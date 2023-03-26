const Tour = require('../models/tourModels');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter;
  if (req.params.tourID) {
    filter = { tour: req.params.tourID };
  }
  const reviews = await Review.find(filter);

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
  //If we didn't specify the tourID in the body, then we want to define it from the url and likewise the user to be a logged in user

  //Allow Nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  return res.status(201).json({
    status: `Success`,
    data: {
      review: newReview,
    },
  });
});
module.exports = { getAllReviews, createReview };
