// Importing Dependencies
const express = require('express');
// Importing Contollers
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
// Declaring express Router
const router = express.Router({ mergeParams: true }); // get params from previous route (tourRoutes)

// Review Routes
router.route('/').get(authController.protect, reviewController.getAllReviews).post(authController.protect, authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview);
router.route('/:id').get(reviewController.getReview).patch(reviewController.updateReview).delete(reviewController.deleteReview);

// Exporting Reviews Router
module.exports = router;