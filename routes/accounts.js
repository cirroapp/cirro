const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

router.get('/@:username', async (req, res) => {
    const username = req.params.username;

    const user = await db.find(((d) => d.username == username), 'users');
    if (!user) return;

    return res.render('accounts/profile', { user, months });
});

router.route('/login')
.get(async (req, res) => {
    if (req.session.user) return res.redirect('/');
    
    return res.render('accounts/login', { err: null });
})
.post(async (req, res) => {
    const { username, password } = req.body;

    const user = await db.find(((user) => user.username.toLowerCase() == username.toLowerCase()), 'users');
    if (!user) return res.render('accounts/login', { err: `No user with that username exists.` });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('accounts/login', { err: `Incorrect password.` });

    req.session.user = user;
    
    return res.redirect(`/@${username}`);
});

router.route('/logout')
.get(async (req, res) => {
    if (!req.session.user) return res.redirect('/');

    req.session.user = null;

    return res.redirect('/');
});

router.route('/register')
.get(async (req, res) => {
    if (req.session.user) return res.redirect('/');

    return res.render('accounts/register');
})
.post(async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = randomstring.generate(12);

    const data = {
        username,
        password: hashedPassword,
        createdAt: Date.now(),
        avatar: null
    }

    await db.set(id, data, 'users');
    req.session.user = data;

    return res.redirect(`/@${username}`);
});

module.exports = router;