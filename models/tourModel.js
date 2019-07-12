// Importing Dependencies
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
// Importing Modles
//const User = require('./userModel');

// Tour Schema
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tour name missing'],
      unique: true,
      trim: true, 
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [6, 'A tour name must have more or equal then 6 characters'],
      // validate: [ validator.isAlpha, 'Tour name must only contain characters' ]
    },
    slug: String,
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
      required: [true, 'Tour difficulty missing'],
      enum: { values: ['easy', 'medium', 'difficult'], message: 'Difficulty must be either easy, medium or difficulty' }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // setter function will run each time value is updated
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Tour price missing']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on newly created doc
          return val < this.price; // Return true if discount price is lower than regular price
        },
        message: 'Discount price ({VALUE}) must be below the regular price'
      } 
    },
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
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON format
      type: {
        type: String,
        default: 'Point', // Start location
        enum: ['Point'] // Only point is valid
      },
      coordinates: [Number], // Array of numbers - LONGITUDE & LATITUDE
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
// object options - adding virtual properties
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Setting index to price & ratingsAverage - 1 Ascending | -1 Descending
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Compound index
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); // using 2dsphere index for real life locations on earth

// Virtual Property - Convert duration to weeks
tourSchema.virtual('durationWeeks').get(function() { // virtual properties cannot be used with/in queries
  return this.duration / 7;
});

// Virtual Property - Virtual populate - Populating and setting reviews field to model without touching db directly
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // tour field in reviewModel
  localField: '_id' // Where is id stored in current model
});

// * Document Middleware - Converts tour name to lower case and slugify it
tourSchema.pre('save', function(next) { // pre save hook, before document is saved
  this.slug = slugify(this.name, { lower: true });
  next();
});
// * Document Middleware - Embedding Guides to Tours
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises); // Result of guidesPromises is promise, it has to be resolved

//   next();
// });

// * Query Middleware - Make secret tours invisible
tourSchema.pre(/^find/, function(next) { // pre find hook, before query was found - ^ means starts with
  this.find({ secretTour: { $ne: true } }); // Don't show secret tours - this points to query

  this.start = Date.now();
  next();
});
// * Query Middleware - Populate Guides
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// * Aggregation Middleware - Adding match stage to the pipeline array 
tourSchema.pre('aggregate', function(next) {
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // Exclude secret tours from aggregation pipeline
  
  // Adding $match stage to the begining of the pipeline array
  this.pipeline().splice(1, 0, { $match: { secretTour: { $ne: true } } }); // Exclude secret tours from aggregation pipeline

  next();
});

// Tour Model
const Tour = mongoose.model('Tour', tourSchema);

// Exporting Tour Model
module.exports = Tour;