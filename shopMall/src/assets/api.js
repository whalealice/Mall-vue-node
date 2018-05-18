/**
 * Created by baifan on 2018/5/18.
 */
const host = '/api'
const Api = {
  // 登陆
  fetchLogin: host + '/users/login',
  // 商品列表
  fetchGoods: host + '/goods/goods',
  // 添加购物车
  addCart: host + '/goods/addCart',
}
export default Api;