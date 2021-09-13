const router = require('express').Router();
const { Comment } = require('../../models');

// Getting all comments (if there is a database)
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            include: [{ model: Comment }]
        })
        res.status(200).json(commentData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Getting a single comment (based on id and if there is a database)
router.get('/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk({
            include: [{ model: Comment }]
        });
        if (!commentData) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Creating a new comment
router.post('/', async (req, res) => {
    try {
        const commentNew = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.status(200).json(commentNew);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Deleting a comment
router.delete('/', async (req, res) => {
    try {
        const commentDelete = await Comment.destroy({
            where: {
                id: req.params.id,
            }
        });
        if (!commentDelete) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;