const multer = require('multer');
const sharp = require('sharp');
const Tour = require('../models/tourModels');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const multerStorage = multer.memoryStorage();

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
const uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  { name: 'images', maxCount: 3 },
]);

/**Let's say we want a field that takes in multiple images
 * const multipleImagesToAField = upload.array('images',5) => req.files
 * const singleImageUpload = upload.singlr("image")  => req.file
 */

const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Process Cover Image
  /**our updateOne factory function takes in req.body so we need to add imageCover to the req.body object */
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  //2) Processing Images
  // a callback that gets access to current >= file and index (which is zero-based) =<
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      // In this case we need to create the current filename
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

// Method 1
// const tours = await Tours.find({
//   duration: 5,
//   difficulty: 'easy',
// });
//{difficulty: 'easy', duration:{$gte:5}}

// Method 2
// const query = Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');

// EXEXCUTE QUERY

/* const getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.query);
  // BUILD THE QUERY
  // 1A) FILTERING

  //2 SORTING

  //3 FIELD LIMITING

  //4 PAGINATION
  //?page=2&limit=10 --> page1(1-10), page2(11-20)

  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitfields()
    .paginate();
  const tours = await features.query;
  // query.sort().select().skip().limit()

  // SEND RESPONSE
  return res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
}); */

/* const createTour = catchAsync(async (req, res, next) => {
  const reqBody = req.body;
  const newTour = await Tour.create(reqBody);
  return res.status(201).json({
    status: `Success`,
    data: { tour: newTour }
  });
}); */

/* const getTour = catchAsync(async (req, res, next) => {
  const ID = req.params.id;
  const tour = await Tour.findById(ID).populate([
    { path: 'reviews', strictPopulate: false },
  ]);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  return res.status(200).json({
    status: `Success`,
    data: {
      tour,
    },
  });
}); */

/* const updateTour = catchAsync(async (req, res, next) => {
  const ID = req.params.id;
  const updateBody = req.body;
  const tour = await Tour.findByIdAndUpdate(ID, updateBody, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  return res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
}); */

const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, {
  path: 'reviews',
  strictPopulate: false,
});
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);
/* Normal Function for ourdeleteT
const deleteTour = catchAsync(async (req, res, next) => {
  const ID = req.params.id;
  const tour = await Tour.findByIdAndDelete(ID, {});
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }
  return res.status(204).json({
    status: `Success`,
    data: null,
  });
}); */

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgrating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }, // WE could repeat the aggregates as well
    // },
  ]);
  return res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  // console.log(year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
      preserveNullAndEmptyArrays: true,
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $projects: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  return res.stats(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});

/*tours-within/:distance/center/:latlng/unit/:unit'
  tours-within/233/center/-40,45/unit/mi
                            (lat, lng)
*/

const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  return res.status(200).json({
    status: `Success`,
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(
      new AppError(
        `Please provide latitude and longitude in the format lat,lng`,
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    /**geoNear should always be the first stage, it requires at least one of our fields contain a geospatial index, which we did before in tourModels.js.
     * But if we hace multiple fields with geospatial indexes then we need to use the key parameters
     */
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [
            lng * 1,
            lat * 1,
          ] /**multiplied by 1 to change them to numbers */,
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  return res.status(200).json({
    status: `Success`,
    data: {
      data: distances,
    },
  });
});
/**  This below doesn't apply here
   * const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
});*/

module.exports = {
  getMonthlyPlan,
  getTourStats,
  aliasTopTours,
  createTour,
  getAllTours,
  getTour,
  updateTour,
  uploadTourImages,
  resizeTourImages,
  deleteTour,
  getToursWithin,
  getDistances,
};
