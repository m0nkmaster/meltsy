var assert = require('assert')
var meltsy = require('../lib/meltsy').meltsy
var nock = require('nock');
var _ = require('lodash')
var items
var req = {
      session: {
        token: "test123",
        secret: "test456"
      }
    }

describe('Meltsy Module', function() {
  describe('One page, no pagination, no variations', function() {
    beforeEach(function() {
      var scope = nock('https://openapi.etsy.com/v2/shops/MeltingHouse')
        .get('/transactions?limit=100')
        .replyWithFile(200, __dirname + '/data/one-transaction.json')

      var scope2 = nock('https://openapi.etsy.com/v2/shops/MeltingHouse')
        .get('/transactions?limit=100&page=2&offset=100')
        .replyWithFile(200, __dirname + '/data/one-transaction-2.json')

      var items = null
    })

    it('should return an object with a single element', function() {
      meltsy.getUnshipped(req, function(result){
        console.log(result)
        items = result
      })
      assert.equal(2, items)
    })

    xit('title of items should be correct', function() {
      var title = []
      meltsy.getUnshipped(req, function(result){

      })
    })
  })

  describe('Simple list, all unshipped with with variation', function() {
    beforeEach(function() {
      var scope = nock('https://openapi.etsy.com/v2/shops/MeltingHouse')
        .get('/transactions?limit=100')
        .times(10)
        .replyWithFile(200, __dirname + '/data/one-transaction-variation.json')

      var scope2 = nock('https://openapi.etsy.com/v2/shops/MeltingHouse')
        .get('/transactions?limit=100&page=2&offset=100')
        .times(10)
        .replyWithFile(200, __dirname + '/data/one-transaction-variation.json')


    })

    xit('should return an object with 2 elements', function() {
      meltsy.getUnshipped(req, function(result){
        size =  _.size(result)
        assert.equal(2, size)
      })
    })

    xit('title of items should be correct', function() {
      var title = []
      meltsy.getUnshipped(req, function(result){

      title[0] = result[0].title
      title[1] = result[1].title

      assert.equal('Hot chocolate spoons... (orange)', title[0])
      assert.equal('Hot chocolate spoons... (mint)', title[1])
      })
    })
  })

  describe('404 is handled', function() {
    xit('should return an empty object', function() {

      var scope = nock('https://openapi.etsy.com/v2/shops/MeltingHouse')
        .get('/transactions?limit=100')
        .times(10)
        .reply(404, {error: 'oh heck'})

      meltsy.getUnshipped(req, function(result){
        size =  _.size(result)
        assert.equal(0, size)
      })
    })
  })
})
