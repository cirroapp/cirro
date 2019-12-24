const express = require('express');
const router = express.Router();

const config = require('../config.json');

router.get('/setup', async (req, res) => {
    return res.render('special/setup', { config });
});

module.exports = router;