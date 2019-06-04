<template>
    <div class='boundPhone'>
        <div class="page">
            <div>
                <span>手机验证</span>
            </div>
            <div class="phone">
                <input v-model="phoneNumber" placeholder="请输入手机号码" oninput="if(value.length>11)value=value.slice(0,11)" type="number">
            </div>
            <div class="code">
                <input :style="widths" type="number" v-model="phoneCode" oninput="if(value.length>4)value=value.slice(0,4)" placeholder="请输入短信验证码">
                <span @click="getcode">{{code}}</span>
            </div>
            <div class="btn">
                <button @click="routerToInformation">下一步</button>
            </div>
        </div>  
    </div>
</template>
<script>
import getphone from '../../../static/public.js';
export default {
    data(){
        return {
            code: '获取验证码',
            isclick: true,
            istrue:'',
            phoneNumber: '',
            phoneCode: '',
            widths: {
                width: 'calc(100% - 74px)'
            }
        }
    },
    created(){
        document.title = '';
    },
    methods: {
        routerToInformation(){
            if(this.phoneNumber == ''){
                this.$toastMsg('请输入手机号');
                return;
            }
            if(this.phoneCode == ''){
                this.$toastMsg('请输入验证码');
                return;
            }
            let data = {
                telephone: this.phoneNumber,
                code: this.phoneCode
            }
            if(this.$store.state.origin != ''){
                data.origin = this.$store.state.origin;
                data.clinicid = this.$store.state.clinicId;
                data.doctorid = this.$store.state.doctorId;
                this.$doRequest('/api/Personal/getUserInformation',data,res=>{
                    this.$store.state.userInfo.sessionId = res.parameters.session;
                    if(res.parameters.patientname != null && res.parameters.patientname != ''){
                        if(res.parameters.diagnosisqueue){
                            this.$router.push({path: '/systemRegistered/payResult', query: {type: 1,patientid: res.parameters.id}});
                        }else{
                            var data = {
                                doctorid: this.$store.state.doctorId,
                                patientid: res.parameters.id,
                                hospitainid: this.$store.state.clinicId
                            }
                            var ua = navigator.userAgent.toLowerCase();
                            if(ua.match(/MicroMessenger/i)=="micromessenger") {
                                data.wptype = 'jsapi';
                              data.openid=this.$store.state.openid;
                            } else {
                                data.wptype = 'h5';
                            }
                            var resc=res;
                            this.$doRequest('/api/diagnosisqueue/wxpay', data ,res=>{
                                if(data.wptype == 'jsapi'){
                                    if(this.$store.state.free){
                                        location.href = res.parameters;
                                    }else{
                                        WeixinJSBridge.invoke('getBrandWCPayRequest', res.parameters,ress=>{
                                            if (ress.err_msg == "get_brand_wcpay_request:ok") {
                                                this.$router.push({path: '/systemRegistered/payResult', query: {type: 0,patientid: resc.parameters.id}});
                                            } else {
                                                this.$toastMsg("支付失败");
                                            }
                                        });
                                    }
                                  
                                }else if(data.wptype == 'h5'){
                                    if(this.$store.state.free){
                                        location.href = res.parameters;
                                    }else{
                                        sessionStorage.setItem('doctorid',this.$store.state.doctorId);
                                        sessionStorage.setItem('hospitainid',this.$store.state.clinicId);
                                        sessionStorage.setItem('patientid',resc.parameters.id)
                                        location.href = res.parameters + '&redirect_url=http://hzyh5.51bjhzy.com/systemRegistered/payResult';
                                    }
                                }
                            })
                        }
                    }else{
                        this.$router.push({ path: '/systemRegistered/perfectInformation', query: {tel: this.phoneNumber}});
                    }
                })
            }else{
                this.$doRequest('/api/Personal/getUserInformation',data,res=>{
                    this.$router.push({path:'/perfectInformation',query:{phoneNum: this.phoneNumber,userInfo: res.parameters,form: this.$route.query.form}})
                })
            }
        },
        getcode(){
            var _this = this;
            var reg = /^1[3456789]\d{9}$/
            if(_this.isclick){ 
                var num = 60;
                _this.istrue = reg.test(_this.phoneNumber);
                if(!_this.istrue){
                    _this.$toastMsg("手机号错误");
                }else{
                    var phone = getphone.Encrypt(_this.phoneNumber);
                    _this.$doRequest(
                        "/api/AppHomePage/verificationCode/getPhoneCode",{parameters:phone}
                    ,res => {
                    }); 
                    var timer = setInterval(function () {
                        num--
                        _this.code = num + 's重新获取';
                        _this.isclick = false;
                        _this.widths = {
                            width: 'calc(100% - 82px)'
                        }
                        if (num === 0) {
                            _this.isclick = true;
                            _this.code = '获取验证码';
                            _this.widths = {
                                width: 'calc(100% - 74px)'
                            }
                            clearInterval(timer);
                        }
                    }, 1000);
                }
            }else{
                return
            }
        },
    }
};
</script>
<style lang="less">
@import "index.less";
</style>


