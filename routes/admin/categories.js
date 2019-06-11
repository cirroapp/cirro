const express = require('express');
const router = express.Router();

const randomstring = require('randomstring');

const checkAdmin = (req, res, next) => {
    if (!req.session.user) return res.status(501).redirect('/');
    if (!req.session.user.admin) return res.status(503).redirect('/');

    next();
}

router.get('/', checkAdmin, async (req, res) => {
    const categories = await db.all('categories');

    return res.render('admin/categories', { categories });
});

router.post('/new', checkAdmin, async (req, res) => {
    const { type } = req.body;

    const categories = await db.count('categories');

    if (type == 'category') {
        const { title: name } = req.body;

        const position = (categories || 0) + 1;
        const id = randomstring.generate(12);

        const data = {
            name,
            position
        }

        await db.set(id, data, 'categories');

        return res.status(201).redirect('/admin/categories');
    } else if (type == 'subcategory') {
        const { name, description, category, position } = req.body;
    } else {
        return res.status(500).render('errors/500', { stack: `dumbass` });
    }
});

router.post('/up', checkAdmin, async (req, res) => {
    const { id } = req.body;

    const categories = await db.all('categories');

    const updatedCategory = await categories.find(category => category.position === parseInt(id), 'categories');
    const otherCategory = await categories.find(category => category.position === parseInt(id) + 1, 'categories');

    await db.update(updatedCategory.id, { position: parseInt(id) + 1 }, 'categories');
    await db.update(otherCategory.id, { position: parseInt(id) }, 'categories');

    return res.redirect('/admin/categories');
});

router.post('/down', checkAdmin, async (req, res) => {
    const { id } = req.body;

    const categories = await db.all('categories');

    const updatedCategory = await categories.find(category => category.position === parseInt(id), 'categories');
    const otherCategory = await categories.find(category => category.position === parseInt(id) - 1, 'categories');

    await db.update(updatedCategory.id, { position: parseInt(id) - 1 }, 'categories');
    await db.update(otherCategory.id, { position: parseInt(id) }, 'categories');

    return res.redirect('/admin/categories');
});

module.exports = router;