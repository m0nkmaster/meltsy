var express = require('express');
var router = express.Router()

router.get('/', function (req, res) {

  //   var apiKey = '0xt6iSZmePgEsS0fKysHmA';
  //   var easypost = require('node-easypost')(apiKey);
  //
  //   // set addresses
  //   var toAddress = {
  //       name: "Emma MacDonald",
  //       street1: "12 New Tanhouse",
  //       city: "Mirfield",
  //       state: "West Yorkshire",
  //       zip: "WF149BP",
  //       country: "UK",
  //       phone: "+447979237983"
  //   };
  //   var fromAddress = {
  //       name: "Melting House",
  //       street1: "4 Emblem Court",
  //       street2: "",
  //       city: "Queensbury",
  //       state: "West Yorkshire",
  //       zip: "BD132SN",
  //       phone: "+4401274 123123"
  //   };
  //
  //   // verify address
  //   easypost.Address.create(toAddress, function(err, toAddress) {
  //       toAddress.verify(function(err, response) {
  //           if (err) {
  //               console.log('Address is invalid.');
  //               console.log(err)
  //               res.end()
  //           } else if (response.message !== undefined && response.message !== null) {
  //               console.log('Address is valid but has an issue: ', response.message);
  //               var verifiedAddress = response.address;
  //           } else {
  //               var verifiedAddress = response;
  //           }
  //       });
  //   });
  //
  // // set parcel
  // easypost.Parcel.create({
  //     predefined_package: "InvalidPackageName",
  //     weight: 21.2
  // }, function(err, response) {
  //     console.log(err);
  // });
  //
  // var parcel = {
  //     length: 10.2,
  //     width: 7.8,
  //     height: 4.3,
  //     weight: 21.2
  // };
  //
  // // create customs_info form for intl shipping
  // var customsItem = {
  //     description: "EasyPost t-shirts",
  //     hs_tariff_number: 123456,
  //     origin_country: "US",
  //     quantity: 2,
  //     value: 96.27,
  //     weight: 21.1
  // };
  //
  // var customsInfo = {
  //     customs_certify: 1,
  //     customs_signer: "Hector Hammerfall",
  //     contents_type: "gift",
  //     contents_explanation: "",
  //     eel_pfc: "NOEEI 30.37(a)",
  //     non_delivery_option: "return",
  //     restriction_type: "none",
  //     restriction_comments: "",
  //     customs_items: [customsItem]
  // };
  //
  // // create shipment
  // easypost.Shipment.create({
  //     to_address: toAddress,
  //     from_address: fromAddress,
  //     parcel: parcel,
  //     customs_info: customsInfo
  // }, function(err, shipment) {
  //
  //     var rates
  //     // getRates
  //     shipment.getRates({carrier_id: "ca_9afb8d9197824fd78396f3dba4862129"}, function(err, rates){
  //       console.log('============== RATES ==============')
  //         console.log(rates.rates)
  //         console.log('============== END RATES ==============')
  //     })
  //
  //
  //     // buy postage label with one of the rate objects
  //     shipment.buy({rate: shipment.lowestRate(['USPS', 'ups']), insurance: 100.00}, function(err, shipment) {
  //         console.log(shipment.tracking_code);
  //         console.log(shipment.postage_label.label_url);
  //         res.send("Here is your shipping label: <a href=\"" + shipment.postage_label.label_url + "\">Label!!!</a>")
  //     });
  // });
  res.render('home',{message:"wip"});
})

module.exports = router
