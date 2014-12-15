var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
var port = process.env.PORT || 8000;
server.connection({
    host: 'localhost',
    port: port
});

server.route(require('./routes'));

// Start the server
server.start();
