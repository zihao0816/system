<template>
    <div class="perfectinformation">
        <div class="page">
            <div class="title">根据国家相关规定，就诊需实名制，请如实填写信息（带*号的为必填项），以便医生辨认（仅医生可见）</div>
            <div class="content">
                <div class="patient">
                    <div class="samestyle">
                        <span class="samecolor">*</span>
                        <span>患者姓名</span>
                        <div class="samediv">
                            <input type="text" v-model="patientname" placeholder="请输入患者真实姓名">
                        </div>
                    </div>
                    <div class="samestyle">
                        <span class="samecolor">*</span>
                        <span>患者性别</span>
                        <div class="samediv">
                            <el-radio-group v-model="sex">
                                <el-radio :label="'1'">男</el-radio>
                                <el-radio :label="'2'">女</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="samestyle">
                        <span class="samecolor">*</span>
                        <span>患者生日</span>
                        <div class="select samediv">
                           <datetime placeholder='请选择生日日期' v-model="birthday" :min-year=1919 @on-change='change'></datetime>
                        </div>
                    </div>
                    <div class="samestyle">
                        <span class="samecolor" style="opacity:0;">*</span>
                        <span style="margin-right:10px;">身份证号码</span>
                        <div class="samediv">
                            <input type="text" v-model="idnumber" oninput="if(value.length>18)value=value.slice(0,18)" placeholder="请输入真实的身份证号码">
                        </div>
                    </div>
                </div>
                <div class="btn">
                    <button @click="add">提交并支付挂号费{{price}}元</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            patientname: '',
            sex: '',
            birthday: '',
            idnumber: '',
            birthday: '',
            price: this.$store.state.price
        }
    },
    created(){
        document.title = '完善信息';
        
    },
    methods: {
        change(v){
            this.birthday = v
        },
        add(){
            if(this.patientname == null || this.patientname == ''){
                this.$toastMsg('请输入患者姓名');
                return;
            }
            if(this.sex == null || this.sex == ''){
                this.$toastMsg('请选择性别');
                return;
            }
            if(this.birthday == null || this.birthday == ''){
                this.$toastMsg('请选择生日日期');
                return;
            }
            var data = {
                patientname: this.patientname,
                sex: this.sex,
                birthday: this.birthday,
                idnumber: this.idnumber,
                telephone: this.$route.query.tel,

            }
            this.$doRequest('/api/Personal/ghregister', data, res=>{
                var datas = {
                    doctorid: this.$store.state.doctorId,
                    patientid: res.parameters,
                    hospitainid: this.$store.state.clinicId
                }
                var ua = navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i)=="micromessenger") {
                    datas.wptype = 'jsapi';
                    datas.openid=this.$store.state.openid;
                } else {
                    datas.wptype = 'h5';
                }
                var resc=res;
                this.$doRequest('/api/diagnosisqueue/wxpay', datas ,res=>{
                    if(datas.wptype == 'jsapi'){
                        if(this.$store.state.free){
                            location.href = res.parameters;
                        }else{
                            WeixinJSBridge.invoke('getBrandWCPayRequest', res.parameters,ress=>{
                                if (ress.err_msg == "get_brand_wcpay_request:ok") {
                                    this.$router.push({path: '/systemRegistered/payResult', query: {type: 0,patientid: resc.parameters}});
                                } else {
                                    this.$toastMsg("支付失败");
                                }
                            });
                        }
                    }else if(datas.wptype == 'h5'){
                        if(this.$store.state.free){
                            location.href = res.parameters;
                        }else{
                            sessionStorage.setItem('doctorid',this.$store.state.doctorId);
                            sessionStorage.setItem('hospitainid',this.$store.state.clinicId);
                            sessionStorage.setItem('patientid',resc.parameters)
                            location.href = res.parameters + '&redirect_url=http://hzyh5.51bjhzy.com/systemRegistered/payResult';
                        }
                    }
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
@import 'index.less';
</style>

