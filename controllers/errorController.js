// Error Handling Middleware
module.exports = (err, req, res, next) => {
    // Default Status Code & Status
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};