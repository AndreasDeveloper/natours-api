// Importing Dependencies
const express = require('express');
// Importing Controllers
const userController = require('../controllers/userController');
// Declaring express Router
const router = express.Router();

// User Resources - Routes
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

// Exporting Users Router
module.exports = router;
