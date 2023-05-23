const multer = require('multer');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

/**Configure a multter upload */
/**If no file path is specidied, it saves to the memory */
/**images are not directly uploaded in the DB, but rather our file system, then in the DB we put a link to that image*/
/**In our scenario in the user docs we'll have the name of the uploaded file */
const multerStorage = multer.diskStorage({
  /**Destination is acall back function that has access to req, file, callback */
  destination: (req, file, callback) => {
    callback(null, 'public/img/users');
  },
  filename: (req, file, callback) => {
    // user-user ID-timestamp.fileExtension
    const ext = file.mimetype.split('/')[1];
    callback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('Not an image!, Please upload only images', 400),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
const uploadUserPhoto = upload.single('photo');

const filtereObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/* const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  // query.sort().select().skip().limit()

  // SEND RESPONSE
  return res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
}); */

const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

const updateMe = catchAsync(async (req, res, next) => {
  console.log('Helo');
  console.log(req.file);
  console.log(req.body);
  //1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        `This route is not for password updates, Please use  /updateMyPassword`,
        400
      )
    );
  }

  //2. FiltereObj -> A function to filter out the unwanted field names not allowed to be updated */
  const filteredBody = filtereObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  //3. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  return res.status(200).json({
    status: `Success`,
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  return res.status(204).json({ status: `Success`, data: null });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

const getUser = factory.getOne(User);
const getAllUsers = factory.getAll(User);
/**Do not update password with this */
const updateUser = factory.updateOne(User); //Only for Admin
const deleteUser = factory.deleteOne(User);
// const createUser => Doesn't exist because we already have a SignUp implementation

module.exports = {
  getAllUsers,
  getMe,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  uploadUserPhoto,
};
