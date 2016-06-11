'use strict';
const Hapi = require('hapi');

let server = new Hapi.Server();
let port = process.env.PORT || 8000;
server.connection({port: port});

server.route(require('./app/config/routes'));

server.start();
