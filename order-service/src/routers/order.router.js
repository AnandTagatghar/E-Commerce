const { Router } = require("express");
const order_service = require("../controllers/order.controller");
const verifyUser = require("../middlewares/auth.middleware");

const router = Router();

router.route("/place-order").post(verifyUser, order_service.createOrder);

router
  .route("/get-orders/user")
  .get(verifyUser, order_service.fetchAllOrdersOfUser);

router
  .route("/get-specific-order/:order_id")
  .get(verifyUser, order_service.fetchOrderById);

router.route("/get-orders").get(verifyUser, order_service.fetchAllOrders);

router
  .route("/update-order-status/:order_id")
  .put(verifyUser, order_service.updateOrderStatus);

router
  .route("/update-payment-status/:order_id")
  .put(verifyUser, order_service.updatePaymentStatus);

router
  .route("/delete-order/:order_id")
  .delete(verifyUser, order_service.deleteOrder);

router
  .route("/get-order-status/:order_id")
  .get(verifyUser, order_service.getOrderStatus);

router
  .route("/check-product-in-stock")
  .post(verifyUser, order_service.checkOrder);

module.exports = { orderRouter: router };
