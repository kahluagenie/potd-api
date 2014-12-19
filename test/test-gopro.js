const goproController = require('../app/controller/gopro');
const nock = require('nock');
const assert = require('assert');
const fs = require('fs');
const enhancePrototypes = require('../app/config/extend-prototypes');

var cache = require('../app/util/cache');

enhancePrototypes();

var mockHtmlFile, mockPhoto, goproUrl;
setupMocks();

describe('gopro controller', function () {
    var html;

    before(function (done) {
        fs.readFile(mockHtmlFile, function (err, mockHtml) {
            if (err) {
                throw err;
            }
            html = mockHtml;
            done();
        });
    });

    beforeEach(function () {
        cache.clear();
    });

    it('should return correct photo on the first and subsequent calls', function (done) {
        mockSuccessGoproCall(html);
        assertGoproControllerReturnsCorrectPhoto(function () {
            assertGoproControllerReturnsCorrectPhoto(done);
        });
    });

    it('should return correct photo with date param', function (done) {
        var date = '2014-12-17';
        mockSuccessGoproCall(html, date);
        assertGoproControllerReturnsCorrectPhoto(done, date);
    });

    it('should return null when cache is empty and network call fails', function (done) {
        mockFailGoproCall();
        assertGoproControllerReturnsNullOnFailedNetworkCall(done);
    });
});

function mockSuccessGoproCall(html, date) {
    var parsedDate = date ? new Date(Date.parse(date)) : new Date();
    var url = goproUrl + parsedDate.toCustomString('/');

    nock(url)
        .get('')
        .reply(200, html);
}

function mockFailGoproCall() {
    var parsedDate = new Date();
    var url = goproUrl + parsedDate.toCustomString('/');

    nock(url)
        .get('')
        .reply(404);
}

function assertGoproControllerReturnsCorrectPhoto(done, date) {
    var request = {
        params: {
            date: date
        }
    };

    goproController(request, function (photo) {
        assert.deepEqual(photo, mockPhoto);
        done();
    });
}

function assertGoproControllerReturnsNullOnFailedNetworkCall(done) {
    var request = {
        params: {}
    };

    goproController(request, function (error) {
        assert.equal(error, 'Error retrieving the image from GoPro');
        done();
    });
}

function setupMocks() {
    mockHtmlFile = './test/resources/gopro-potd-2014-12-17.html';
    goproUrl = 'https://gopro.com/photos/photo-of-the-day/';

    mockPhoto = {
        uri: 'http://cbcdn2.gp-static.com/uploads/photo_of_the_day/image/135179/full_height2x_G0027451.jpg',
        title: 'Skydive over Bay of Acre Israel',
        byline: 'by Yogev Kalmanovich'
    };
}
