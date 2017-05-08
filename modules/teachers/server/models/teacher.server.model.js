'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Teacher Schema
 */
var TeacherSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  FirstName: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },

  LastName: {
    type: String,
    default: '',
    trim: true,
    required: 'LastName cannot be blank'
  },

  Department: {
    type: String,
    default: '',
    trim: true,
    required: 'Department cannot be blank'
  },

  Position: {
    type: String,
    default: '',
    trim: true,
    required: 'Position cannot be blank'
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

mongoose.model('Teacher', TeacherSchema);
