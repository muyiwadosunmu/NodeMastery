const express = require('express');

const router = express.Router();

const {
  getMonthlyPlan,
  getTourStats,
  aliasTopTours,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../Controllers/tourControllers');
const { protect, restrictTo } = require('../Controllers/authController');
const reviewRouter = require('./reviewRoutes');

router.use('/:tourID/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly_plan/:year').get(getMonthlyPlan);
router.route('/tour-stats').get(getTourStats);

// router.param('id'); //To define parameter middleware in our application
router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
