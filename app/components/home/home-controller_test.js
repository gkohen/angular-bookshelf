'use strict';

describe('Controller: HomeController', function() {

  beforeEach(module('angular-bookshelf'));

  var $controller;
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  var BookService;
  beforeEach(inject(function(_BookService_) {
    BookService = _BookService_;
  }));

  it('should load all books on setup.', function() {
    // setup mocking
    var books = {
      'book': {}
    };
    spyOn(BookService, 'getAll').and.returnValue(books);

    // instantiate controller
    var controller = $controller('HomeController', {
      BookService: BookService
    });

    // validate result
    expect(BookService.getAll).toHaveBeenCalled();
    expect(controller.books).toEqual(books);
  });

});