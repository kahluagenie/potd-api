/*jshint esnext: true*/

const Hapi = require('hapi');
const enhancePrototypes = require('./app/config/extend-prototypes');

// Create a server with a host and port
var server = new Hapi.Server();
var port = process.env.PORT || 8000;
server.connection({
    host: 'localhost',
    port: port
});

server.route(require('./app/config/routes'));

enhancePrototypes();

server.start();
