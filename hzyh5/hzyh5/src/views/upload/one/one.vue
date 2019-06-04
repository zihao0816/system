<template>
  <div class="one">
    <div class="content-py">
      <div
        class="consult-py"
        v-for="(item,index) in consultation"
        :key="index"
      >
        <span>{{index+1}}.{{item.questionname}}</span>({{item.singleselection==1?'单选':'多选'}})
        <div
          class="consult-item-py"
          v-if="item.singleselection==2"
        >
          <el-checkbox-group v-model="item.ischecked">
            <el-checkbox
              class="answer-py"
              v-for="item in item.orderinquiryoptions"
              :label="item.id"
              :key="item.id"
            >{{item.anwser}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div
          class="consult-item-py"
          v-else
        >
          <el-radio-group v-model="item.ischecked">
            <el-radio
              class="answer-py"
              v-for="item in item.orderinquiryoptions"
              :label="item.id"
              :key="item.id"
            >{{item.anwser}}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <div class="btn-py">
      <el-button
        type="primary"
        @click="sendDoctor"
      >发送给医生</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      consultation: []
    };
  },
  created() {
    this.$isLogin(window.location.search.substr(1), this.query);
  },
  methods: {
    query() {
      var _this = this;
      this.$doRequest("/api/Inquiry/getConsultationForm", null, res => {
        if (res.result == 0) {
          for (var i = 0; i < res.parameters.length; i++) {
            res.parameters[i].ischecked = [];
            _this.consultation.push(res.parameters[i]);
          }
        }
      });
    },
    ab(a) {
      var answer = [];
      var answers = {};
      var _this = this;
      for (var j = 0; j < a.length; j++) {
        answers = {
          orderid: _this.$route.query.orderId,
          qustionid: a[j].questionid,
          anwser: a[j].anwser,
          ischecked: null,
          id: a[j].id
        };
        answer.push(answers);
      }
      return answer;
    },
    sendDoctor() {
      var consultation = this.consultation;
      var reorderinquiryquestion = [];
      var question = {};
      var _this = this;
      for (var i = 0; i < consultation.length; i++) {
        if(typeof consultation[i].ischecked == 'string'){
          var c = consultation[i].ischecked;
          consultation[i].ischecked = [];
          consultation[i].ischecked.push(c);
        }
        if (consultation[i].ischecked.length == 0) {
          this.$toastMsg("请补填第" + (i + 1) + "题");
          return false;
        } else {
          question = {
            ordereid: _this.$route.query.orderId,
            questionname: consultation[i].questionname,
            singleselection: consultation[i].singleselection,
            isrequired: consultation[i].isrequired,
            answerId: consultation[i].ischecked
          };
          var a = consultation[i].orderinquiryoptions;
          question.orderinquiryoptions = _this.ab(a);
          reorderinquiryquestion.push(question);
        }
      }
      var data = {
        orderid: this.$route.query.orderId,
        reorderinquiryquestion: reorderinquiryquestion
      };
      this.$doRequest("/api/Inquiry/inquirySubmission", data, res => {
        _this.$toastMsg("提交成功");
        var ext = {
          'businessType': 'profileFinish',
          'orderid': _this.$route.query.orderId
        };
        _this.$sendPrivateText(_this,_this.$store.state.AllOfValue.ImDoctorInfo.doctorId,'我已上传问诊单',function(msg){
          _this.$router.go(-1);
          var data = {
            fromid: _this.$store.state.userInfo.id,
            toid: _this.messages.doctorId,
            msgtype: '3',
            val: '患者已上传问诊单',
            fromType: '2',
            fromName: _this.$store.state.userInfo.patientnickname,
            orderid: _this.$route.query.orderId
          }
          _this.$doRequest('/api/ImUtil/signIm',data,function(res){
          })
        },ext);
      });
    }
  }
};
</script>
<style>
.one {
  margin-top: 4px;
}
.content-py {
  padding-bottom: 30px;
}
.consult-py {
  padding: 16px 20px;
  background: #ffffff;
  margin-top: 1px;
}
.consult-item-py {
  margin-top: 18px;
}
.answer-py {
  margin: 0 20px 20px 0;
}
.one .el-checkbox{
  color: #141414;
}
.one .el-checkbox + .el-checkbox {
  margin-left: 0px;
}
.one .el-checkbox__inner {
  border-radius: 50%;
}
.one .el-checkbox__inner:hover {
  border-color: #d74326;
}
.one .el-checkbox__input.is-focus .el-checkbox__inner {
  border-radius: 50%;
  border-color: #dcdfe6;
}
.one .el-checkbox__input.is-checked .el-checkbox__inner,
.one .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #d74326;
  border-color: #d74326;
  border-radius: 50%;
}
.one .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #d74326;
}

.one .el-radio + .el-radio {
  margin-left: 0px;
}
.one .el-radio__inner {
  border-radius: 50%;
}
.one .el-radio__inner:hover {
  border-color: #d74326;
}
.one .el-radio__input.is-focus .el-radio__inner {
  border-radius: 50%;
  border-color: #dcdfe6;
}
.one .el-radio__input.is-checked .el-radio__inner,
.one .el-radio__input.is-indeterminate .el-radio__inner {
  background: #d74326;
  border-color: #d74326;
  border-radius: 50%;
}
.one .el-radio__input.is-checked + .el-radio__label {
  color: #d74326;
}
.btn-py {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
}
.one .el-button--primary {
  background: #d74326;
  border-color: #d74326;
  width: 100%;
  border-radius: 0;
}
.one .el-button--primary:focus,
.one .el-button--primary:hover {
  background: #d74326;
  border-color: #d74326;
}
</style>



