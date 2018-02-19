process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../../server');
const User = require('../models/user');

chai.use(chaiHttp);

describe('Users', () => {

  after((done) => {
    User.collection.drop();
    done();
  });

describe('Get all users: ', () => {
  it('Should get all users in the DB', (done) => {
      chai.request(server)
      .get('/api/users')
      .end( (err, res) => {
        // console.log(res);
        expect(res).to.have.status(200);
        done();
      })
  });
});


describe('Get non-existent user: ', () => {
  it('Should give you a error about user not found', (done) => {
    chai.request(server)
      .get('/api/user/unknowUser123')
      .end( (err,res) => {
        //console.log(res.body)
        expect(res).to.have.status(404);
        done();
        });
  });
});


describe('Add an user: ', () => {
  it(`Should add the user`, (done) => {
    chai.request(server)
      .post('/api/users')
      .send({username:'test123', email:'test@test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(201);
        done();
      });
  });
});

describe('Add an user with error 1: ', () => {
  it(`shouldn't add the user, reason: username exists`, (done) => {
    chai.request(server)
      .post('/api/users')
      .send({username:'test123', email:'test@test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Add an user with error 2: ', () => {
  it(`shouldn't add the user, reason: username's length`, (done) => {
    chai.request(server)
      .post('/api/users')
      .send({username:'test', email:'test@test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Add an user with error 3: ', () => {
  it(`shouldn't add the user, reason: email syntax error`, (done) => {
    chai.request(server)
      .post('/api/users')
      .send({username:'test123', email:'test.com'})
      .end( (err,res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        done();
      });
  });
});

describe('Add an user with error 4: ', () => {
  it(`shouldn't add the user, reason: email syntax error`, (done) => {
    chai.request(server)
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
    chai.request(server)
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
    chai.request(server)
      .get('/api/user/test123')
      .end( (err,res) => {
        expect(res).to.have.status(200);
        let userId = res.body.user._id;
        chai.request(server)
          .put(`/api/user/${userId}`)
          .send({name: 'testsito', notificationTime: 4, workTime: 10})
          .end( (err,res) => {
            //console.log(res.body);
            expect(res).to.have.status(200);
            chai.request(server)
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

describe('Update the allowed user fields: ', () => {
  it(`should update only the allowed field [name, team, role, avatar, notificationTime, workTime]`, (done) =>{
    chai.request(server)
    .get('/api/user/test123')
    .end( (err,res) => {
      expect(res).to.have.status(200);
      let oldUser = res.body.user;
      chai.request(server)
        .put(`/api/user/${oldUser._id}`)
        .send({username:"SuperTest", email: 'unemail@gmail.com', role: 'admin', _id: 'MyId', team: 'LosDelNorte'})
        .end( (err,res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.user.username).to.equal(oldUser.username);
          expect(res.body.user.email).to.equal(oldUser.email);
          expect(res.body.user.role).to.be.a('string', 'admin');
          expect(res.body.user.role).to.be.a('string', 'LosDelNorte');
          done();
        });
    });
  });
});

describe('Delete user wih username test123: ', () => {
  it(`Should delete the username test123`, (done) => {
    chai.request(server)
      .get('/api/user/test123')
      .end( (err,res) => {
        expect(res).to.have.status(200);
        let userId = res.body.user._id;
        chai.request(server)
          .del(`/api/user/${userId}`)
          .end( (err,res) => {
            expect(res).to.have.status(200);
            chai.request(server)
              .get('/api/user/test123')
              .end( (err,res) => {
                expect(res).to.have.status(404);
                done();
              });
          });
      });
  });
});

});
