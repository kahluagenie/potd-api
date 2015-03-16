'use strict';

function DateUtil() {
}

DateUtil.toCustomDateString = function (date, separator) {
    if (!separator) {
        separator = '-';
    }
    return date.getFullYear() + separator + (date.getMonth() + 1) + separator + date.getDate();
};


DateUtil.toCustomUTCDateString = function (date, separator) {
    if (!separator) {
        separator = '-';
    }
    return date.getUTCFullYear() + separator + (date.getUTCMonth() + 1) + separator + date.getUTCDate();
};


module.exports = DateUtil;
