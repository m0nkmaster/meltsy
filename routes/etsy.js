var express = require('express');
var router = express.Router();

var meltsy = require('../lib/meltsy').meltsy
var _ = require('lodash')
var path = require('path')

router.get('/', function (req, res, next) {
  res.render('home')
})

router.get('/item-list', function (req, res, next) {

  meltsy.getUnshipped(req, function(items){
    console.log('Finished gettingUnshipped')
    var total = _.sumBy(items, 'quantity');
    res.render('items', {items: items, total: total})
  })

})

router.get('/handle_callback', function (req, res) {
  //Save auth details to session cookie
  req.session.token = req.query.access_token
  req.session.secret = req.query.access_secret

  // res.end(JSON.stringify(req.query, null, 2))
  res.render('etsy/connected', {token: req.session.token, secret: req.session.secret})
})

module.exports = router
