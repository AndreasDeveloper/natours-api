// Importing Dependencies
const mongoose = require('mongoose');

// Tour Schema
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tour name missing'],
      unique: true
    },
    rating: {
      type: Number,
      default: 4.5
    },
    price: {
      type: Number,
      required: [true, 'Tour price missing']
    }
  });
// Tour Model
const Tour = mongoose.model('Tour', tourSchema);


// Exporting Tour Model
module.exports = Tour;