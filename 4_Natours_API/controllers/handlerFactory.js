const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const ID = req.params.id;
    const doc = await Model.findByIdAndDelete(ID, {});
    if (!doc) {
      return next(new AppError(`No document found with that ID`, 204));
    }
    return res.status(204).json({
      status: `Success`,
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const ID = req.params.id;
    const updateBody = req.body;
    const doc = await Model.findByIdAndUpdate(ID, updateBody, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    return res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const ID = req.params.id;
    let query = Model.findById(ID);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    return res.status(200).json({
      status: `Success`,
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    /**To allow for nested GET reviews on the tour model(A small hack)*/
    let filter;
    if (req.params.tourID) {
      filter = { tour: req.params.tourID };
    }
    // console.log(req.query);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitfields()
      .paginate();
    const doc = await features.query;
    /* const doc = await features.query.explain();*/ //Used to check our application stats and helped us to implement indexing

    // query.sort().select().skip().limit()

    // SEND RESPONSE
    return res.status(200).json({
      status: 'Success',
      requestedAt: req.requestTime,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

// BUILD THE QUERY
// 1A) FILTERING

//2 SORTING

//3 FIELD LIMITING

//4 PAGINATION
//?page=2&limit=10 --> page1(1-10), page2(11-20)

// EXECUTE QUERY
