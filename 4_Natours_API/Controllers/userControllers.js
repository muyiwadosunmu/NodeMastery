const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

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
