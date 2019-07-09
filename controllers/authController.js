// Importing Dependencies
const jwt = require('jsonwebtoken');
// Importing Models
const User = require('../models/userModel');
// Importing Utils
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    // Creating new User
    const newUser = await User.create(req.body);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { // arguments: payload, secret, options
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Sending Status & JSON
    res.status(201).json({ // 201 - Created
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});