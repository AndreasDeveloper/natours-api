// Importing Utils
const AppError = require('../utils/appError');

// Function for handling Cast Errors
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};
// Function for handling duplicate keys
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // Match string between quotes. Get the first element of returned array
    const message = `Duplicate field value: ${value}. Use another value`;
    return new AppError(message, 400);
};
// Function for handling validation errors
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
// Function for handling JWT errors
const handleJWTError = () => new AppError('Invalid JWT. Log in again', 401);
const handleJWTExpiredError = () => new AppError('JWT has expired. Log in again', 401);

// Function for Development Errors
const sendErrorDev = (err, res) => {
    // Sending Status and JSON
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Function for Production Errors
const sendErrorProd = (err, res) => {
    // If error is operational (created by developers (us))
    if (err.isOperational) {
        // Sending Status and JSON
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else { // else if it's not operational (3rd party error) - don't leak details to the client
        console.error('Error', err);
        // Sending Generic Status and JSON
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

// Error Handling Middleware
module.exports = (err, req, res, next) => {
    // Default Status Code & Status
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err}; 
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};