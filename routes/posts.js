const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Post model
const auth = require('../middleware/verifyToken'); // Authentication middleware

/*
// Create a route to test posts:
router.get('/', (req,res) => {
    // a response is issued by the server
    res.send('You are in Posts!')
})

// POST (Create data) for test posts:
router.post('/',async(req,res)=>{
    // print data from user:
    console.log(req.body)
})
*/

// 1. Create a new post
router.post('/', auth, async (req, res) => {
    const { title, body, topic, expirationTime } = req.body;

    // Validation for required fields
    if (!title || !body || !topic) {
        return res.status(400).json({ message: 'Title, body, and topic are required.' });
    }

    try {
        const post = new Post({
            title,
            body,
            topic,
            expirationTime: new Date(req.body.expirationTime), // Expiration in minutes
            owner: req.user._id, // User ID from the auth middleware
            status: 'Live',
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post.', error: err.message });
    }
});


// 2. Retrieve posts by topic
router.get('/:topic', auth, async (req, res) => {
    const { topic } = req.params;

    try {
        const posts = await Post.find({ topic, status: 'Live' }).sort({ createdAt: -1 }); // Retrieve live posts
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving posts.', error: err.message });
    }
});

// 3. Like a post
router.patch('/:id/like', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        if (post.status === 'Expired') {
            return res.status(400).json({ message: 'Cannot like an expired post.' });
        }

        post.likes += 1;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error liking the post.', error: err.message });
    }
});

// 4. Dislike a post
router.patch('/:id/dislike', auth, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        if (post.status === 'Expired') {
            return res.status(400).json({ message: 'Cannot dislike an expired post.' });
        }

        post.dislikes += 1;
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error disliking the post.', error: err.message });
    }
});

// 5. Comment on a post
router.post('/:id/comment', auth, async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: 'Comment text is required.' });

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found.' });

        if (post.status === 'Expired') {
            return res.status(400).json({ message: 'Cannot comment on an expired post.' });
        }

        post.comments.push({ user: req.user._id, text, createdAt: new Date() });
        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: 'Error commenting on the post.', error: err.message });
    }
});

// 6. Retrieve the most active post for a topic
router.get('/:topic/most-active', auth, async (req, res) => {
    const { topic } = req.params;

    try {
        const mostActivePost = await Post.findOne({ topic, status: 'Live' })
            .sort({ likes: -1, dislikes: -1 }); // Sort by likes and dislikes

        if (!mostActivePost) {
            return res.status(404).json({ message: 'No posts found for this topic.' });
        }

        res.json(mostActivePost);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving the most active post.', error: err.message });
    }
});

// 7. Retrieve expired posts for a topic
router.get('/:topic/expired', auth, async (req, res) => {
    const { topic } = req.params;

    try {
        const expiredPosts = await Post.find({ topic, status: 'Expired' }).sort({ createdAt: -1 });
        res.json(expiredPosts);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving expired posts.', error: err.message });
    }
});

module.exports = router;