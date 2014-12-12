const httpRequest = require('request');
const cheerio = require('cheerio');

const GOPRO_URL = 'https://gopro.com/photos/photo-of-the-day/';

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/potd/gopro',
        handler: function (request, reply) {
            requestPhoto(reply);
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

function requestPhoto(reply) {
    var date = new Date();
    var url = GOPRO_URL + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

    httpRequest(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var body = cheerio.load(html);
            var uri = body('div.span12.text-center.black-background img').attr('src').toString();
            var title = body('title').text().replace('GoPro Photo Of The Day | ', '');

            var byline = body('div.row-fluid.black-background.medium-top-padding.xxlarge-bottom-padding ' +
            'p.gray-font.medium-bottom-margin').text();
            byline = trim(byline, '\n');
            byline = byline.replace('\n', ' ');

            reply({
                'uri': uri,
                'title': title,
                'byline': byline
            });
        }
    });
}

function trim(text, stringToTrim) {
    var result = text.toString();
    if (result.startsWith(stringToTrim)) {
        result = result.replace(stringToTrim, '');
    }

    if (result.endsWith(stringToTrim)) {
        result = result.slice(0, result.length - stringToTrim.length);
    }

    return result;
}

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
