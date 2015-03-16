'use strict';

var httpRequest = require('request');
var Photo = require('../model/Photo');
var cache = require('../util/cache');
var DateUtil = require('../util/DateUtil');

exports.GOPRO_URL = 'https://api.gopro.com/v2/channels/feed/playlists/photo-of-the-day?platform=web';

exports.getPicture = function (request, reply) {
    var date;

    if (request.params.date) {
        date = new Date(Date.parse(decodeURIComponent(request.params.date)));
    } else {
        var now = new Date();
        date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }

    var cacheKey = DateUtil.toCustomUTCDateString(date);
    var cacheEntry = cache.get(cacheKey);

    if (cacheEntry) {
        reply(cacheEntry);
    } else {
        getPhoto(cacheKey, date, reply);
    }
};

function getPhoto(cacheKey, date, reply) {
    httpRequest(exports.GOPRO_URL, function (error, response, body) {
        if (error) {
            throw error;
        }

        if (response.statusCode === 200) {
            var photo;
            var goproApiResponse = JSON.parse(body);

            goproApiResponse.media.some(function (photoItem) {
                var responseDate = new Date(Date.parse(photoItem.date));

                if (DateUtil.toCustomUTCDateString(date) === DateUtil.toCustomUTCDateString(responseDate)) {
                    photo = buildPhoto(photoItem);
                    return true;
                }
            });

            if (photo) {
                cache.put(cacheKey, photo);
                reply(photo);
            } else {
                var responsePhoto = goproApiResponse.media[0];
                var latestResponseDate = new Date(Date.parse(responsePhoto.date));

                if (DateUtil.toCustomUTCDateString(date) > DateUtil.toCustomUTCDateString(latestResponseDate)) {
                    photo = buildPhoto(responsePhoto);
                    reply(photo);
                } else {
                    reply().code(404);
                }
            }
        } else {
            reply('Error retrieving the image from GoPro', null);
        }
    });
}

function buildPhoto(responsePhoto) {
    var photo = new Photo(
        responsePhoto.thumbnails.full.image,
        responsePhoto.title,
        'by ' + responsePhoto.author
    );
    photo.source = 'https://gopro.com/channel/photo-of-the-day/' + responsePhoto.permalink + '/';

    return photo;
}
