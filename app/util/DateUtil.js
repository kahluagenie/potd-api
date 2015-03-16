'use strict';

function DateUtil() {
}

DateUtil.toUTCDateString = function (date, separator) {
    if (!separator) {
        separator = '-';
    }
    return date.getUTCFullYear() + separator + (date.getUTCMonth() + 1) + separator + date.getUTCDate();
};


module.exports = DateUtil;
