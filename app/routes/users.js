const express = require('express');
const router = express.Router();  // get an instance of the express Router
const User = require('../models/user');   // our user model

// ROUTES FOR OUR API
// =============================================================================

router.use( function(req, res, next) {
  console.log('From /routes/user');
  next();
});

// on routes that end in /users
// ---------------------------------------------------
router.route('/users')
  .get(getUsers)
  .post(createUser)

// on routes that end in /users/:username
// ----------------------------------------------------
router.route('/user/:username')
  .get(getUser)
  .put(updateUser)
  .delete(removeUser)


  async function getUsers(req, res) {
    try {
      await User.find()
        .then( (users) => {
          res.status(200).json(users)
        })
    } catch (err) {
      res.status(503).send(err)
    }
  }

   async function createUser(req, res) {
    try {
      await User.create(req.body)
        .then( (user) => {
          res.status(201).json({ message: user})
        })
    } catch (e) {
      res.status(400).send({ errmsg: e.message})
    }
  }

  async function getUser(req, res) {
    try {
      await User.findOne({username: req.params.username})
        .then((user) => {
          if (user) {
            res.status(200).json({ user: user });
          } else {
            res.status(404).send({ errmsg: 'user not found'});
          }
        })
    } catch (e) {
      res.status(503).send({ errmsg: e})
    }
  }

  async function updateUser(req, res) {
    let bodyIsEmpty = isEmptyObject(req.body)
    if (bodyIsEmpty) {
      return res.status(400).send({ err: `Body can't be empty`})
    }

    let canBeUpdated = checkRequest(req.body)
    if (!canBeUpdated) {
      return res.status(400).send({ err: `the only fields that you can update are the follows: name, team, role, avatar, notificationTime, workTime`})
    }

    try {
        await User.findById(req.params.username)
          .then((user) => {
            fillFields(req.body, user)
            user.save()
          .then((updatedUser) => res.status(200).send({ message: updatedUser }))
        })
    } catch (e) {
      console.err(e);
      res.status(400).send({ err: e })
    }
  }

async function removeUser(req, res) {
  await User.remove({_id: req.params.username})
    .then((user) => {
      if(user.result.n > 0){
        res.status(200).json({message: 'User deleted', user })
      } else {
        res.status(503).json({error:'Error while deleting user'})
      }
    })
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

function checkRequest(req) {
  var allowedFields = ['name', 'team', 'role', 'avatar', 'notificationTime', 'workTime']
  var keys = Object.keys(req)

  for (var i = 0; i < keys.length; i++) {
    if (allowedFields.indexOf(keys[i]) > -1)
      return true
  }

  return false
}

function fillFields(req, user) {
  if (req.name)
    user.name = req.name

  if (req.team)
    user.team = req.team

  if (req.role)
    user.role = req.role

  if (req.avatar)
    user.settings.avatar = req.avatar

  if (req.notificationTime)
    user.settings.notificationTime = req.notificationTime

  if (req.workTime)
    user.settings.workTime = req.workTime

  return user
}

module.exports = router;