const { Router } = require("express");
const { verifyUser } = require("../middlewares/auth.middleware");
const { createReview, editReviewById } = require("../controllers/review.controller");

const router = Router();

router.route("/:product_id/create-review").post(verifyUser, createReview);
router.route("/edit-review/:review_id").patch(verifyUser, editReviewById)
module.exports = {
  reviewRouter: router,
};
