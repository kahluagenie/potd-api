'use strict';
const Url = require('url');
const _ = require('lodash');
const Endpoints = require('../config/endpoints');


module.exports = function (request, reply) {
    let currentHref = 'http://' + request.info.host + request.path;
    console.log(request.info);
    currentHref = _.trimEnd(currentHref, '/');

    reply({
        links: [{
            rel: 'gopro',
            href: currentHref + Endpoints.gopro
        }]
    });
};
