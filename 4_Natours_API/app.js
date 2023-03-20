const express = require('express');

const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

const userRouter = require('./Routes/userRoutes');
const tourRouter = require('./Routes/tourRoutes');

//Middlewares

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
      'price',
    ],
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Route Handlers
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
//  app.delete('/api/v1/tours/:id', deleteTour);

//User Route_Handlers

// Routes => Middleware

app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
