const router = require('express').Router();
const { Post } = require('../../models');

// Getting all posts made
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll ({
            include: [{ model: Post }]
        })
        res.status(200).json(postData);
    } catch (err) {
        res. status(400).json(err);
    }
});

// Getting a single post based on ID
router.get('/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk({
            include: [{ model: Post }]
        });
        if (!postData) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Creating a new Post
router.post('/', async (req, res) => {
    try {
        const postNew = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(postNew);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Deleting a post
router.delete('/', async (req, res) => {
    try {
        const postDelete = await Post.destroy({ 
            where: {
                id: req.params.id,
            },
        });
        if (!postDelete) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        res.status(200).json({ message: 'Post deleted' });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;