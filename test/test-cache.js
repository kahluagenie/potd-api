'use strict';

var assert = require('assert');
var enhancePrototypes = require('../app/config/extend-prototypes');
var DateUtil = require('../app/util/DateUtil');

var mockPhoto = {
    uri: 'http://cbcdn2.gp-static.com/uploads/photo_of_the_day/image/135179/full_height2x_G0027451.jpg',
    title: 'Skydive over Bay of Acre Israel',
    byline: 'by Yogev Kalmanovich'
};

var cache = require('../app/util/cache');

enhancePrototypes();

beforeEach(function () {
    cache.clear();
});

describe('cache', function () {
    it('should store today\'s photo', function (done) {
        assertCacheStoresTodayPhoto();
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

function assertCacheStoresTodayPhoto() {
    var today = DateUtil.toCustomUTCDateString(new Date());
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
    assertCacheStoresMockValue(DateUtil.toCustomDateString(tomorrow));
}

function assertCacheDoesNotStoreYesterdaysPhoto() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    assertCacheDoesNotStoreMockValue(DateUtil.toCustomDateString(yesterday));
}

function assertCacheDoesNotStoreMockValue(dateKey) {
    var cacheValue = cache.get(dateKey);
    assert.equal(cacheValue, null);

    cache.put(dateKey, mockPhoto);
    cacheValue = cache.get(dateKey);
    assert.equal(cacheValue, null);
}

function testCacheClear() {
    var today = DateUtil.toCustomDateString(new Date());
    cache.put(today, mockPhoto);

    cache.clear();
    var cacheValue = cache.get(today);
    assert.equal(cacheValue, null);
}
