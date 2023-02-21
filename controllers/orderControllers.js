const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");

const { checkPermissions } = require("../utils");
const Errors = require("../errors");

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = "somerandomvalue";
  return { clientSecret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  return res.status(StatusCodes.OK).json({ orders: orders });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById({ _id: id });
  if (!order) {
    throw new Errors.NotFoundError(`Order with id: ${id} not found`);
  }
  checkPermissions(req.user, order.user);
  return res.status(StatusCodes.OK).json({ order: order });
};

const getCurrentUserOrders = async (req, res) => {
  const { id: userId } = req.user;
  const orders = await Order.find({ user: userId });
  return res.status(StatusCodes.OK).json({ orders: orders });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new Errors.BadRequestError("No cart items provided");
  }

  if (!tax || !shippingFee) {
    throw new Errors.BadRequestError("Please provide tax and shipping free");
  }

  let orderItems = [];
  let subtotal = 0;

  for (item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new Errors.NotFoundError(
        `Product with id: ${item.product} not found`
      );
    }
    const { _id, name, image, price } = dbProduct;
    const singleOrder = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    orderItems = [...orderItems, singleOrder];
    subtotal += item.amount * price;
  }

  let total = tax + shippingFee + subtotal;

  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.id,
  });

  return res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret,
  });
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById({ _id: id });
  if (!order) {
    throw new Errors.NotFoundError(`Order with id: ${id} not found`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  await order.save();
  return res.status(StatusCodes.OK).json({ order: order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
