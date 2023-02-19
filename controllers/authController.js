const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
// const jwt = require("jsonwebtoken");
const {
  createJWT,
  attachCookiesResponse,
  createTokenUser,
} = require("../utils");

const Errors = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Errors.BadRequestError("Email already exists");
  }

  const isFirst = (await User.countDocuments({})) === 0;
  const role = isFirst ? "admin" : "user";

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const tokenUser = createTokenUser(user);
  attachCookiesResponse({ res, payload: tokenUser });

  return res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Errors.BadRequestError("Please provide email and password");
  }

  const userExists = await User.findOne({ email });

  if (!userExists) {
    throw new Errors.BadRequestError("Invalid credentials");
  }

  const isPasswordMatching = await userExists.comparePassword(password);

  if (!isPasswordMatching) {
    throw new Errors.BadRequestError("Invalid credentials");
  }

  const tokenUser = createTokenUser(userExists);
  attachCookiesResponse({ res, payload: tokenUser });
  return res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({
    msg: "User logged out",
  });
};

module.exports = {
  register,
  login,
  logout,
};
