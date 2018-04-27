'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Set Schema
 */
var SetSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Set name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Set', SetSchema);
