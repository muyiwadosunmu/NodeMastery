const crypto = require('node:crypto');
const { promisify } = require('node:util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, //only while using https
    httpOnly: true, //Cannot be accessed/modified by the  browser
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  const token = signToken(user._id);
  res.cookie('jwt', token, cookieOptions);
  // Removes password from the output
  user.password = undefined;
  return res.status(statusCode).json({
    status: `Success`,
    token,
    data: {
      user,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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
  //3 Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(`The user assigned to this user token does not exist!`, 401)
    );

  //4 Check if user changed password after jwt was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(`User recently changed password, please login again`, 401)
    );
  }
  // Grant Access To Protected Route
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      console.log(req);
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  });

const forgotPassword = catchAsync(async (req, res, next) => {
  //1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`There is no user with this email address`), 404);
  }
  //2. Generate the Random  reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3.Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a request with your new password and password Confirm to : ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email, //Or req.body.email
      subject: `Your password reset token - Valid for 10mins`,
      message,
    });

    res.status(200).json({
      status: `Success`,
      message: `Token sent`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(`There was an Error sending the email. Try again later`),
      500
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  //1. Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2 If token has not expired and there is user, set the new password
  if (!user) {
    return next(new AppError(`Token is Invalid or has expired`), 400);
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3 Update changePaswordAt property of the user
  //4 Log the user in, send JWT to client(user)
  createSendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  //1. Get user from the collection
  const user = await User.findById(req.user.id).select('+password');
  //2 Check if POSTed current password is coreect
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError(`Your current password is wrong.`, 401));
  }
  //3 If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //N.b User.findByIdAndUpdate will not work as intended!!!
  //4 Log user in , send JWT
  createSendToken(user, 200, res);
});

module.exports = {
  signUp,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
