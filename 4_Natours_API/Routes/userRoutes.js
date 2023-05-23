const express = require('express');
const multer = require('multer');
const {
  signUp,
  protect,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  logout,
} = require('../controllers/authController');

const {
  getAllUsers,
  getMe,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userControllers');

/**If we do not pass in any destination, images would be saved in the memory */
const upload = multer({ dest: 'public/img/users' });

const router = express.Router();
router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// All routes after this should be protected
router.use(protect);
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', upload.single('photo'), updateMe);
router.delete('/deleteMe', deleteMe);

// router.param('id', (req, res, next, val) => {
//   console.log(`User id is ${val}`);
//   next();
// });

//All Routes below are protected and restricted to admin
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
