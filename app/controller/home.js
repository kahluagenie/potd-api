'use strict';
var _ = require('lodash');
var Endpoints = require('../config/endpoints');

module.exports = function (request, reply) {
    var currentHref = 'http://' + request.info.host + request.path;
    currentHref = _.trimEnd(currentHref, '/');

    reply({
        links: [{
            rel: 'gopro',
            href: currentHref + Endpoints.gopro
        }]
    });
};
