const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Refers to the User model
        required: true,
    },
    text: {
        type: String,
        required: true,
        maxlength: 1024,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 256,
    },
    body: {
        type: String,
        required: true,
        maxlength: 2048,
    },
    topic: {
        type: String,
        required: true,
        enum: ['Politics', 'Health', 'Sport', 'Tech'], // Allowed topics
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expirationTime: {
        type: Date,
        required: true, // Set at post creation
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Refers to the User model
        required: true,
    },
    status: {
        type: String,
        enum: ['Live', 'Expired'], // Post status
        default: 'Live',
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: [commentSchema], // Array of comments
});

// Middleware to automatically update post status based on expiration time
postSchema.pre('save', function (next) {
    if (this.expirationTime <= Date.now()) {
        this.status = 'Expired';
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);