const jsonwebtoken = require('jsonwebtoken');

function auth(req, res, next) {
    // Retrieve token from the request header
    const token = req.header('auth-token');

    // If token is missing, deny access
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the secret key
        const verifiedUser = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);

        // Attach the verified user info to the request object for use in subsequent middleware/routes
        req.user = verifiedUser;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle invalid or expired tokens
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

module.exports = auth;