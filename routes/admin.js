const express = require('express');
const router = express.Router();

const { version } = require('../package.json');

router.get('/', async (req, res) => {
    if (!req.session.user) return res.status(501).redirect('/');
    if (!req.session.user.admin) return res.status(503).redirect('/');

    return res.render('admin/index', { version, startDate });
});

module.exports = router;