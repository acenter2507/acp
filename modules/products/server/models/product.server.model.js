'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  paginate = require('mongoose-paginate'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  // 製品名称
  name: {
    type: String,
    required: '製品名称が必須です。',
    trim: true
  },
  // 製品写真
  image: { type: String },
  // 製品ブランド
  brand: { type: String },
  // 製品型番
  model_number: { type: String },
  // 製品ロット番号
  lot_number: { type: String },
  // 二次元コード
  qr_code: { type: String },
  // 導入年月日
  intro_date: { type: Date },
  // 交換日
  exchange_date: { type: Date },
  created: { type: Date, default: Date.now }
});
ProductSchema.plugin(paginate);

mongoose.model('Product', ProductSchema);
