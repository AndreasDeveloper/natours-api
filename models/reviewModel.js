// Importing Dependencies
const mongoose = require('mongoose');
// Importing Models
const Tour = require('../models/tourModel');

// Review Schema
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review content is missing'],
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Review rating is missing'],
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
}, { // Show virtual elements that are not stored in db by default (virtual els)
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for Tours and Users to prevent duplicating reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// * Query Middleware - Populate Reviews
reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

// Static Method - Calculating Ratings Average
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([ // this points to the current model
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]); 

    if (stats.length > 0) {
        // Find and update tour with calculated data
        await Tour.findByIdAndUpdate(tourId, { ratingsQuantity: stats[0].nRating, ratingsAverage: stats[0].avgRating });
    } else {
        await Tour.findByIdAndUpdate(tourId, { ratingsQuantity: 0, ratingsAverage: 4.5 });
    }
};

// * Document Middleware - on Post call calcAverageRatings
reviewSchema.post('save', function() { // this points to current document that is being saved - post doesn't have access to next arg
    this.constructor.calcAverageRatings(this.tour); // constructor points to the Model
});


// * Query Middleware - For Updating and Deleting Documents | RATINGS / REVIEWS
reviewSchema.pre(/^findOneAnd/, async function(next) { // first get a query
    this.r = await this.findOne(); // works only on query middleware
});
reviewSchema.post(/^findOneAnd/, async function() { // then call the function and either Update or Delete the docs
    this.r.constructor.calcAverageRatings(this.r.tour);
});


// Review Model
const Review = mongoose.model('Review', reviewSchema);

// Exporting Review Model
module.exports = Review;