'use strict';

var Endpoints = require('../config/endpoints');
var StringUtil = require('../util/StringUtil');

module.exports = function (request, reply) {
    var currentHref = 'http://' + request.info.host + request.path;
    if (StringUtil.endsWith(currentHref, '/')) {
        currentHref = currentHref.slice(0, currentHref.length - 1);
    }

    reply({
        links: [{
            rel: 'gopro',
            href: currentHref + Endpoints.gopro
        }]
    });
};
