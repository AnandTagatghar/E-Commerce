const { Router } = require("express");
const verifyUser = require("../middlewares/auth.middleware");
const {
  getCartByUser,
  addProductToCart,
  clearCart,
  removeProductFromCart,
} = require("../controllers/cart.controller");

const router = Router();

router.route("/get-cart").get(verifyUser, getCartByUser);
router.route("/add-product-to-cart/:product_id").patch(verifyUser, addProductToCart);
router
  .route("/remove-product-from-cart/:product_id")
  .patch(verifyUser, removeProductFromCart);
router.route("/clear-cart").delete(verifyUser, clearCart);

module.exports = { cartRouter: router };
