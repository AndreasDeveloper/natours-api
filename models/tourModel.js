// Importing Dependencies
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

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
      max: [5, 'Rating must be below 5.0']
    },
    ratingQuantity: {
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
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  }, { // object options - adding virtual properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

// Virtual Property - Convert duration to weeks
tourSchema.virtual('durationWeeks').get(function() { // virtual properties cannot be used with/in queries
  return this.duration / 7;
});

// * Document Middleware
tourSchema.pre('save', function(next) { // pre save hook, before document is saved
  this.slug = slugify(this.name, { lower: true });
  next();
});
// * Query Middleware
tourSchema.pre(/^find/, function(next) { // pre find hook, before query was found - ^ means starts with
  this.find({ secretTour: { $ne: true } }); // Don't show secret tours - this points to query

  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function(docs, next) { // post runs after query has been executed
  // console.log(`Query took ${Date.now() - this.start} miliseconds`);
  // console.log(docs);
  next();
});
// * Aggregation Middleware
tourSchema.pre('aggregate', function(next) {
  // Adding $match stage to the begining of the pipeline array
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // Exclude secret tours from aggregation pipeline

  console.log(this);
  next();
});

// Tour Model
const Tour = mongoose.model('Tour', tourSchema);

// Exporting Tour Model
module.exports = Tour;