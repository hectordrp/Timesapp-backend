
const express = require('express');
const router = express.Router();  // get an instance of the express Router
const Card = require('../models/card');   // our card model


router.use( (req, res, next) => {
  next();
});


// Card route
// ----------------------------------------------------
router.route('/cards')
  .get(getCards)
  .post(createCard)

// show the cards of the owner
router.route('/cards/:owner')
  .get(getUserCards)

// show card by id, modify it or delete it
router.route('/card/:id')
  .get(getCard)
  .put(updateCard)
  .delete(deleteCard)

// show card by team
router.route('/cards/team/:team')
  .get(getTeamCards)

function getTeamCards(req, res) {
  Card.find({ownerTeam: req.params.team}, null, {sort: {owner: 1}}, (err, cards) => {
    if (err) {
      res.status(400).send({error: err});
      return next(err);
    }

    res.json({ cards:cards});
  })
}

function getCards(req, res, param) {
  Card.find( {}, null, {sort: {owner: 1}}, (err, cards) => {
    if (err) {
      res.status(400).send({error: err});
      return next(err);
    }
    res.status(201).json({cards: cards});
  })
}

function getUserCards(req, res) {
  Card.find({owner: req.params.owner}, (err, cards) => {
    if (err) {
      res.status(400).send({error: err});
      return next(err);
    }

    if(cards.length > 0){
      res.status(200).json({cards: cards});
    }else{
      res.status(400).send(`This user doesn't have any cards`)
    }
  })
}

function getCard(req, res) {
  Card.find({ _id: req.params.id }, (err, card) => {
    if (err) {
      res.status(400).send({error: err});
      return next(err);
    }

    if(card.length > 0){
      res.status(200).json({card: card});
    }else{
      res.status(400).send('card not found');
    }
  })
}

function createCard(req, res) {
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
    if (err) {
      res.status(400).send({ errmsg: err.message});
    } else {
      res.status(200).json({ card: card});
   }
  });
}

function updateCard(req, res) {
  Card.findOne({ owner: req.body.owner, _id: req.params.id }, (err, card) => {
    if (err) {
      res.status(400).send({error: err});
      return next(err);
    }
  // if the card id is incorrect, a message will display and not action will happen
    if (card === null) {
      return res.status(400).json( { error: 'id card not found'})
    }

    var username = req.body.owner;
  // also if the card has status has 'done', we don't allow to update cards that are already finished
    if (card.status === 'done'){
      return res.status(400).json({"error": "Cant modify cards that are done"})
    }

    let canBeUpdated = checkRequest(req, card);

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
  })
}

function deleteCard(req, res) {
  Card.remove({
    _id: req.params.id,
    owner: req.body.owner
  }, (err, card) => {
    if (err) {
      res.status(400).send({error: err});
      return next(err);
    }

      if (card.result.n > 0) {
        res.status(200).json({message: 'Card deleted', card })
      } else {
        res.status(400).json({error:'Error while deleting the card'})
      }
  });
}

function checkRequest(req, card) {
  canBeUpdated = false;
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

  return canBeUpdated
}

module.exports = router;
