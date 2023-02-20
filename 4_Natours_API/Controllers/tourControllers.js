const Tour = require('../models/tourModels');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
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

const getAllTours = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(401).json({
      status: `Failed`,
      message: error,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const reqBody = req.body;
    const newTour = await Tour.create(reqBody);
    return res.status(201).json({
      status: `Success`,
      data: { tour: newTour },
    });
  } catch (error) {
    return res.status(404).json({
      status: `Failed`,
      message: error,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const ID = req.params.id;
    const tour = await Tour.findById(ID);
    return res.status(200).json({
      status: `Success`,
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: `Failed`,
      message: error,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const ID = req.params.id;
    const updateBody = req.body;
    const tour = await Tour.findByIdAndUpdate(ID, updateBody, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: `Failed`,
      message: error,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const ID = req.params.id;
    await Tour.findByIdAndDelete(ID, {});
    return res.status(204).json({
      status: `Success`,
      data: null,
    });
  } catch (error) {
    return res.status(404).json({
      status: `Failed`,
      message: error,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: error,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    console.log(year);
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
  } catch (error) {
    res.status(404).json({
      status: 'Fail',
      message: error,
    });
  }
};

module.exports = {
  getMonthlyPlan,
  getTourStats,
  aliasTopTours,
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
};
