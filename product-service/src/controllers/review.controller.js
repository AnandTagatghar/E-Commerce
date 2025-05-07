const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../config/logger");
const Product = require("../models/product.model");
const Review = require("../models/reviews.model");
const mongoose = require("mongoose");
const { setDataToRedis, getDataFromRedis } = require("../utils/redisFeatures");

const createReview = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Create review controller got hitted`);

    if (!req.params) throw new ApiError(400, `Required parameter is missing`);
    const { product_id } = req.params;
    if (!product_id) throw new ApiError(400, `Required parameter is missing`);

    if (!req.body) throw new ApiError(400, `Required fields are missing`);
    const { comment, rating } = req.body;
    if (!comment || !rating) throw new ApiError(`Required fields are missing`);

    if (req.user.role != "user") throw new ApiError(403, `You are not a user`);

    let product = await Product.findById(product_id);
    if (!product)
      throw new ApiError(404, `Product Id: ${product_id} not found`);

    let review = await Review.create({
      username: req.user.username,
      email: req.user.email,
      comment,
      rating,
      product: product_id,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, `Your feedback submitted successfully`, review)
      );
  } catch (error) {
    logger.error(`Error in create review controller: ${error.message}`);
    next(error);
  }
});

const editReviewById = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Edit review by id controller got hitted`);

    if (!req.params) throw new ApiError(400, `Required parameters are missing`);
    const { review_id } = req.params;
    if (!review_id) throw new ApiError(400, `Required parameter is missing`);

    if (!req.body) throw new ApiError(400, `Required fields are missing`);
    const { comment, rating } = req.body;
    if (!comment || !rating)
      throw new ApiError(400, `Required fields are missing`);

    let review = await Review.findById(review_id);

    if (!review) throw new ApiError(404, `Review not found`);

    if (review.email != req.user.email)
      throw new ApiError(403, `You are not authorized for this action`);

    review.comment = comment;
    review.rating = rating;
    await review.save();

    let newReview = await Review.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "reivew",
          as: "likes",
        },
      },
      {
        $addFields: {
          number_of_likes: {
            $size: "$likes",
          },
        },
      },
      {
        $project: {
          likes: 0,
          __v: 0,
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, `Review changes are done`, newReview));
  } catch (error) {
    logger.error(`Error in edit review by id controller: ${error.message}`);
    next(error);
  }
});

const deleteReviewById = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Delete review controller got hitted`);
    if (!req.params) throw new ApiError(400, `Requried parameters is missing`);
    const { review_id } = req.params;
    if (!review_id) throw new ApiError(400, `Required parameter is missing`);

    let review = await Review.findById(review_id);

    if (!review) throw new ApiError(404, `Review ID: ${review_id} not found`);

    if (review.email != req.user.email)
      throw new ApiError(403, `You are not authorized for this action`);

    review = await Review.deleteOne(review._id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Review ID: ${review_id} deleted successfully`,
          review
        )
      );
  } catch (error) {
    logger.error(`Error in delete review controller: ${error.message}`);
    next(error);
  }
});

const getReviewById = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Get review by id controller got hitted`);

    if (!req.params) throw new ApiError(400, `Requried parameters are missing`);
    const { review_id } = req.params;
    if (!req.params) throw new ApiError(400, `Required parameter is required`);

    let cached = await getDataFromRedis(`review_${review_id}`);
    if (cached) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            `Reviwe ID: ${review_id} fetched successfully`,
            cached
          )
        );
    }

    let review = await Review.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(review_id),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "review",
          as: "likes",
        },
      },
      {
        $addFields: {
          number_of_likes: { $size: "$likes" },
        },
      },
      {
        $project: {
          likes: 0,
          __v: 0,
        },
      },
    ]);

    if (!review) throw new ApiError(404, `Review Id: ${review_id} not found`);

    await setDataToRedis(`review_${review_id}`, review);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Reviwe ID: ${review_id} fetched successfully`,
          review
        )
      );
  } catch (error) {
    logger.error(`Error on get review by id controller: ${error.message}`);
    next(error);
  }
});

module.exports = {
  createReview,
  editReviewById,
  deleteReviewById,
  getReviewById,
};
