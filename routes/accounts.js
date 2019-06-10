const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

router.get('/@:username', async (req, res) => {
    const username = req.params.username;

    const user = await db.find(((d) => d.username == username), 'users');
    if (!user) return;

    return res.render('accounts/profile', { user });
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
    const { username, password, confirmpassword } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = randomstring.generate({
        length: 7,
        charset: 'numeric'
    });

    const data = {
        username,
        password: hashedPassword
    }

    await db.set(id, data, 'users');
    req.session.user = data;

    return res.redirect(`/@${username}`);
});

module.exports = router;