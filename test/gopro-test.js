const goproController = require('../controller/gopro');
const nock = require('nock');
const assert = require('assert');
const fs = require('fs');
const enhancePrototypes = require('../config/extend-prototypes');

enhancePrototypes();

describe('gopro controller', function () {
    it('should return the correct response', function (done) {
        var mockHtml = './test/resources/gopro-potd-2014-12-17.html';

        fs.readFile(mockHtml, function (err, html) {
            if (err) {
                throw err;
            }

            assertGoproControllerReturnsCorrectPhoto(html, done);
        });
    });
});

function assertGoproControllerReturnsCorrectPhoto(html, done) {
    var url = 'https://gopro.com/photos/photo-of-the-day/2014/12/17';
    var expectedPhoto = {
        uri: 'http://cbcdn2.gp-static.com/uploads/photo_of_the_day/image/135179/full_height2x_G0027451.jpg',
        title: 'Skydive over Bay of Acre Israel',
        byline: 'by Yogev Kalmanovich'
    };

    nock(url)
        .get('')
        .reply(200, html);

    var request = {
        params: [{
            date: '2014-12-17'
        }]
    };

    goproController(request, function (photo) {
        assert.deepEqual(photo, expectedPhoto);
        done();
    });
}
