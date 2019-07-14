// Importing Dependencies
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Importing Controllers
const factory = require('../controllers/handlerFactory');
// Importing Models
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
// Importing Utilities
const catchAsync = require('../utils/catchAsync');

// GET - Checkout Session
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // Get currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`, // webhook workaround
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            { 
                name: `${tour.name} Tour`, 
                description: tour.summary, 
                images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount: tour.price * 100, // amount expected to be in cents, multiply by 100 needed
                currency: 'usd',
                quantity: 1
            }
        ]
    });

    // Create session as a response
    res.status(200).json({
        status: 'success',
        session
    });
});


// TEMPORARY MIDDLEWARE | ALTERNATIVE TO WEBHOOKS
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    // Getting variables from query
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    // Creating Booking
    await Booking.create({ tour, user, price });
    
    // Redirecting
    res.redirect(req.originalUrl.split('?')[0]);
});

// GET - Bookings
exports.getAllBookings = factory.getAll(Booking);

// GET - Specific Booking
exports.getBooking = factory.getOne(Booking);

// POST - New Bookings
exports.createBooking = factory.createOne(Booking);

// PATCH - Specific Booking
exports.updateBooking = factory.updateOne(Booking);

// DELETE - Specific Booking
exports.deleteBooking = factory.deleteOne(Booking);