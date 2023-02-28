const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error : Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      // err: err,
      message: err.message,
      // stack: err.stack,
    });

    // Programming Error or other unknown error:
  } else {
    // 1. Log the Error
    console.error(`Error`, err);
    //2. Send Generic Message
    res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
