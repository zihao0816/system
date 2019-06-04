import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/login/index'
import explain from '@/views/explain/index'
import doctorDetails from '@/views/doctorDetails/index'
import cash from '@/views/cash/index'
import rule from '@/views/rule/index'
import hospital from '@/views/hospitalList/index'
import register from '@/views/register/index'



Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {//注册
      path: '/login',
      name: 'index',
      component: index
    },
    {//登录
      path: '/register',
      name: 'register',
      component: register
    },
    {//说明
      path: '/explain',
      name: 'explain',
      component: explain
    },
    {//提现列表
      path: '/doctorDetails',
      name: 'doctorDetails',
      component: doctorDetails
    },
    {//提现详情
      path: '/cash',
      name: 'cash',
      component: cash
    },
    {//缴税说明
      path: '/rule',
      name: 'rule',
      component: rule
    },
    {//机构列表
      path: '/hospitalList',
      name: 'hospital',
      component: hospital
    },
  ]
})
