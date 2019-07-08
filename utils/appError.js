// AppError Class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message); 
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Checks if statusCode starts with 4 
        this.isOperational = true;
        // Adding Stack Trace
        Error.captureStackTrace(this, this.constructor);
    }
};

// Exporting AppError Class
module.exports = AppError;