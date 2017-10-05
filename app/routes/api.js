

const express = require('express');
const router = express.Router();  // get an instance of the express Router
const User = require('../models/user');   // our user model


// ROUTES FOR OUR API
// =============================================================================

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
      if(err){
        console.log(err);
        res.send({ errmsg: err.message});
      }else{
        res.json({ message: user.name});
     }
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

router.route('/user/:name')
  .get( (req, res) => {
    User.find({name: req.params.name}, (err, user) => {
      if(err)
        res.send(err);

      res.json(user);
    })
  })

  .put( (req, res) => {
    User.findOne({name: req.params.name}, (err, user) => {
        if(err)
          res.send(err);

      if(user !== null){
        user.name = req.body.name;
        var newUser = user;
        user.save((err) => {
          if(err)
            res.send(err);

        res.json( { message: 'User updated!, ', newUser});
        });
      } else {
      res.json( { error: 'An error has just ocurred while updating...'})
    }
    })
  })

  .delete( (req, res) => {
    User.remove({
      _id: req.params.user_id
    }, (err, user) => {
      if(err)
        res.send(err);

      res.json({message: 'User deleted' })
    });
  });

module.exports = router;
