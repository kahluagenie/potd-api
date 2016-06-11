'use strict';

const nock = require('nock');
const assert = require('assert');
const Sinon = require('sinon');
const goproController = require('../app/controller/gopro');
const cache = require('../app/util/cache');


const goproResponse = require('./resources/gopro-api-potd-response.json');

const expectedPhoto = {
    uri: "https://thumbnails-01.gp-static.com/v1/thumbnails/mdeqgKeMZC-6TZFjvQbgbUdq8Pw=/1920x1080/channels-uploads/production/images/master/970/b2578-7603845.jpg",
    title: "Splash",
    byline: "by Thodoris Ermilios",
    source: "https://gopro.com/channel/photo-of-the-day/splash/"
};

describe('gopro controller', function () {
    let sandbox;

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
        let date = '2015-01-25';
        mockSuccessfulGoproCall(goproResponse);
        assertGoproControllerReturnsCorrectPhoto(done, date);
    });

    it('should return null when cache is empty and network call fails', function (done) {
        mockFailureGoproCall();
        assertGoproControllerReturnsNullOnFailedNetworkCall(done);
    });

    it('should return latest available photo when date is too high', function (done) {
        let date = '2015-01-28';
        mockSuccessfulGoproCall(goproResponse);
        assertGoproControllerReturnsCorrectPhoto(done, date);
    });

    it('should return latest available photo when date is too high and date is single digit', function (done) {
        let date = '2015-01-10';
        mockSuccessfulGoproCall(require('./resources/gopro-api-response-modified.json'));
        assertGoproControllerReturnsCorrectPhoto(done, date);
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
    let request = {
        params: {
            date: date
        }
    };

    goproController.getPicture(request, function (photo) {
        assert.deepEqual(photo, expectedPhoto);
        callback();
    });
}

function assertGoproControllerReturnsNullOnFailedNetworkCall(callback) {
    let request = {
        params: {}
    };

    goproController.getPicture(request, function (error) {
        assert.equal(error, 'Error retrieving the image from GoPro');
        callback();
    });
}
