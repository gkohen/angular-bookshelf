(function() {
  'use strict';

  angular
    .module('angular-bookshelf')
    .service('BookService', BookService);

  /* @ngInject */
  function BookService() {
    var books = loadBooks();
    var service = {
      getAll: getAll,
      getBySlug: getBySlug
    };
    return service;

    ////////////////

    function loadBooks() {
      return {
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
    }

    function getAll() {
      return books;
    }

    function getBySlug(slug) {
      if (slug in books) {
        return books[slug];
      } else {
        return {};
      }
    }
  }

})();