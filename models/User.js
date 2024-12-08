const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Fixed typo: 'require' -> 'required'
        minlength: 3,
        maxlength: 256,
        trim: true // Ensures no leading or trailing whitespace
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 256,
        trim: true,
        unique: true, // Ensures no duplicate emails in the database
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex to validate email format
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024 // Allows for hashed passwords of adequate length
    },
    date: {
        type: Date,
        default: Date.now
    },
    roles: {
        type: [String],
        default: ['user'] // Can include roles like 'admin' if needed
    }
});

/**
// Commenting out the hashing logic
// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const bcryptjs = require('bcryptjs'); // Import bcrypt only when needed
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
});
*/

// Export the User model
module.exports = mongoose.model('User', userSchema); // Changed model name to 'User' for clarity