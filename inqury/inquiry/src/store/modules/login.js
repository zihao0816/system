/**
 * Created by lifei on 2019/1/9.
 * 与登录相关的
 */

const state = {
  // 当前登录人的ID
  loginId: '',
}
const getters = {

}
const mutations = {

}

const actions = {
  //获取当前登录人的ID
  getLoginId({state}) {
    let detail = sessionStorage.getItem('loginDetail');
    let login = JSON.parse(detail);
    let param = login.parameters;
    let loginId
    if(param.doctorid == null){
      loginId = param.id;
    }else{
      loginId = param.doctorid;
    }
    //return '189d3de547774715b2355e276f9073f4';
    return loginId;
  },
  //当前登录的详情信息
  getLoginDetail({state}) {
    let detail = sessionStorage.getItem('loginDetail');
    let login = JSON.parse(detail);
    let param = login.parameters;
    return param;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
