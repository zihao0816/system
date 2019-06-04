/**
 * Created by lifei on 2019/1/5.
 * 开方及处方信息
 */
import prescriptionService from '@/service/PrescriptionService';
import dictService from '@/service/DictService';
class DoctorPrescription {
  constructor() {
    this.isagreementparty = '';
    this.orderprescriptionname = '';
    this.templateId = '';
    this.gongJiShu = '7';//共有多少剂药，
    this.riJi = '1';//每日使用的剂量
    this.jiChiShu = '2';//每剂药分几次服用
    this.shiFouDaiJian = '1';//是否代煎， 代煎 2 , 1 不代煎
    this.number = 0;//共多少味药（协定方回显的时候用）
    this.yaoCaiLieBao = [];
   }
 }
class DoctorMedicine {
  constructor() {
    this.index = 0;
    this.id = '';//药材ID
    this.medicineNum = 10;//药材数量
    this.medicineUnit = '';//药材单位
    this.medicineprice = 0;//药材价格
    this.medicinename = '';//药材名称
    this.decoctionname = ''; //煎药方法名称
    this.decoctionid = ''; //煎药方法标识
  }
}
//药品在本地的所有的缓存
const medicineMap = new Map();
const state = {
  errors: [],
  // 药房列表
  pharmacylist: [],
  //药材品牌
  brands: [],
  //根据剂型选择的品牌
  selectedDosageBrands: [],
  //药房、品牌、剂型相关的所有的药材
  brandDrugList: [],
  //煎法
  jianfaList: [],
  //用药禁忌
  yyjjList: [],
  //患者历史的就诊数量,
  patientHistoryCount: 0,
  //就诊单
  prescription: {
    patientname: '',//患者姓名
    patientsex: '',//患者性别
    patientage: '',//患者年纪
    clinicid: '',//门诊ID
    hospitaid: '',//药房ID
    doctorid: '',//医生ID
    doctorname: '',//医生名称
    brandid: '',//品牌ID
    brandname: '',//品牌名称
    patientid: '',//患者ID
    prescriptionshapeid: '',//剂型id
    prescriptionsid: '',//是否可见ID
    numberorder: '',//排号
    guahaoId: '',//挂号ID
    diagnosisqueueid: '',////挂号ID
    bianBing: '',//辨病
    bianZheng: '',//辨证
    chaKanYaoFang: '2',//查看药方的权限，可看 1， 不可看 2
    yiZhu: '',//医嘱
    yyjj: '',//用药期间禁忌
    yaofang: '',//药方
    jixing: 'yt1002',//剂型
    pinpai: '',//品 牌 商
    feiYongHeJi: 0,//费用总计
    money: 0,
    ismoney: false,
    //药方list
    prescriptionList: [],
  }
}
const getters = {
  // 选择的药房列表
  selectedPharmacylist (state) {
    return state.pharmacylist;
  },
  loadedBrands (state) {
    return state.brands;
  },
  //选择药材,已经过滤掉已经选择过的
  selectedDrugs(state) {
    return state.brandDrugList
  },

}
const mutations = {
  //获取搜索值
  setPharmacylist(state, value) {
    state.pharmacylist = value
  },
  //添加最终价格
  setPrescription(state, value) {
    state.prescription.money = value;
    state.prescription.ismoney = true;
  },
  setBrands (state, value) {
    state.brands = value
  },
  selectedDosage(state, value) {
    state.dosage = value;
  },
  selectedDosageBrands(state,value) {
    state.selectedDosageBrands = value;
  },
  //设置新的药方
  setPrescriptionList(state, value) {
    if (value.isagreementparty) {
      state.prescription.prescriptionList = value.arr;
      state.prescription.prescriptionList[value.i].isagreementparty = value.isagreementparty;
    }else{
      state.prescription.prescriptionList = value;
    }
  },
  //设置医生选择的药品列表
  setDoctorDrugList(state, value) {
    let i = value.i;
    //协定方
    if (value.isagreementparty == '1') {
        state.prescription.prescriptionList[i].isagreementparty = value.isagreementparty;
        state.prescription.prescriptionList[i].orderprescriptionname = value.orderprescriptionname;
        state.prescription.prescriptionList[i].number = value.number;
        state.prescription.prescriptionList[i].yaoCaiLieBao = value.arr;
    } else {
    //普通方
      let list = value.arr;
      if (list != [] && list.length > 0) {
          state.prescription.prescriptionList[i].isagreementparty = value.isagreementparty;
          state.prescription.prescriptionList[i].orderprescriptionname = value.orderprescriptionname;
          state.prescription.prescriptionList[i].yaoCaiLieBao = list;
      } else {
          //药方模板取消后
        state.prescription.prescriptionList[i].yaoCaiLieBao = [];
        state.prescription.prescriptionList[i].yaoCaiLieBao.push(new DoctorMedicine());
        }
    }
  },
  //与指定的品牌相关的所有的药材列表
  setBrandDrugList(state,value) {
    state.brandDrugList = value;
  },
  //设置煎法
  setJianfaList(state,value) {
    state.jianfaList = value;
  },
  //用药禁忌
  setYyjjList(state,value) {
    state.yyjjList = value;
  },
  //设置费用合计
  setAmount(state,value) {
    state.prescription.feiYongHeJi = value;
  },
  //设置患者历史就诊的数量
  setPatientHistoryCount(state,value) {
    state.patientHistoryCount = value;
  },
  appendError(state,msg) {
    let errList = state.errors;
    errList.push(msg);
    state.errors = errList;
  },
  clearError(state){
    state.errors = []
  },
  emptyPrescription(state){
    state.prescription ={
      patientname:'',//患者姓名
      patientsex:'',//患者性别
      patientage:'',//患者年纪
      clinicid: '',//门诊ID
      hospitaid:'',//药房ID
      doctorid: '',//医生ID
      doctorname:'',//医生名称
      brandid: '',//品牌ID
      money: 0,
      brandname:'',//品牌名称
      patientid:'',//患者ID
      prescriptionshapeid:'',//剂型id
      prescriptionsid:'',//是否可见ID
      numberorder:'',//排号
      guahaoId:'',//挂号ID
      diagnosisqueueid:'',////挂号ID
      bianBing:'',//辨病
      bianZheng:'',//辨证
      gongJiShu:7,//共有多少剂药，
      riJi:'1',//每日使用的剂量
      jiChiShu:'2',//每剂药分几次服用
      shiFouDaiJian:'1',//是否代煎， 代煎 2 , 1 不代煎
      chaKanYaoFang: '2',//查看药方的权限，可看 1， 不可看 2
      yiZhu:'',//医嘱
      yyjj: '',//用药期间禁忌
      yaofang: '',//药方
      jixing:'yt1002',//剂型
      pinpai:'',//品 牌 商
      feiYongHeJi: 0,//费用总计
      money: 0,
      ismoney: false,
      prescriptionList: [],
    }
  }
}

