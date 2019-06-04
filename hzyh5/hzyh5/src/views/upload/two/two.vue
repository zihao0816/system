<template>
    <div class="two">
        <!-- v-else -->
        <div class="page-py">
            <div class="patientName" @click="routerTo">
                 <wv-cell :title="$store.state.userInfo.patientname?$store.state.userInfo.patientname:'添加患者'" is-link :value="pickerdate" />
            </div>
            <div class="addreadme-py">
                <div class="aone-py">
                    <p class="title-py titles-py">病症自述</p>
                    <div class="texts-py">
                        <textarea maxlength="500" v-model="patientInfo.symptom" name="" id="" rows="6" placeholder="请详细描述您的病情与症状，帮助医生更准确的了解您的病情" @blur="updateTop"></textarea>
                        <p class="maxlength">{{patientInfo.symptom.length>0?patientInfo.symptom.length:0}}/500</p>
                        <!-- <wv-group class="xxxx" style="background:#F8F8F8">
                            <wv-textarea style="background:#F8F8F8;border-radius:8px;" placeholder="请输入文本" :rows="4" v-model="patientInfo.symptom" :max-length="500"></wv-textarea>
                        </wv-group> -->
                    </div>
                </div>
                <div class="aone-py">
                    <div class="texts-py textHeight">
                        <label for="height" style="display:flex;" class="label">
                            <span style="margin-bottom:16px;">身高 <i>(厘米)</i></span>
                            <input type="number" name="" oninput="if(value.length>3)value=value.slice(0,3)" class="height-py" id="height" placeholder="请输入整数" v-model="patientInfo.height" @blur="updateTop">
                        </label><br>
                        <label for="weight" style="display:flex;" class="label">
                            <span style="margin-bottom:16px;">体重 <i>(公斤)</i></span>
                            <input type="number" name="" oninput="if(value.length>3)value=value.slice(0,3)" class="weight-py" id="weight" placeholder="请输入整数" v-model="patientInfo.weight" @blur="updateTop">
                        </label>
                    </div>
                </div>
                <div class="aone-py">
                    <p class="title-py">过敏史<span>（选填）</span></p>
                    <div class="texts-py">
                        <textarea name="" id="" maxlength="500" rows="6" placeholder="请详细描述您的病情与症状，帮助医生更准确的了解您的病情" v-model="patientInfo.allergichistory" @blur="updateTop"></textarea>
                        <p class="maxlength">{{patientInfo.allergichistory.length>0?patientInfo.allergichistory.length:0}}/500</p>
                    </div>
                </div>
                <div class="aone-py footer-py">
                    <p class="title-py">既往病史<span >（选填）</span></p>
                    <div class="texts-py">
                        <textarea name="" id="" maxlength="500" rows="6" placeholder="请详细描述您的病情与症状，帮助医生更准确的了解您的病情" v-model="patientInfo.pastcase" @blur="updateTop"></textarea>
                        <p class="maxlength">{{patientInfo.pastcase.length>0?patientInfo.pastcase.length:0}}/500</p>
                    </div>
                </div>
            </div>
            <div class="btn-py">
                <el-button type="primary" @click="sendDoctor">发送给医生</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            pickerdate:"",
            patientInfo: {
                symptom: "",
                height: "",
                weight: "",
                allergichistory: "",
                pastcase: "",
                orderid: "",
                parientid: ""
            },
            orderID: "",
            userInfo: {}
        };
    },
    created() {
        this.orderID = this.$route.query.orderId;
        this.userInfo = this.$store.state.userInfo;
        document.title="问诊资料";
        let sexAll=this.userInfo.sex=='1'?'男':'女';
        this.pickerdate=this.userInfo.age?(sexAll+' '+this.userInfo.age):'';
    },
    methods: {
        updateTop(){
            window.scroll(0,0);
        },
        sendDoctor() {
            var _this = this;
            var reg = /(^[1-9]\d*$)/;
            if (this.patientInfo.symptom == "") {
                this.$toastMsg("请填写病症自述");
                return false;
            }
            if (this.patientInfo.height == "") {
                this.$toastMsg("请填写身高");
                return false;
            }
            if (this.patientInfo.weight == "") {
                this.$toastMsg("请填写体重");
                return false;
            }
            if(!reg.test(this.patientInfo.height) || !reg.test(this.patientInfo.weight)){
                this.$toastMsg('请输入整数');
                return false;
            }
            this.patientInfo.orderid = this.orderID;
            this.patientInfo.parientid = this.userInfo.id;
            this.$doRequest("/api/Inquiry/complainedModified",_this.patientInfo,res => {
                _this.$toastMsg("提交成功");
                var ext = {
                    businessType: "patient_profile",
                    orderid: _this.$route.query.orderId,
                  businessBody:{
                    patientname: _this.$store.state.userInfo.patientname,
                    patientnickname: _this.$store.state.userInfo.patientnickname,
                    sex: _this.$store.state.userInfo.sex,
                    age: _this.$store.state.userInfo.age,
                    symptom:_this.patientInfo.symptom
                  }
                };
                _this.$sendPrivateText(_this,_this.$store.state.AllOfValue.ImDoctorInfo.doctorId,"我已上传问诊资料",function(msg) {
                    _this.$router.push({ path: "/im" });
                    var data = {
                        fromid: _this.$store.state.userInfo.id,
                        toid: _this.messages.doctorId,
                        msgtype: "3",
                        val: "患者已上传问诊单",
                        fromType: "2",
                        fromName: _this.$store.state.userInfo.patientnickname,
                        orderid: _this.$route.query.orderId
                    };
                    _this.$doRequest("/api/ImUtil/signIm", data, function(res) {
                    });
                },ext);
            });
        },
        routerTo() {
            var _this = this;
            this.$router.push({ path: "/three", query: { orderId: _this.orderID } });
        }
    }
};
</script>
<style scoped>
@import "two.css";
</style>

