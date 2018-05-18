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

ColorSchema.statics.setCombo = function (colorId, comboId) {
  return this.findById(colorId).exec(function (err, color) {
    if (err || !color) return;
    color.combo = comboId;
    return color.save();
  });
};

ColorSchema.statics.removeCombo = function (colorId) {
  return this.findById(colorId).exec(function (err, color) {
    if (err || !color) return;
    color.combo = undefined;
    return color.save();
  });
};

mongoose.model('Color', ColorSchema);
