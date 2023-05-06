const Tour = require('../models/tourModels');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //1 Get tour data from collection
  const tours = await Tour.find();

  //Build template
  //3 Render that template using tour data from 1
  res.status(200).render('overview.pug', {
    tour: 'All Tours',
    tours: tours,
  });
});

exports.getTour = (req, res) =>
  res.status(200).render('tour.pug', {
    title: 'The Forst Hiker',
  });
