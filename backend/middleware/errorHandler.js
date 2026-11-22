/**
 * Global Error Handler Middleware
 * Centralized error handling for consistent API error responses
 */

const logger = require('../utils/logger');

/**
 * 404 Not Found Handler
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Global Error Handler
 * Must have 4 parameters for Express to recognize it as error handler
 */
const errorHandler = (err, req, res, next) => {
  // Default status code
  let statusCode = err.statusCode || err.status || 500;
  let message = process.env.NODE_ENV === 'production' && statusCode >= 500
    ? 'An unexpected server error occurred'
    : (err.message || 'Internal Server Error');

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  logger.error({
    message: process.env.NODE_ENV === 'production' && statusCode >= 500
      ? 'Unhandled server error'
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    statusCode,
    path: req.path,
    method: req.method,
  });

  if (err.name === 'MulterError' && err.code !== 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'The uploaded file could not be accepted';
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 50}MB`;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
