const express = require('express');
const router = express.Router();

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
    
});

module.exports = router;