const validateInput = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // Validate request body
    if (error) {
        const errors = error.details.map((detail) => detail.message); // Collect all error messages
        return res.status(400).json({ message: 'Validation error', errors });
    }
    next();
};

module.exports = validateInput;