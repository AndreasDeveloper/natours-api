// Importing Dependencies
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must have minimum of 8 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm your password'],
        validate: {
            // Validate Passwords
            validator: function(el) { // Only works on create & save documents
                return el === this.password;
            },
            message: 'Password didn\'t match'
        }
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Encrypting Password
    this.password = await bcrypt.hash(this.password, 12); // Password hashing
    this.passwordConfirm = undefined; // Deleting passwordConfirm field
    next();
});

// User Model
const User = mongoose.model('User', userSchema);

// Exporting User Model
module.exports = User;