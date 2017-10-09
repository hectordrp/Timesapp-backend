

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
    user.username = req.body.username;
    user.email = req.body.email
    if(req.body.name)
      user.name = req.body.name;

    if(req.body.role)
      user.role = req.body.role;

    if(req.body.avatar)
      user.settings.avatar = req.body.avatar;

    user.save( (err) => {
      if(err){
        res.send({ errmsg: err.message});
      }else{
        res.json({ message: user});
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

router.route('/user/:username')
  .get( (req, res) => {
    User.find({username: req.params.username}, (err, user) => {
      if(err)
        res.send(err);

      res.json(user);
    })
  })

  .put( (req, res) => {
    User.findOne({username: req.params.username}, (err, user) => {
        if(err)
          res.send(err);
  //If user exist and the request has parameters it will modify the user
      if(user !== null && Object.keys(req.body).length > 0){
        if(req.body.name)
          user.name = req.body.name;

        if(req.body.notificationTime)
          user.settings.notificationTime = req.body.notificationTime;

        if(req.body.workTime)
          user.settings.workTime = req.body.workTime;

        user.save((err) => {
          if(err){
            res.json({ error: err.message});
          } else {
            res.json( { message: 'User has been updated!'});
          }
        });

      } else {
        res.json( { error: 'An error has just ocurred while updating...'})
    }
    })
  })

  .delete( (req, res) => {
    User.remove({
      username: req.params.username,
      _id: req.body.userId
    }, function(err, user){
      if(err)
        res.send(err);

        if(user.result.n > 0){
          res.json({message: 'User deleted', user })
        } else {
          res.json({error:'Error while deleting user'})
        }
    });
  });

// Card route
// ----------------------------------------------------
router.route('/cards')
.post( (req, res) => {
  var card = new Card();
  card.title = req.body.title;
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
      res.send({ errmsg: err.message});
    }else{
      res.json({ message: card});
   }
  });

})

.get( (req, res) => {
  Card.find( {}, null, {sort: {owner: 1}}, (err, cards) => {
    if (err)
      res.send(err);

    res.json(cards);
  })

});

// show the cards of the owner
router.route('/cards/:owner')
  .get( (req, res) => {
    Card.find({owner: req.params.owner}, (err, cards) => {
      if(err)
        res.send(err);

      res.json(cards);
    })
  });

// show card by id or modify it
router.route('/card/:id')
  .get( (req, res) => {
    Card.find({ _id: req.params.id }, (err, card) => {
    if(err)
      res.send(err);

    res.json(card);
  })
})

  .put( (req, res) => {
    Card.findOne({ owner: req.body.username, _id: req.params.id }, (err, card) => {
        if(err)
          res.send(err);
    // if the card id is incorrect, a message will display and not action will happen
      if(card !== null){
        // also if the card has status has 'done', we don't allow to update cards that are already finished
          if(card.status !== 'done'){
            if(req.body.status)
              card.status = req.body.status;

            if(req.body.title)
              card.title = req.body.title;

            if(req.body.timeEntry)
              card.timeEntry = req.body.timeEntry;

            if(req.body.timeEnd)
              card.timeEnd = req.body.timeEnd;

            if(req.body.estimatedTime)
              card.estimatedTime = req.body.estimatedTime;

            if(req.body.notification)
              card.notification = req.body.notification;

            if(req.body.description)
              card.description = req.body.description;

            card.save((err) => {
              if(err){
                res.json( { err: err.message} );
              } else {
                res.json( { message: 'card updated!'});
              }
            });
          }else{
            res.json( { message: 'Can\'t modify cards that are done'})
          }
      } else {
        res.json( { error: 'An error has just ocurred while updating the card...'})
    }
    })
  });

  router.route('/cards/team/:team')
    .get( (req, res) => {
      Card.find({ownerTeam: req.params.team}, null, {sort: {owner: 1}}, (err, cards) => {
    if(err)
      res.send(err);

    res.json(cards);
    })
  });



module.exports = router;
