/**
 * Created by baifan on 2018/5/17.
 */
var express = require('express')
var router = express.Router()
var User = require('./../models/user')

router.get('/test', (req, res, next) => {
  res.send('test111');
})
// 登陆
router.post('/login', (req, res, next) => {
  // var { userName, userPwd } = req.body
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  console.log(param)
  User.findOne(param,(err,doc) => {
    // console.log(doc,err)
    if (err) {
      return res.json({
        status: "1",
        msg: err.message,
        result: []
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        })
        // req.session.user = doc;
        return res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  })
})

// 登出
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  return res.json({
    status: '0',
    msg: '登出成功',
    result: []
  })
})
// 检测是否登录
router.post('/checkLogin', (req, res, next) => {
  // console.log(req.cookies)
  if(req.cookies.userId){
    return res.json({
      status: '0',
      msg: '已经登陆',
      result: {
        userName: req.cookies.userName || ''
      }
    })
  }else{
    return res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

// 查询当前用户的购物车信息
router.post('/cartList', (req, res, next) => {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
      return
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
        return
      }
    }
  })
})

module.exports = router