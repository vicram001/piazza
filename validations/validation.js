const Joi = require('joi');

// Registration Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(256)
            .trim()
            .required()
            .messages({
                'string.base': 'Username must be a string',
                'string.empty': 'Username is required',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username must not exceed 256 characters',
                'any.required': 'Username is required',
            }),
        email: Joi.string()
            .min(6)
            .max(256)
            .trim()
            .email({ tlds: { allow: true } }) // Validate email format and top-level domains
            .required()
            .messages({
                'string.base': 'Email must be a string',
                'string.email': 'Invalid email format',
                'string.empty': 'Email is required',
                'string.min': 'Email must be at least 6 characters long',
                'string.max': 'Email must not exceed 256 characters',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .min(6)
            .max(1024)
            .pattern(new RegExp('^[a-zA-Z0-9@#$%^&*]+$')) // Enforce allowed characters
            .required()
            .messages({
                'string.base': 'Password must be a string',
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password must not exceed 1024 characters',
                'string.pattern.base': 'Password contains invalid characters',
                'any.required': 'Password is required',
            }),
    });
    return schema.validate(data, { abortEarly: false }); // Return all validation errors at once
};

// Login Validation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(6)
            .max(256)
            .trim()
            .email({ tlds: { allow: true } })
            .required()
            .messages({
                'string.base': 'Email must be a string',
                'string.email': 'Invalid email format',
                'string.empty': 'Email is required',
                'string.min': 'Email must be at least 6 characters long',
                'string.max': 'Email must not exceed 256 characters',
                'any.required': 'Email is required',
            }),
        password: Joi.string()
            .min(6)
            .max(1024)
            .required()
            .messages({
                'string.base': 'Password must be a string',
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long',
                'string.max': 'Password must not exceed 1024 characters',
                'any.required': 'Password is required',
            }),
    });
    return schema.validate(data, { abortEarly: false });
};

module.exports = {
    registerValidation,
    loginValidation,
};

/**
 * ALTERNATIVE SIMPLE CODE
 * 
 * const joi = require('joi');

const registerValidation = (data) => {
    const schema = joi.object({
        username: joi.string().required().min(3).max(256),
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024),
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
};

 * 
 */