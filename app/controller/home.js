/*jshint esnext: true*/

const endpoints = require('../config/endpoints');

module.exports = function (request, reply) {
    var currentHref = 'http://' + request.info.host + request.path;
    if (currentHref.endsWith('/')) {
        currentHref = currentHref.slice(0, currentHref.length - 1);
    }

    reply({
        links: [{
            rel: 'gopro',
            href: currentHref + endpoints.gopro
        }]
    });
};
