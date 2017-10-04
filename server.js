// BASE SETUP
// =============================================================================


// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var User = require('./app/models/user');
var dbUri = 'mongodb://pepe:q1w2e3r4t5@ds163034.mlab.com:63034/timeapp';


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use( function(req, res, next) {
  console.log('Something is happening...');
  next();
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /users
// ---------------------------------------------------
router.route('/users')
  .post( (req, res) => {
    var user = new User();
    user.name = req.body.name;

    user.save( (err) => {
      if(err)
        res.send(err);

      res.json({ message: user});
    });

  })

  .get( (req, res) => {

    User.find( (err, users) => {
      if (err)
        res.send(err);

      res.json(users);
    })

  });

// on routes that end in /users/:user_id
// ----------------------------------------------------

router.route('/users/:user_id')
  .get( (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if(err)
        res.send(err);

      res.json(user);
    })
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
mongoose.connect(dbUri, (err) => {
    if(err)
      return console.log(err);

    console.log('Connected to database');
    app.listen(port, () => {
        console.log('Magic happens on port ' + port)
      });
});
