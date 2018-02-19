const express = require('express');
const router = express.Router();  // get an instance of the express Router
const User = require('../models/user');   // our user model

// ROUTES FOR OUR API
// =============================================================================

router.use( function(req, res, next) {
  next();
});

// on routes that end in /users
// ---------------------------------------------------
router.route('/users')
  .get(getUsers)
  .post(createUser)

// on routes that end in /users/:username
// ----------------------------------------------------
router.get('/user/:username', getUser)

  // on routes that end in /users/:id
  // ----------------------------------------------------
router.route('/user/:id')
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
        await User.findById(req.params.id)
          .then((user) => {
            fillFields(req.body, user)
            user.save()
          .then((updatedUser) => res.status(200).send({ user: updatedUser }))
        })
    } catch (e) {
      console.error(e);
      res.status(400).send({ err: e })
    }
  }

async function removeUser(req, res) {
  try {
    await User.remove({_id: req.params.id})
      .then((user) => {
        if(user.result.n > 0){
          res.status(200).json({message: 'User deleted', user })
        } else {
          res.status(503).json({error:'Error while deleting user'})
        }
      })
  } catch (e) {
      res.status(503).send({ errmsg: e})
  }
}

// Return false if the object (req.body) is empty //
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// Check if the fields provided in the request can be modified //
function checkRequest(req) {
  var allowedFields = ['name', 'team', 'role', 'avatar', 'notificationTime', 'workTime']
  var keys = Object.keys(req)

  for (var i = 0; i < keys.length; i++) {
    // the result should return > -1 if the request key appears in the allowedFields array //
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
