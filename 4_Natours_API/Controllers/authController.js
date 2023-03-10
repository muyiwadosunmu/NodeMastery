const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  return res.status(201).json({
    status: `Success`,
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1 Check if email && password exists
  if (!email || !password)
    return next(new AppError(`Please provide email and password!`, 400));
  //2 Check if user exists && password is correct

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError(`Incorrect email or password`, 401));

  //3 If everything is okay, send jwtoken to client
  const token = signToken(user._id);
  return res.status(200).json({
    status: `Success`,
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  //1. Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(token);
  if (!token) {
    return next(new AppError(`Unauthorized, please log in to get access`, 401));
  }
  //2. Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
  //3 Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError(`The user assigned to this user token not exist!`, 401)
    );

  //4 Check if user changed password after jwt was issued
  next();
});

module.exports = { signUp, login, protect };
