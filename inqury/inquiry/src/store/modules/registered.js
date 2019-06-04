/**
 * Created by lifei on 2019/1/17.
 */


/**
 * Created by lifei on 2019/1/9.
 * 门诊相关的数据,门诊问诊的信息
 */

import dictService from '@/service/DictService';
import outpatientService from '@/service/OutpatientService';
import {doRequest} from '@/api/http';
const state = {
  // 待就诊的医生列表
  doctorList: []
}
const getters = {
  getDoctorList (state) {
   let docList = state.doctorList;
   console.log(docList);
   let list = [];

   return [];
    //return state.doctorList;
  }
}
const mutations = {
  //待就诊列表
  setDoctorList(state,value) {
    state.doctorList = value;
  },
}

const actions = {
  //获取就诊列表
  findDoctorList({state,commit},loginId) {
    var _this = this;
    doRequest("/api/doctorinterrogation/list",null,function(res){
      console.log('================>>>>',res);
      commit('setDoctorList',res);
    })
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
