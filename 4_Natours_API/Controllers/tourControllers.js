const Tour = require('../models/tourModels');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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
      data: newTour,
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
module.exports = { createTour, getAllTours, getTour, updateTour, deleteTour };
