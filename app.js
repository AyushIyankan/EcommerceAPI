require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/connect");
const NotFound = require("./middleware/not-found");
const ErrorHandler = require("./middleware/error-handler");

const router = require("./routes");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1", router);

app.use(NotFound);
app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
