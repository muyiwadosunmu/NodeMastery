const Tour = require('../models/tourModels');

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

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter()
};

const getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // BUILD THE QUERY
    // 1A) FILTERING
    const queryObject = { ...req.query }; //We're making a hardCopy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    //1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    //2 SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');

      query = query.sort(sortBy);
      // sort('price ratingsAverage'), if there's a tie
    } else {
      query = query.sort('-createdAt');
    }

    //3 FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //4 PAGINATION
    //?page=2&limit=10 --> page1(1-10), page2(11-20)
    const page = req.query.page * 1 || 1; //Nice trick to convert string to Number
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;
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
    return res.stat(404).json({
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
module.exports = {
  aliasTopTours,
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
};
