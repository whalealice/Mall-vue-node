/**
 * Created by baifan on 2018/5/17.
 */
var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')
var Goods = require('./../models/goods')
var User = require('./../models/user')

// 查询商品列表
router.post('/goods',(req,res,next)=>{
  // console.log(req.body)
  let page = parseInt(req.body.page)
  let pageSize = parseInt(req.body.pageSize)
  let skip = (page-1)*pageSize
  let sort = req.body.sort
  let priceLevel = req.body.priceLevel.toString()
  let params = {}
  var priceGt = ''
  var priceLte = ''
  if (priceLevel !== 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0
        priceLte = 100
        break;
      case '1':
        priceGt = 100
        priceLte= 500
        break;
      case '2':
        priceGt = 500
        priceLte = 1000
        break;
      case '3':
        priceGt = 1000
        priceLte = 5000
        break;
    }
    params = {
      salePrice: {
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodModel = Goods.find(params).skip(skip).limit(pageSize)
  goodModel.sort({'salePrice':sort})
  goodModel.exec((err,doc)=>{
    if (err) {
      res.json({
        status: '1',
        message: err.message
      })
    } else {
      res.json({
        status: '0',
        message: '',
        result: {
          count: doc.length,
          data: doc
        }
      })
    }
  })
})
router.get('/test', function(req, res, next) {
  res.send('test2222');
})
// 返回图片地址
router.get('/images/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../',req.url))
  // console.log(path.join(__dirname, '../',req.url));
})
// 加入到购物车
router.post("/addCart", function (req,res,next) {
  var userId = '19910616',productId = req.body.productId;

  User.findOne({userId:userId}, function (err,userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      console.log("userDoc:"+userDoc);
      if(userDoc){
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){
          userDoc.save(function (err2,doc2) {
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'success add'
              })
            }
          })
        }else{
          Goods.findOne({productId:productId}, function (err1,doc) {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else{
              if(doc){
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2,doc2) {
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'success add',
                      result:'success add'
                    })
                  }
                })
              }
            }
          });
        }
      }
    }
  })
})
module.exports = router;