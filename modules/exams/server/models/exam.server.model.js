'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Exam Schema
 */
var ExamSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  ExamName: {
    type: String,
    default: '',
    trim: true,
    required: 'ExamName cannot be blank'
  },
  ExamType: {
    type: String,
    default: '',
    trim: true,
    required: 'ExamType cannot be blank'
  },
  
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Exam', ExamSchema);
