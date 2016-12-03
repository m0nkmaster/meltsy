var express = require('express');
var router = express.Router();

var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('../config/etsy-provider.json');
var etsy = purest({provider: 'etsy', config})
var etsyConfig = require('../config/etsy-keys.json')

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/handle_callback', function (req, res) {

  //Save auth details to session cookie
  req.session.token = req.query.access_token
  req.session.secret = req.query.access_secret

  res.end(JSON.stringify(req.query, null, 2))
})

router.get('/', function (req, res) {
  var eReq = etsy
  //.get('oauth/scopes')
  .get('featured_treasuries/listings')
  .oauth({
      consumer_key: etsyConfig.etsy.consumer_key,
      consumer_secret: etsyConfig.etsy.consumer_secret
    })
  .auth(req.session.token, req.session.secret)
  .request()
  .catch((err) => {
    console.log('Error fetching from etsy')
    console.log(err)
  })
  .then((result) => {



    // res.render('home', {
    // message: err.message,
    // error: err
    // });
    console.log(JSON.stringify(result))
  })
  res.render('index',{message:"dave"});
  // res.send('Hello, etsy page here.')
})

module.exports = router
