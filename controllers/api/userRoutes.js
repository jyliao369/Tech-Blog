const router = require('express').Router();
const { EDESTADDRREQ } = require('constants');
const { User } = require('../../models');

// Creates a new User
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        req.session.save(() => {
            req.session.loggedIn = true;

            res.status(200).json(newUser);
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

// This checks for login
// this checks for login credentials through email and a password
router.post('/login', async (req, res) => {
    try {
        // this checcks for email
        const userData = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect Email or Password. Try Again.' })
            return;
        }
        
        // This checks to see if the password matches the user's password
        const userPass = await userData.checkPassword(req.body.password);

        if (!userPass) {
            res.status(400).json({ message: 'Incorrect Email or Password. Try Again.' })
            return;
        }

        req.session.save(() => {
            req.session.loggedIn = true;
            res.status(200).json({ user: userData, message: 'Logging in' });
        });

    } catch (err) {
        res.status(500).json(err);
    }
});

// This helps logging out
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.seesion.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;