<template>
  <div class="twos">
    <div class="page-py">
      <div class="top-py">
        <!-- <img width="54" height="54" :src="userInfo.patient != null && userInfo.patient != '' && userInfo.patient.portrait == '' ? userInfo.patient.headphoto : userInfo.patient.portrait" alt=""> -->
        <div class="name-py">
          <p><span>{{userInfo.patient.patientname==''?userInfo.patient.patientnickname:userInfo.patient.patientname}}</span><span>{{userInfo.patient.relationship}}</span></p>
          <p>{{userInfo.patient.sex=='1'?'男':'女'}}，{{userInfo.ordermaintellinfo.age}}</p>
        </div>
      </div>
      <div class="report-py">
        <p>病症自述</p>
        <p>{{userInfo.ordermaintellinfo.symptom}}</p>
      </div>
      <div class="report-py">
        <p>身高体重</p>
        <p>
          <span>身高：{{userInfo.ordermaintellinfo.height}}cm</span>&emsp;&emsp;&emsp;
          <span>体重：{{userInfo.ordermaintellinfo.weight}}kg</span>
        </p>
      </div>
      <div class="allergy-py">
        <p class="msg-py">以下信息将帮助医生更准确的了解您的病情</p>
        <p>过敏史（选填）</p>
        <p>{{userInfo.ordermaintellinfo.allergichistory==null || userInfo.ordermaintellinfo.allergichistory==''?'无':userInfo.ordermaintellinfo.allergichistory}}</p>
      </div>
      <div class="allergy-py">
        <p>既往病史（选填）</p>
        <p>{{userInfo.ordermaintellinfo.pastcase==null || userInfo.ordermaintellinfo.pastcase==''?'无':userInfo.ordermaintellinfo.pastcase}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {}, //用户信息
      orderId: "" //d当前服务订单id
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.query();
  },
  methods: {
    query() {
      var _this = this;
      var data = {
        orderID: this.orderId,
        getPatient: 1,
        isaction: 1
      };
      this.$doRequest("/api/Inquiry/orderDetails", data,function(res){
        _this.userInfo = res;
      });
    }
  },
  mounted() {}
};
</script>
<style>
.top-py,
.allergy-py {
  background: #ffffff;
  padding: 16px 20px;
  margin-bottom: 6px;
}
.top-py img {
  vertical-align: middle;
}
.name-py {
  display: inline-block;
  /* margin-left: 14px; */
  vertical-align: middle;
}
.name-py p:nth-child(1) span:nth-child(2) {
  color: #818181;
  margin-left: 10px;
}
.name-py p:nth-child(2) {
  color: #818181;
  font-size: 16px;
}
.report-py {
  background: #ffffff;
  margin-bottom: 6px;
}
.report-py p {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f0f5;
}
.report-py p:nth-child(1) {
  font-weight: bold;
  font-size: 15px;
}
.msg-py {
  text-align: center;
  color: #c1c1c1;
  margin-bottom: 16px;
}
.allergy-py p:nth-child(2) {
  margin: 16px 0;
}
</style>
