<template>
    <div class="register">
        <header>
            <img src="../../assets/icone66@3x.png"> 
            <img src="../../assets/hzyguidetext@3x.png">
        </header>
        <div class="center">
            <div>
                <input type="number" placeholder='请输入北京好中医登录手机号' v-model="telephone" oninput="if(value.length>11)value=value.slice(0,11)">
            </div>
            <div>
                <input type="number" placeholder='请输入验证码' v-model="phoneCode" oninput="if(value.length>4)value=value.slice(0,4)">
                <span @click="getCode" class="code">{{count}}</span>
            </div>
            <button :class="isSubmit?'submit':'nosubmit'" @click="submitRegister">登录</button>
        </div>
        <!-- 弹框 -->
        <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :text="toastText" :position="position" width="auto"></toast>
        <!-- 操作弹框 -->
        <div>
            <confirm v-model="show"
                @on-confirm="onsubmit">
                <p style="text-align:center;">该手机号尚未注册，前往注册，审核通过后即可开启您的个人线上医馆</p>
            </confirm>
        </div>
    </div>
</template>
<script>
import common from '../../api/common';
import { Toast, Confirm} from 'vux'
    export default {
        components: {
            Toast,
            Confirm
        },
        data() {
            return {
                telephone: '',//手机号
                phoneCode: '',//验证码
                count: '获取验证码',
                isSubmit: true,
                code: '',
                isGet: true,
                //弹框
                showPositionValue: false, //是否显示提示
                position: 'center', //提示信息的位置
                toastText: '', // 提示文本
                //操作弹框
                show: false
            }
        },
        //挂载完成
        methods: {
            //弹框确定
            onsubmit(){
                this.$router.push({path: '/login'});
            },
            //获取用户code
            getWechatCode(){
                this.code = common.getQueryString(window.location.search.substr(1), 'code');
            },
            //获取验证码
            getCode(){
                if(this.isGet){
                    let reg = /^1[3456789]\d{9}$/;//18513176976   15340027750
                    this.istrue = reg.test(this.telephone);
                    if(!this.istrue){
                        this.toastText = '请输入正确的手机号';
                        this.showPositionValue = true;
                        return;
                    }else{
                        let _this = this;
                        let num = 60;
                        let timer = setInterval(function () {
                            num--
                            _this.count = num + 's重新获取';
                            _this.isGet = false;
                            if (num === 0) {
                                _this.isGet = true;
                                _this.count = '获取验证码';
                                clearInterval(timer);
                            }
                        }, 1000);
                        this.$doRequest("/api/AppHomePage/getPcode",{parameters: this.telephone},res => {
                            if(res.result > 0){
                                if(res.result == 1){
                                    //已注册
                                }else{
                                    //未注册
                                    this.show = true;
                                }
                            }else{
                                this.toastText = res.message;
                                this.showPositionValue = true;
                            }
                        });
                    }
                }
            },
            //登录请求
            submitRegister(){
                //验证
                if(!this.telephone){
                    this.toastText = '请输入正确格式的手机号';
                    this.showPositionValue = true;
                }else if(!this.phoneCode){
                    this.toastText = '请输入正确格式的验证码';
                    this.showPositionValue = true;
                }{
                    this.isSubmit = false;
                    let params = {
                        telePhone: this.telephone,
                        phoneCode: this.phoneCode,
                        code: this.code,
                    };
                    this.$doRequest("api/AppHomePage/doctorLogin", params,res => {
                        if(res.result > 0){
                            this.$router.push({path: '/doctorDetails',query: {openid: res.openid,telePhone: this.telephone}});
                        }else{
                            this.toastText = res.message;
                            this.showPositionValue = true;
                        }
                    });
                }
            },
            //机构跳转
            goPath(){
                this.$router.push({path: '/hospitalList', query: {
                        doctorname: this.doctorname,
                        telephone: this.telephone,
                        phoneCode: this.phoneCode,
                        site: this.site}
                        });
            }
        },
        //生命周期之创建完成
        created: function() {
            this.getWechatCode();
            document.title = '医生登录';
        }
    }
</script>
<style lang="less">
.register{
    width: 100%;
    height: 100vh;
    background: #fff;
    header{
        padding: 20px 0;
        img{
            display: block;
            margin: 0 auto;
        }
        img:nth-child(1){
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
            border-radius: 6px;
        }
        img:nth-child(2){
            width: 110px;
            height: auto;
        }
    }
    .center{
        padding: 0 16px;
        >div{
            width: 100%;
            height: 52px;
            border-bottom: 1px solid #F1F0F5;
            line-height: 52px;
            color: #818181;
            font-weight: 200;
            overflow: hidden;
            position: relative;
            input{
                width: 100%;
                height: 52px;
                line-height: 52px;
                text-align: left;
                float: right;
                font-size: 16px;
                color: #141414;
                padding-left: 20px;
            }
            span.go{
                width: 4px;
                height: 11px;
                float: right;
                margin: 21px 0;
                background: url(../../assets/xyj_y@3x.png);
                background-size: 100% 100%;
            }
            span.code{
                position: absolute;
                top: 0;
                right: 0;
                color: #4A90E2;
                font-size: 14px;
            }
            span.name{
                float: right;
                padding-right: 10px;
                color: #141414;
            }
            div.address{
                width: 80%;
                height: 52px;
                float: right;
                .vux-no-group-title{
                    margin-top: 0;
                    height: 52px;
                    line-height: 52px;
                    font-size: 16px;
                    .weui-cell{
                        padding: 0;
                    }
                }
                .weui-cell__ft{
                    width: 4px;
                    height: 11px;
                    float: right;
                    margin: 21px 0;
                    background: url(../../assets/xyj_y@3x.png);
                    background-size: 100% 100%;
                    padding-right: 0;
                    margin-left: 10px;
                }
                .weui-cells:before{
                    border: none;
                    display: none;
                }
                .weui-cell_access .weui-cell__ft:after{
                    display: none;
                }
            }
        }
        >div:nth-child(1){
            input{
                background-image: url(../../assets/srshoujihao@3x.png);
                background-size: 12px auto;
                background-repeat: no-repeat;
                background-position: 0 18px;
            }
        }
        >div:nth-child(2){
            input{
                background-image: url(../../assets/shuruyanzhenma@3x.png);
                background-size: 14px auto;
                background-repeat: no-repeat;
                background-position: 0 20px;
            }
        }
        >div:nth-child(3){
            input{
                width: 50%;
                text-align: left;
            }
        }
    }
    .explain{
        font-size: 12px;
        width: 100%;
        display: block;
        text-align: center;
        color: #141414;
        a{
            color: #D74326;
            text-decoration:none;
        }
    }
}
</style>
  

