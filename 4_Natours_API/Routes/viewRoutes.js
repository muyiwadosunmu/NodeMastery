const express = require('express');
const viewsController = require('../controllers/viewsController');

// implementation
const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/tour', viewsController.getTour);
module.exports = router;
