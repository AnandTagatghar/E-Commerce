const logger = require("../config/logger");
const razorpay = require("../config/razorpay");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandlers = require("../utils/asyncHandlers");
const Payment = require("../models/payment.model");

const payment_controller = {
  create_payment_initiation: asyncHandlers(async (req, res, next) => {
    try {
      logger.info(`Create payment order controller got hitted`);

      if (!req.body) throw new ApiError(400, `Requried fields are missing`);
      const {
        amount,
        order_id,
        currency = "INR",
        customer_name,
        customer_contact,
        payment_method = "razorpay",
      } = req.body;
      if (
        !amount ||
        !order_id ||
        !customer_name ||
        !customer_contact ||
        !payment_method
      )
        throw new ApiError(400, `Please provide requried fields`);

      let order = await razorpay.paymentLink.create({
        amount: amount * 100,
        currency,
        accept_partial: false,
        reference_id: order_id,
        description: `Payment for Order ID: ${order_id}`,
        customer: {
          name: customer_name,
          email: req.user.email,
          contact: customer_contact,
        },
        notify: {
          sms: true,
          email: true,
        },
      });

      let payment_document = await Payment.create({
        order_id,
        email: req.user.email,
        amount: amount * 100,
        currency,
        payment_method,
        razorpay_link_id: order.id,
        razorpay_link_url: order.short_url,
      });

      res.status(200).json(
        new ApiResponse(200, `Payment order created`, {
          payment_document,
          order,
        })
      );
    } catch (error) {
      logger.error(
        `Error on create payment order controller: ${error.message}`
      );
      next(error);
    }
  }),

  payment_status: asyncHandlers(async (req, res, next) => {
    try {
      logger.info(`Payment status controller got hitted`);
      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { payment_id } = req.params;
      if (!payment_id) throw new ApiError(400, `Required parameter is missing`);

      const payment_status = await Payment.findById(payment_id).select(
        "status"
      );

      if (!payment_status)
        throw new ApiError(
          404,
          `Payment stauts for payment id: ${payment_id}, not found`
        );

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Payment status fetched successfully`,
            payment_status
          )
        );
    } catch (error) {
      logger.error(`Error on payment status controller: ${error.message}`);
      next(error);
    }
  }),

  payment_status_by_order_id: asyncHandlers(async (req, res, next) => {
    try {
      logger.info(`Payment by order id status controller got hitted`);

      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { order_id } = req.params;
      if (!order_id) throw new ApiError(400, `Required parameter is missing`);

      let payment_response = await Payment.findOne({ order_id }).select(
        "status"
      );

      if (!payment_response)
        throw new ApiError(
          404,
          `Payment status with order id: ${order_id}, not found`
        );

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Order ID: ${order_id}, fetched successfully`,
            payment_response
          )
        );
    } catch (error) {
      logger.error(
        `Error on payment by order id status controller: ${error.message}`
      );
      next(error);
    }
  }),

  fetch_all_payments: asyncHandlers(async (req, res, next) => {
    try {
      logger.info(`Fetch all payments controller got hitted`);

      let payments = await Payment.find().select("-__v");

      if (!payments || payments.length == 0)
        throw new ApiError(404, `No payments found`);

      res
        .status(200)
        .json(new ApiResponse(200, `Payments fetched successfully`, payments));
    } catch (error) {
      logger.error(`Error at fetch all payments controller: ${error.message}`);
      next(error);
    }
  }),

  fetch_all_pending_payments: asyncHandlers(async (req, res, next) => {
    try {
      logger.info(`Fetch all pending payments controllers got hitted`);

      let payments = await Payment.aggregate([
        {
          $match: {
            status: "pending",
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      if (!payments || payments.length == 0)
        throw new ApiError(404, `No pending payments are found`, payments);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Pending payments are found fetched successfully`,
            payments
          )
        );
    } catch (error) {
      logger.error(
        `Error at fetch all pending payments controllers: ${error.message}`
      );
      next(error);
    }
  }),

  update_payment_status: asyncHandlers(async (req, res, next) => {
    try {
      logger.info(`Update payment status controller got hitted`);

      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { id } = req.params;
      if (!id) throw new ApiError(200, `Required patameter is missing`);

      if (!req.body) throw new ApiError(400, `Required fields are missing`);
      const { status } = req.body;
      if (!status) throw new ApiError(400, `Requried field is missing`);

      let payment_status = await Payment.findOneAndUpdate(
        {
          $or: [{ _id: id }, { order_id: id }],
        },
        {
          $set: {
            status,
          },
        },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!payment_status)
        throw new ApiError(404, `Payment for ID: ${id}, not found`);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Payment for ID: ${id} found successfully`,
            payment_status
          )
        );
    } catch (error) {
      logger.error(
        `Error at update payment status controller: ${error.message}`
      );
      next(error);
    }
  }),

  delete_payment_by_id: asyncHandlers(async (req, res, next) => {
    try {
      logger.info(`Delete payment by id controller got hitted`);

      if (!req.params) throw new ApiError(400, `Required fields are missing`);
      const { payment_id } = req.params;
      if (!payment_id) throw new ApiError(400, `Required field is missing`);

      await Payment.findByIdAndDelete(payment_id);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Payment ID: ${payment_id}, deleted successfully`
          )
        );
    } catch (error) {
      logger.error(
        `Error at delete payment by id controller: ${error.message}`
      );
      next(error);
    }
  }),
};

module.exports = payment_controller;
