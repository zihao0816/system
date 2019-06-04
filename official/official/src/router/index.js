import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index/index'
import doctordetails from '@/views/doctorDetails/index'
import doctorlist from '@/views/doctorList/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/doctordetails',
      name: 'doctordetails',
      component: doctordetails
    },
    {
      path: '/doctorlist',
      name: 'doctorlist',
      component: doctorlist
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
}
})
