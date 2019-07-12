// Importing Dependencies
const express = require('express');
// Importing Contollers
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
// Declaring express Router
const router = express.Router({ mergeParams: true }); // get params from previous route (tourRoutes)


// Call Protect Middleware for all upcoming routes ->
router.use(authController.protect);
// Review Routes
router.route('/').get(reviewController.getAllReviews).post(authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);
router.route('/:id').get(reviewController.getReview).patch(authController.restrictTo('user', 'admin'), reviewController.updateReview).delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview);

// Exporting Reviews Router
module.exports = router;