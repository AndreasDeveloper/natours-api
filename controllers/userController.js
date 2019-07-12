// Importing Models
const User = require('../models/userModel');
// Importing Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// Importing Controllers
const factory = require('./handlerFactory');

// Function for filtering objects / keys
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

// ------ Handler Functions for USERS ------- 

// PATCH - Currently authenticated user - User Only
exports.updateMe = catchAsync(async (req, res, next) => {
    // Display error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Cannot update password on this route. Use /updatePassword to update password.', 400));
    }

    // Update user document - Filter out unwanted fields name that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true }); // new - returns new object instead of old one

    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

// DELETE - Currently authenticated user - User only
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    // Sending Status & JSON
    res.status(204).json({ // 204 - Deleted
        status: 'success',
        data: null
    });
});



// GET - Specific User
exports.getUser = factory.getOne(User);

// POST - New User
exports.createUser = (req, res) => {
    res.status(500).json({ // 500 - Internal Server Error
        status: 'error',
        message: 'Route not defined. Use /signup instead.'
    });
};

// GET - All Users - Administrator Only
exports.getAllUsers = factory.getAll(User);

// PATCH - Specific User - Administrator Only
exports.updateUser = factory.updateOne(User);

// DELETE - Specific User - Administrator Only 
exports.deleteUser = factory.deleteOne(User);