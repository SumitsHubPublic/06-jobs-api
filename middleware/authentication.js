const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid #01");
  }

  const token = authHeaders.split("Bearer ")[1];
  if (!token) throw new UnauthenticatedError("Authentication invalid #02");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    //* OR - find user by id and send user without password
    // const user = await User.findById(payload.userId).select("-password");
    // req.user = user;

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid #03");
  }
};

module.exports = authMiddleware;
