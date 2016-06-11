'use strict';

const endpoints = require('./endpoints');
const Gopro = require('../controller/gopro');

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
