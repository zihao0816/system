import Vue from 'vue'
import Router from 'vue-router'
import mymanage from '@/views/myManage/index'//我的
import caseList from '@/views/caseList/index'//我的问诊列表
import cases from '@/views/case/index'//我的问诊列表
import myOrderList from '@/views/myOrderList/index'//我的订单列表
import myOrderDetailsWZ from '@/views/myOrderDetailsWZ/index'//我的订单详情（问诊）
import myOrderDetailsYF from '@/views/myOrderDetailsYF/index'//我的订单详情（药方）
import myCoupon from '@/views/myCoupon/index'//我的优惠券
import myDiseaseInfo from '@/views/myDiseaseInfo/index'//我的问诊单
import myDoctor from '@/views/myDoctor/index'//我的医生列表
import aboutUs from '@/views/aboutUs/index'//关于我们
import userAgreement from '@/views/userAgreement/index'//用户协议
import tickling from '@/views/tickling/index'//问题反馈
import address from '@/views/address/index'//新增地址
import empty from '@/components/empty/index'//报空页面
import im from '@/views/im/index' //im tab栏
import one from '@/views/upload/one/one' //问诊单填写
import ones from '@/views/upload/ones/ones' //查看问诊单
import two from '@/views/upload/two/two' //病症自述填写
import twos from '@/views/upload/twos/twos' //个人病症信息查看
import three from '@/views/upload/three/three' //完善个人信息
import four from '@/views/upload/four/four' //填写舌照面照
import physicianVisits from '@/views/physicianVisits/index' //问诊列表
import doctorList from '@/views/doctor/index'//医生列表（带搜索）
import doctorDetails from '@/views/doctorDetails/index'//医生详情（支付）
import boundPhone from '@/views/boundPhone/index'//修改手机号
import buyServiceDetails from '@/views/buyServiceDetails/index'//购买服务
import orderDetailsYF from '@/views/orderDetailsYF/index'//我的订单详情（药方）NEW
import perfectInformation from '@/views/perfectInformation/index' //完善信息
import myRegistered from '@/views/myRegistered/index'  //问诊挂号
import myRegisteredDetails from '@/views/myRegisteredDetails/index'  //问诊挂号详情
import notice from '@/views/notice/index'  //公告
import noticeDetails from '@/views/noticeDetails/index'  //公告详情
import sx from '@/views/sx/index' //刷新
import guahao from '@/views/systemRegistered/guahao/index'  //门诊挂号-门诊系统
import addressedit from '@/views/addressedit/index' //地址编辑
import paymentSteps from '@/views/paymentSteps/index' //支付步骤
import wxQrcode from '@/views/wxQrcode/index' //微信支付二维码

import payResult from '@/views/systemRegistered/payResult/index'  //支付结果-门诊系统
import SperfectInformation from '@/views/systemRegistered/perfectInformation/index' //完善信息-门诊系统
// import pay from '@/views/systemRegistered/pay/index' //支付-门诊系统
// import pays from '@/views/systemRegistered/pays/index' //支付-门诊系统
import orgDoctorDetails from '@/views/orgDoctorDetails/index'// 机构下医生详情
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/wxQrcode',
      name: 'wxQrcode',
      component: wxQrcode
    },
    {
      path: '/paymentSteps',
      name: 'paymentSteps',
      component: paymentSteps
    },
    {
      path: '/empty',
      name: 'empty',
      component: empty
    },
    {
      path: '/myManage',
      name: 'mymanage',
      component: mymanage
    },
    {
      path: '/caseList',
      name: 'caseList',
      component: caseList
    },
    {
      path: '/cases',
      name: 'cases',
      component: cases
    },
    {
      path: '/myOrderList',
      name: 'myOrderList',
      component: myOrderList
    },
    {
      path: '/myOrderDetailsWZ',
      name: 'myOrderDetailsWZ',
      component: myOrderDetailsWZ
    },
    {
      path: '/addressedit',
      name: 'addressedit',
      component: addressedit
    },
    {
      path: '/myOrderDetailsYF',
      name: 'myOrderDetailsYF',
      component: myOrderDetailsYF
    },
    {
      path: '/myCoupon',
      name: 'myCoupon',
      component: myCoupon
    },
    {
      path: '/myDiseaseInfo',
      name: 'myDiseaseInfo',
      component: myDiseaseInfo
    },
    {
      path: '/myDoctor',
      name: 'myDoctor',
      component: myDoctor
    },
    {
      path: '/im',
      name: 'im',
      component: im
    },
    {
      path: '/one',
      name: 'one',
      component: one
    },
    {
      path: '/ones',
      name: 'ones',
      component: ones
    },
    {
      path: '/two',
      name: 'two',
      component: two
    },
    {
      path: '/twos',
      name: 'twos',
      component: twos
    },
    {
      path: '/three',
      name: 'three',
      component: three
    },
    {
      path: '/four',
      name: 'four',
      component: four
    },
    {
      path: '/physicianVisits',
      name: 'physicianVisits',
      component: physicianVisits
    },
    {
      path: '/doctorList',
      name: 'doctorList',
      component: doctorList
    },
    {
      path: '/doctorDetails',
      name: 'doctorDetails',
      component: doctorDetails
    },
    {
      path: '/boundPhone',
      name: 'boundPhone',
      component: boundPhone
    },
    {
      path: '/buyServiceDetails',
      name: 'buyServiceDetails',
      component: buyServiceDetails
    },
    {
      path: '/aboutUs',
      name: 'aboutUs',
      component: aboutUs
    },
    {
      path: '/userAgreement',
      name: 'userAgreement',
      component: userAgreement
    },
    {
      path: '/tickling',
      name: 'tickling',
      component: tickling
    },
    {
      path: '/address',
      name: 'address',
      component: address
    },
    {
      path: '/orderDetailsYF',
      name: 'orderDetailsYF',
      component: orderDetailsYF
    },
    {
      path: '/perfectInformation',
      name: 'perfectInformation',
      component: perfectInformation
    },
    {
      path: '/myRegistered',
      name: 'myRegistered',
      component: myRegistered
    },
    {
      path: '/myRegisteredDetails',
      name: 'myRegisteredDetails',
      component: myRegisteredDetails
    },
    {
      path: '/notice',
      name: 'notice',
      component: notice
    },
    {
      path: '/noticeDetails',
      name: 'noticeDetails',
      component: noticeDetails
    },
    {
      path: '/sx',
      name: 'sx',
      component: sx
    },
    {
      path: '/systemRegistered/guahao',
      name: 'guahao',
      component: guahao
    },
    {
      path: '/systemRegistered/payResult',
      name: 'payResult',
      component: payResult
    },
    {
      path: '/systemRegistered/perfectInformation',
      name: 'perfectInformation',
      component: SperfectInformation
    },
    {
      path: '/orgDoctorDetails',
      name: 'orgDoctorDetails',
      component: orgDoctorDetails
    }
  ]
})


