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
        const { title: name } = req.body;
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

router.post('/categories/up', checkAdmin, async (req, res) => {
    const { id } = req.body;

    const categories = await db.count('categories');

    if (id >= categories) return res.redirect('/admin/categories');

    const updated = {
        position: id + 1
    }

    await db.update(id, updated, 'categories');

    return res.redirect('/admin/categories');
});

router.post('/categories/down', checkAdmin, async (req, res) => {
    const { id } = req.body;

    const categories = await db.count('categories');

    if (id <= 1) return res.redirect('/admin/categories');

    const updated = {
        position: id - 1
    }

    await db.update(id, updated, 'categories');

    return res.redirect('/admin/categories');
});

module.exports = router;