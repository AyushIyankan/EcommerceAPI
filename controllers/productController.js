const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const path = require("path");

const Errors = require("../errors");

const createProduct = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  return res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  return res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productID } = req.params;

  const product = await Product.findOne({ _id: productID }).populate("reviews");
  if (!product) {
    throw new Errors.NotFoundError(`No product with id ${productID}`);
  }

  return res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productID } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productID }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new Errors.NotFoundError(`No product with id ${productID}`);
  }

  return res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productID } = req.params;

  const product = await Product.findOne({ _id: productID });
  if (!product) {
    throw new Errors.NotFoundError(`No product with id ${productID}`);
  }

  await product.remove();

  return res.status(StatusCodes.OK).json({ msg: "Product removed" });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new Errors.BadRequestError("No file uploaded");
  }

  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new Errors.BadRequestError("Please upload image");
  }

  const maxSize = 5 * 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new Errors.BadRequestError("Please image smaller than 5MB");
  }

  const targetImagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(targetImagePath);

  return res
    .status(StatusCodes.OK)
    .json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
