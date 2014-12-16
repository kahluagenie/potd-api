const httpRequest = require('request');
const cheerio = require('cheerio');
const Photo = require('../model/Photo');

const GOPRO_URL = 'https://gopro.com/photos/photo-of-the-day/';

var cache = require('../cache');

module.exports = function (request, reply) {
    var date = new Date();
    var url = GOPRO_URL + formatDate(date, '/');

    var key = formatDate(date, '-');
    var cacheEntry = cache.get(key);

    if (cacheEntry) {
        reply(cacheEntry);
    } else {
        httpRequest(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var body = cheerio.load(html);
                var uri = body('div.span12.text-center.black-background img').attr('src').toString();
                var title = body('title').text().replace('GoPro Photo Of The Day | ', '');

                var byline = body('div.row-fluid.black-background.medium-top-padding.xxlarge-bottom-padding ' +
                'p.gray-font.medium-bottom-margin').text();
                byline = byline.trimSequence('\n');
                byline = byline.replace('\n', ' ');

                var photo = new Photo(uri, title, byline);
                cache.put(key, photo);

                reply(photo);
            }
        });
    }
};

function formatDate(date, separator) {
    return date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate();
}
