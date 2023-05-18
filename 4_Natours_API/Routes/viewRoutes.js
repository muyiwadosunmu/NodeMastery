const express = require('express');
const viewsController = require('../controllers/viewsController');
const { protect, isLoggedIn } = require('../controllers/authController');
// implementation
const router = express.Router();
router.use(isLoggedIn);
router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);
router.route('/login').get(viewsController.getLoginForm);
//   .post(viewsController.postLoginForm);
module.exports = router;
