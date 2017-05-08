'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  coursename: {
    type: String,
    default: '',
    trim: true,
    required: 'coursename cannot be blank'
  },
  departmentCourse: {
    type: String,
    default: '',
    trim: true,
    required: 'Department cannot be blank'
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

mongoose.model('Course', CourseSchema);
