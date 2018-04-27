'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Combo Schema
 */
var ComboSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Combo name',
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

mongoose.model('Combo', ComboSchema);
