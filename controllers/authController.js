// Importing Models
const User = require('../models/userModel');
// Importing Utils
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
    // Creating new User
    const newUser = await User.create(req.body);

    // Sending Status & JSON
    res.status(201).json({ // 201 - Created
        status: 'success',
        data: {
            user: newUser
        }
    });
});