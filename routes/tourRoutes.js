// Importing Dependencies
const express = require('express');
const fs = require('fs');
// Importing Contollers
const tourController = require('../controllers/tourController');
// Declaring express Router
const router = express.Router();

// Param Middleware
router.param('id', tourController.checkID); 



// Tours Resources - Routes
router.route('/').get(tourController.getAllTours).post(tourController.checkBody, tourController.createTour);
router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);

// Exporting Tours Router
module.exports = router;