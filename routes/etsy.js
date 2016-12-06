var express = require('express');
var router = express.Router();

var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('../config/etsy-provider.json');
var etsy = purest({provider: 'etsy', config})
var etsyConfig = require('../config/etsy-keys.json')

var meltsy = require('../lib/meltsy').meltsy
var _ = require('lodash')

var path = require('path')

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })


router.get('/', function (req, res, next) {

  console.log(`Token: ${req.session.token}\nSecret: ${req.session.secret}`)

  var items,
      user_id

  var eReq = etsy
  //.get('oauth/scopes')
  // .get('users/m0nkmaster/transactions')
  // .get('featured_treasuries/listings')
  .get('shops/MeltingHouse/transactions')
  // .get('transactions/1222322325')
  //  .get('shops/MeltingHouse/receipts')
  // .get('shops/MeltingHouse/ledger/')
  .oauth({
      consumer_key: etsyConfig.etsy.consumer_key,
      consumer_secret: etsyConfig.etsy.consumer_secret
    })
  .auth(req.session.token, req.session.secret)
  .request()
  .catch((err) => {
    console.log('Error fetching from etsy')
    console.log(err)
    res.render('home',{items:null})
  })
  .then((result) => {

    if (result[0].statusCode != 200) {
        res.render('list',{items:null})
        console.log('Error not a 200')
    }

    var output = result.pop(); // for some reason the result contains two copies

    // @temp - output response to file
    fs = require('fs');


    //set user and items for view
    user_id = output.params.user_id
    items = output.results
        .filter((e) => {return e.title !== undefined})
        .map((e) => {e.date = new Date(e.creation_tsz * 1000).toGMTString();return e})
  })
  .then((error, result, body) => {
        res.render('list',{items:items, user_id:user_id});
  })
})

router.get('/item-list', function (req, res, next) {
  var items
  meltsy.getUnshipped(req, function(items){
    console.log('Finished gettingUnshipped')
    // console.log(items)
    var total = _.sumBy(items, 'quantity');
    res.render('items', {items: items, total: total})
  })
  // res.render('items', {items: items})
})



// router.get('/unshipped-items', function (req, res, next) {
//
//   fs = require('fs');
//   var csv = fs.readFileSync(path.join(__dirname, '../example-files/sales.csv')).toString()
//   var jsonOrders
//   var combinedOrders
//
//   var Converter = require("csvtojson").Converter;
//   var converter = new Converter({});
//   converter.fromString(csv,function(err,result){
//     jsonOrders = result.filter(e => {
//       if (e["Date Posted"] != ""){
//         return true
//       }
//     })
//
//     // jsonOrders.forEach(e => {
//     //   // if (!)
//     //   // combinedOrders[e['Listing ID']['count'] = 1]
//     //   combinedOrders[e['Listing ID'] = e["Item Name"]]
//     // })
//
//
//     fs.writeFile('output.json', JSON.stringify(jsonOrders))
//     res.render('items',{title:"Unshipped items",items:jsonOrders})
//   });
// })

router.get('/handle_callback', function (req, res) {
  //Save auth details to session cookie
  req.session.token = req.query.access_token
  req.session.secret = req.query.access_secret

  // res.end(JSON.stringify(req.query, null, 2))
  res.render('etsy/connected', {token: req.session.token, secret: req.session.secret})
})

module.exports = router
