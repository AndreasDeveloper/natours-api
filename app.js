// Importing Dependencies
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
// Importing Middleware 
const globalErrorHandler = require('./controllers/errorController');
// Importing Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());
// Serving Static Files
app.use(express.static(`${__dirname}/public`));



// * - Routes - * \\
// Express Router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling 404 Pages
app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on the server.`);
    // err.status = 'fail';
    // err.statusCode = 404;

    // Passing error right to error handling middleware (skips over all other middlewares)
    next(new AppError(`Can't find ${req.originalUrl} on the server.`, 404));
});

// Error Handling Middleware
app.use(globalErrorHandler);

// Exporting App
module.exports = app;