var root = '/potd';

module.exports = {
    method: 'GET',
    path: root + '/gopro',
    config: {
        handler: require('./controller/gopro')
    }
};
