const express = require('express');
const router = express.Router();  // get an instance of the express Router
const User = require('../models/user');   // our user model
const Card = require('../models/card');   // our card model

// ROUTES FOR OUR API
// =============================================================================

router.use( function(req, res, next) {
  console.log('From /routes/user');
  next();
});




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





module.exports = router;
