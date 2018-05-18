/**
 * Created by baifan on 2018/5/17.
 */
var express = require('express')
var router = express.Router()
var User = require('./../models/user')

router.get('/test', function(req, res, next) {
  res.send('test111');
})
// 登陆
router.post('/login', function(req, res, next) {
  // var { userName, userPwd } = req.body
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  console.log(param)
  User.findOne(param,(err,doc) => {
    console.log(doc,err)
    if (err) {
      res.json({
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
        res.json({
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

module.exports = router