const { Router } = require("express");
const { verifyUser } = require("../middlewares/auth.middleware");
const {
  uploadProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = Router();

router.route("/upload-product").post(verifyUser, uploadProduct);

router.route("/get-all-products").get(getAllProducts);

router.route("/update-product/:product_id").patch(verifyUser, updateProduct);

router.route("/delete-product/:product_id").delete(verifyUser, deleteProduct);

module.exports = {
  productRouter: router,
};
