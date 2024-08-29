const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new BadRequestError("Please provide name email and password");

  //* NOTE: moved hashing to mongoose middleware
  // const salt = await bcryptjs.genSalt(10);
  // const hashedPassword = await bcryptjs.hash(password, salt);
  // const tempUser = { name, email, password: hashedPassword };

  const user = await User.create({ ...req.body });

  // generate token - moved to schema instance method
  // const token = jwt.sign(
  //   { userId: user._id, name: user.name },
  //   process.env.JWT_SECRET,
  //   { expiresIn: "30d" }
  // );

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).send({ token, user: { name: user.name } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Must provide email and password");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("No user found with email");

  // compare password
  const passwordMatched = await user.comparePass(password);
  if (!passwordMatched) throw new UnauthenticatedError("Wrong password");

  const token = user.createJWT2(); // using instance method defined using User.method()

  res.status(StatusCodes.OK).send({ user: { name: user.name }, token });
};

module.exports = { register, login };
