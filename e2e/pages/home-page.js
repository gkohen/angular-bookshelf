'use strict';

var HomePage = (function() {

  function HomePage() {
    this.books = element.all(by.repeater('book in homeCtrl.books'));
  }

  HomePage.prototype.open = function() {
    browser.get('/');
  };

  HomePage.prototype.getBooks = function() {
    return this.books;
  };

  HomePage.prototype.selectBook = function(index) {
    this.books.get(index).element(by.css('a')).click();
  };

  return HomePage;

})();

module.exports = HomePage;
