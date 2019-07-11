// Importing Dependencies
const express = require('express');
// Importing Controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// Declaring express Router
const router = express.Router();

// Authentication Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Password Reset Routes
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
// Password Update Route
router.patch('/updatePassword', authController.protect, authController.updatePassword);
// User Data Update Route
router.patch('/updateMe', authController.protect, userController.updateMe);

// User Resources - Routes
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

// Exporting Users Router
module.exports = router;