'use strict';

const DateUtil = require('./DateUtil');

/**
 * Cache for storing just two values:
 * today and tomorrow (because of time zone differences).
 * Those will be the majority of use cases.
 */

let cache = {
    today: new CacheEntry(),
    tomorrow: new CacheEntry()
};

function CacheEntry(date, value) {
    this.date = date;
    this.value = value;
}

exports.get = function (key) {
    if (key === cache.today.date) {
        return cache.today.value;
    } else if (key === cache.tomorrow.date) {
        return cache.tomorrow.value;
    } else {
        return null;
    }
};

exports.put = function (key, value) {
    let date = new Date();

    let today = DateUtil.toCustomDateString(date);
    if (key === today) {
        cache.today.date = key;
        cache.today.value = value;
    }

    date.setDate(date.getDate() + 1);
    let tomorrow = DateUtil.toCustomDateString(date);
    if (key === tomorrow) {
        cache.tomorrow.date = key;
        cache.tomorrow.value = value;
    }
};

exports.clear = function () {
    cache = {
        today: new CacheEntry(),
        tomorrow: new CacheEntry()
    };
};
