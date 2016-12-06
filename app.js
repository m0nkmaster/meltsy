var express = require('express')
var app = express()
var path = require('path');

var etsy = require('./routes/etsy')
var easypost = require('./routes/easypost')
var Grant = require('grant-express')
var etsyConfig = require('./config/etsy-keys.json')
var grant = new Grant(etsyConfig)
var cookieSession = require('cookie-session')

app.use(cookieSession({secret: 'melty super secret'}))
app.use(grant)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//routes
app.use('/etsy', etsy)
app.use('/easypost', easypost)

//homepage
app.get('/', function(req,res,next) {
    res.render('index')
})

//statics
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/css', express.static(__dirname + '/css'));

app.listen(3000, function () {
  console.log('Meltsy running on port ' + 3000)
})
