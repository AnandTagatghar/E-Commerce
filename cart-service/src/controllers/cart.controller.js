const Cart = require("../models/cart.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../config/logger");
const asyncHander = require("../utils/asyncHandler");
const CartItem = require("../models/cartItems.model");
const axios = require("axios");

const getCartByUser = asyncHander(async (req, res, next) => {
  try {
    logger.info(`Get cart controller hitted`);

    const cart = await Cart.aggregate([
      {
        $match: {
          email: req.user.email,
        },
      },
      {
        $lookup: {
          from: "cartitems",
          localField: "_id",
          foreignField: "cartID",
          as: "cartItems",
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          totalPrice: {
            $sum: {
              $map: {
                input: "$cartItems",
                as: "item",
                in: "$$item.price",
              },
            },
          },
          totalQuantity: {
            $sum: {
              $map: {
                input: "$cartItems",
                as: "item",
                in: "$$item.quantity",
              },
            },
          },
          cartItems: {
            $map: {
              input: "$cartItems",
              as: "item",
              in: {
                productId: "$$item.productId",
                title: "$$item.title",
                image: "$$item.image",
                description: "$$item.description",
                category: "$$item.category",
                quantity: "$$item.quantity",
                price: "$$item.price",
              },
            },
          },
        },
      },
    ]);

    if (!cart || cart.length === 0) {
      throw new ApiError(404, "Cart not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Cart fetched successfully", cart));
  } catch (error) {
    logger.error(`Error in get cart controller: ${error.message}`);
    next(error);
  }
});

const addProductToCart = asyncHander(async (req, res, next) => {
  try {
    logger.info(`Add product to cart controller hitted`);
    if (!req.params) throw new ApiError(400, "Product not found");
    const { product_id } = req.params;
    if (!product_id) throw new ApiError(400, "Product id required");

    let product = await axios.get(
      `${process.env.PRODUCT_SERVICE_URL}/product/get-product/${product_id}`
    );
    if (!product.data.status) throw new ApiError(404, "Product not found");

    product = product.data.data[0];

    let cart = await Cart.findOne({
      email: req.user.email,
    });
    if (!cart) {
      cart = await Cart.create({
        email: req.user.email,
      });
    }

    let cart_item = await CartItem.findOneAndUpdate({
      cartID: cart._id,
      productId: product_id,
    });

    if (cart_item) {
      cart_item.quantity += 1;
      cart_item.price = product.price * cart_item.quantity;

      cart_item = await cart_item.save();

      delete cart_item._doc.__v;
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Product updated in cart successfully",
            cart_item
          )
        );
    }

    cart_item = await CartItem.create({
      cartID: cart._id,
      productId: product_id,
      price: product.price,
      title: product.product_name,
      image: product.image_url,
      description: product.description,
      quantity: 1,
      category: product.category,
    });

    delete cart_item._doc.__v;

    res
      .status(200)
      .json(
        new ApiResponse(200, "Product added to cart successfully", cart_item)
      );
  } catch (error) {
    logger.error(`Error in add product to cart controller: ${error.message}`);
    next(error);
  }
});

const removeProductFromCart = asyncHander(async (req, res, next) => {
  try {
    logger.info(`Remove product from cart controller hitted`);
    if (!req.params) throw new ApiError(400, "Required product id");
    const { product_id } = req.params;
    if (!product_id) throw new ApiError(400, "Product id not found");

    const cart = await Cart.findOne({
      email: req.user.email,
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    const cart_item = await CartItem.findOne({
      cartID: cart._id,
      productId: product_id,
    });

    if (!cart_item) {
      throw new ApiError(404, "Product not found in cart");
    }

    if (cart_item.quantity > 1) {
      cart_item.price = cart_item.price - cart_item.price / cart_item.quantity;
      cart_item.quantity -= 1;
      await cart_item.save();

      delete cart_item._doc.__v;

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Product quantity updated in cart successfully",
            cart_item
          )
        );
    } else {
      await CartItem.findOneAndDelete({
        cartID: cart._id,
        productId: product_id,
      });
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Product removed from cart successfully"));
  } catch (error) {
    logger.error(
      `Error in remove product from cart controller: ${error.message}`
    );
    next(error);
  }
});

const clearCart = asyncHander(async (req, res, next) => {
  try {
    logger.info(`Clear cart controller hitted`);
    const cart = await Cart.findOneAndDelete({
      email: req.user.email,
    });

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    res.status(200).json(new ApiResponse(200, "Cart cleared successfully"));
  } catch (error) {
    logger.error(`Error in clear cart controller: ${error.message}`);
    next(error);
  }
});

module.exports = {
  getCartByUser,
  addProductToCart,
  removeProductFromCart,
  clearCart,
};
