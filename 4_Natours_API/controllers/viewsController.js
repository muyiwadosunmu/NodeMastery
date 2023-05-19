const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Tour = require('../models/tourModels');
const AppError = require('../utils/appError');
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

exports.getTour = catchAsync(async (req, res, next) => {
  //1 Get the data, for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'reviews rating user',
    })
    .exec();
  if (!tour) {
    return next(new AppError("There's no tour with that name.", 404));
  }

  //2 Build the template

  //3 Render template using data from step1
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    )
    .render('tour.pug', {
      title: `${tour.name} Tour`,
      tour: tour,
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login.pug', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res, next) => {
  res.status(200).render('account.pug', {
    title: 'Your Account',
  });
};
// exports.postLoginForm = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;
//   const response = await fetch('https://127.0.0.1:3000/api/v1/users/login', {
//     method: 'POST',
//     body: JSON.stringify({ email, password }),
//     headers: { 'Content-Type': 'application/json' },
//   });
//   const data = await response.json();
//   console.log(data);
//   res.status(200).render('login.pug', {
//     title: 'Log into your account',
//     data,
//   });
// });
