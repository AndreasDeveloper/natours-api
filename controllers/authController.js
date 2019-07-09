// Importing Dependencies
const jwt = require('jsonwebtoken');
// Importing Models
const User = require('../models/userModel');
// Importing Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Function for signing tokens
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { // arguments: payload, secret, options
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// POST - Sign Up New User
exports.signup = catchAsync(async (req, res, next) => {
    // Creating new User
    const newUser = await User.create(req.body);

    // Creating JWT
    const token = signToken(newUser._id);

    // Sending Status & JSON
    res.status(201).json({ // 201 - Created
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

// POST - Login User
exports.login = catchAsync(async (req, res, next) => {
    // Variables
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Provide email and password', 400));
    }
    // Find user and get email and password fields
    const user = await User.findOne({ email }).select('+password'); // if field has select: false, +fieldName must be used to 'display' it back again

    // Check if user exist and if password is correct
    if (!user || !(await user.correctPassword(password, user.password))) { // Compare passwords
        return next(new AppError('Incorrect email or password'), 401); // 401 - Unauthorised
    }

    // Send token to client
    const token = signToken(user._id);
    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        token
    });
});