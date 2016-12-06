var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('../config/etsy-provider.json');
var etsy = purest({provider: 'etsy', config})
var etsyConfig = require('../config/etsy-keys.json')
var _ = require('lodash');


function meltsy(){
        var items = []
        this.getUnshipped = function (req, callback, page, offset, passedItems) {
          if (passedItems !== undefined){
            items = passedItems
          }

          var eReq = etsy
          .get('shops/MeltingHouse/transactions?limit=100')
          .oauth({
              consumer_key: etsyConfig.etsy.consumer_key,
              consumer_secret: etsyConfig.etsy.consumer_secret
            })
          .auth(req.session.token, req.session.secret)
          .request()
          .catch((err) => {
            callback('Error fetching transactions - ' + JSON.stringify(err)) //no data
            console.log('Error fetching transactions')
            fs = require('fs');
            fs.writeFile('fail.json', JSON.stringify(err))
            console.log(err)
            callback(items)
          })
          .then((result) => {
            // return //not sure why this deals with bad requests??
            output = result.pop() // for some reason the result contains two copies

            var tempItems = output.results
              .map((e) => {e.date = new Date(e.creation_tsz * 1000).toGMTString();return e})
              .filter((e) => {return e.shipped_tsz == null})

            items = items.concat(tempItems)

            console.log('next offet: ' + result[0].body.pagination.next_offset)
            console.log('next page: ' + result[0].body.pagination.next_page)

            // @WIP Pagination, see http://stackoverflow.com/questions/17242600/how-to-recurse-asynchronously-over-api-callbacks-in-node-js
            if (_.size(tempItems) > 0) {
              // this.getUnshipped(req, callback, result[0].body.pagination.next_page, result[0].body.pagination.next_offset, )
            }

            var newItems = {}
            items.forEach(function(e){
              var itemNameIncVariation
              e.variations.forEach(v => {
                itemIDIncVariation = e.listing_id + '_' + v.formatted_value
                itemNameIncVariation = e.title.substring(0,60) + '...'
                if (v.formatted_value) {
                   itemNameIncVariation += ' (' + v.formatted_value + ')'
                }
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

            // @temp - output response to file
            fs = require('fs');
            fs.writeFile('output.json', JSON.stringify(result))
            callback(newItems);
          })
        }
}

// expose foobar to other modules
exports.meltsy = new meltsy();
