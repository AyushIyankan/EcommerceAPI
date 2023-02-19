const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const {
  createTokenUser,
  attachCookiesResponse,
  checkPermissions,
} = require("../utils");
const Errors = require("../errors");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  return res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new Errors.NotFoundError(`No user found with id: ${id}`);
  }
  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({
    user: req.user,
  });
};

//update user with user.save()
const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new Errors.BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user.id });

  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesResponse({ res, payload: tokenUser });
  res.status(StatusCodes.OK).json({
    user: tokenUser,
  });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new Errors.BadRequestError("Please provide both values");
  }

  const user = await User.findOne({ _id: req.user.id });
  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new Errors.UnauthenticatedError("Invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

//update user with User.findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;

//   if (!name || !email) {
//     throw new Errors.BadRequestError("Please provide all values");
//   }

//   const user = await User.findOneAndUpdate(
//     { _id: req.user.id },
//     {
//       name,
//       email,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   const tokenUser = createTokenUser(user);
//   attachCookiesResponse({ res, payload: tokenUser });
//   res.status(StatusCodes.OK).json({
//     user: tokenUser,
//   });
// };
