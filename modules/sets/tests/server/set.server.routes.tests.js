'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Set = mongoose.model('Set'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  set;

/**
 * Set routes tests
 */
describe('Set CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Set
    user.save(function () {
      set = {
        name: 'Set name'
      };

      done();
    });
  });

  it('should be able to save a Set if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Set
        agent.post('/api/sets')
          .send(set)
          .expect(200)
          .end(function (setSaveErr, setSaveRes) {
            // Handle Set save error
            if (setSaveErr) {
              return done(setSaveErr);
            }

            // Get a list of Sets
            agent.get('/api/sets')
              .end(function (setsGetErr, setsGetRes) {
                // Handle Sets save error
                if (setsGetErr) {
                  return done(setsGetErr);
                }

                // Get Sets list
                var sets = setsGetRes.body;

                // Set assertions
                (sets[0].user._id).should.equal(userId);
                (sets[0].name).should.match('Set name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Set if not logged in', function (done) {
    agent.post('/api/sets')
      .send(set)
      .expect(403)
      .end(function (setSaveErr, setSaveRes) {
        // Call the assertion callback
        done(setSaveErr);
      });
  });

  it('should not be able to save an Set if no name is provided', function (done) {
    // Invalidate name field
    set.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Set
        agent.post('/api/sets')
          .send(set)
          .expect(400)
          .end(function (setSaveErr, setSaveRes) {
            // Set message assertion
            (setSaveRes.body.message).should.match('Please fill Set name');

            // Handle Set save error
            done(setSaveErr);
          });
      });
  });

  it('should be able to update an Set if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Set
        agent.post('/api/sets')
          .send(set)
          .expect(200)
          .end(function (setSaveErr, setSaveRes) {
            // Handle Set save error
            if (setSaveErr) {
              return done(setSaveErr);
            }

            // Update Set name
            set.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Set
            agent.put('/api/sets/' + setSaveRes.body._id)
              .send(set)
              .expect(200)
              .end(function (setUpdateErr, setUpdateRes) {
                // Handle Set update error
                if (setUpdateErr) {
                  return done(setUpdateErr);
                }

                // Set assertions
                (setUpdateRes.body._id).should.equal(setSaveRes.body._id);
                (setUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sets if not signed in', function (done) {
    // Create new Set model instance
    var setObj = new Set(set);

    // Save the set
    setObj.save(function () {
      // Request Sets
      request(app).get('/api/sets')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Set if not signed in', function (done) {
    // Create new Set model instance
    var setObj = new Set(set);

    // Save the Set
    setObj.save(function () {
      request(app).get('/api/sets/' + setObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', set.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Set with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sets/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Set is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Set which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Set
    request(app).get('/api/sets/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Set with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Set if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Set
        agent.post('/api/sets')
          .send(set)
          .expect(200)
          .end(function (setSaveErr, setSaveRes) {
            // Handle Set save error
            if (setSaveErr) {
              return done(setSaveErr);
            }

            // Delete an existing Set
            agent.delete('/api/sets/' + setSaveRes.body._id)
              .send(set)
              .expect(200)
              .end(function (setDeleteErr, setDeleteRes) {
                // Handle set error error
                if (setDeleteErr) {
                  return done(setDeleteErr);
                }

                // Set assertions
                (setDeleteRes.body._id).should.equal(setSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Set if not signed in', function (done) {
    // Set Set user
    set.user = user;

    // Create new Set model instance
    var setObj = new Set(set);

    // Save the Set
    setObj.save(function () {
      // Try deleting Set
      request(app).delete('/api/sets/' + setObj._id)
        .expect(403)
        .end(function (setDeleteErr, setDeleteRes) {
          // Set message assertion
          (setDeleteRes.body.message).should.match('User is not authorized');

          // Handle Set error error
          done(setDeleteErr);
        });

    });
  });

  it('should be able to get a single Set that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Set
          agent.post('/api/sets')
            .send(set)
            .expect(200)
            .end(function (setSaveErr, setSaveRes) {
              // Handle Set save error
              if (setSaveErr) {
                return done(setSaveErr);
              }

              // Set assertions on new Set
              (setSaveRes.body.name).should.equal(set.name);
              should.exist(setSaveRes.body.user);
              should.equal(setSaveRes.body.user._id, orphanId);

              // force the Set to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Set
                    agent.get('/api/sets/' + setSaveRes.body._id)
                      .expect(200)
                      .end(function (setInfoErr, setInfoRes) {
                        // Handle Set error
                        if (setInfoErr) {
                          return done(setInfoErr);
                        }

                        // Set assertions
                        (setInfoRes.body._id).should.equal(setSaveRes.body._id);
                        (setInfoRes.body.name).should.equal(set.name);
                        should.equal(setInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Set.remove().exec(done);
    });
  });
});
