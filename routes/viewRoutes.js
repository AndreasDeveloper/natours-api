// Importing Dependencies
const express = require('express');
// Importing Controllers
const viewsController = require('../controllers/viewsController');
// Declaring express Router
const router = express.Router();

// Routes 

// GET - Tours Overview
router.get('/', viewsController.getOverview);
// GET - Tour
router.get('/tour', viewsController.getTour);


// Exporting View routes Rotuer
module.exports = router;