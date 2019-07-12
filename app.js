// Importing Dependencies
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
// Importing Middleware 
const globalErrorHandler = require('./controllers/errorController');
// Importing Utils
const AppError = require('./utils/appError');
// Importing Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();


// Middlewares
// Helmet
app.use(helmet());
// Morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Express Rate Limit
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour in miliseconds,
    message: 'Too many requests from this IP, try again in 1 hour'
});
app.use('/api', limiter);
// JSON / Body Parser
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb
// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());
// Prevent parameter polution (HPP)
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));
// Serving Static Files
app.use(express.static(`${__dirname}/public`));


// * - Routes - * \\
// Express Router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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