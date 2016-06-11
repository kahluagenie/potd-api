'use strict';

const httpRequest = require('request');
const Photo = require('../model/Photo');
const cache = require('../util/cache');
const DateUtil = require('../util/DateUtil');

exports.GOPRO_URL = 'https://api.gopro.com/v2/channels/feed/playlists/photo-of-the-day?platform=web';

exports.getPicture = function (request, reply) {
    let date;

    if (request.params.date) {
        date = new Date(Date.parse(decodeURIComponent(request.params.date)));
    } else {
        let now = new Date();
        date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    }

    let cacheKey = DateUtil.toCustomUTCDateString(date);
    let cacheEntry = cache.get(cacheKey);

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
            let photo;
            let goproApiResponse = JSON.parse(body);

            goproApiResponse.media.some(function (photoItem) {
                let responseDate = new Date(Date.parse(photoItem.date));

                if (DateUtil.toCustomUTCDateString(date) === DateUtil.toCustomUTCDateString(responseDate)) {
                    photo = buildPhoto(photoItem);
                    return true;
                }
            });

            if (photo) {
                cache.put(cacheKey, photo);
                reply(photo);
            } else {
                let responsePhoto = goproApiResponse.media[0];
                let latestResponseDate = new Date(Date.parse(responsePhoto.date));

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

/**
 * 
 * @param responsePhoto
 * @param responsePhoto.author
 * @param responsePhoto.thumbnails.full.image
 * @param responsePhoto.title
 * @param responsePhoto.permalink
 * @returns {Photo}
 */
function buildPhoto(responsePhoto) {
    let byline = '';
    if (responsePhoto.author && responsePhoto.author !== 'null null') {
        byline = 'by ' + responsePhoto.author;
    }
    return new Photo(
        responsePhoto.thumbnails.full.image,
        responsePhoto.title,
        byline,
        'https://gopro.com/channel/photo-of-the-day/' + responsePhoto.permalink + '/'
    );
}
