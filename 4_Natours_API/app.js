const express = require('express');

const app = express();
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');

const userRouter = require('./Routes/userRoutes');
const tourRouter = require('./Routes/tourRoutes');

//Middlewares

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

console.log(process.env.NODE_ENV);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
