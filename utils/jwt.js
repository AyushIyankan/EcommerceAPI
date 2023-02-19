const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

const attachCookiesResponse = ({ res, payload }) => {
  const token = createJWT({ payload: payload });

  const oneDay = 1000 * 60 * 60 * 24;
  return res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

const validateToken = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createJWT,
  attachCookiesResponse,
  validateToken,
};
