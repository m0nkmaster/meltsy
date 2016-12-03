var express = require('express')
var app = express()
var path = require('path');
var bodyParser = require('body-parser');

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

//route
app.use('/etsy', etsy)
app.use('/easypost', easypost)


// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/css', express.static(__dirname + '/css'));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));




app.listen(3000, function () {
  console.log('Express server listening on port ' + 3000)
})
