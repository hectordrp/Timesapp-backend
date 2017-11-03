
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url= 'http://localhost:8080';

// cards

describe('Get all cards: ', ()=>{
  it('Should get all cards in the DB', (done) => {
    chai.request(url)
      .get('/api/cards')
      .end( (err,res) => {
        //console.log(res.body)
        expect(res).to.have.status(200);
        done();
        });
  });
});

describe('Get non-existent card: ', ()=>{
  it('Should give you a error about card not found', (done) => {
    chai.request(url)
      .get('/api/card/randomstring')
      .end( (err,res) => {
        //console.log(res.body)
        expect(res).to.have.status(400);
        done();
        });
  });
});

describe('Get cards from a non-existent user: ', ()=>{
  it('Should give you a error about user not found', (done) => {
    chai.request(url)
      .get('/api/cards/test123')
      .end( (err,res) => {
        //console.log(res.body)
        expect(res).to.have.status(400);
        done();
        });
  });
});


describe('Add an card without required fields: ', () => {
  it(`shouldn't add the card. reason: no required fields has given`, (done) => {
    chai.request(url)
      .post('/api/cards')
      .end( (err, res) => {
        // console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Add an card with a fictional user: ', () =>{
  it(`Should add the card`, (done) => {
    chai.request(url)
      .post('/api/cards')
      .send({username:'test123', title:'Testing...', team:'QA Group'})
      .end( (err,res) => {
        // console.log(res.body);
        let cardId = res.body.card._id;
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Get cars from an user: ', () => {
  it(`Should list all the user's cards`, (done) => {
    chai.request(url)
      .get('/api/cards/test123')
      .end( (err, res) => {
        // console.log(res.body);
        expect(res).to.have.status(200);
        done();
      });
  });
});

// describe('Modify a card: ', () => {
//   it('Should modify the card', (done) => {
//     chai.request(url)
//       .get('/api/cards/test123')
//       .end( (err, res) => {
//         // console.log(res.body);
//         let cardId = res.body.cards[0]._id;
//         expect(res).to.have.status(200);
//         chai.request(url)
//           .put('/api/card/' + cardId)
//           .send({owner: 'test123', status: 'done', })
//
//   })
// })
describe('Delete a card: ', () =>{
  it(`Should delete the card`, (done) => {
    chai.request(url)
      .get('/api/cards/test123')
      .end( (err,res) => {
        let cardId = res.body.cards[0]._id;
        expect(res).to.have.status(200);
        chai.request(url)
          .del('/api/card/' + cardId)
          .send({owner:'test123'})
          .end( (err,res) => {
            // console.log(res.body);
            done();
        });
      });
  });
});
