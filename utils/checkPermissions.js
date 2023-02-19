const Errors = require("../errors");

const checkPermissions = (requestUserObject, resourceId) => {
  if (requestUserObject.role === "admin") return;
  if (requestUserObject.id === resourceId.toString()) return;
  throw new Errors.UnauthorizedError(
    "You are not authorized to access this details"
  );
};

module.exports = checkPermissions;
