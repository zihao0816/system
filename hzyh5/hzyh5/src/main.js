// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import websdk from 'easemob-websdk' //环信IM
import router from './router'
import { isLogin, doRequest, toastMsg } from './api/http'
import store from './store'
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'
import { initWebSocket, sendMessage, firstData, secondDatas, websocketonmessage, initwebsoct, guid, sendsocketping, jiantingsocket } from './api/im'
import {
  Alert,//弹窗alert
  Toast,//短语提示
  Loading,//loading
  Previewer,//照片窗口（舌照，面照预览）
  Tabbar, TabbarItem, //底部导航
  XButton,//按钮
  XInput,//输入框
  XNumber,//number格式输入框
  XSwitch,//开关
  XTextarea,//textarea
  CellBox,
  Qrcode,//二维码
  Popup,//开关并控制显yin
  Datetime,//日期（生日选择）
  FormPreview, //订单列表
  Tab, TabItem, //选项卡
  Checklist, //复选框
  Selector, //下拉框
  Group,    //外部包裹
  Scroller,   //上拉加載
  LoadMore   //上拉加載
} from 'vux'

import { CheckboxGroup, Checkbox, Radio, RadioGroup, Button, Input, Icon, Upload, Select, Option } from 'element-ui';
import {sendPrivateText,sendPrivateImg,sendPrivateFile,msgDatas,login,register} from '../src/im/index'

let webIM = window.WebIM = websdk

var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})
import 'element-ui/lib/theme-chalk/index.css';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import VueScroller from 'vue-scroller'
import App from './App'

Vue.prototype.$WebIM = webIM
Vue.prototype.$sendPrivateText = sendPrivateText
Vue.prototype.$sendPrivateImg = sendPrivateImg
Vue.prototype.$sendPrivateFile = sendPrivateFile
Vue.prototype.$msgDatas = msgDatas
Vue.prototype.$login = login;
Vue.prototype.$register = register;


Vue.prototype.$isLogin = isLogin;
Vue.prototype.$doRequest = doRequest;
Vue.prototype.$toastMsg = toastMsg;

Vue.prototype.$initWebSocket = initWebSocket;
Vue.prototype.$sendMessage = sendMessage;
Vue.prototype.$firstData = firstData;
Vue.prototype.$secondDatas = secondDatas;
Vue.prototype.$websocketonmessage = websocketonmessage;
Vue.prototype.$initwebsoct = initwebsoct;
Vue.prototype.$guid = guid;
Vue.prototype.$sendsocketping = sendsocketping;
Vue.prototype.$jiantingsocket = jiantingsocket;

Vue.use(WeVue)


Vue.component(Select.name, Select);
Vue.component(Option.name, Option);

Vue.component(Checkbox.name, Checkbox);
Vue.component(CheckboxGroup.name, CheckboxGroup);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(Button.name, Button);
Vue.component(Input.name, Input);
Vue.component(Icon.name, Icon);
Vue.component(Upload.name, Upload);

Vue.config.productionTip = false

Vue.component('alert', Alert)
Vue.component('Toast', Toast)
Vue.component('loading', Loading)
Vue.component('previewer', Previewer)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('x-button', XButton)
Vue.component('x-input', XInput)
Vue.component('x-number', XNumber)
Vue.component('x-switch', XSwitch)
Vue.component('x-textarea', XTextarea)
Vue.component('cell-box', CellBox)
Vue.component('qrcode', Qrcode)
Vue.component('popup', Popup)
Vue.component('datetime', Datetime)
Vue.component('form-preview', FormPreview)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('checklist', Checklist)
Vue.component('selector', Selector)
Vue.component('scrollervux', Scroller)
Vue.component('group', Group)
Vue.component('load-more', LoadMore)

//Vue.use(Viewer) 默认配置写法
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    loop: false,
    navbar: 0,
    toolbar: 0,
    title: 0,
    show: function(){
    }
  }
})
const imConn = new webIM.connection({
  isMultiLoginSessions: webIM.config.isMultiLoginSessions,
  https: typeof webIM.config.https === 'boolean' ? webIM.config.https : location.protocol === 'https:',
  url: webIM.config.xmppURL,
  isAutoLogin: true,
  heartBeatWait: webIM.config.heartBeatWait,
  autoReconnectNumMax: webIM.config.autoReconnectNumMax,
  autoReconnectInterval: webIM.config.autoReconnectInterval,
  apiUrl: webIM.config.apiURL
})
Vue.prototype.$imConn = imConn

Vue.use(VueScroller)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})