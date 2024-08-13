// error-handler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging purposes
  
    // Determine the status code and message
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    const message = err.message || 'An unexpected error occurred';
  
    res.status(statusCode).json({
        statusCode,
      message,
    });
  };
  
  module.exports = errorHandler;
  