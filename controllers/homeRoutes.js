const router = require('express').Router();
const { Post, User } = require('../models');

// The normal get route of the homepage would retrieve past posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [{ model: User, attributes: ["username"] }],
        });
        const allPosts = postData.map((project) => project.get({ plain: true }));
        res.render("homepage", {
            posts,
            loggedIn: req.session.loggedIn, 
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;