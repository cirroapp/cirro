const express = require('express');
const router = express.Router();

const { version } = require('../package.json');

const checkAdmin = (req, res, next) => {
    if (!req.session.user) return res.status(501).redirect('/');
    if (!req.session.user.admin) return res.status(503).redirect('/');

    next();
}

router.get('/', checkAdmin, async (req, res) => {
    return res.render('admin/index', { version, startDate });
});

module.exports = router;