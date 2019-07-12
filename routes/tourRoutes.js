// Importing Dependencies
const express = require('express');
// Importing Contollers
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// Importing Routes
const reviewRouter = require('../routes/reviewRoutes');
// Declaring express Router
const router = express.Router();

// Param Middleware
// router.param('id', tourController.checkID); 

// User Review router if it encounters endpoint such as this one
router.use('/:tourId/reviews', reviewRouter);

// Tour Stats & Monthly Plan Routes
router.route('/tour-stats').get(tourController.getTourStats); // Tours Stats
router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan); // Tours Stats
// 5 Top Cheap Tours Route
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours); // Top 5 Tours
// Tour routes
router.route('/').get(tourController.getAllTours).post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour); // GET & POST Tours
router.route('/:id').get(tourController.getTour).patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour); // GET, PATCH, DELETE Tours

// Exporting Tours Router
module.exports = router;