var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('../config/etsy-provider.json');
var etsy = purest({provider: 'etsy', config})
var etsyConfig = require('../config/etsy-keys.json')
var _ = require('lodash');

function meltsy(){
        this.getUnshipped = function (req, callback) {
          var eReq = etsy
          .get('shops/MeltingHouse/transactions?limit=300&page=4')
          .oauth({
              consumer_key: etsyConfig.etsy.consumer_key,
              consumer_secret: etsyConfig.etsy.consumer_secret
            })
          .auth(req.session.token, req.session.secret)
          .request()
          .catch((err) => {
            console.log('Error fetching transactions')
            console.log(err)
            res.render('home',{items:[]})
          })
          .then((result) => {
            console.log(result[0].body)
            var output = result.pop() // for some reason the result contains two copies
            var items = output.results
              .map((e) => {e.date = new Date(e.creation_tsz * 1000).toGMTString();return e})
              .filter((e) => {return e.shipped_tsz == null})

            var newItems = {}
            items.forEach(function(e){
              var itemNameIncVariation
              e.variations.forEach(v => {
                itemIDIncVariation = e.listing_id + '_' + v.formatted_value
                itemNameIncVariation = e.title.substring(0,60) + '... (' + v.formatted_value + ')'
                if (!(itemIDIncVariation in newItems)) {
                  newItems[itemIDIncVariation] = []
                  newItems[itemIDIncVariation].title = itemNameIncVariation
                  newItems[itemIDIncVariation].listing_id = itemIDIncVariation
                  newItems[itemIDIncVariation].quantity = 1
                } else {
                  newItems[itemIDIncVariation].quantity += 1
                }
              })
            })

            newItems = _.orderBy(newItems, 'quantity', 'desc');

            // // @temp - output response to file
            fs = require('fs');
            fs.writeFile('output.json', JSON.stringify(output))
            callback(newItems);
          })


          //return items
        }
}

// expose foobar to other modules
exports.meltsy = new meltsy();
