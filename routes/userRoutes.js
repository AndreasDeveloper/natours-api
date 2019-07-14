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
router.get('/logout', authController.logout);

// Password Reset Routes
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Call Protect Middleware for all upcoming routes ->
router.use(authController.protect); 
// Password Update Route
router.patch('/updatePassword', authController.updatePassword);
// User Data Update Route (@Me) 
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Call Restrict To for all upcoming routes ->
router.use(authController.restrictTo('admin'));
// User Resources - Routes
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

// Exporting Users Router
module.exports = router;