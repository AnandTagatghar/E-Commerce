const { Router } = require("express");
const {
  toggleLikeOnProduct,
  toggleLikeOnReview,
} = require("../controllers/likes.controller");
const { verifyUser } = require("../middlewares/auth.middleware");

const router = Router();

router
  .route("/like-toggle-product/:product_id")
  .get(verifyUser, toggleLikeOnProduct);
router
  .route("/like-toggle-review/:review_id")
  .get(verifyUser, toggleLikeOnReview);

module.exports = {
  likeRouter: router,
};
