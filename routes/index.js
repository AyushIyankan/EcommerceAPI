const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const reviewRoutes = require("./reviewRoutes");
const orderRoutes = require("./orderRoutes");

const { authenticateUser } = require("../middleware/authentication");

router.get("/test", (req, res) => {
  console.log(req.signedCookies);
  res.send("test");
});

router.use("/user", authenticateUser, userRoutes);
router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/reviews", reviewRoutes);
router.use("/order", orderRoutes);

module.exports = router;
