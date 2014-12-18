const homeController = require('../controller/home');
const assert = require('chai').assert;
const expect = require('chai').expect;

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
        assert(response.links, 'links must exist on home resource');
        done();
    });
}

function assertHomeHasGoproLink(done) {
    homeController(mockRequest, function (response) {
        expect(response.links).to.contain({rel: 'gopro', href: 'http://localhost/gopro'});
        done();
    });
}
