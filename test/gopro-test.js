const goproController = require('../controller/gopro');
const nock = require('nock');
const assert = require('assert');
const fs = require('fs');
const enhancePrototypes = require('../config/extend-prototypes');

enhancePrototypes();

describe('getPhoto', function () {
    it('should return the correct response', function (done) {
        var url = 'https://gopro.com/photos/photo-of-the-day/2014/12/17';
        var mockHtml = './test/resources/gopro-potd-2014-12-17.html';

        var expectedPhoto = {
            uri: 'http://cbcdn2.gp-static.com/uploads/photo_of_the_day/image/135179/full_height2x_G0027451.jpg',
            title: 'Skydive over Bay of Acre Israel',
            byline: 'by Yogev Kalmanovich'
        };

        fs.readFile(mockHtml, function (err, html) {
            if (err) {
                throw err;
            }

            nock(url)
                .get('')
                .reply(200, html);

            goproController({params: [{date: '2014-12-17'}]}, function (photo) {
                assert.deepEqual(photo, expectedPhoto);
                done();
            });
        });
    });
});
