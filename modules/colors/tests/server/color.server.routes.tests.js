'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Color = mongoose.model('Color'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  color;

/**
 * Color routes tests
 */
describe('Color CRUD tests', function () {

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

    // Save a user to the test db and create new Color
    user.save(function () {
      color = {
        name: 'Color name'
      };

      done();
    });
  });

  it('should be able to save a Color if logged in', function (done) {
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

        // Save a new Color
        agent.post('/api/colors')
          .send(color)
          .expect(200)
          .end(function (colorSaveErr, colorSaveRes) {
            // Handle Color save error
            if (colorSaveErr) {
              return done(colorSaveErr);
            }

            // Get a list of Colors
            agent.get('/api/colors')
              .end(function (colorsGetErr, colorsGetRes) {
                // Handle Colors save error
                if (colorsGetErr) {
                  return done(colorsGetErr);
                }

                // Get Colors list
                var colors = colorsGetRes.body;

                // Set assertions
                (colors[0].user._id).should.equal(userId);
                (colors[0].name).should.match('Color name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Color if not logged in', function (done) {
    agent.post('/api/colors')
      .send(color)
      .expect(403)
      .end(function (colorSaveErr, colorSaveRes) {
        // Call the assertion callback
        done(colorSaveErr);
      });
  });

  it('should not be able to save an Color if no name is provided', function (done) {
    // Invalidate name field
    color.name = '';

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

        // Save a new Color
        agent.post('/api/colors')
          .send(color)
          .expect(400)
          .end(function (colorSaveErr, colorSaveRes) {
            // Set message assertion
            (colorSaveRes.body.message).should.match('Please fill Color name');

            // Handle Color save error
            done(colorSaveErr);
          });
      });
  });

  it('should be able to update an Color if signed in', function (done) {
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

        // Save a new Color
        agent.post('/api/colors')
          .send(color)
          .expect(200)
          .end(function (colorSaveErr, colorSaveRes) {
            // Handle Color save error
            if (colorSaveErr) {
              return done(colorSaveErr);
            }

            // Update Color name
            color.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Color
            agent.put('/api/colors/' + colorSaveRes.body._id)
              .send(color)
              .expect(200)
              .end(function (colorUpdateErr, colorUpdateRes) {
                // Handle Color update error
                if (colorUpdateErr) {
                  return done(colorUpdateErr);
                }

                // Set assertions
                (colorUpdateRes.body._id).should.equal(colorSaveRes.body._id);
                (colorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Colors if not signed in', function (done) {
    // Create new Color model instance
    var colorObj = new Color(color);

    // Save the color
    colorObj.save(function () {
      // Request Colors
      request(app).get('/api/colors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Color if not signed in', function (done) {
    // Create new Color model instance
    var colorObj = new Color(color);

    // Save the Color
    colorObj.save(function () {
      request(app).get('/api/colors/' + colorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', color.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Color with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/colors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Color is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Color which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Color
    request(app).get('/api/colors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Color with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Color if signed in', function (done) {
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

        // Save a new Color
        agent.post('/api/colors')
          .send(color)
          .expect(200)
          .end(function (colorSaveErr, colorSaveRes) {
            // Handle Color save error
            if (colorSaveErr) {
              return done(colorSaveErr);
            }

            // Delete an existing Color
            agent.delete('/api/colors/' + colorSaveRes.body._id)
              .send(color)
              .expect(200)
              .end(function (colorDeleteErr, colorDeleteRes) {
                // Handle color error error
                if (colorDeleteErr) {
                  return done(colorDeleteErr);
                }

                // Set assertions
                (colorDeleteRes.body._id).should.equal(colorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Color if not signed in', function (done) {
    // Set Color user
    color.user = user;

    // Create new Color model instance
    var colorObj = new Color(color);

    // Save the Color
    colorObj.save(function () {
      // Try deleting Color
      request(app).delete('/api/colors/' + colorObj._id)
        .expect(403)
        .end(function (colorDeleteErr, colorDeleteRes) {
          // Set message assertion
          (colorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Color error error
          done(colorDeleteErr);
        });

    });
  });

  it('should be able to get a single Color that has an orphaned user reference', function (done) {
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

          // Save a new Color
          agent.post('/api/colors')
            .send(color)
            .expect(200)
            .end(function (colorSaveErr, colorSaveRes) {
              // Handle Color save error
              if (colorSaveErr) {
                return done(colorSaveErr);
              }

              // Set assertions on new Color
              (colorSaveRes.body.name).should.equal(color.name);
              should.exist(colorSaveRes.body.user);
              should.equal(colorSaveRes.body.user._id, orphanId);

              // force the Color to have an orphaned user reference
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

                    // Get the Color
                    agent.get('/api/colors/' + colorSaveRes.body._id)
                      .expect(200)
                      .end(function (colorInfoErr, colorInfoRes) {
                        // Handle Color error
                        if (colorInfoErr) {
                          return done(colorInfoErr);
                        }

                        // Set assertions
                        (colorInfoRes.body._id).should.equal(colorSaveRes.body._id);
                        (colorInfoRes.body.name).should.equal(color.name);
                        should.equal(colorInfoRes.body.user, undefined);

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
      Color.remove().exec(done);
    });
  });
});
