const endpoints = require('./endpoints');

module.exports = [
    {
        method: 'GET',
        path: endpoints.home,
        handler: require('../controller/home')
    },
    {
        method: 'GET',
        path: endpoints.gopro + '/{date?}',
        handler: require('../controller/gopro')
    }
];
