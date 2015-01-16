(function() {

  'use strict';

  angular
    .module('angular-bookshelf')
    .config(function($routeProvider, $locationProvider) {

      $routeProvider
        .when('/', {
          templateUrl: 'home/home.html',
          controller: 'HomeController',
          controllerAs: 'homeCtrl'
        })
        .when('/books/:bookSlug', {
          templateUrl: 'book/book.html',
          controller: 'BookController',
          controllerAs: 'bookCtrl'
        })
        .when('/books/:bookSlug/chapters/:chapterId', {
          templateUrl: 'book/chapter/book-chapter.html',
          controller: 'BookChapterController',
          controllerAs: 'bookChapterCtrl'
        })

        // if no case matches redirect to home
        .otherwise('/');

      // generate URLs without '#'
      $locationProvider.html5Mode(true);

    });

})();
