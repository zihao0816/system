/**
 * Created by lifei on 2019/1/9.
 * 门诊相关的数据,门诊问诊的信息
 */

import dictService from '@/service/DictService';
import outpatientService from '@/service/OutpatientService';

const state = {
  // 待就诊人数
  diagnosisWaitCount: 0,
  //已经就诊人数
  diagnosisCount: 0,
  //待就诊列表
  diagnosisWaitList:[],
  //已经就诊列表
  diagnosisAlreadyList:[],
  //当前正在就诊的患者
  currentPatient:{

  },
  //当前选择的已经就诊过的患者
  alreadyPatient: {},
  //当前已经就诊患者的列表
  alreadyPatientList:[],
  //当前选中的患者
  selectedPatientIndex:0
}
const getters = {

}
const mutations = {
    //待就诊列表
    setDiagnosisWaitList(state,value) {
      state.diagnosisWaitList = value;
      state.diagnosisWaitCount = value.length;
      if (state.selectedPatientIndex < value.length) {
        if(state.currentPatient.patientname == null){
          state.currentPatient = value[state.selectedPatientIndex];
        }
      } else if(value.length ==0) {
        state.currentPatient = value[0];
      }
    },
    //已经就诊列表
    setDiagnosisAlreadyList(state,value) {
        state.diagnosisAlreadyList = value;
        state.diagnosisCount = value.length;
    },
    //当前就诊的患者
    setCurrentPatient(state, params) {
      // if (!value.patientname) {
      //   value['patientname'] = '';
      // }
      let patient = params.patient;
      let index = params.index;

      state.currentPatient = patient;
      state.selectedPatientIndex = index;
    },
    //当前选中的已经就诊的患者
    setAlreadyPatient(state, value) {
      state.alreadyPatient = value;
    },
    setAlreadyPatientList(state,value) {
      state.alreadyPatientList = value;
    }
}

const actions = {
  //获取就诊列表
  fetchOutpatientList({state,commit},loginId) {
    outpatientService.findDiagnosisWaitList(loginId).then((resp) => {
      if (resp.status === 200){
        let list = resp.data
        commit('setDiagnosisWaitList',list);
      }
    });
  },
  //已经就诊列表
  alreadyOutpatientList({state,commit},loginId) {
    outpatientService.findDiagnosisAlreadyList(loginId).then((resp) => {
      if (resp.status === 200){
        let list = resp.data
        commit('setDiagnosisAlreadyList',list);
      }
    });
  },
  //当前已经就诊的患者的列表
  findAlreadyPatientList({state, commit},params) {
    let {doctorid,patientid} = params;
    outpatientService.findAlreadyPatientList(doctorid, patientid).then(resp=>{
      let data = resp.data.matchPatient;
      commit('setAlreadyPatientList',data);
    });
  },
  //选择当前的处方挂号,默认会选择一个。
  selectedDefaultPatient({state,commit}) {
    let index = state.selectedPatientIndex;
    let list = state.diagnosisWaitList;
    if (index > list.length) {
      index = 0;
    }
    if (state.currentPatient.patientname != null){
      if (index <= list.length) {
        let selected = state.diagnosisWaitList[index];
        commit('setCurrentPatient',{index:index,patient:selected});
      }
    }
  },
  nextPatient({state, commit}) {

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
