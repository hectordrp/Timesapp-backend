
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url= 'http://localhost:3000';

// users

describe('Get all users: ', ()=>{
  it('Should get all users in the DB', (done) => {
    chai.request(url)
      .get('/api/users')
      .end( (err,res) => {
        //console.log(res.body)
        expect(res).to.have.status(200);
        done();
        });
  });
});

describe('Get non-existent user: ', ()=>{
  it('Should give you a error about user not found', (done) => {
    chai.request(url)
      .get('/api/user/unknowUser123')
      .end( (err,res) => {
        //console.log(res.body)
        expect(res).to.have.status(400);
        done();
        });
  });
});


describe('Add an user: ', () =>{
  it(`Should add the user`, (done) => {
    chai.request(url)
      .post('/api/users')
      .send({username:'test123', email:'test@test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Add an user with error 1: ', () =>{
  it(`shouldn't add the user, reason: username exists`, (done) => {
    chai.request(url)
      .post('/api/users')
      .send({username:'test123', email:'test@test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Add an user with error 2: ', () =>{
  it(`shouldn't add the user, reason: username's length`, (done) => {
    chai.request(url)
      .post('/api/users')
      .send({username:'test', email:'test@test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Add an user with error 3: ', () =>{
  it(`shouldn't add the user, reason: email syntax error`, (done) => {
    chai.request(url)
      .post('/api/users')
      .send({username:'test123', email:'test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Add an user with error 4: ', () =>{
  it(`shouldn't add the user, reason: email syntax error`, (done) => {
    chai.request(url)
      .post('/api/users')
      .send({username:'test123', email:'test$@test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Get test123 user info: ', () => {
  it('Should list test123 information', (done) => {
    chai.request(url)
      .get('/api/user/test123')
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(200);
        done();
      });
  });
});

describe('Update the user fields: ', () => {
  it('Should update the user fields: name, notificationTime, workTime', (done) => {
    chai.request(url)
      .get('/api/user/test123')
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(200);
        chai.request(url)
          .put('/api/user/test123')
          .send({name: 'testsito', notificationTime: 4, workTime: 10})
          .end( (err,res) => {
            //console.log(res.body);
            expect(res).to.have.status(200);
            chai.request(url)
              .get('/api/user/test123')
              .end( (err,res) => {
                //console.log(res.body);
                expect(res).to.have.status(200);
                done();
              });
          });
      });
  });
});

describe('Update the user field with error: ', () => {
  it(`shouldn't update the user at all. reason: invalid field`, (done) =>{
    chai.request(url)
    .get('/api/user/test123')
    .end( (err,res) => {
      //console.log(res.body);
      expect(res).to.have.status(200);
      chai.request(url)
        .put('/api/user/test123')
        .send({username:"SuperTest", email: 'unemail@gmail.com', role: 'admin', _id: 'MyId', team: 'LosDelNorte'})
        .end( (err,res) => {
          //console.log(res.body);
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});

describe('Delete user wih username test123: ', () =>{
  it(`Should delete the username test123`, (done) => {
    chai.request(url)
      .get('/api/user/test123')
      .end( (err,res) => {
        //console.log(res.body);
        let userId = res.body.user[0]._id;
        expect(res).to.have.status(200);
        chai.request(url)
          .del('/api/user/test123')
          .send({username:'test123', userId: userId})
          .end( (err,res) => {
            //console.log(res.body);
            expect(res).to.have.status(200);
            chai.request(url)
              .get('/api/user/test123')
              .end( (err,res) => {
                //console.log(res.body);
                expect(res).to.have.status(400);
                done();
              });
          });
      });
  });
});
