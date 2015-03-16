'use strict';

var Hapi = require('hapi');

var server = new Hapi.Server();
var port = process.env.PORT || 8000;
server.connection({
    host: 'localhost',
    port: port
});

server.route(require('./app/config/routes'));

server.start();
