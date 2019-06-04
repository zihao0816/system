import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/views/homePage/index'
import drugManage from '@/views/drugManage/index'
import drugStorage from '@/views/drugStorage/index'
import addDrug from '@/views/addDrug/index'
import drugCaution from '@/views/drugCaution/index'
import storageManage from '@/views/storageManage/index'
import stateStorage from '@/views/stateStorage/index'
import pullStorage from '@/views/pullStorage/index'
import pushStorage from '@/views/pushStorage/index'
import printing from '@/views/printing/index'
import login from '@/views/login/index'

Vue.use(Router)

function getAbsolutePath () {
  let path = location.pathname
  return path.substring(0, path.lastIndexOf('/') + 1)
}

export default new Router({
  mode: 'history',
  base: getAbsolutePath(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {//首页
      path: '/homePage',
      name: 'homePage',
      component: homePage
    },
    {//药房管理
      path: '/drugManage',
      name: 'drugManage',
      component: drugManage
    },
    {//药品库
      path: '/drugStorage',
      name: 'drugStorage',
      component: drugStorage
    },
    {//新增药品
      path: '/addDrug',
      name: 'addDrug',
      component: addDrug
    },
    {//预警药品
      path: '/drugCaution',
      name: 'drugCaution',
      component: drugCaution
    },
    {//库房管理
      path: '/storageManage',
      name: 'storageManage',
      component: storageManage
    },
    {//库房状态
      path: '/stateStorage',
      name: 'stateStorage',
      component: stateStorage
    },
    {//出库
      path: '/pullStorage',
      name: 'pullStorage',
      component: pullStorage
    },
    {//入库
      path: '/pushStorage',
      name: 'pushStorage',
      component: pushStorage
    },
    {//打印订单
      path: '/printing',
      name: 'printing',
      component: printing
    }
  ]
})
