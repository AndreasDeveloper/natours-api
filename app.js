// Importing Dependencies
const express = require('express'),
      morgan = require('morgan');
const app = express();
// Importing Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

// Exporting App
module.exports = app;