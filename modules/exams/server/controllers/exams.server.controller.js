'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Exam = mongoose.model('Exam'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a exam
 */
exports.create = function (req, res) {
  var exam = new Exam(req.body);
  exam.user = req.user;

  exam.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exam);
    }
  });
};

/**
 * Show the current exam
 */
exports.read = function (req, res) {
  res.json(req.exam);
};

/**
 * Update a exam
 */
exports.update = function (req, res) {
  var exam = req.exam;

  exam.title = req.body.title;
  exam.content = req.body.content;

  exam.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exam);
    }
  });
};

/**
 * Delete an exam
 */
exports.delete = function (req, res) {
  var exam = req.exam;

  exam.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exam);
    }
  });
};

/**
 * List of Exams
 */
exports.list = function (req, res) {
  Exam.find().sort('-created').populate('user', 'displayName').exec(function (err, exams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(exams);
    }
  });
};

/**
 * Exam middleware
 */
exports.examByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Exam is invalid'
    });
  }

  Exam.findById(id).populate('user', 'displayName').exec(function (err, exam) {
    if (err) {
      return next(err);
    } else if (!exam) {
      return res.status(404).send({
        message: 'No exam with that identifier has been found'
      });
    }
    req.exam = exam;
    next();
  });
};
