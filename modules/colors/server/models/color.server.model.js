'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Color Schema
 */
var ColorSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Color name',
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

mongoose.model('Color', ColorSchema);
