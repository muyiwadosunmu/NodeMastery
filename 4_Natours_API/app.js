const path = require('node:path');
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./Routes/userRoutes');
const tourRouter = require('./Routes/tourRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const viewRouter = require('./Routes/viewRoutes');

//Middlewares
/**Make sure to install it */
// app.use(
//   cors({
//     origin: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js',
//   })
// );
app.use(express.static(path.join(__dirname, './public')));
app.set('view-engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// Serving static files
// Set security HTTP headers
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js"
  );
  return next();
});

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
app.use(cookieParser());

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
  console.log(req.cookies);
  next();
});

app.use(express.urlencoded({ extended: false }));

/**SSR Routes were previously here*/

//User Route_Handlers

// Routes => Middleware

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
