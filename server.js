const Hapi = require('hapi');
const enhancePrototypes = require('./config/extend-prototypes');

// Create a server with a host and port
var server = new Hapi.Server();
var port = process.env.PORT || 8000;
server.connection({
    host: 'localhost',
    port: port
});

server.route(require('./config/routes'));

enhancePrototypes();

server.start();
