'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  FirstName: {
    type: String,
    default: '',
    trim: true,
    required: 'FirstName cannot be blank'
  },

  SecondName: {
    type: String,
    default: '',
    trim: true,
    required: 'SecondName cannot be blank'
  },

  StudentID: {
    type: String,
    default: '',
    trim: true,
    required: 'StudentID cannot be blank'
  },

  StudentDOB: {
    type: Date,
    default: '',
    required: 'Date of Birth cannot be blank'
  },

  StudentBatch: {
    type: String,
    default: '',
    trim: true,
    required: 'Student Batch cannot be blank'
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

mongoose.model('Student', StudentSchema);
