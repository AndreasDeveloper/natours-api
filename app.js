// Importing Dependencies
const epxress = require('express'),
      morgan = require('morgan');
const app = epxress();
// Importing Routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Middlewares
app.use(morgan('dev'));
app.use(epxress.json());

// * - Routes - * \\
// Express Router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Exporting App
module.exports = app;