/**
 * Created by baifan on 2018/5/16.
 */
var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var goods = require('./routes/goods')
var users = require('./routes/user')

app.use(bodyParser.json())
app.use(cookieParser())
// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall')

mongoose.connection.on("connected",()=>{
  console.log('MongoDB connected success.')
})

mongoose.connection.on("error", () => {
  console.log("MongoDB connected fail.")
})

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connected disconnected.")
})

// 全局拦截是否登录
app.use(function (req,res,next) {
  if(req.cookies.userId){
    return next()
  }else{
    // 登录 登出 商品列表 接口不用拦截
    // console.log(req.originalUrl.indexOf('/goods/images')>-1)
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path == '/goods/list' || req.originalUrl.indexOf('/goods/images')>-1){
      return next()
    }else{
      return res.json({
        status: '10001',
        msg: '当前未登录',
        result: ''
      })
    }
  }
});

app.use('/goods',goods)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  return next(err)
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  return res.render('error')
});

var server = app.listen(9090, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
});