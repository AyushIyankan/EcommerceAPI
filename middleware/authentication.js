const Errors = require("../errors");
const { validateToken } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new Errors.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const payload = validateToken({ token });
    const { name, id, role } = payload;
    req.user = { name, id, role };
    next();
  } catch (error) {
    throw new Errors.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizeUser = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Errors.UnauthorizedError(
        "Authorization invalid, you can't access this route"
      );
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeUser,
};
