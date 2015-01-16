(function() {

  'use strict';

  angular
    .module('angular-bookshelf')
    .controller('BookChapterController', BookChapterController);

  /* @ngInject */
  function BookChapterController($routeParams, BookService) {
    var vm = this;
    vm.book = {};
    vm.chapter = {};

    activate();

    ////////////////

    function activate() {
      vm.book = BookService.getBySlug($routeParams.bookSlug);
      vm.chapter = vm.book.chapters[$routeParams.chapterId];
    }
  }

})();
