const express = require('express');
const viewsController = require('../controllers/viewsController');
const { protect, isLoggedIn } = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
// implementation
const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.get('/me', protect, viewsController.getAccount);
router.get('/my-tours', protect, viewsController.getMyTours);

router.post('/submit-user-data', protect, viewsController.updateUserData);
//   .post(viewsController.postLoginForm);
module.exports = router;
