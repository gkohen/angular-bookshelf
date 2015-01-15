'use strict';

describe('Controller: BookChapterController', function() {

  beforeEach(module('angular-bookshelf'));

  var $controller;
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  var $routeParams;
  beforeEach(inject(function(_$routeParams_) {
    $routeParams = _$routeParams_;
  }));

  var BookService;
  beforeEach(inject(function(_BookService_) {
    BookService = _BookService_;
  }));

  it('should load a specific book and chapter on setup.', function() {
    // setup mocking BookService
    var book = {
      title: 'unitTesting in AngularJS',
      chapters: [{
        title: 'setupKarma'
      }]
    };
    spyOn(BookService, 'getBySlug').and.returnValue(book);

    // setup mocking for $routeParams
    var bookSlug = 'unit';
    var chapterId = 0;
    $routeParams = {
      bookSlug: bookSlug,
      chapterId: chapterId
    };

    // instantiate controller
    var controller = $controller('BookChapterController', {
      $routeParams: $routeParams,
      BookService: BookService
    });

    // validate result
    expect(BookService.getBySlug).toHaveBeenCalledWith(bookSlug);
    expect(controller.book).toEqual(book);
    expect(controller.chapter).toEqual(book.chapters[chapterId]);
  });

});