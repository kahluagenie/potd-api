const assert = require('assert');
const enhancePrototypes = require('../config/extend-prototypes');

const mockPhoto = {
    uri: 'http://cbcdn2.gp-static.com/uploads/photo_of_the_day/image/135179/full_height2x_G0027451.jpg',
    title: 'Skydive over Bay of Acre Israel',
    byline: 'by Yogev Kalmanovich'
};

var cache = require('../cache');

enhancePrototypes();

beforeEach(function () {
    cache.clear();
});

describe('cache', function () {
    it('should store today\'s photo', function (done) {
        assertCacheStoresTodaysPhoto();
        done();
    });

    it('should store tomorrow\'s photo', function (done) {
        assertCacheStoresTomorrowsPhoto();
        done();
    });

    it('should not store yesterday\'s photo', function (done) {
        assertCacheDoesNotStoreYesterdaysPhoto();
        done();
    });

    it('should empty itself on clear command', function (done) {
        testCacheClear();
        done();
    });
});

function assertCacheStoresTodaysPhoto() {
    var today = new Date().toCustomString();
    assertCacheStoresMockValue(today);
}

function assertCacheStoresMockValue(dateKey) {
    var cacheValue = cache.get(dateKey);
    assert.equal(cacheValue, null);

    cache.put(dateKey, mockPhoto);
    cacheValue = cache.get(dateKey);
    assert.deepEqual(cacheValue, mockPhoto);
}

function assertCacheStoresTomorrowsPhoto() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    assertCacheStoresMockValue(tomorrow.toCustomString());
}

function assertCacheDoesNotStoreYesterdaysPhoto() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    assertCacheDoesNotStoreMockValue(yesterday.toCustomString());
}

function assertCacheDoesNotStoreMockValue(dateKey) {
    var cacheValue = cache.get(dateKey);
    assert.equal(cacheValue, null);

    cache.put(dateKey, mockPhoto);
    cacheValue = cache.get(dateKey);
    assert.equal(cacheValue, null);
}

function testCacheClear() {
    var today = new Date().toCustomString();
    cache.put(today, mockPhoto);

    cache.clear();
    var cacheValue = cache.get(today);
    assert.equal(cacheValue, null);
}
