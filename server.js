// Importing Modules
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Safety Net #2 | If there are uncaught exceptions
process.on('uncaughtException', err => {
  console.log('Uncaught Exception. Shutting Down..')
  console.log(err.name, err.message);
  // Shutting Down Server
  process.exit(1); // 0 - success | 1 - Uncaught Exception
});

// Setting Environmental Variables
dotenv.config({ path: './config.env' });
const app = require('./app');

// Connecting MongoDB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
  console.log('Database connected');
});

// Listening Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});


// Safety Net #1 | If server error appear | Unhandled Rejection Promise
process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection. Shutting Down..')
  console.log(err.name, err.message);
  // Shutting Down Server
  server.close(() => {
    process.exit(1); // 0 - success | 1 - Uncaught Exception
  });
});