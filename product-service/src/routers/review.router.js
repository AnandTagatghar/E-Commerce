const { Router } = require("express");
const { verifyUser } = require("../middlewares/auth.middleware");
const {
  createReview,
  editReviewById,
  deleteReviewById,
  getReviewById,
} = require("../controllers/review.controller");

const router = Router();

router.route("/:product_id/create-review").post(verifyUser, createReview);
router.route("/edit-review/:review_id").patch(verifyUser, editReviewById);
router.route("/delete-review/:review_id").delete(verifyUser, deleteReviewById);
router.route("/get-review/:review_id").get(getReviewById);

module.exports = {
  reviewRouter: router,
};
