/*jshint esnext: true*/

const httpRequest = require('request');
const cheerio = require('cheerio');
const Photo = require('../model/Photo');

const GOPRO_URL = 'https://gopro.com/photos/photo-of-the-day/';

var cache = require('../cache');

module.exports = function (request, reply) {
    var date = request.params.date ?
        new Date(Date.parse(encodeURIComponent(request.params.date)))
        : new Date();
    var url = GOPRO_URL + date.toCustomString('/');

    var cacheKey = date.toCustomString();
    var cacheEntry = cache.get(cacheKey);

    if (cacheEntry) {
        reply(cacheEntry);
    } else {
        getPhoto(url, cacheKey, reply);
    }
};

function getPhoto(url, cacheKey, reply) {
    httpRequest(url, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var photo = parseGoproWebpage(html);
            cache.put(cacheKey, photo);

            reply(photo);
        }
    });
}

function parseGoproWebpage(html) {
    var body = cheerio.load(html);
    var uri = body('div.span12.text-center.black-background img').attr('src').toString();
    var title = body('title').text().replace('GoPro Photo Of The Day | ', '');

    var byline = body('div.row-fluid.black-background.medium-top-padding.xxlarge-bottom-padding ' +
    'p.gray-font.medium-bottom-margin').text();
    byline = byline.trim();
    byline = byline.replace('\r\n', ' ');
    byline = byline.replace('\n', ' ');
    byline = byline.replace(/\s{2,}/g, ' ');

    return new Photo(uri, title, byline);
}
