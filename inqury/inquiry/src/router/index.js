import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login/index' //登录页
import loginpage from '@/views/loginpage/index' //登录页
import historyPrescription from '@/views/historyPrescription/index' //历史问诊处方
import inquiringPrescriptions from '@/views/inquiringPrescriptions/index'//问诊开方
import alreadyTreated from '@/views/alreadyTreated/index'//已问诊
import membershipCard from '@/views/membershipCard/index'//会员卡
import registrationHall from '@/views/registrationHall/index'//挂号大厅
import therapy from '@/views/registrationHall/therapy/index'//挂号大厅-理疗开方
import inquiry from '@/views/registrationHall/inquiry/index'//挂号大厅-问诊挂号
import registered from '@/views/registrationHall/registered/index'//挂号大厅-问诊挂号 ，使用IView
import system from '@/views/system/index'//系统设置
import account from '@/views/system/account/index'//系统设置二级路由的账户管理
import docList from '@/views/system/docList/index'//系统设置二级路由的医生列表
import briefing from '@/views/system/briefing/index'//系统设置二级路由的简报
import administration from '@/views/system/administration/index'//系统设置二级路由的理疗管理
import project from '@/views/system/administration/project/index'//理疗管理的二级路由理疗项目管理
import physiotherapist from '@/views/system/administration/physiotherapist/index'//理疗管理的二级路由理疗师管理
import therapyPrescription from '@/views/therapyPrescription/index'//历史理疗处方

Vue.use(Router)
function getAbsolutePath () {
  let path = location.pathname
  return path.substring(0, path.lastIndexOf('/') + 1)
}

export default new Router({
  mode: 'history',
  base: getAbsolutePath(),
  routes: [
    {//首页
      path: '/',
      name: 'loginpage ',
      component: loginpage
    },
    {
      path: '/',
      name: 'login ',
      component: login
    },
    {
      //历史问诊处方
      path:'/historyPrescription',
      name:'historyPrescription',
      component:historyPrescription
    },
    {
      //问诊开方
      path:'/inquiringPrescriptions',
      name:'inquiringPrescriptions',
      component:inquiringPrescriptions
    },
    {
      //已问诊
      path:'/alreadyTreated',
      name:'alreadyTreated',
      component:alreadyTreated
    },
    {
      //会员卡
      path:'/membershipCard',
      name:'membershipCard',
      component:membershipCard
    },
    {
      //挂号大厅
      path:'/registrationHall',
      name:'registrationHall',
      component:registrationHall
    },
    {
      //挂号大厅-理疗开方
      path:'/therapy',
      name:'therapy',
      component:therapy
    },{
      //挂号大厅-理疗开方
      path:'/inquiry',
      name:'inquiry',
      component:inquiry
    },
    {
      //registered
      path:'/registered',
      name:'registered',
      component:registered
    },
    {
      //系统设置
      path:'/system',
      name:'system',
      component:system,
      children:[
        {
          //管理账号
          path:"/",
          name:"account",
          component:account,
        },
        {
          //医生列表
          path:"docList",
          name:"docList",
          component:docList
        },
        {
          //简报
          path:"briefing",
          name:"briefing",
          component:briefing
        },
        {
          //理疗管理
          path:"administration",
          name:"administration",
          component:administration,
          children:[
            {
              //理疗项目管理
              path:"/",
              name:"project",
              component:project
            },
            {
              //理疗师管理
              path:"physiotherapist",
              name:"physiotherapist",
              component:physiotherapist
            }
          ]
        }
      ]
    },
    {
      //历史理疗处方
      path:'/therapyPrescription',
      name:'therapyPrescription',
      component:therapyPrescription
    }
  ]
})
