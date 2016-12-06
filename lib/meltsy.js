var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('../config/etsy-provider.json');
var etsy = purest({provider: 'etsy', config})
var etsyConfig = require('../config/etsy-keys.json')
var _ = require('lodash');
var fs = require('fs');

function meltsy(){
        var items = []
        this.getUnshipped = function (req, callback, page, offset, passedItems) {

          this.items = passedItems || []

          var paginationVars = ''
          if (page > 0 && offset > 0){
            paginationVars = `&page=${page}&offset=${offset}`
          }

          var uri = `shops/MeltingHouse/transactions?limit=100${paginationVars}`
          console.log(uri)
          var eReq = etsy
          .get(uri)
          .oauth({
              consumer_key: etsyConfig.etsy.consumer_key,
              consumer_secret: etsyConfig.etsy.consumer_secret
            })
          .auth(req.session.token, req.session.secret)
          .request()
          .catch((err) => {
            //callback('Error fetching transactions - ' + JSON.stringify(err)) //no data
            console.log('Error fetching transactions')
            // fs.writeFile('fail.json', JSON.stringify(err))
            // console.log(err)
            //callback(this.items)
          })
          .then((result) => {
            console.log('Success getting transactions')
            // return //not sure why this deals with bad requests??

            // if (result[0].body.pagination.effective_page == 1) {
            //     fs.writeFile('result.json', JSON.stringify(result))
            // }

            output = result.pop() // for some reason the result contains two copies

            var unshippedItems = output.results
              .map((e) => {e.date = new Date(e.creation_tsz * 1000).toGMTString();return e})
              .filter((e) => {return e.shipped_tsz == null})

            //this.items = []
            //console.log(this.items)
            this.items = this.items.concat(unshippedItems)

            // console.log('next offet: ' + result[0].body.pagination.next_offset)
            // console.log('next page: ' + result[0].body.pagination.next_page)

            /*
            * @WIP Pagination:
            * http://stackoverflow.com/questions/17242600/how-to-recurse-asynchronously-over-api-callbacks-in-node-js
            */
            if (_.size(unshippedItems) > 0) {
              this.getUnshipped(
                req,
                callback,
                result[0].body.pagination.next_page,
                result[0].body.pagination.next_offset,
                this.items
              )
                return
            }

            //--------------------------------

            fs.writeFile('output.json', JSON.stringify(this.items))

            console.log('Doing the array building')
            var newItems = {}
            this.items.forEach(function(e){
              var itemNameIncVariation
              if (e.variations.length > 0) {
                e.variations.forEach(v => {
                  itemIDIncVariation = e.listing_id + '_' + v.formatted_value
                  itemNameIncVariation = e.title //.substring(0,100) + '...'
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
              } else {
                if (!(e.listing_id in newItems)) {
                  newItems[e.listing_id] = []
                  newItems[e.listing_id].title = e.title //.substring(0,80) + '...'
                  newItems[e.listing_id].listing_id = e.listing_id
                  newItems[e.listing_id].quantity = 1
                } else {
                  newItems[e.listing_id].quantity += 1
                }
              }
            })

            newItems = _.orderBy(newItems, 'quantity', 'desc');

            // @temp - output response to file
            //fs.writeFile('output.json', newItems)
            callback(newItems);
          })
        }
}

// expose foobar to other modules
exports.meltsy = new meltsy();
