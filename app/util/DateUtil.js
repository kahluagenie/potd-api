'use strict';
const _ = require('lodash');

function DateUtil() {
}

DateUtil.toCustomDateString = function (date, separator) {
    return _buildCustomDateString(date.getFullYear(), date.getMonth(), date.getDate(), separator);
};


DateUtil.toCustomUTCDateString = function (date, separator) {
    return _buildCustomDateString(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), separator);
};


function _buildCustomDateString(year, month, date, separator) {
    if (!separator) {
        separator = '-';
    }
    return year.toString().concat(separator).concat(month + 1).concat(separator).concat(date);
}


module.exports = DateUtil;
