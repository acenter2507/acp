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
  // 検索用
  search: { type: String },
  // 製品
  products: [{ type: Schema.ObjectId, ref: 'Product' }],
  created: { type: Date, default: Date.now }
});
ComboSchema.plugin(paginate);

ComboSchema.statics.addProduct = function (comboId, productId) {
  return this.findById(comboId).exec(function (err, combo) {
    if (err || !combo) return;
    combo.products.push(productId);
    return combo.save();
  });
};

ComboSchema.statics.removeProduct = function (comboId, productId) {
  return this.findById(comboId).exec(function (err, combo) {
    if (err || !combo) return;
    combo.products.pull(productId);
    return combo.save();
  });
};

mongoose.model('Combo', ComboSchema);
