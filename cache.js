/**
 * Cache for storing just two values:
 * today and tomorrow (because of time zone differences).
 */

var cache = {
    today: new CacheEntry(),
    tomorrow: new CacheEntry()
};

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
    var date = new Date();

    var today = formatDate(date);
    if (key === today) {
        cache.today.date = key;
        cache.today.value = value;
    }

    date.setDate(date.getDate + 1);
    var tomorrow = formatDate(date);
    if (key === tomorrow) {
        cache.tomorrow.date = key;
        cache.tomorrow.value = value;
    }
};

function CacheEntry(date, value) {
    this.date = date;
    this.value = value;
}

function formatDate(date, separator) {
    if (!separator) {
        separator = '-';
    }
    return date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate();
}
