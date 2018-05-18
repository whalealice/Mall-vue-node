/**
 * Created by baifan on 2018/5/17.
 */
var express = require('express')
var router = express.Router()
var Users = require('./../models/user')

router.get('/test', function(req, res, next) {
  res.send('test111');
})

module.exports = router