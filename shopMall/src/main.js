// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import axios from 'axios'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

Vue.use(infiniteScroll)
Vue.use(Vuex)
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
})
Vue.filter('currency', currency)
Vue.config.productionTip = false

axios.interceptors.response.use(function (response) {
  //143 -- 登陆过期
  if (response.data.status === '10001' ) {
    console.log(response.data.msg);
    window.location.href = '#/goods';
    // message.error(response.data.errorMsg);
    // setTimeout(function(){
    //   window.location.href = '/';
    // },500)

  }
  return response.data;

}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
