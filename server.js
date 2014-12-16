const Hapi = require('hapi');

// Create a server with a host and port
var server = new Hapi.Server();
var port = process.env.PORT || 8000;
server.connection({
    host: 'localhost',
    port: port
});

server.route(require('./config/routes'));

var cache = require('./cache');

enhanceStringPrototype();

server.start();


// ==========

function enhanceStringPrototype() {
    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) === str;
        };
    }

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function (str) {
            return this.slice(-str.length) === str;
        };
    }

    String.prototype.trimSequence = function (stringToTrim) {
        var result = this.toString();
        if (result.startsWith(stringToTrim)) {
            result = result.replace(stringToTrim, '');
        }

        if (result.endsWith(stringToTrim)) {
            result = result.slice(0, result.length - stringToTrim.length);
        }

        return result;
    }
}
