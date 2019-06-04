// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "@babel/polyfill";
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { doRequest} from './api/http'
// import promise from 'es6-promise';
 
// 兼容 Promise
// promise.polyfill();

Vue.config.productionTip = false

import { Button, Select, Pagination,Carousel,CarouselItem } from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Pagination.name, Pagination);
Vue.component(Carousel.name, Carousel);
Vue.component(CarouselItem.name, CarouselItem);
Vue.prototype.$doRequest = doRequest;
/* 或写为
 * Vue.use(Button)
 * Vue.use(Select)
 */

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
