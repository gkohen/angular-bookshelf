(function() {
  'use strict';

  angular
    .module('angular-bookshelf')
    .controller('HomeController', HomeController);

  /* @ngInject */
  function HomeController(BookService) {
    /*jshint validthis: true */
    var vm = this;
    vm.books = {};

    activate();

    ////////////////
    
    function activate() {
      vm.books = BookService.getAll();
    }
  }

})();