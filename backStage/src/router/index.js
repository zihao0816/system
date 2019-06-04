import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index/index'
import finance from '@/views/finance/index'  //财务
import financeWX from '@/views/finance/weChat/index'  //微信提现
import financeWXinfo from '@/views/finance/weChatinfo/index'  //微信提现详情
import financebank from '@/views/finance/banks/index'  //银行卡提现financebankinfo
import financebankinfo from '@/views/finance/banksinfo/index'  //银行卡提现
import warehouse from '@/views/warehouse/index'  //库房管理
import institution from '@/views/institution/index'  //机构管理
import doctorhouse from '@/views/doctorhouse/index'  //医生账号管理
import doclist from '@/views/doctorhouse/doclist/index'
import pending from '@/views/doctorhouse/pending/index'
import examine from '@/views/examine/index'  //门诊管理
import patientInformationManagement from '@/views/patientInformationManagement/index'  //患者信息管理
import registerOrder from '@/views/registerOrder/index'//线上问诊订单
import registerDetails from '@/views/registerDetails/index'//线上问诊详情
import consultOrder from '@/views/consultOrder/index'//线下问诊订单
import recipeOrder from '@/views/recipeOrder/index'//处方订单
import therapyOrder from '@/views/therapyOrder/index'//理疗订单
import consultDetails from '@/views/consultDetails/index'//线下问诊详情
import recipeDetails from '@/views/recipeDetails/index'//理疗详情
import therapyDetails from '@/views/therapyDetails/index'//理疗详情
//运营中心
import articleManage from '@/views/operatingCenter/articleManage/index'//文章管理
import addArticle from '@/views/operatingCenter/articleManage/addArticle'//添加文章

// 数据中心导航
// import doctorStatistics from '@/views/dataCenter/doctorStatistics/index'//医生统计
// import docActive from '@/views/dataCenter/doctorStatistics/docActive/index'//医生活跃度
// import docData from '@/views/dataCenter/doctorStatistics/docData/index'//医生数据
// import docQualification from '@/views/dataCenter/doctorStatistics/docQualification/index'//医生资质



import doctorServiceDetails from '@/views/doctorServiceDetails/index'//理疗详情

import doctorService  from  '@/views/doctorService/index'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/articleManage',
      name: 'articleManage',
      component: articleManage
    },
    {
      path: '/addArticle',
      name: 'addArticle',
      component: addArticle
    },
    {
      path: '/finance',
      name: 'finance',
      component: finance
    },
    {
      path: '/financeWX',
      name: 'financeWX',
      component: financeWX
    },
    {
      path: '/financeWXinfo',
      name: 'financeWXinfo',
      component: financeWXinfo
    },
    {
      path: '/financebank',
      name: 'financebank',
      component: financebank
    },
    {
      path: '/financebankinfo',
      name: 'financebankinfo',
      component: financebankinfo
    },
    {
      path: '/warehouse',
      name: 'warehouse',
      component: warehouse
    },
    {//医生账号
      path: '/doctorhouse',
      name: 'doctorhouse',
      component: doctorhouse,
      children:[{
          path:"/",//医生列表
          name:"doclist",
          component:doclist
        },
        {//医生待审核列表
          path:"pending",
          name:"pending",
          component:pending
        }
      ],
    },
    {//门诊账号
      path: '/examine',
      name: 'examine',
      component: examine
    },
    {//机构账号
      path: '/institution',
      name: 'institution',
      component: institution
    },
    {//挂号订单
      path: '/registerOrder',
      name: 'registerOrder',
      component: registerOrder
    },
    {//挂号订单详情
      path: '/registerDetails',
      name: 'registerDetails',
      component: registerDetails
    },
    {//问诊订单
      path: '/consultOrder',
      name: 'consultOrder',
      component: consultOrder
    },
    {//处方订单
      path: '/recipeOrder',
      name: 'recipeOrder',
      component: recipeOrder
    },
    {//处方订单
      path: '/therapyOrder',
      name: 'therapyOrder',
      component: therapyOrder
    },
    {//问诊详情
      path: '/consultDetails',
      name: 'consultDetails',
      component: consultDetails
    },
    {//问诊详情
      path: '/recipeDetails',
      name: 'recipeDetails',
      component: recipeDetails
    },
    {//理疗详情
      path: '/therapyDetails',
      name: 'therapyDetails',
      component: therapyDetails
    },
    // {//医生统计
    //   path: '/doctorStatistics',
    //   name: 'doctorStatistics',
    //   component: doctorStatistics,
    //   children:[{
    //     path:"/",//医生数据
    //     name:"docData",
    //     component:docData
    //   },
    //   {//医生活跃度
    //     path:"docActive",
    //     name:"docActive",
    //     component:docActive
    //   },
    //   {//医生资质分析
    //     path:"docQualification",
    //     name:"docQualification",
    //     component:docQualification
    //   }
    // ],
    // },

    {//医生服务详情     
      path: '/doctorServiceDetails',
      name: 'doctorServiceDetails',
      component: doctorServiceDetails
    },
    {//拍照开方
      path: '/doctorService',
      name: 'doctorService',
      component: doctorService
    },
    {//患者信息管理
        path: '/patientInformationManagement',
        name: 'patientInformationManagement',
        component: patientInformationManagement
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
}
})
