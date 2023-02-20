const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const {
  authorizeUser,
  authenticateUser,
} = require("../middleware/authentication");

router
  .route("/")
  .get(getAllProducts)
  .post([authenticateUser, authorizeUser("admin")], createProduct);
router
  .route("/uploadImage")
  .post([authenticateUser, authorizeUser("admin")], uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizeUser("admin")], updateProduct)
  .delete([authenticateUser, authorizeUser("admin")], deleteProduct);

module.exports = router;
