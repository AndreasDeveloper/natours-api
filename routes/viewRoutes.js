// Importing Dependencies
const express = require('express');
// Importing Controllers
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
// Declaring express Router
const router = express.Router();

// Routes 

router.use(authController.isLoggedIn);
// GET - Tours Overview
router.get('/', viewsController.getOverview);
// GET - Tour
router.get('/tour/:tourName', viewsController.getTour);
// GET - Login Page
router.get('/login', viewsController.getLoginForm);


// Exporting View routes Rotuer
module.exports = router;