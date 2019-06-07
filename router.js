module.exports = (app) => {
    app.use((req, res, next) => {
        res.locals.title = 'Cirro';
        
        if (req.session.user) locals.user = req.session.user;
        else locals.user = null;

        next();
    });

    app.use('/', require('./routes/index'));

    app.use((err, req, res, next) => {
        console.error(err.stack);
        return res.status(500).render('errors/500', { stack: err.stack });
    });

    app.use((req, res, next) => {
        return res.status(404).render('errors/404', { route: req.originalUrl });
    });
}