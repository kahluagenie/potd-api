module.exports = function () {
    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) === str;
        };
    }

    if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function (str) {
            return this.slice(-str.length) === str;
        };
    }

    Date.prototype.toCustomString = function (separator) {
        if (!separator) {
            separator = '-';
        }
        return this.getUTCFullYear() + separator + (this.getUTCMonth() + 1) + separator + this.getUTCDate();
    };
};
