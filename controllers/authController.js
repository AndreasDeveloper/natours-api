// Importing Dependencies
const crypto = require('crypto');
const { promisify } = require('util'); 
const jwt = require('jsonwebtoken');
// Importing Models
const User = require('../models/userModel');
// Importing Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

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
        return next(new AppError('Incorrect email or password', 401)); // 401 - Unauthorised
    }

    // Send token to client
    const token = signToken(user._id);
    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        token
    });
});

// Middleware For Authorization
exports.protect = catchAsync(async (req, res, next) => {
    // Get token & check if exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // check if authorization header starts with Bearer
        token = req.headers.authorization.split(' ')[1]; // Getting the second element of the array which is JWT
    }
    if (!token) {
        return next(new AppError('You must be logged in'), 401);
    }

    // Verificate token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // returns promise & awaits it right away

    // Check if user exists
    const freshUser = await User.findById(decoded.id); // decoded holds id in its payload 
    if (!freshUser) {
        return next(new AppError('The user belonging to this token no longer exists', 401));
    }

    // Check if user changed password after the JWT was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) { // iat - issued at
        return next(new AppError('User password changed recently. Log in again', 401));
    }

    // Put user data on the request
    req.user = freshUser;
    next();
});

// Middleware For Restricting users on specific routes
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('No permission to perform this action', 403)); // 403 - Forbidden
        }

        next();
    };
};

// Middleware for Forgetting the password and sending reset link to user
exports.forgotPassword = catchAsync(async (req, res, next) => {
    // Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('User with given email address is not found', 404));
    } 

    // Generate random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); // Deactivate all validators

    // Send it back as an email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a patch request with your new password and password confirm to: ${resetURL}\n If you didn't forget your password, ignore this email.`;

    try { // Try / Catch because something more HAS to be done
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token',
            message
        });
    
        // Sending Status & JSON
        res.status(200).json({
            status: 'sucess',
            message: 'Token sent to email'
        });
    } catch (err) { // If error, reset both 
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again.', 500));
    }
});

// Middleware for
exports.resetPassword = catchAsync(async (req, res, next) => {
    // Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()} }); // Find user by the token & check if token expired

    // If token has not expired & user exists, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    // Reset tokens
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Saves docs
    await user.save();

    // Update changedPasswordAt property for the user    

    // Log the user in, send JWT
    const token = signToken(user._id);
    // Sending Status & JSON
    res.status(200).json({
        status: 'sucess',
        token
    });
});