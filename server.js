// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');       // call express
const bodyParser = require('body-parser');   // request parser
const mongoose   = require('mongoose');      // database ORM
const api = require('./app/routes/api');     // Our Api routes
const app        = express();                // define our app using express
const http       = require('http');
const server = http.createServer(app);
const dbUri = 'mongodb://pepe:q1w2e3r4t5@ds163034.mlab.com:63034/timeapp'; // mongodb Url


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', api);

// START THE SERVER
// =============================================================================

mongoose.connect(dbUri, { useMongoClient: true}, (err) => {
      if(err)
        return console.log('An error just ocurred ', err);

      console.log('Connected to database');
      server.listen(port,() => {
            console.log('Magic happens on port ' + port)
          });
        });
