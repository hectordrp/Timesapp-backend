// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');       // call express
const bodyParser = require('body-parser');   // request parser
const mongoose   = require('mongoose');      // database ORM
const api = require('./app/routes/api');     // Our Api routes
const app        = express();                // define our app using express
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const http       = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const dbUri = 'mongodb://pepe:q1w2e3r4t5@ds163034.mlab.com:63034/timeapp'; // mongodb Url


server.on('error', function (err) {
  console.log('error en el servidor -> ', err.Error);
  server.close();
});

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;        // set our port


// auth0
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

// START THE SERVER
// =============================================================================

mongoose.connect(dbUri, { useMongoClient: true}, (err) => {
      if(err)
        return console.log('An error just ocurred ', err);

      console.log('Connected to database');

      server.listen(port,() => {
            console.log('Magic happens on port ' + port),
            io.on('connection', function(socket) {
              console.log("client connect");
              socket.emit('test','ola wey desde mi selvidol');
              socket.on('my other event', function (data) {
                console.log(data);
              });
            });
          });
        });

// Make io accessible to our router
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  req.io = io;
  next();
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
// app.use(checkJwt);
app.use('/api', api);

module.exports = app;
