var express = require('express')
var Grant = require('grant-express')
var etsyConfig = require('./config/etsy-keys.json')
var grant = new Grant(etsyConfig)

var cookieSession = require('cookie-session')

var request = require('request')
var promise = require('bluebird')
var purest = require('purest')({request, promise})
var config = require('./config/etsy-provider.json');
var etsy = purest({provider: 'etsy', config})
var exphbs = require('express-handlebars')

var app = express()
app.use(cookieSession({secret: 'melty super secret'}))
app.use(grant)
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/css', express.static(__dirname + '/css'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/handle_etsy_callback', function (req, res) {

  //Save auth details to session cookie
  req.session.token = req.query.access_token
  req.session.secret = req.query.access_secret

  res.end(JSON.stringify(req.query, null, 2))
})

app.get('/etsy', function (req, res) {
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
    console.log('Error')
    console.log(err)
  })
  .then((result) => {
    res.render('home', {
      body: JSON.stringify(result)
    });
    // res.end(JSON.stringify(result))
  })
})

app.listen(3000, function () {
  console.log('Express server listening on port ' + 3000)
})
