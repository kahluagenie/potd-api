'use strict';

const should = require('chai').should();
const DateUtil = require('../app/util/DateUtil');


describe('DateUtil', function () {
    it('Should return custom UTC date string', function (done) {
        let date = new Date(Date.parse('2015-03-16T20:00:00'));
        let customString = DateUtil.toCustomUTCDateString(date);

        should.exist(customString);
        customString.should.equal('2015-03-16');
        done();
    });

    it('Should return custom date string', function (done) {
        let date = new Date(Date.parse('2015-03-09T20:00:00'));
        let customString = DateUtil.toCustomUTCDateString(date);

        should.exist(customString);
        customString.should.equal('2015-03-09');
        done();
    });
});
