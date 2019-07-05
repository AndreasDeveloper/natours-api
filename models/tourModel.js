// Importing Dependencies
const mongoose = require('mongoose');

// Tour Schema
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tour name missing'],
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'Tour duration missing']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour maxGrouSize missing']
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty missing']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour price missing']
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, 'Tour summary missing'],
      trim: true // Cut the whitespace
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'Tour imageCover missing']
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
  });
// Tour Model
const Tour = mongoose.model('Tour', tourSchema);

// Exporting Tour Model
module.exports = Tour;