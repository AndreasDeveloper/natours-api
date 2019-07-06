// Importing Dependencies
const express = require('express');
// Importing Contollers
const tourController = require('../controllers/tourController');
// Declaring express Router
const router = express.Router();

// Param Middleware
// router.param('id', tourController.checkID); 

// Tours Resources - Routes
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/').get(tourController.getAllTours).post(tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

// Exporting Tours Router
module.exports = router;