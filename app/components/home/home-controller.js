(function() {

  'use strict';

  angular
    .module('angular-bookshelf')
    .controller('HomeController', HomeController);

  /* @ngInject */
  function HomeController(BookService) {
    var vm = this;
    vm.books = {};

    activate();

    ////////////////

    function activate() {
      vm.books = BookService.getAll();
    }
  }

})();
