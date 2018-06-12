/**
 * Created by baifan on 2018/5/17.
 */
var express = require('express')
var router = express.Router()
var User = require('./../models/user')
require('./../util/util')

router.get('/test', (req, res, next) => {
  res.send('test111');
})
// 登陆
router.post('/login', (req, res, next) => {
  // var { userName, userPwd } = req.body
  var param = {
    'userName': req.body.userName,
    'userPwd': req.body.userPwd
  }
  console.log(param)
  User.findOne(param,(err,doc) => {
    console.log(doc,err)
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
  User.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

//购物车删除 - 修改数量
router.post('/cartDel', (req, res, next) => {
  var userId = req.cookies.userId,
      productId = req.body.productId;
  console.log(req.body.act)
  // 删除
  if (req.body.act === 'delete'){
    User.update({'userId': userId}, {
      $pull:{
        'cartList':{
          'productId': productId
        }
      }
    },(err,doc)=>{
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if (doc) {
          res.json({
            status: '0',
            msg: '删除成功!',
            result: ''
          })
        }
      }
    })
  }
  else if(req.body.act === 'edit'){
    var productNum = req.body.productNum,
        checked = req.body.checked;
    User.update({'userId': userId, "cartList.productId":productId}, {
      "cartList.$.productNum":productNum,
      "cartList.$.checked":checked
    },(err,doc)=>{
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if (doc) {
          res.json({
            status: '0',
            msg: '修改数量成功!',
            result: ''
          })
        }
      }
    })
  }
  else if (req.body.act === 'all'){
    var checkAll = req.body.checkAll?'1':'0';
    User.findOne({'userId': userId},(err,user)=>{
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if(user){
          user.cartList.forEach((item)=>{
            item.checked = checkAll;
          })
          user.save((err,doc)=>{
            if(err){
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              })
            }else {
              if(doc){
                res.json({
                  status: '0',
                  msg: '全选按钮设置成功!',
                  result: ''
                })
              }
            }
          })
        }
      }
    })
  }
});

// 用户地址管理
router.post('/userAddress',(req,res,next)=>{
  var userId = req.cookies.userId,
      act = req.body.act;

  if(act === 'list'){
    // 查询列表
    User.findOne({'userId': userId},(err,doc)=>{
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if (doc) {
          res.json({
            status: '0',
            msg: '',
            result: doc.addressList
          })
        }
      }
    })
  }
  else if (act === 'set'){
    // 设置用户默认地址
    var addressId = req.body.addressId;
    User.findOne({'userId': userId},(err,doc)=>{
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if(doc){
          doc.addressList.forEach((item)=>{
            if(item.addressId === addressId){
              item.isDefault = true
            } else{
              item.isDefault = false
            }
          })
          doc.save((err,doc)=>{
            if(err){
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              })
            } else {
              res.json({
                status: '0',
                msg: '修改默认地址成功!',
                result: ''
              })
            }
          })
        }
      }
    })
  }
  else if (act === 'delete'){
    var addressId = req.body.addressId;
    User.update({'userId': userId},{
      $pull: {
        'addressList': {
          'addressId': addressId
        }
      }
    },(err,doc)=>{
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if (doc) {
          res.json({
            status: '0',
            msg: '删除成功!',
            result: ''
          })
        }
      }
    })
  }
});

router.post('/payMent',(req,res,next)=>{
  var userId = req.cookies.userId,
      addressId = req.body.addressId,
      orderTotal = req.body.orderTotal;
  User.findOne({'userId':userId},(err,doc)=>{
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else {
      var address = '',goodsList = [];
      if(doc){
        //获取用户购物车的购买商品
        doc.cartList.forEach((item)=>{
          if(item.checked === '1' ){
            goodsList.push(item)
          }
        });
        //获取当前用户的地址信息
        doc.addressList.forEach((item)=>{
          if(item.addressId === addressId ){
            address = item
          }
        })
        var platform = '622';
        var r1 = Math.floor(Math.random()*10);
        var r2 = Math.floor(Math.random()*10);
        var sysDate = new Date().Format('yyyyMMddhhmmss');
        var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
        var orderId = platform+r1+sysDate+r2;
        var order = {
          orderId: orderId,
          orderTotal: orderTotal,
          addressInfo: address,
          goodsList: goodsList,
          orderStatus:'1',
          createDate: createDate
        };
        doc.orderList.push(order);

        doc.save((err,doc) =>{
          if(err){
            res.json({
              status: "1",
              msg: err.message,
              result: ''
            });
          }else{
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId: order.orderId,
                orderTotal: order.orderTotal
              }
            });
          }
        });

      }
    }
  })
})

router.post('/orderDetail',(req,res,next)=>{
  var userId = req.cookies.userId,
    orderId = req.body.orderId;
  User.findOne({'userId':userId},(err,doc)=>{
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }
    else {
      var orderList = doc.orderList;
      if (orderList.length > 0) {
        var itemList ='';
        orderList.forEach((item)=>{
          if(item.orderId === orderId ){
            itemList = item;
          }
        });
        res.json({
          status: '0',
          msg: '',
          result: itemList
        })
      }else{
        res.json({
          status:'120001',
          msg:'当前用户未创建订单',
          result:[]
        });
      }

    }
  })
});






module.exports = router