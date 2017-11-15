

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
        res.status(400).send({ errmsg: err.message});
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

// on routes that end in /users/:username
// ----------------------------------------------------

router.route('/user/:username')
  .get( (req, res) => {
    User.find({username: req.params.username}, (err, user) => {
      if(err)
        res.send(err);

      if(user.length === 0){
        res.status(400).send({ errmsg: 'user not found'});
      } else {
      res.json({user: user});
      }
    })
  })

  .put( (req, res) => {
    User.findOne({username: req.params.username}, (err, user) => {
        if(err)
          res.send(err);
  //If user exist and the request has parameters it will modify the user
      if(user !== null && Object.keys(req.body).length > 0){
        let canBeUpdated = false;
        if(req.body.name)
          canBeUpdated = true;
          user.name = req.body.name;

        if(req.body.notificationTime)
          canBeUpdated = true;
          user.settings.notificationTime = req.body.notificationTime;

        if(req.body.workTime)
          canBeUpdated = true;
          user.settings.workTime = req.body.workTime;

        if(canBeUpdated){
          user.save((err) => {
            if(err){
              res.status(400).json({ error: err.message});
            } else {
              res.json( { message: 'User has been updated!'});
            }
          });
        } else {
          res.status(400).json({error: 'only name, notificationTime, workTime can be edited'})
        }

      } else {
        res.status(400).json( { error: 'An error has just ocurred while updating...'})
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
          res.status(200).json({message: 'User deleted', user })
        } else {
          res.status(400).json({error:'Error while deleting user'})
        }
    });
  });

// Card route
// ----------------------------------------------------
router.route('/cards')
.post( (req, res) => {
  var card = new Card();
  card.title = req.body.title;
  card.owner = req.body.owner;

  if(req.body.ownerTeam)
    card.ownerTeam = req.body.ownerTeam;

  if(req.body.estimatedTime)
    card.estimatedTime = req.body.estimatedTime;

  if(req.body.notification)
    card.notification = req.body.notification;

  if(req.body.description)
    card.description = req.body.description;

  card.save( (err) => {
    if(err){
      res.status(400).send({ errmsg: err.message});
    }else{
      res.json({ card: card});
   }
  });

})

.get( (req, res) => {
  Card.find( {}, null, {sort: {owner: 1}}, (err, cards) => {
    if (err){
      res.send({error: err});
      return next(err);
    }
    res.json({cards: cards});
  })

});

// show the cards of the owner
router.route('/cards/:owner')
  .get( (req, res) => {
    Card.find({owner: req.params.owner}, (err, cards) => {
      if(err)
        res.send(err);

      if(cards.length > 0){
        res.json({cards: cards});
      }else{
        res.status(400).send('Wrong user')
      }

    })
  });

// show card by id, modify it or delete it
router.route('/card/:id')
  .get( (req, res) => {
    Card.find({ _id: req.params.id }, (err, card) => {
    if(err)
      res.send(err);

    if(card.length > 0){
      res.json({card: card});
    }else{
      res.status(400).send('card not found');
    }
  })
})

  .put( (req, res) => {
    Card.findOne({ owner: req.body.owner, _id: req.params.id }, (err, card) => {
        if(err){
          res.send(err);
        }
    // if the card id is incorrect, a message will display and not action will happen
      if(card !== null){
        var username = req.body.owner;
        // also if the card has status has 'done', we don't allow to update cards that are already finished
          if(card.status !== 'done'){
            let canBeUpdated = false;
            if(req.body.status)
              canBeUpdated = true;
              card.status = req.body.status;

            if(req.body.title)
              canBeUpdated = true;
              card.title = req.body.title;

            if(req.body.timeEntry)
              canBeUpdated = true;
              card.timeEntry = req.body.timeEntry;

            if(req.body.timeEnd)
              canBeUpdated = true;
              card.timeEnd = req.body.timeEnd;

            if(req.body.estimatedTime)
              canBeUpdated = true;
              card.estimatedTime = req.body.estimatedTime;

            if(req.body.notification)
              canBeUpdated = true;
              card.notification = req.body.notification;

            if(req.body.description)
              canBeUpdated = true;
              card.description = req.body.description;

            if(canBeUpdated){
              card.save((err) => {
                if(err){
                  res.status(400).json( { err: err.message} );
                } else {
                  res.json( { message: 'card updated!'});
                  req.io.sockets.emit('mutation', username);
                }
              });
            }else{
              res.status(400).json( { error: 'Only the follow fields can be updated: status,title,timeEntry,timeEndestimated,Timenotification,description '})
            }
          }else{
            res.status(400).json( { message: 'Can\'t modify cards that are done'})
          }
      } else {
        res.status(400).json( { error: 'id card not found'})
    }
    })
  })

  .delete( (req, res) => {
    Card.remove({
      _id: req.params.id,
      owner: req.body.owner
    }, function(err, card){
      if(err)
        res.send(err);
        if(card.result.n > 0){
          res.status(200).json({message: 'Card deleted', card })
        } else {
          res.status(400).json({error:'Error while deleting the card'})
        }
    });
  });

  router.route('/cards/team/:team')
    .get( (req, res) => {
      Card.find({ownerTeam: req.params.team}, null, {sort: {owner: 1}}, (err, cards) => {
    if(err)
      res.send(err);

    res.json({ cards:cards});
    })
  });



module.exports = router;
