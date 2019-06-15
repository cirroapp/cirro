const express = require('express');
const router = express.Router();
const { template: t } = require(`${process.cwd()}/config.json`);

const { scriptRegex } = require('../../src/constants');
const rs = require("randomstring");

const { compile } = require("ejs");
const root = `${process.cwd()}/templates/${t}/views/partials`;
const categoryTemplate = compile(require("fs").readFileSync(`${root}/categories/render.ejs`).toString("utf-8"), { root });

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
    const categories = await db.all('categories');
    if (type == 'category') {
        const { name, icon } = req.body;
        if (icon != null) {
            let match = (icon || "").match(scriptRegex);
            if (match) icon = icon.replace(scriptRegex, '');
        }
        const id = rs.generate(12);
        const data = {
            name,
            icon,
            position: categories.filter(c => !c.hasOwnProperty("sub")).length + 1,
        };
        await db.set(id, data, 'categories');
        categories.push({ id, ...data });
        return res.status(201).json({ categories: categoryTemplate({ categories }) });
    } else if (type == 'subcategory') {
        const { parent, name, icon, description } = req.body;
        if (!parent) return res.status(400).json({ message: "Parent category required!" });
        if (icon != null) {
            let match = (icon || "").match(scriptRegex);
            if (match) icon = icon.replace(scriptRegex, '');
        }
        const id = rs.generate(12);
        const data = {
            name,
            parent,
            icon,
            position: categories.filter(c => c.hasOwnProperty("sub") && c.parent === parent).length + 1,
            description,
            sub: true
        };
        await db.set(id, data, "categories");
        categories.push({ id, ...data });
        return res.status(201).json({ id, name, cleanIcon: icon });
    } else {
        return res.status(500).render('errors/500', { stack: `dumbass` });
    }
});

router.post('/delete', checkAdmin, async (req, res) => {
    const { id, type } = req.body;
    if (type === "category") {
        const categories = await db.all("categories");
        const mainCategory = categories.find(c => !!!c.sub && c.id === id);
        if (mainCategory) {
            await db.delete(id, "categories");
            categories.splice(categories.indexOf(mainCategory), 1);
            for (const sub of categories.filter(c => !!c.sub && c.sub === true && c.parent === id)) {
                categories.splice(categories.indexOf(sub), 1);
                await db.delete(sub.id, "categories");
            }
            return res.status(200).json({ categories: categoryTemplate({ categories }) });
        } else {
            return res.status(400).json({ categories: categoryTemplate({ categories }) });
        }
    } else if (type === "subcategory") {
        const categories = await db.all("categories");
        const sub = categories.find(c => !!c.sub && c.sub === true && c.id === id);
        if (sub) {
            await db.delete(id, "categories");
            categories.splice(categories.indexOf(sub), 1);
            return res.status(200).json({ categories: categoryTemplate({ categories }) });
        } else {
            return res.status(400).json({ categories: categoryTemplate({ categories }) });
        }
    } else {
        return res.status(500).render('errors/500', { stack: "dumbass v2" });
    }
});

router.post("/resort", checkAdmin, async (req, res) => {
    const { ids } = req.body;
    const c = ids.map((id, i) => ({ id, position: ids.length - i }));
    await db.bulkUpdate(c, "categories");
    return res.status(200).send();
});

module.exports = router;