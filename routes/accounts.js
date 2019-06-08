const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const randomstring = require('randomstring');

router.get('/@:username', async (req, res) => {
    const username = req.params.username;

    const user = await db.find(((d) => d.username == username), 'users');
    if (!user) return;

    return res.render('accounts/profile');
});

router.route('/login')
.get(async (req, res) => {
    return res.render('accounts/log-in');
})
.post(async (req, res) => {
    
});

router.route('/register')
.get(async (req, res) => {
    return res.render('accounts/register');
})
.post(async (req, res) => {
    const { username, password, confirmpassword } = req.body;

    const hashedPassword = bcrypt.hash(password, 10);
    const id = randomstring.generate({
        charset: 'numeric'
    });

    const data = {
        username,
        password: hashedPassword
    }

    await db.set(id, data, 'users');
    return res.redirect(`/@${username}`);
});

module.exports = router;