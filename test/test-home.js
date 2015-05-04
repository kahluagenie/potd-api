'use strict';

var homeController = require('../app/controller/home');
var should = require('chai').should();

var mockRequest = {
    info: {
        host: 'localhost'
    },
    path: '/'
};

describe('home resource', function () {
    it('should contain a list of links', function (done) {
        assertHomeHasLinks(done);
    });

    it('should have a gopro link', function (done) {
        assertHomeHasGoproLink(done);
    });
});

function assertHomeHasLinks(done) {
    homeController(mockRequest, function (response) {
        should.exist(response.links, 'links must exist on home resource');
        done();
    });
}

function assertHomeHasGoproLink(done) {
    homeController(mockRequest, function (response) {
        should.exist(response);
        should.exist(response.links);
        response.links.should.contain({rel: 'gopro', href: 'http://localhost/gopro'});
        done();
    });
}
