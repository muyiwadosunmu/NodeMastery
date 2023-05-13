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

exports.getTour = catchAsync(async (req, res) => {
  //1 Get the data, for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews rating user',
  });

  //2 Build the template

  //3 Render template using data from step1
  res.status(200).render('tour.pug', {
    title: `${tour.name} Tour`,
    tour: tour,
  });
});
