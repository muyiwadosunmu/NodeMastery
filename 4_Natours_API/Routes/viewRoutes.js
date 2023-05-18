const express = require('express');
const viewsController = require('../controllers/viewsController');
const { protect } = require('../controllers/authController');
// implementation
const router = express.Router();

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', protect, viewsController.getTour);
router.route('/login').get(viewsController.getLoginForm);
//   .post(viewsController.postLoginForm);
module.exports = router;
