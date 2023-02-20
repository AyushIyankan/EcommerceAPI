const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

const { checkPermissions } = require("../utils");
const Errors = require("../errors");

const createReview = async (req, res) => {
  const { product: productID } = req.body;
  const { id: userID } = req.user;

  if (!productID) {
    throw new Errors.BadRequestError("Product ID is required");
  }

  const product = await Product.findById(productID);
  if (!product) {
    throw new Errors.NotFoundError(`Product with id: ${productID} not found`);
  }

  const alreadyReviewed = await Review.findOne({
    product: productID,
    user: userID,
  });

  if (alreadyReviewed) {
    throw new Errors.BadRequestError(`You have already reviewed this product`);
  }

  req.body.user = userID;
  const review = await Review.create(req.body);
  return res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name price company",
    })
    .populate({
      path: "user",
      select: "name email",
    });
  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewID } = req.params;

  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new Errors.NotFoundError(`Review with id: ${id} not found`);
  }

  return res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewID } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewID });
  if (!review) {
    throw new Errors.NotFoundError(`Review with id: ${id} not found`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  return res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewID } = req.params;

  const review = await Review.findOne({ _id: reviewID });
  console.log(review);
  if (!review) {
    throw new Errors.NotFoundError(`Review not found`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();

  return res
    .status(StatusCodes.OK)
    .json({ msg: `Review removed successfully` });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productID } = req.params;

  const reviews = await Review.find({ product: productID });
  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
