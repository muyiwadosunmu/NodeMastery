const express = require('express');

const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  createReview,
} = require('../Controllers/reviewControler');
const { protect, restrictTo } = require('../Controllers/authController');

router
  .route('/')
  .get(protect, restrictTo('user'), getAllReviews)
  .post(protect, createReview);

module.exports = router;
