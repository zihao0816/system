<template>
  <div class="three">
    <div class="page-py">
      <div class="warn-py">根据国家相关规定,就诊需实名制,请如实填写信息,以便医生辨认（仅医生可见）</div>
      <!-- <div class="headphoto-py">
        <div class="addphoto-py">
          <img width="100" height="100" :src="imageUrl" alt="">
          <div class="uploadphoto-py">
            <i class="el-icon-plus"></i>
            <p>上传照片</p>
            <input type="file" name="" id="" @change="chooseImg($event)" ref="images">
          </div>
        </div>
      </div>-->
      <div class="information-py">
        <div class="addname-py">
          <label for="name">
            <span class="patientName">患者姓名</span>
            <div class="inputstyle-py">
              <input type="text" @blur="updateTop" class="inputPatientName" placeholder="请填写真实姓名"  v-model="patientname"/>
            </div>
          </label>
        </div>
        <div class="addnames-py">
          <span class="patientSex" style="float:left;width:74px">患者性别</span>
          <p>
            <span @click="getSex('女')" :class="sex=='女'?'male':''">女</span>
            <span @click="getSex('男')" :class="sex=='男'?'male':''">男</span>
          </p> 
        </div>
        <div class="addname-py">
          <wv-cell title="患者年龄" is-link :value="pickerdate" @click.native="getPicker" />
          <wv-datetime-picker ref="datePickers" type="date"  @confirm="confirmDate" ></wv-datetime-picker>
        </div>
        <div class="addname-py">
          <wv-cell title="关&ensp;系" is-link :value="relation" @click.native="relationPickerShow = true" />
          <wv-picker :visible.sync="relationPickerShow" :columns="relationColumns" value-key="name" @confirm="confirmRelation" />
        </div>
        <button class="btn-submit-py" @click="sendDoctor">下一步</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import common from "../../../api/common"
export default {
  data() {
    return {
      pickerdate:"请选择",
      pickerValue:[],
      sexPickerShow: false,
      sex: "",
      patientname:'',
      relationPickerShow: false,
      relation: "请选择",
      relationColumns: [
        {
          values: [
            {
              name: "本人",
              id: 1
            },
            {
              name: "父亲",
              id: 2
            },
            {
              name: "母亲",
              id: 3
            },
            {
              name: "妻子",
              id: 4
            },
            {
              name: "儿子",
              id: 5
            },
            {
              name: "女儿",
              id: 6
            },
            {
              name: "孙子",
              id: 7
            },
            {
              name: "孙女",
              id: 8
            },
            {
              name: "爷爷",
              id: 9
            },
            {
              name: "奶奶",
              id: 10
            },
            {
              name: "朋友",
              id: 11
            },
            {
              name: "同事",
              id: 12
            },
            {
              name: "亲戚",
              id: 13
            }
          ]
        }
      ],
      userInfo: {},
      imageUrl: require("../../../assets/my/mrtx@3x.png"),
    };
  },
  created() {
    document.title="患者信息";
    this.userInfo = this.$store.state.userInfo;
    this.patientname=this.userInfo.patientname?this.userInfo.patientname:'';
    this.sex = this.userInfo.sex == "1" ? "男" : "女";
    this.relation = this.userInfo.relationship;
    this.pickerdate=this.userInfo.birthday?this.userInfo.birthday:'请选择';
    this.imageUrl =
      this.userInfo.portrait == ""
        ? this.userInfo.headphoto == ""
          ? this.imageUrl
          : this.userInfo.headphoto
        : this.userInfo.portrait;
    this.userInfo.oldportrait = this.userInfo.portrait;
    this.orderID = this.$route.query.orderId;
  },
  methods: {
    getSex(index){
      this.sex=index;
    },
    confirmDate(value){
      this.pickerdate=common.timestampToTime(value,2)
    },
    getPicker(){
      this.$refs.datePickers.open();
    },
    updateTop(){
      window.scroll(0,0);
    },
    confirmRelation(picker, value) {
      var _this = this;
      this.$nextTick(() => {
        var relation = picker.getValues();
        _this.relation = relation[0].name;
      });
    },
    sendDoctor() {
      var _this = this;
      if (this.userInfo.oldportrait === this.userInfo.portrait) {
        this.userInfo.oldportrait = "";
      }
      if (!(this.patientname)) {
        this.$toastMsg("请填写姓名");
        return false;
      }
      if (!(this.sex)) {
        this.$toastMsg("请选择性别");
        return false;
      }
      if (!(this.pickerdate)&&this.pickerdate=="请选择") {
        this.$toastMsg("请填写出生日期");
        return false;
      }
      if (this.relation == null || this.relation == ""||this.relation == "请选择") {
        this.$toastMsg("请选择关系");
        return false;
      }
      var newpatient = {
        id: this.userInfo.id,
        patientname: this.patientname,
        portrait: this.userInfo.portrait,
        sex: this.sex == "男" ? "1" : "2",
        birthday:this.pickerdate,
        relationship: this.relation,
        oldportrait: this.userInfo.oldportrait
      };
      this.$doRequest("/api/Personal/addpatient", newpatient, res => {
        _this.$doRequest(
          "/api/Personal/getMyDetial",
          { parameters: _this.userInfo.id },
          res => {
            res.sessionId = _this.userInfo.sessionId;
            _this.$store.state.userInfo = res;
            _this.$toastMsg("添加完成");
            this.$router.push({
              path: "/two",
              query: { orderId: _this.orderID, }
            });
          }
        );
      });
    },
    chooseImg(e) {
      var files = e.target.files[0];
      var formData = new FormData();
      formData.append("file", files);
      var _this = this;
      this.$doRequest(
        "/api/FastDfs/uploadLocal",
        formData,
        res => {
          _this.userInfo.portrait = res[0].fileUrl;
          _this.imageUrl = _this.$store.state.fileUrl + res[0].fileUrl;
        },
        null,
        null,
        true
      );
    }
  }
};
</script>
<style scoped>
@import "three.css";
</style>



