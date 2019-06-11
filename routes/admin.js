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
    const { type } = req.body;

    const categories = await db.count('categories');

    if (type == 'category') {
        const { name } = req.body;
        const position = (categories || 0) + 1;

        const data = {
            name,
            position
        }

        await db.set(position, data, 'categories');

        return res.status(201).redirect('/admin/categories');
    } else if (type == 'subcategory') {
        const { name, description, category, position } = req.body;
    } else {
        return res.status(500).render('errors/500', { stack: `dumbass` });
    }
});

module.exports = router;