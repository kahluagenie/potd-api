var Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// load one plugin
server.register(require('./parser'), function (err) {
    if (err) {
        console.error('Failed to load plugin:', err);
    }
});

// Start the server
server.start();
