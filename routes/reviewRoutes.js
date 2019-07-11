// Importing Dependencies
const express = require('express');
// Importing Contollers
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
// Declaring express Router
const router = express.Router();

// Review Routes
router.route('/').get(authController.protect, reviewController.getAllReviews).post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

// Exporting Reviews Router
module.exports = router;