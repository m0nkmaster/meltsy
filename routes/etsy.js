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



router.get('/', function (req, res) {

  console.log(
      req.session.token, req.session.secret,
      req.session.token, req.session.secret
  )
  var items,
     user_id,
     datetime
  eReq = etsy
  //.get('oauth/scopes')
  .get('users/m0nkmaster/transactions')
  // .get('featured_treasuries/listings')
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

    var output = result.pop(); // for some reason the result contain two copies
    // console.log(output);
    fs = require('fs');
    fs.writeFile('output.json', JSON.stringify(output))
    // console.log(output.statusCode)
    items = output.results
        .filter(function(e){return e.title !== undefined})
        .map(function(e){
            e.date = new Date(e.creation_tsz * 1000).toGMTString()
            return e
        })
    user_id = output.params.user_id
  })
  .then((error, result, body) => {
        res.render('list',{items:items, user_id:user_id});
  })
})

router.get('/handle_callback', function (req, res) {

  //Save auth details to session cookie
  req.session.token = req.query.access_token
  req.session.secret = req.query.access_secret

  res.end(JSON.stringify(req.query, null, 2))
})

module.exports = router