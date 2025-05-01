const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Like = require("../models/likes.model");
const logger = require("../config/logger");
const Product = require("../models/product.model");

const toggleLikeOnProduct = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Toggle like on product controller got hitted`);

    if (!req.params) throw new ApiError(400, `Required parameter is missing`);
    const { product_id } = req.params;
    if (!product_id) throw new ApiError(400, `Required parameter is missing`);

    let getLike = await Like.findOneAndDelete({
      product: product_id,
      email: req.user.email,
    });

    if (getLike) {
      return res
        .status(200)
        .json(new ApiResponse(200, `like removed on product`, getLike));
    } else {
      let create_like = await Like.create({
        email: req.user.email,
        product: product_id,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, `liked product`, create_like));
    }
  } catch (error) {
    logger.error(
      `Error in toggle like on product controller: ${error.message}`
    );
    next(error);
  }
});

const toggleLikeOnReview = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Toggle like on review controller got hitted`);

    if (!req.params) throw new ApiError(400, `Required parameters are missing`);
    const { review_id } = req.params;
    if (!review_id) throw new ApiError(400, `Required parameter is missing`);

    let review = await Like.findOneAndDelete({
      email: req.user.email,
      review: review_id,
    });

    if (review) {
      return res
        .status(200)
        .json(new ApiResponse(200, `Review like removed`, review));
    } else {
      let new_review = await Like.create({
        email: req.user.email,
        review: review_id,
      });

      res.status(200).json(new ApiResponse(200, `Review liked`, new_review));
    }
  } catch (error) {
    logger.error(`Error on toggle like on review controller: ${error.message}`);
    next(error);
  }
});

module.exports = { toggleLikeOnProduct, toggleLikeOnReview };
