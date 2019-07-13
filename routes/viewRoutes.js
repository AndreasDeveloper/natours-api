// Importing Dependencies
const express = require('express');
// Importing Controllers
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
// Declaring express Router
const router = express.Router();

// Routes 

// GET - Tours Overview
router.get('/', authController.isLoggedIn, viewsController.getOverview);
// GET - Tour
router.get('/tour/:tourName', authController.isLoggedIn, viewsController.getTour);
// GET - Login Page
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// GET - User Account
router.get('/me', authController.protect, viewsController.getAccount);


// POST - Edit User Data (Old Fashioned Way)
router.post('/submit-user-data', authController.protect, viewsController.updateUserData);

// Exporting View routes Rotuer
module.exports = router;