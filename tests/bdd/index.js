'use strict';
// Instantiate the app module to start the web server
require('../../app');

// Use chai and chai as promised for my assertions
var chai = require("chai");  
var chaiAsPromised = require("chai-as-promised");  
chai.use(chaiAsPromised);  
chai.should();
// Use the wd library for webdriver
var wd = require('wd');
// Link chai-as-promised and wd promise chaining
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
//browser driver
var browser = wd.promiseChainRemote();
// Blog Index Suite
describe('Blog Index', function () {
  // Mocha's 2 second timeout is sometimes a little slow when
  // webdriver is starting up
  this.timeout(6000);
  before(function (done) {
      //Open a browser using webdriver remote
      browser.init({browserName:'firefox'})
          .then(function () {
              done();
          });
  });
  beforeEach(function (done) {
          browser.get('http://localhost:3000/blog/')
          .then(function () {
              done();
          });
  });
  after(function (done) {
      //Quit the browser
      browser.quit()
          .then(function () {
              done();
          });
  });
});


/**
* As a Visitor, 
* I would like to see summaries of the last few blog posts on the blog index, 
* so that I can see which scintillating nuggets Andy has gifted to the World.
*/
it('displays a number of article summaries on the blog index', function (done) {  
  browser.elementsByCssSelector('.article-summary')
    .should.eventually.have.length.above(0).notify(done);
});