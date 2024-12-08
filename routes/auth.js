const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validations/validation'); // Assuming validation functions are defined

// User Registration
router.post('/register', async (req, res) => {
    try {
        // Validate user input
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the user's password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);

        // Create a new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // Save the user to the database
        const savedUser = await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        // Validate user input
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if the user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Validate password
        const passwordValidation = await bcryptjs.compare(req.body.password, user.password);
        if (!passwordValidation) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate an auth token
        const token = jsonwebtoken.sign(
            { _id: user._id, roles: user.roles }, // Include roles for role-based access
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' } // Token expiration for added security
        );

        res.header('auth-token', token).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;