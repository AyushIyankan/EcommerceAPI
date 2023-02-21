const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderControllers");

const {
  authenticateUser,
  authorizeUser,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizeUser("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
