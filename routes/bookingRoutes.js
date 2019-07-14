// Importing Dependencies
const express = require('express');
// Importing Contollers
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
// Declaring express Router
const router = express.Router(); // get params from previous route (tourRoutes)

router.use(authController.protect);
// Booking Routes | Views
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));
// Booking Routes | API
router.route('/').get(bookingController.getAllBookings).post(bookingController.createBooking);
router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking);

// Exporting Bookings Router
module.exports = router;