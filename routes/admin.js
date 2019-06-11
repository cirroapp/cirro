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

router.get('/categories', checkAdmin, async (req, res) => {
    const categories = await db.all('categories');

    return res.render('admin/categories', { categories });
});

router.post('/categories/new', checkAdmin, async (req, res) => {
    const { name, type } = req.body;

    const categories = await db.all('categories');

    if (type == 'category') {

    } else {
        return 
    }
});

module.exports = router;