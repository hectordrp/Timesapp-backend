// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');       // call express
const bodyParser = require('body-parser');   // request parser
const mongoose   = require('mongoose');      // database ORM
const users = require('./app/routes/users');     // Our Api routes
const cards = require('./app/routes/cards');
const app        = express();                // define our app using express
const compression = require('compression');
const logger = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const http       = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const dbUri = 'mongodb://pepe:q1w2e3r4t5@ds163034.mlab.com:63034/timeapp'; // mongodb Url

var config = require('./app/_config');
var port = process.env.PORT || 3000;        // set our port

// auth0 config
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://winterandfell.eu.auth0.com/.well-known/jwks.json"
    }),
    audience: 'http://10.246.69.191:8080/api',
    issuer: "https://winterandfell.eu.auth0.com/",
    algorithms: ['RS256']
});

// MIDDLEWARE //
// logger //
if (app.get('env') !== 'production') {
// debugging middleware in development only
  app.use(logger('dev'));
}
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Make io accessible to our router
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  req.io = io;
  next();
});
// disable express identification //
app.disable('x-powered-by');
// auth0 middlware //
// app.use(checkJwt);
// compression middleware //
app.use(compression());
// routes middleware //
app.use('/api', users, cards);
// Error handler middleware //
app.use( (err, req, res, next) => {
  console.error(`This was catched with the middleman \n ${err}`);
  res.status(400).json({ error: err.errmsg});
  next();
});
// Event error handler //
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error('Address in use -> ' + e);
    setTimeout(() => {
      server.close();
    }, 1000);
  } else {
    console.error(e);
  }
});

// START THE SERVER
// =============================================================================
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI[app.settings.env], { useMongoClient: true}, (err) => {
      if (err)
        return console.error('An error just ocurred \n', err);

      console.log(`Connected to database ${config.db[app.settings.env]}`);

      server.listen(port,() => {
            console.log(`Magic happens on port  ${port}`),
            io.on('connection', function(socket) {
              console.log("client connect");
              socket.emit('test','ola wey desde mi selvidol');
              socket.on('my other event', function (data) {
                console.log(data);
              });
            });
          });
        });

module.exports = app;
