// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Login from './views/login/index'
import router from './router'
import {doRequest} from './api/http'
import store from './store'
import iView from 'iview'
import axios from 'axios'
import 'iview/dist/styles/iview.css' 
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import md5 from 'js-md5';
import {timestampToTime} from "./api/common";
import service from "./api/request"
import echarts from "echarts"
Vue.prototype.$md5 = md5;
Vue.config.productionTip = false;
Vue.prototype.$doRequest = doRequest;
Vue.prototype.$timestampToTime=timestampToTime;
Vue.prototype.$service=service;
Vue.use(ElementUI);
Vue.use(iView);
router.beforeEach((to,from,next)=>{
  if(sessionStorage.getItem("session")){
    next();
  }else{
    router.push({path:'/historyPrescription'});
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template:'<App/>'
})

