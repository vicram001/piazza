require('dotenv').config();

// 1. Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // For authentication
const { registerValidation, loginValidation } = require('./validations/validation');

// 2. Create the express application
const app = express();

// 3. Middleware setup
app.use(cors()); // Enable cross-origin resource sharing

// 4. Middleware for parsing JSON
const bodyParser = require('body-parser')
app.use(bodyParser.json());

// 5. Import Routes
const postsRoute = require('./routes/posts');

// 5a. Use Routes
app.use('/posts', postsRoute); // API for post-related actions

// 6. Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Twitter-like App API!');
});

// 6a. Routes
// Import the auth route
const authRoute = require('./routes/auth');
// Use the auth route
// Public authentication routes
app.use('/auth', authRoute);
// Protected posts routes
app.use('/posts', postsRoute);

// 7. MongoDB Connection
const MURL = process.env.MURL;
if (!MURL) {
    console.error('MongoDB connection string (MURL) is missing!');
    process.exit(1);
}

async function connectDB() {
    try {
        await mongoose.connect(MURL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Terminate the app if DB connection fails
    }
}

connectDB();

// 8. Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 9. Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});