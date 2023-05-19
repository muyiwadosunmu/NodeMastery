const express = require('express');
const viewsController = require('../controllers/viewsController');
const { protect, isLoggedIn } = require('../controllers/authController');
// implementation
const router = express.Router();

router.get('/', isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', isLoggedIn, viewsController.getTour);
router.get('/login', isLoggedIn, viewsController.getLoginForm);
router.get('/me', protect, viewsController.getAccount);
//   .post(viewsController.postLoginForm);
module.exports = router;
