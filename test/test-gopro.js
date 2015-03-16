'use strict';

var nock = require('nock');
var assert = require('assert');
var fs = require('fs');
var Sinon = require('sinon');
var goproController = require('../app/controller/gopro');
var cache = require('../app/util/cache');


var mockGoproResponseFile, mockPhoto;
setupMocks();

describe('gopro controller', function () {
    var goproResponse;
    var sandbox;

    before(function (done) {
        fs.readFile(mockGoproResponseFile, 'utf8', function (err, mockResponse) {
            if (err) {
                throw err;
            }
            goproResponse = mockResponse;
            done();
        });
    });

    beforeEach(function () {
        cache.clear();
        sandbox = Sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should return correct photo on the first and subsequent calls', function (done) {
        sandbox.useFakeTimers(new Date(2015, 0, 25, 20).getTime());
        mockSuccessfulGoproCall(goproResponse);
        assertGoproControllerReturnsCorrectPhoto(function () {
            assertGoproControllerReturnsCorrectPhoto(done);
        });
    });

    it('should return correct photo with date param', function (done) {
        var date = '2015-01-25';
        mockSuccessfulGoproCall(goproResponse);
        assertGoproControllerReturnsCorrectPhoto(done, date);
    });

    it('should return null when cache is empty and network call fails', function (done) {
        mockFailureGoproCall();
        assertGoproControllerReturnsNullOnFailedNetworkCall(done);
    });
});

function mockSuccessfulGoproCall(response) {
    nock('https://api.gopro.com')
        .get('/v2/channels/feed/playlists/photo-of-the-day?platform=web')
        .reply(200, response);
}

function mockFailureGoproCall() {
    nock('https://api.gopro.com')
        .get('/v2/channels/feed/playlists/photo-of-the-day?platform=web')
        .reply(404);
}

function assertGoproControllerReturnsCorrectPhoto(callback, date) {
    var request = {
        params: {
            date: date
        }
    };

    goproController.getPicture(request, function (photo) {
        assert.deepEqual(photo, mockPhoto);
        callback();
    });
}

function assertGoproControllerReturnsNullOnFailedNetworkCall(callback) {
    var request = {
        params: {}
    };

    goproController.getPicture(request, function (error) {
        assert.equal(error, 'Error retrieving the image from GoPro');
        callback();
    });
}

function setupMocks() {
    mockGoproResponseFile = './test/resources/gopro-api-potd-response.json';

    mockPhoto = {
        uri: "https://thumbnails-01.gp-static.com/v1/thumbnails/mdeqgKeMZC-6TZFjvQbgbUdq8Pw=/1920x1080/channels-uploads/production/images/master/970/b2578-7603845.jpg",
        title: "Splash",
        byline: "by Thodoris Ermilios",
        source: "https://gopro.com/channel/photo-of-the-day/splash/"
    };
}
