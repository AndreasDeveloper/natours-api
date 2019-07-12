// Importing Models
const Review = require('../models/reviewModel');
// Importing Controllers
const factory = require('./handlerFactory');

// GET - All Reviews
exports.getAllReviews = factory.getAll(Review);

// GET - Specific Review
exports.getReview = factory.getOne(Review);

// POST - New Review
exports.setTourUserIds = (req, res, next) => { // Middleware Function
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};
exports.createReview = factory.createOne(Review);

// PATCH - Review
exports.updateReview = factory.updateOne(Review);

// DELETE - Review
exports.deleteReview = factory.deleteOne(Review);