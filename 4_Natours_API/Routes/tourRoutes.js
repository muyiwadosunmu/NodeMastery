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

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan').get(getMonthlyPlan);
// router.param('id'); //To define parameter middleware in our application
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
