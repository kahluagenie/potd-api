'use strict';

function StringUtil() {
}

StringUtil.startsWith = function (str, query) {
    return str.slice(0, query.length) === query;
};

StringUtil.endsWith = function (str, query) {
    return str.slice(-query.length) === query;
};


module.exports = StringUtil;
