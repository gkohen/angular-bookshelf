'use strict';

describe('Service: BookService', function() {

  beforeEach(module('angular-bookshelf'));

  var BookService;
  beforeEach(inject(function(_BookService_) {
    BookService = _BookService_;
  }));

  var books = {
    'java': {
      title: 'Java ist auch eine Insel',
      slug: 'java',
      chapters: [{
        title: 'Vorwort',
        summary: 'Am 23. Mai 1995 stellten John Gage die Programmiersprache Java vor.'
      }, {
        title: 'Java ist auch eine Sprache',
        summary: 'Nach fast 20 Jahren hat sich Java als Plattform etabliert.'
      }, {
        title: 'Imperative Sprachkonzepte',
        summary: 'Ein Programm in Java wird nicht umgangssprachlich beschrieben.'
      }]
    },
    'book': {
      title: 'A Book',
      slug: 'book',
      chapters: [{
        title: 'Intro',
        summary: 'Not so much...'
      }]
    }
  };


  // getAll()
  describe('. getAll() ', function() {

    it('should return all books.', function() {
      // call method
      var result = BookService.getAll();

      // validate result
      expect(result).toEqual(books);
    });

  });

  
  // getBySlug()
  describe('. getBySlug() ', function() {

    it('should return a specific book.', function() {
      var slug = 'java';

      // call method
      var result = BookService.getBySlug(slug);

      // validate result
      expect(result).toEqual(books[slug]);
    });

    it('should return an empty object if the book does not exist.', function() {
      var slug = 'notExisting';

      // call method
      var result = BookService.getBySlug(slug);

      // validate result
      expect(result).toEqual({});
    });

  });

});