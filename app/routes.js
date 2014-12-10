module.exports = function(app) {
    // index route
    app.get('/', function(req, res) {
        res.sendfile('index.html');
    });

    // default route
    app.use(function(req, res) {
        res.redirect('/');
    });
};
