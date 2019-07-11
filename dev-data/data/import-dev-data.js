// Importing Dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
// Importing MDB Model
const Tour = require('../../models/tourModel');

// Environmental Variables Config
dotenv.config({ path: './config.env' });

// Setting up MDB
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
  
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(() => console.log('DB connection successful!'));

// Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// Import Data into the Database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data seeded');
        process.exit();
    } catch (err) {
        throw new Error(err);
    }
};

// Delete all data from Database
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted');
        process.exit(); 
    } catch (err) {
        throw new Error(err);
    }
};

// Command Line Handler
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);