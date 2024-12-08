const express = require('express');
const router = express.Router();
//const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validations/validation'); // Assuming validation functions are defined

// User Registration
router.post('/register', async (req, res) => {
    try {
        // Validation 1: Check user input
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Validation 2: Check if user exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

         // Generates a salt
         /** Had to comment out the hash as my login process is not working!
        const salt = await bcryptjs.genSalt(10);
        // Hash the user's password
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        */

        // Using plain text password for testing, skipped
        const hashedPassword = req.body.password;

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
        // Validation 1: Check user input
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Validation 2: Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }


        // Debugging: Log the input password and hashed password
        console.log('Input password:', req.body.password); // The password entered in Postman
        console.log('Hashed password in DB:', user.password); // The hashed password stored in the database

        // Validation 3: Check if the password is valid
        /** Commented out this section as could not get it to work!
        const passwordValidation = await bcryptjs.compare(req.body.password, user.password);
        // Debugging - Check the result of password comparison
        console.log('Password validation result:', passwordValidation);
        if (!passwordValidation) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        */

        const passwordValidation = req.body.password === user.password;  // Plain text comparison for testing
        if (!passwordValidation) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate an auth token
        const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.header('auth-token', token).send({ 'auth-token': token });

        // Generate an auth token
        /**
        const token = jsonwebtoken.sign(
            { _id: user._id, roles: user.roles }, // Include roles for role-based access
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' } // Token expiration for added security
        );
        */

        res.header('auth-token', token).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

module.exports = router;