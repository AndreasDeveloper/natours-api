// Importing Dependencies
const express = require('express');
// Importing Contollers
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// Declaring express Router
const router = express.Router();

// Param Middleware
// router.param('id', tourController.checkID); 

// Tours Resources - Routes
router.route('/tour-stats').get(tourController.getTourStats); // Tours Stats
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan); // Tours Stats

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours); // Top 5 Tours

router.route('/').get(authController.protect, tourController.getAllTours).post(tourController.createTour); // GET & POST Tours
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour); // GET, PATCH, DELETE Tours

// Exporting Tours Router
module.exports = router;