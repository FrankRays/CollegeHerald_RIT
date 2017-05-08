'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Exam = mongoose.model('Exam'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, exam;

/**
 * Exam routes tests
 */
describe('Exam CRUD tests', function () {

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

    // Save a user to the test db and create new exam
    user.save(function () {
      exam = {
        title: 'Exam Title',
        content: 'Exam Content'
      };

      done();
    });
  });

  it('should be able to save an exam if logged in', function (done) {
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

        // Save a new exam
        agent.post('/api/exams')
          .send(exam)
          .expect(200)
          .end(function (examSaveErr, examSaveRes) {
            // Handle exam save error
            if (examSaveErr) {
              return done(examSaveErr);
            }

            // Get a list of exams
            agent.get('/api/exams')
              .end(function (examsGetErr, examsGetRes) {
                // Handle exam save error
                if (examsGetErr) {
                  return done(examsGetErr);
                }

                // Get exams list
                var exams = examsGetRes.body;

                // Set assertions
                (exams[0].user._id).should.equal(userId);
                (exams[0].title).should.match('Exam Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an exam if not logged in', function (done) {
    agent.post('/api/exams')
      .send(exam)
      .expect(403)
      .end(function (examSaveErr, examSaveRes) {
        // Call the assertion callback
        done(examSaveErr);
      });
  });

  it('should not be able to save an exam if no title is provided', function (done) {
    // Invalidate title field
    exam.title = '';

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

        // Save a new exam
        agent.post('/api/exams')
          .send(exam)
          .expect(400)
          .end(function (examSaveErr, examSaveRes) {
            // Set message assertion
            (examSaveRes.body.message).should.match('Title cannot be blank');

            // Handle exam save error
            done(examSaveErr);
          });
      });
  });

  it('should be able to update an exam if signed in', function (done) {
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

        // Save a new exam
        agent.post('/api/exams')
          .send(exam)
          .expect(200)
          .end(function (examSaveErr, examSaveRes) {
            // Handle exam save error
            if (examSaveErr) {
              return done(examSaveErr);
            }

            // Update exam title
            exam.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing exam
            agent.put('/api/exams/' + examSaveRes.body._id)
              .send(exam)
              .expect(200)
              .end(function (examUpdateErr, examUpdateRes) {
                // Handle exam update error
                if (examUpdateErr) {
                  return done(examUpdateErr);
                }

                // Set assertions
                (examUpdateRes.body._id).should.equal(examSaveRes.body._id);
                (examUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of exams if not signed in', function (done) {
    // Create new exam model instance
    var examObj = new Exam(exam);

    // Save the exam
    examObj.save(function () {
      // Request exams
      request(app).get('/api/exams')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single exam if not signed in', function (done) {
    // Create new exam model instance
    var examObj = new Exam(exam);

    // Save the exam
    examObj.save(function () {
      request(app).get('/api/exams/' + examObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', exam.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single exam with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/exams/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Exam is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single exam which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent exam
    request(app).get('/api/exams/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No exam with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an exam if signed in', function (done) {
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

        // Save a new exam
        agent.post('/api/exams')
          .send(exam)
          .expect(200)
          .end(function (examSaveErr, examSaveRes) {
            // Handle exam save error
            if (examSaveErr) {
              return done(examSaveErr);
            }

            // Delete an existing exam
            agent.delete('/api/exams/' + examSaveRes.body._id)
              .send(exam)
              .expect(200)
              .end(function (examDeleteErr, examDeleteRes) {
                // Handle exam error error
                if (examDeleteErr) {
                  return done(examDeleteErr);
                }

                // Set assertions
                (examDeleteRes.body._id).should.equal(examSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an exam if not signed in', function (done) {
    // Set exam user
    exam.user = user;

    // Create new exam model instance
    var examObj = new Exam(exam);

    // Save the exam
    examObj.save(function () {
      // Try deleting exam
      request(app).delete('/api/exams/' + examObj._id)
        .expect(403)
        .end(function (examDeleteErr, examDeleteRes) {
          // Set message assertion
          (examDeleteRes.body.message).should.match('User is not authorized');

          // Handle exam error error
          done(examDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Exam.remove().exec(done);
    });
  });
});
