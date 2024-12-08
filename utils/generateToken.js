const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for authentication
 * @param {Object} user - The user object (must include _id and username)
 * @returns {string} - The generated JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username }, // Payload
        process.env.TOKEN_SECRET, // Secret key from .env
        { expiresIn: '1h' } // Token expiration time
    );
};

module.exports = generateToken;