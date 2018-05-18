/**
 * Created by baifan on 2018/5/16.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// 定义表结构
var produtSchema = new Schema({
  "productId":{type:String},
  "productName":String,
  "salePrice":Number,
  "checked":String,
  "productNum":Number,
  "productImage":String
});
// 将表的数据结构和表关联起来
// var produtSchema = mongoose.model(表名, 表的数据结构)
module.exports = mongoose.model('Good',produtSchema);