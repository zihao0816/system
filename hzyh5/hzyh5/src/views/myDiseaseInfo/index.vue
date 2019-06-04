<template>
    <div class="myDiseaseInfo">
        <div class="basicInfo">
            <div class="top">
                <h3>{{patient.patientname}}</h3>
                <div>
                    <span v-if="patient.sex">{{patient.sex == 1?'男':'女'}}·</span>
                    <span>{{patient.age}}</span>
                    <span v-if="patient.city">·{{patient.city}}</span>
                </div>
            </div>
            <div class="line" v-if="ordermaintellinfo">
                <div>
                    <span>{{ordermaintellinfo.height?ordermaintellinfo.height:0}}cm</span>
                    <span>患者身高</span>
                </div>
                <div>
                    <span>{{ordermaintellinfo.weight?ordermaintellinfo.weight:0}}kg</span>
                    <span>患者体重</span>
                </div>
            </div>
            <div class="history" v-if="ordermaintellinfo">
                <h3>既往病史</h3>
                <span v-if="ordermaintellinfo.pastcase">{{ordermaintellinfo.pastcase}}</span>
                <span v-else>无</span>
                <h3>过敏历史</h3>
                <span v-if="ordermaintellinfo.allergichistory">{{ordermaintellinfo.allergichistory}}</span>
                <span v-else>无</span>
                <h3>患者自述</h3>
                <span v-if="ordermaintellinfo.symptom">{{ordermaintellinfo.symptom}}</span>
                <span v-else>无</span>
            </div>
        </div>
        <div class="facePhoto">
            <h3>舌照面照<span v-if="isAccordingexchanges">{{isAccordingexchanges.length}}张</span></h3>
            <!-- 有照片的 otherdetails-->
            <div>
                <div v-for="(item,index) in isAccordingexchanges" :key="index">
                    <viewer>
                        <img :src="item">
                    </viewer>
                </div>
            </div>
            <!-- 无照片的 -->
            <span v-if="isAccordingexchanges==0">暂无提交</span>
            <h3>其他照片<span v-if="otherdetails">{{otherdetails.length}}张</span></h3>
            <div>
                <div v-for="(item,index) in otherdetails" :key="index">
                    <viewer>
                        <img :src="item">
                    </viewer>
                </div>
            </div>
            <!-- 无照片的 -->
            <span v-if="otherdetails==0">暂无提交</span>
        </div>
        <div class="facePhoto">
            <h3>问诊单问题</h3>
            <!-- 有信息的 -->
            <div class="issueInfo">
                <span>{{reorderinquiryquestion?reorderinquiryquestion:'无'}}</span>
            </div>
        </div>
    </div>
</template>
<style lang="less">
@import "index.less";
</style>
<script>
export default {
  data() {
    return {
      show: false,
      show2: false,
      id: this.$route.query.id,
      patient: {}, //患者基本信息
      ordermaintellinfo: {}, //主诉信息
      isAccordingexchanges: [], //舌照面照
      isInterrogationsingle: {}, //问诊单
      otherdetails: []
    };
  },
  methods: {
    //获取问诊资料详情
    getDiseaseInfo() {
      let params = {
        //1获取2不获取
        orderID: this.id, //订单id
        getPatient: 1, //患者信息
        isaction: 1, //主诉信息
        isAccordingexchanges: 1, //舌照面照
        ischecked: 1 //问诊单
      };
      var _this = this;
      this.$doRequest("/api/Inquiry/orderDetails", params, res => {
        this.patient = res.patient;
        this.ordermaintellinfo = res.ordermaintellinfo;
        if(res.accordingTtongue.length>0){
            for(var i=0;i<res.accordingTtongue.length;i++){
                _this.isAccordingexchanges.push(res.accordingTtongue[i]);
            }
        }
        if(res.surfaceAccording.length>0){
            for(var i=0;i<res.surfaceAccording.length;i++){
                _this.isAccordingexchanges.push(res.surfaceAccording[i]);
            }
        }
        _this.otherdetails = res.otherdetails; //其他照片
        _this.reorderinquiryquestion = res.reorderinquiryquestion;
      });
    }

    //详情页跳转
  },
  created: function() {
    this.$isLogin(window.location.search.substr(1), this.getDiseaseInfo);
    document.title = '问诊资料';
  }
};
</script>

