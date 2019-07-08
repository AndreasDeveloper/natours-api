// Setting Environmental Variables
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// Importing Modules
const mongoose = require('mongoose');
const app = require('./app');

// Connecting MongoDB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }).then(() => {
  console.log('Database connected');
});

// Listening Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});