const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../config/logger");
const axios = require("axios");
const Order = require("../models/order.model");

const order_service = {
  createOrder: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Create order controller got hitted`);
      if (!req.body) throw new ApiError(400, `Required fields are missing`);
      const { address, city, country, postalCode } = req.body;
      if (!address || !city || !postalCode)
        throw new ApiError(400, `Requried fields are missing`);

      let cart_response = await axios.get(
        `${process.env.CART_SERVICE_URI}/get-cart`,
        {
          headers: {
            Cookie: Object.entries(req.cookies)
              .map(([key, value]) => `${key}=${value}`)
              .join("; "),
          },
        }
      );

      if (!cart_response.data.status)
        throw new ApiError(
          cart_response.data.statusCode,
          cart_response.data.message
        );

      let order_items_data = cart_response.data.data[0].cartItems.map(
        (item) => {
          return {
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price,
          };
        }
      );

      let order = await Order.create({
        email: req.user.email,
        items: order_items_data,
        shipping_address: {
          address,
          city,
          postalCode,
          country,
        },
      });

      res
        .status(200)
        .json(new ApiResponse(200, `Order placed successful`, order));
    } catch (error) {
      logger.error(`Error at create order controller: ${error.message}`);
      next(error);
    }
  }),

  fetchAllOrdersOfUser: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Fetch all order of user controller got hitted`);

      let orders = await Order.find({
        email: req.user.email,
      }).select("-__v");

      if (!orders || orders.length == 0)
        throw new ApiError(404, `No order found`);

      res
        .status(200)
        .json(new ApiResponse(200, `Orders fetched successfully`, orders));
    } catch (error) {
      logger.error(
        `Error at fetch all orders of user controller: ${error.message}`
      );
      next(error);
    }
  }),

  fetchOrderById: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Fetch order by id controller got hitted`);

      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { order_id } = req.params;
      if (!order_id) throw new ApiError(400, `Required parameter is missing`);

      let order = await Order.findById(order_id).select("-__v");

      if (!order) throw new ApiError(404, `Order not found`);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Order ID: ${order_id} fetched successfully`,
            order
          )
        );
    } catch (error) {
      logger.error(`Error at fetch order by id controller: ${error.message}`);
      next(error);
    }
  }),

  fetchAllOrders: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Fetch all orders controller got hitted`);

      let orders = await Order.find().select("-__v");

      if (!orders || orders.length == 0)
        throw new ApiError(404, `No Orders found`);

      res
        .status(200)
        .json(new ApiResponse(200, `Orders fetched successfully`, orders));
    } catch (error) {
      logger.error(`Error at fetch all orders controller: ${error.message}`);
      next(error);
    }
  }),

  updateOrderStatus: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Update order status controller got hitted`);

      if (!req.body) throw new ApiError(400, `Required fields are missing`);
      const { status } = req.body;
      if (!status) throw new ApiError(400, `Requried field is missing`);

      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { order_id } = req.params;
      if (!order_id) throw new ApiError(400, `Required parameter is missing`);

      let order = await Order.findByIdAndUpdate(
        order_id,
        {
          status,
        },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!order) throw new ApiError(404, `Order ID: ${order_id} not found`);

      res
        .status(200)
        .json(new ApiResponse(200, `Order status updated successfully`, order));
    } catch (error) {
      logger.error(`Error at update order status controller: ${error.message}`);
      next(error);
    }
  }),

  updatePaymentStatus: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Update payment status controller got hitted`);

      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { order_id } = req.params;
      if (!order_id) throw new ApiError(400, `Required paramenter is missing`);

      if (!req.body) throw new ApiError(400, `Required fields are missing`);
      const { payment_status } = req.body;
      if (!payment_status) throw new ApiError(400, `Required field is missing`);

      let order = await Order.findByIdAndUpdate(
        order_id,
        {
          payment_status,
        },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!order) throw new ApiError(404, `Order Id: ${order} is not found`);

      res
        .status(200)
        .json(
          new ApiResponse(200, `Payment status updated successfully`, order)
        );
    } catch (error) {
      logger.error(
        `Error at update payment status controller: ${error.message}`
      );
      next(error);
    }
  }),

  deleteOrder: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Delete order controller got hitted`);

      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { order_id } = req.params;
      if (!order_id) throw new ApiError(400, `Required parameter is missing`);

      await Order.findByIdAndDelete(order_id);

      res
        .status(200)
        .json(
          new ApiResponse(200, `Order ID: ${order_id}, deleted successfully`)
        );
    } catch (error) {
      logger.error(`Error at delete order controller: ${error.message}`);
      next(error);
    }
  }),

  getOrderStatus: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Get order status controller got hitted`);

      if (!req.params)
        throw new ApiError(400, `Required parameters are missing`);
      const { order_id } = req.params;
      if (!order_id) throw new ApiError(400, `Required prameter is missing`);

      let order = await Order.findById(order_id).select("status");

      if (!order) throw new ApiError(404, `Order ID: ${order_id} not found`);

      res
        .status(200)
        .json(new ApiResponse(200, `Order status fetched successfully`, order));
    } catch (error) {
      logger.error(`Error at get order status controller: ${error.message}`);
      next(error);
    }
  }),

  checkOrder: asyncHandler(async (req, res, next) => {
    try {
      logger.info(`Check order controller got hitted`);

      if (!req.body) throw new ApiError(400, `Required parameters are missing`);
      const { product_id } = req.body;
      if (!product_id) throw new ApiError(400, `Required parameter is missing`);

      let product_details = await axios.get(
        `${process.env.PRODUCT_SERVICE_URI}/product/get-product/${product_id}`,
        {
          headers: {
            Cookie: Object.entries(req.cookies)
              .map(([key, value]) => `${key}=${value}`)
              .join("; "),
          },
        }
      );

      if (!product_details.data.status)
        throw new ApiError(
          product_details.data.status,
          product_details.data.statusCode
        );

      if (product_details.data.data.count_in_stock == 0)
        throw new ApiError(404, `Please check back later`);

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Product Id: ${product_id}, is in stock`,
            product_details.data.data
          )
        );
    } catch (error) {
      logger.error(`Error at check order controller: ${error.message}`);
      next(error);
    }
  }),
};

module.exports = order_service;
