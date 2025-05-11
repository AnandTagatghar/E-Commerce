const { Router } = require("express");
const verifyUser = require("../middlewares/auth.middleware");
const payment_controller = require("../controllers/payment.controller");

const router = Router();

router
  .route("/create-payment-order")
  .post(verifyUser, payment_controller.create_payment_initiation);

router
  .route("/payment-id-status/:payment_id")
  .get(verifyUser, payment_controller.payment_status);

router
  .route("/payment-status-by-order-id/:order_id")
  .get(verifyUser, payment_controller.payment_status_by_order_id);

router
  .route("/fetch-all-payments")
  .get(verifyUser, payment_controller.fetch_all_payments);

router
  .route("/fetch-all-pending-payments")
  .get(verifyUser, payment_controller.fetch_all_pending_payments);

router
  .route("/update-payment-status/:id")
  .patch(verifyUser, payment_controller.update_payment_status);

module.exports = {
  paymentRouter: router,
};
