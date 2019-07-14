// Importing Dependencies
const express = require('express');
// Importing Contollers
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
// Declaring express Router
const router = express.Router(); // get params from previous route (tourRoutes)

// Booking Routes
router.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession);

// Exporting Bookings Router
module.exports = router;