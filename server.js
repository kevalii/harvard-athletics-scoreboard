// Local CORS proxy for testing; must be adjusted for production
// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8081;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: ["http://localhost:8080"],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
