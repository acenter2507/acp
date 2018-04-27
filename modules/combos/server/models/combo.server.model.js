'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  paginate = require('mongoose-paginate'),
  Schema = mongoose.Schema;

/**
 * Combo Schema
 */
var ComboSchema = new Schema({
  // セット名称
  name: {
    type: String,
    required: 'セット名称が必須です。',
    trim: true
  },
  // セット組カラーコード
  color_code: { type: String },
  // セット年月日
  datetime: { type: Date },
  // セット担当者
  author: { type: String },
  // 減菌年月日
  sterilize_date: { type: Date },
  created: { type: Date, default: Date.now }
});
ComboSchema.plugin(paginate);

mongoose.model('Combo', ComboSchema);
