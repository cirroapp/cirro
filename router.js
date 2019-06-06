module.exports = (app) => {
    app.use((req, res, next) => {
        // placeholder
        next();
    });

    app.use('/', require('./routes/index'));

    app.use((req, res, next) => {
        return res.status(404).render('errors/404');
    });
}