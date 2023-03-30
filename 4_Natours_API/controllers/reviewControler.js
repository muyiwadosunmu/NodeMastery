const Tour = require('../models/tourModels');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

/* const getAllReviews = catchAsync(async (req, res, next) => {
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
}); */

// This middleware runs before the createReview implementation(ie- a middleware)
const setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

const getReview = factory.getOne(Review);
const getAllReviews = factory.getAll(Review);
const createReview = factory.createOne(Review);
const updateReview = factory.updateOne(Review);
const deleteReview = factory.deleteOne(Review);

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setTourUserIds,
};
