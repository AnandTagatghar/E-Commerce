const asyncHandler = require("../utils/asyncHandler");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");
const Product = require("../models/product.model");
const { putObjectURL, deleteObject } = require("../utils/s3Features");
const ApiResponse = require("../utils/ApiResponse");
require("../models/reviews.model");
require("../models/likes.model");

const uploadProduct = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Add product controller got hitted`);
    if (req.user.role != "admin")
      throw new ApiError(403, `You are not an admin.`);

    if (!req.body) throw new ApiError(400, `Required fields are missing`);

    const {
      product_name,
      description,
      brand,
      category,
      price,
      discount,
      count_in_stock,
      image,
      is_active,
    } = req.body;

    if (
      !product_name ||
      !description ||
      !brand ||
      !category ||
      !price ||
      !discount ||
      !count_in_stock ||
      image == undefined ||
      is_active == undefined
    )
      throw new ApiError(400, `Required fields are missing`);

    let imageObject;
    if (image) {
      imageObject = await putObjectURL("jpeg");
    }

    const product = await Product.create({
      product_name,
      description,
      brand,
      category,
      price,
      discount,
      count_in_stock,
      is_active,
      ...(imageObject
        ? { image_url: imageObject.signedURL, image_key: imageObject.key }
        : {}),
    });

    res
      .status(200)
      .json(new ApiResponse(200, `Product uploaded successfully`, product));
  } catch (error) {
    logger.error(`Error in add product controller : ${error.message}`);
    next(error);
  }
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Get all products controller got hitted`);

    const products = await Product.aggregate([
      {
        $lookup: {
          from: "likes",
          localField: "likes",
          foreignField: "_id",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_d",
          as: "reviews",
          pipeline: [
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
                __v:0
              }
            }
          ],
        },
      },

      {
        $addFields: {
          number_of_likes: {
            $size: "$likes",
          },
          number_of_reviews: {
            $size: "$reviews",
          },
        },
      },

      {
        $project: {
          __v: 0,
          image_key: 0,
        },
      },
    ]);

    if (products.length == 0) throw new ApiError(404, `No data to show`);

    res
      .status(200)
      .json(new ApiResponse(200, `Products fetched successfully`, products));
  } catch (error) {
    logger.error(`Error in get all products controller: ${error.message}`);
    next(error);
  }
});

const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Update product controller got hitted`);

    if (req.user.role != "admin")
      throw new ApiError(403, `You are not authorized for this action`);

    if (!req.body || !req.params)
      throw new ApiError(400, `Required fields are missing`);

    const {
      product_name,
      description,
      brand,
      category,
      price,
      discount,
      count_in_stock,
      is_active,
    } = req.body;
    const { product_id } = req.params;

    if (
      !product_name ||
      !description ||
      !brand ||
      !category ||
      !price ||
      !discount ||
      !count_in_stock ||
      !is_active ||
      !product_id
    )
      throw new ApiError(400, `Required fields are missing`);

    let product = await Product.findByIdAndUpdate(
      product_id,
      {
        $set: {
          product_name,
          description,
          brand,
          category,
          price,
          discount,
          count_in_stock,
          is_active,
        },
      },
      { new: true }
    )
      .populate({ path: "reviews", select: "-__v" })
      .populate({ path: "likes", select: "-__v" })
      .select("-__v -image_key");

    if (!product) throw new ApiError(400, `This product is not available`);

    res
      .status(200)
      .json(new ApiResponse(200, `Update product successful`, product));
  } catch (error) {
    logger.error(`Error in update product controller: ${error.message}`);
    next(error);
  }
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Delete product controller got hitted`);

    if (req.user.role != "admin")
      throw new ApiError(403, `Your are not authorized for this action`);

    if (!req.params) throw new ApiError(400, `Required parameters missing`);

    const { product_id } = req.params;
    if (!product_id) throw new ApiError(400, `Required parameters missing`);

    let product = await Product.findByIdAndDelete(product_id);

    if (!product)
      throw new ApiError(404, `Product id: ${product_id} not found`);

    await deleteObject(product.image_key);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Deletion of the product id : ${product_id} success`,
          product
        )
      );
  } catch (error) {
    logger.error(`Error in delete product controller: ${error.message}`);
    next(error);
  }
});

module.exports = {
  uploadProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
