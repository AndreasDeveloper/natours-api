// Importing Dependencies
const mongoose = require('mongoose');

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

// * Query Middleware - Populate Reviews
reviewSchema.pre(/^find/, function(next) {
    // Populate Reviews
    // this.populate({
    //     path: 'tour',
    //     select: 'name', // Select only name
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });

    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

// Review Model
const Review = mongoose.model('Review', reviewSchema);

// Exporting Review Model
module.exports = Review;