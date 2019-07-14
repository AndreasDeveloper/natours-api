// Importing Dependencies
const multer = require('multer');
const sharp = require('sharp');
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

// -- Multer -- \\

// Creating Multer Storage
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users'); // args - error and destination
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1]; // Getting mime type (jpg, jpeg, png..)
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // Creating filename
//     }
// });
const multerStorage = multer.memoryStorage(); // Saving files to memory | buffer save

// Creating Multer Filter - Check if uplaoded file is image
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('File is not a image type', 400), false);
    }
};

// Setting up Multer
const upload = multer({  // dest to save files in fs
    storage: multerStorage,
    fileFilter: multerFilter
});

// Upload user photo middleware function
exports.uploadUserPhoto = upload.single('photo');

// Middleware Function for resizing user photos (if needed)
exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();

    // Saving filename on file object
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    // Resizing image
    sharp(req.file.buffer)
    .resize(500, 500) // width, height
    .toFormat('jpeg') // to jpeg
    .jpeg({ quality: 90 }) // 90% quality
    .toFile(`public/img/users/${req.file.filename}`);

    next();
};

// ------ Handler Functions for USERS ------- \\

// GET - Currently authenticated user - User Only
// Middleware Function for setting params id to user id
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
// GET - Specific User
exports.getUser = factory.getOne(User);

// PATCH - Currently authenticated user - User Only
exports.updateMe = catchAsync(async (req, res, next) => {
    // Display error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Cannot update password on this route. Use /updatePassword to update password.', 400));
    }

    // Update user document - Filter out unwanted fields name that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;

    // Update user document
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