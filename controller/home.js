module.exports = function (request, reply) {
    var currentHref = 'http://' + request.info.host + request.path;
    if (currentHref.endsWith('/')) {
        currentHref = currentHref.slice(0, currentHref.length - 1);
    }

    reply({
        links: [{
            rel: 'gopro',
            href: currentHref + require('../config/endpoints').gopro
        }]
    });
};

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (str) {
        return this.slice(-str.length) === str;
    };
}