const actions = {
  selectedDosage ({ state, commit },value) {
    commit('selectedDosage', value);
    let brand = state.brands.filter((b) => b.itemcode == value)
    let filteredBrands = [];
    if (brand.length > 0) {
      filteredBrands = brand[0].prescriptionshapebrands;
    }
    commit('selectedDosageBrands',filteredBrands);
    //清空已经选择的药品
    // commit('setDoctorDrugList',[]);
  },
  


  //加载药房列表
  async loadPharmacylist ({ state, commit }) {
    let resp = await prescriptionService.findPharmacylist();
    let list = resp.data.parameters;
    commit('setPharmacylist',list);
  },
  async loadBrands ({ state, commit }) {
    let resp = await prescriptionService.findBrand();
    let list = resp.data.parameters;
    commit('setBrands',list);
  },

  //获取订单最终金额
  async sumOfMoney({ state, commit }, index) {
    let resp = await prescriptionService.submitprescribejg(index);
    let list = resp.data.parameters;
    commit('setPrescription',list);
  },

  //删除一个药材
  removeDrug({ state, commit }, index) {
    let i = index.i;
    let eq = index.index;
    let doctorDruglist = state.prescription.prescriptionList[i].yaoCaiLieBao;
    if (eq <= doctorDruglist.length) {
      doctorDruglist.splice(eq,1);
    }
    let drug = {
      i: i,
      arr: doctorDruglist
    };
    commit('setDoctorDrugList',drug);
  },
  //添加药材列表（模板状态）
  addDrugList({ state, commit }, value) {
    let drug = {
      i: value.i,
      arr: value.arr,
      isagreementparty: value.isagreementparty,//是否为协议方
      orderprescriptionname: value.orderprescriptionname,//协议方名称
    };
    commit('setDoctorDrugList', drug);
  },
  //添加药材列表（协定方状态）
  addDrugSecrecyList({ state, commit }, value) {
    commit('setDoctorDrugList', value);
  },
  //清空操作
  clearDrugList({ state, commit }, value) {
    let drug = {
      i: value,
      arr: []
    };
    commit('setDoctorDrugList',drug);
  },


  //添加一个药方
  addPrescription({ state, commit }, index) {
    let prescriptionList = state.prescription.prescriptionList;
    let prescription = new DoctorPrescription();
    prescriptionList.push(prescription);
    let params = '';
    if (index.isagreementparty) {
      params = {
        i: index.i,
        isagreementparty: index.isagreementparty,
        orderprescriptionname: index.orderprescriptionname,
        arr: prescriptionList,
      }
    }else{
      params = prescriptionList;
    }
    commit('setPrescriptionList', params);
  },

  //删除一个药方
  removePrescription({ state, commit }, index) {
    let prescriptionList = state.prescription.prescriptionList;
    if (index <= prescriptionList.length) {
      prescriptionList.splice(index,1);
    }
    commit('setPrescriptionList', prescriptionList);
  },

  //清空药材列表
  clearPrescriptionList({ state, commit }, index) { 
    let prescriptionList = [];
    commit('setPrescriptionList', prescriptionList);
  },

  //添加一个药材
  appendEmptyDrug({ state, commit }, index) {
    let i = index.i;
    let eq = index.index;
    let doctorDruglist = state.prescription.prescriptionList[i].yaoCaiLieBao;
    //是否有一个占位符号
    let hasHolder = false;
    for (let drug in doctorDruglist) {
      if (drug.medicine === '') {
        hasHolder = true;
      }
    }
    let temp = doctorDruglist[eq];
    if (temp  != undefined) {
      if (temp.id == ''){
        return;
      }
    }
    if (!hasHolder) {
      let medicine = new DoctorMedicine();
      medicine.index = doctorDruglist.length + 1;
      if (eq > -1) {
        let atIndex = eq +1;
        if (atIndex < 0) {
          atIndex = 0;
        }
        doctorDruglist.splice(atIndex,0,medicine);
      }else {
        doctorDruglist.push(medicine);
      }
      let drug = {
        i: i,
        arr: doctorDruglist
      };
      commit('setDoctorDrugList',drug);
    }

  },
  //查找药材
  findMedicine({state},medicineId) {
    let medicine = medicineMap.get(medicineId);
    if (medicine) {
      return medicine;
    }
    let found = state.brandDrugList.find(m=>m.id == medicineId);
    return found;
  },
  //加载开方要用的一些字典
  loadDicts({state, commit}) {
    dictService.listDictItems('yyjj').then((resp)=>{
      let dictItems = resp.data;
      commit('setYyjjList',dictItems)
    });
    dictService.listDictItems('jianfa').then((resp)=>{
      let dictItems = resp.data;
      commit('setJianfaList',dictItems)
    });
  },
  async loadAllDrug({ state, commit },params) {
    let {pharmacy,dosage,brandId} = params;
    try{
      let resp = await prescriptionService.listAllDrug(pharmacy, dosage, brandId);
      if (resp.status == 200) {
        let drugs = resp.data;
        let all_drugs = drugs.map((item)=>{
          item['codes'] = item.phoneticode.split(',')
          let cacheItem = Object.assign({},item);
          medicineMap.set(cacheItem.id,cacheItem);
          return item;
        })
        commit('setBrandDrugList',all_drugs);
        return drugs;
      } else {
        return []
      }
    }catch(error){
      console.error(error);
    }
  },
  //获取最终价格
  getbatchverificationjg({ state, commit }, prescription) {
    prescriptionService.submitprescribejg(prescription);
  },
  //提交订单
  doSumbitPrescription({state, commit},prescription) {
    let script = JSON.stringify(prescription);
    prescriptionService.submitPrescribe(prescription);
  },
  //计算费用合计
  calculateAmount({state,commit}) {
    let yaoCaiList = state.prescription.yaoCaiLieBao;
    let amount = 0.0;
    yaoCaiList.forEach((yaocai)=>{
      let price = yaocai.medicineprice;
      let num = yaocai.medicineNum;
      amount += price * num
    })
    amount = amount * state.prescription.gongJiShu;
    amount = Math.round(amount * 100) / 100;
    commit('setAmount',amount);
  },
  //获取患者的历史就诊数量
  getPatientHistoryCount({state, commit},patient) {
    let {doctorid,patientid} = patient;
    prescriptionService.getPatientHistoryCount(doctorid, patientid).then((resp)=>{
      if (resp.status == 200) {
        let data = resp.data;
        let result = data.action;

        commit('setPatientHistoryCount',result);
      }
    });
  },
  //初始化门诊处方
  initPrescription({state, commit}, patient) {
    if (state.prescription.patientid !== patient.patientid){
        state.prescription.patientname = patient.patientname;
        state.prescription.patientage = patient.patientage;
        state.prescription.patientsex = patient.patientsex;
    }
  },
  //验证处方单
  validatePrescription({state, commit}) {
    commit('clearError');
    //验证药品，空的去掉
    // let emptyIndex = state.prescription.yaoCaiLieBao.findIndex((yao)=>yao.id == '');
    // let list = state.prescription.yaoCaiLieBao;
    // let loop = 0;
    //防止死循环
    // while (emptyIndex >=0 && loop < 100) {
    //   list = list.splice(emptyIndex, 1);
    //   emptyIndex = state.prescription.yaoCaiLieBao.findIndex((yao)=>yao.id == '');
    //   list = state.prescription.yaoCaiLieBao;
    //   loop = loop + 1;
    // }

    if (state.prescription.bianBing == '') {
      state.prescription.bianBing = '未填写';
    }
    if (state.prescription.bianZheng == '') {
      state.prescription.bianZheng = '未填写';
    }
    if (state.prescription.gongJiShu == '' || state.prescription.gongJiShu <=0) {
      commit('appendError','方的剂数不能为空！');
    }
    if (state.prescription.riJi > state.prescription.gongJiShu) {
      commit('appendError','每日的剂数不能大于总剂数！');
    }
    // if ((state.prescription.riJi * state.prescription.jiChiShu) != state.prescription.gongJiShu) {
    //   commit('appendError','每日剂数和每日服用次数的总和与总剂数不匹配！')
    // }
    // for (var index in list) {    // don't actually do this
    //   let item = list[index];

    //   if (item.medicineNum ==0) {
    //     let msg = `药材 ${item.medicinename} 的药品数量不能为空！`;
    //     commit('appendError',msg);
    //   }
    //   //饮片
    //   if (state.prescription.jixing == 'yt1002') {
    //     // console.log(item);
    //     // if (item.decoctionid == '') {
    //     //   let msg = `药材 ${item.medicinename} 的煎法不能为空！`;
    //     //   commit('appendError',msg);
    //     // }
    //   }
    // }
  },
  clearPrescription({state, commit}){
      commit('emptyPrescription')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
