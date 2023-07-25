const Application = require('./app');
const config = require('./config.json');

let app = new Application();
/*app.expressApp.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });*/
app.expressApp.listen(config.port, config.host, function() {
    console.log('Invitation backend listening at ' + config.port);
});