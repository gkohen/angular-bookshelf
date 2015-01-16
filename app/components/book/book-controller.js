(function() {

  'use strict';

  angular
    .module('angular-bookshelf')
    .controller('BookController', BookController);

  /* @ngInject */
  function BookController($routeParams, BookService) {
    var vm = this;
    vm.book = {};

    activate();

    ////////////////

    function activate() {
      vm.book = BookService.getBySlug($routeParams.bookSlug);
    }
  }

})();
