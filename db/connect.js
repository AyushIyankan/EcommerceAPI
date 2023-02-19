const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
  return mongoose
    .connect(url)
    .then((res) => console.log("DB Connected"))
    .catch((err) => console.log("DB Connection unsuccessful"));
};

module.exports = connectDB;
