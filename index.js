var Hapi = require('hapi');
var httpRequest = require('request');
var cheerio = require('cheerio');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path: '/potd/gopro',
    handler: function (request, reply) {
        httpRequest('https://gopro.com/photos/photo-of-the-day/2014/12/11', function (error, response, html) {
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
});

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

// Start the server
server.start();
