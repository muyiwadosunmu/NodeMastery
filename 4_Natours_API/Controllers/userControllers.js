const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  // query.sort().select().skip().limit()

  // SEND RESPONSE
  return res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

const updateMe = (req, res, next) => {
  //1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not for password updates, Please use  /resetPassword`,
        400
      )
    );
  }

  //2. Update user document
};

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: `This Route is yet not defined` });
};

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: `This Route is yet not defined` });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: `This Route is yet not defined` });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'Error', message: `This Route is yet not defined` });
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
