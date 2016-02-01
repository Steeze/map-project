/**
 * Proxy Server
 * https://medium.com/@victorleungtw/setup-proxy-server-with-express-827b6e69211f#.bmaxyq1hs
 */
var express = require('express');
var request = require('request');
var app = express();
var API_KEY = '3b314c685f09b666a09b89297f06f38b';

/**
 * Allow CORS to work for every request.
 * http://stackoverflow.com/a/13148080/135786
 */
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    // if we don't have this, no other headers will show.
    res.header('Access-Control-Expose-Headers', 'Content-Type, Location');
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
/**
 * API call to BreweryDB
 */
app.get('/api', function(req, res){
    request('https://api.brewerydb.com/v2/locations?key=' + API_KEY + '&locality=Pittsburgh', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
            res.send(body);
        }
    });
});

app.listen(3000);
console.log('Server running on port %d', 3000);