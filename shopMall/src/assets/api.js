/**
 * Created by baifan on 2018/5/18.
 */
const host = '/api'
const Api = {
  // 登陆
  Login: host + '/users/login',
  // 登出
  logOut: host + '/users/logout',
  // 检查是否登录
  checkLogin: host + '/users/checkLogin',
  // 商品列表
  fetchGoods: host + '/goods/list',
  // 添加购物车
  addCart: host + '/goods/addCart',
  // 用户购物车列表
  cartList: host + '/users/cartList',
  // 用户购物车删除
  cartDel: host + '/users/cartDel',
  // 用户地址列表 userAddress
  fetchAddress: host + '/users/userAddress',
  // 用户设置默认地址 defaultAddress
  // defaultAddress: host + '/users/defaultAddress',
}
export default Api
