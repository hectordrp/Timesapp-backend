

const express = require('express');
const router = express.Router();  // get an instance of the express Router
const User = require('../models/user');   // our user model
const Card = require('../models/card');   // our card model

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

// Card route

router.route('/cards')
.post( (req, res) => {
  var card = new Card();
  if(req.body.title)
    card.title = req.body.title;

  if(req.body.username)
    card.owner = req.body.username;

  if(req.body.team)
    card.ownerTeam = req.body.team;

  if(req.body.estimatedTime)
    card.estimatedTime = req.body.estimatedTime;

  if(req.body.notification)
    card.notification = req.body.notification;

  if(req.body.description)
    card.description = req.body.description;

  card.save( (err) => {
    if(err){
      console.log(err);
      res.send({ errmsg: err.message});
    }else{
      res.json({ message: card});
   }
  });

})

.get( (req, res) => {

  Card.find( (err, cards) => {
    if (err)
      res.send(err);

    res.json(cards);
  })

});


router.route('/cards/:owner')
  .get( (req, res) => {
    Card.find({owner: req.params.owner}, (err, cards) => {
      if(err)
        res.send(err);

      res.json(cards);
    })
  });

router.route('/card/:id')
  .put( (req, res) => {
    User.find({_id: req.params.id}, (err, card) => {
        if(err)
          res.send(err);

      if(card !== null){
        user.save((err) => {
          if(err)
            res.send(err);

        res.json( { message: 'card updated!'});
        });
      } else {
      res.json( { error: 'An error has just ocurred while updating the card...'})
    }
    })
  })

module.exports = router;
