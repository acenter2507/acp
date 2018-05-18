'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  paginate = require('mongoose-paginate'),
  Schema = mongoose.Schema;

/**
 * Color Schema
 */
var ColorSchema = new Schema({
  // カラー名
  name: {
    type: String,
    required: 'カラー名称が必須です。',
    trim: true
  },
  // コード
  code: { type: String },
  // カラー
  color: { type: String },
  combo: { type: Schema.ObjectId, ref: 'Combo' }
});
ColorSchema.plugin(paginate);

mongoose.model('Color', ColorSchema);
