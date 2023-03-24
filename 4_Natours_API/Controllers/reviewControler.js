const Tour = require('../models/tourModels');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  // SEND RESPONSE
  return res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  return res.status(201).json({
    status: `Success`,
    data: {
      review: newReview,
    },
  });
});
module.exports = { getAllReviews, createReview };
