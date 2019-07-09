// Importing Models
const User = require('../models/userModel');
// Importing Utils
const catchAsync = require('../utils/catchAsync');

// Handler Functions for USERS
// GET - All Users
exports.getAllUsers = catchAsync(async (req, res) => {
    // Getting all Users
    const allUsers = await User.find();

    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        results: allUsers.length,
        data: {
            allUsers
        }
    });
});

// GET - Specific User
exports.getUser = (req, res) => {
    res.status(500).json({ // 500 - Internal Server Error
        status: 'error',
        message: 'Route not defined'
    });
};

// POST - New User
exports.createUser = (req, res) => {
    res.status(500).json({ // 500 - Internal Server Error
        status: 'error',
        message: 'Route not defined'
    });
};

// PATCH - Specific User
exports.updateUser = (req, res) => {
    res.status(500).json({ // 500 - Internal Server Error
        status: 'error',
        message: 'Route not defined'
    });
};

// DELETE - Specific User
exports.deleteUser = (req, res) => {
    res.status(500).json({ // 500 - Internal Server Error
        status: 'error',
        message: 'Route not defined'
    });
};