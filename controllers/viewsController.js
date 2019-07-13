// Importing Models
const Tour = require('../models/tourModel');
// Importing Utilities
const catchAsync = require('../utils/catchAsync');


// GET - Overview of Tours
exports.getOverview = catchAsync(async (req, res, next) => {
    // Get tour data from collection
    const tours = await Tour.find();

    // Render Template using tour data
    res.status(200).render('overview', { title: 'All Tours', tours });
});

// GET - Tour
exports.getTour = catchAsync(async (req, res, next) => {
    // Get the requested tour and populate it with reviews
    const tour = await Tour.findOne({ slug: req.params.tourName }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    // Render Template using tour data
    res.status(200).render('tour', { title: `${tour.name}`, tour });
});

// GET - Login Page
exports.getLoginForm = (req, res) => {
    // Render Template
    res.status(200).render('login', { title: 'Log into your account' });
};