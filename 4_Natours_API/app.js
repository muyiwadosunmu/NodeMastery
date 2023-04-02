const path = require('node:path');
const express = require('express');

const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./Routes/userRoutes');
const tourRouter = require('./Routes/tourRoutes');
const reviewRouter = require('./Routes/reviewRoutes');

//Middlewares
/**Make sure to install it */
app.set('view-engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Set security HTTP headers
app.use(helmet());

//Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100, //100 requests
  windowMs: 60 * 60 * 1000, //1hr converson
  mesaage: `Too many requests from this IP, please try again in an hour`,
});

//Limit requests from same API
app.use('/api', limiter); //We're limiting it to our API routes
// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data Snitization against NoSQL Query injection
/*Checks req.body, req.query, req.params and filters out all $ sign and .(dots)*/
app.use(mongoSanitize());
// Data Saitization against XSS[Cross-Site Scripting Attacks]
app.use(xss());
//Prevents parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price ',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use(express.urlencoded({ extended: false }));

/**SSR Routes */
app.get('/', (req, res) => {
  res.status(200).render('base.pug', {
    tour: 'The forest hiker',
    user: 'Muyiwa',
  });
});

app.get('/overview', (req, res) =>
  res.status(200).render('overview.pug', {
    title: 'All Tours',
  })
);

app.get('/tour', (req, res) =>
  res.status(200).render('tour.pug', {
    title: 'The Forst Hiker',
  })
);
//User Route_Handlers

// Routes => Middleware

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
