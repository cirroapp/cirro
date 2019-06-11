const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const categories = await db.all('categories');

    return res.render('index', { categories });
});

module.exports = router;