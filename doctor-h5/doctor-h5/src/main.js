// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { XAddress,XDialog } from 'vux'
import { isLogin, post, fetch, doRequest } from './api/http'

export default {
  components: {
    XAddress,
    XDialog
  }
}

Vue.config.productionTip = false
Vue.prototype.$isLogin = isLogin;
Vue.prototype.$post = post;
Vue.prototype.$get = fetch;
Vue.prototype.$doRequest = doRequest;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
