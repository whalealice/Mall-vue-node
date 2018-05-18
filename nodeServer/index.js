/**
 * Created by baifan on 2018/5/16.
 */
var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var goods = require('./routes/goods')
var users = require('./routes/user')

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall')

mongoose.connection.on("connected",()=>{
  console.log('MongoDB connected success.')
})

mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.")
})

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connected disconnected.")
})

app.use('/goods',goods)
app.use('/users', users)


var server = app.listen(9090, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});