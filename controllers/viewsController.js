// Importing Models
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
// Importing Utilities
const AppError = require('../utils/appError');
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

    if (!tour) {
        return next(new AppError('No tour with that name', 404));
    }

    // Render Template using tour data
    res.status(200).render('tour', { title: `${tour.name}`, tour });
});

// GET - Login Page
exports.getLoginForm = (req, res) => {
    // Render Template
    res.status(200).render('login', { title: 'Log into your account' });
};

// GET - User Account
exports.getAccount = (req, res) => {
    // Render Template
    res.status(200).render('account', { title: 'Your Account' });
};


// POST - Update User Data
exports.updateUserData = catchAsync(async (req, res, next) => {
    // Update User
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true, // Get new updated document
        runValidators: true
    });
    // Render Template
    res.status(200).render('account', { title: 'Your Account', user: updatedUser });
});