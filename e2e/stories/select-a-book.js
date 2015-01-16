'use strict';

var HomePage = require('../pages/home-page');

describe('angular-bookshelf - ', function () {

  var homePage;

  beforeEach(function () {
    homePage = new HomePage();
    homePage.open();
  });

  describe('HomePage', function () {

    it('should automatically redirect to "/".', function () {
      expect(browser.getTitle()).toEqual('Bookshelf');
      expect(browser.getCurrentUrl()).toEqual(browser.params.baseUrl + '/');
    });

    it('should show two books.', function () {
      expect(homePage.getBooks().count()).toBe(2);
    });

    it('should redirect when selecting book.', function() {
      homePage.selectBook(1);
      expect(browser.getCurrentUrl()).toEqual(browser.params.baseUrl + '/books/java');
    });

  });

});
