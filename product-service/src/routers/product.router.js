const { Router } = require("express");
const { verifyUser } = require("../middlewares/auth.middleware");
const {
  uploadProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../controllers/product.controller");

const router = Router();

router.route("/upload-product").post(verifyUser, uploadProduct);

router.route("/get-all-products").get(getAllProducts);

router.route("/update-product/:product_id").patch(verifyUser, updateProduct);

router.route("/delete-product/:product_id").delete(verifyUser, deleteProduct);

router.route("/get-product/:product_id").get(getProductById);

module.exports = {
  productRouter: router,
};
