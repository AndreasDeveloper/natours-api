// Importing Dependencies
const express = require('express');
// Importing Controllers
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
// Declaring express Router
const router = express.Router();

// Routes 

// GET - Tours Overview
router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);
// GET - Tour
router.get('/tour/:tourName', authController.isLoggedIn, viewsController.getTour);
// GET - Login Page
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// GET - User Account
router.get('/me', authController.protect, viewsController.getAccount);
// GET - User Bookings
router.get('/my-tours', authController.protect, viewsController.getMyTours);


// POST - Edit User Data (Old Fashioned Way)
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

// Exporting View routes Rotuer
module.exports = router;