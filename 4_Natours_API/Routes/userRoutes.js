const express = require('express');
const { signUp, login } = require('../Controllers/authController');

const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../Controllers/userControllers');

router.post('/signup', signUp);
router.post('/login', login);

router.param('id', (req, res, next, val) => {
  console.log(`User id is ${val}`);
  next();
});

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
