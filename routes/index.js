const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

const { authenticateUser } = require("../middleware/authentication");

router.get("/test", (req, res) => {
  console.log(req.signedCookies);
  res.send("test");
});

router.use("/user", authenticateUser, userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
