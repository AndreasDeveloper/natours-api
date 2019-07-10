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
        minlength: [8, 'Password must have minimum of 8 characters'],
        select: false // Won't show up in output
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
    },
    passwordChangedAt: Date
});

// Pre Middleware for encrypting password
userSchema.pre('save', async function(next) {
    // If password is not modified - return
    if (!this.isModified('password')) return next();

    // Encrypting Password
    this.password = await bcrypt.hash(this.password, 12); // Password hashing
    this.passwordConfirm = undefined; // Deleting passwordConfirm field
    next();
});

// Instance Method - Check if entered password and hashed password are the 'same'
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
// Instance Method - Check if user changed his password before / after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        console.log(changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;
    }

    return false; // By default return false - not changed
};

// User Model
const User = mongoose.model('User', userSchema);

// Exporting User Model
module.exports = User;