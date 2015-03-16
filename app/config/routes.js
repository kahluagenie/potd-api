'use strict';

var endpoints = require('./endpoints');
var Gopro = require('../controller/gopro');

module.exports = [
    {
        method: 'GET',
        path: endpoints.home,
        handler: require('../controller/home')
    },
    {
        method: 'GET',
        path: endpoints.gopro + '/{date?}',
        handler: Gopro.getPicture
    }
];
