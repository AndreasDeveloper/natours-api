// Importing Models
const Review = require('../models/reviewModel');
// Importing Utilities
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET - All Reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
    // Getting all reviews
    const reviews = await Review.find();

    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

// POST - New Review
exports.createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    // Creating new review
    const newReview = await Review.create(req.body);

    // Sending Status & JSON
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
});