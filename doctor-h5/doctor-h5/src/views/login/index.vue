<template>
    <div class="login">
        <header>
            <img src="../../assets/icone66@3x.png"> 
            <img src="../../assets/hzyguidetext@3x.png">
        </header>
        <div class="center">
            <div>
                <span>姓名</span>
                <input type="text" placeholder='请输入您的姓名' v-model="doctorname">
            </div>
            <div>
                <span>手机</span>
                <input type="number" placeholder='请输入您的手机号码' v-model="telephone" oninput="if(value.length>11)value=value.slice(0,11)">
            </div>
            <div>
                <span>验证码</span>
                <input type="number" v-model="phoneCode" oninput="if(value.length>4)value=value.slice(0,4)">
                <span @click="getCode" class="code">{{count}}</span>
            </div>
            <div>
                <span>地区</span>
                <div class="address">
                    <group>
                        <x-address 
                            :title="title"
                            v-model="value" 
                            :list="addressData" 
                            placeholder=""
                            @on-shadow-change="onShadowChange"
                            :show.sync="showAddress">
                        </x-address>
                    </group>
                </div>
            </div>
            <div @click="goPath">
                <span>医疗机构</span>
                <span class="go"></span>
                <span class="name">{{hospitainfoName}}</span>
            </div>
            <button :class="isSubmit?'submit':'nosubmit'" @click="submitRegister">完成医生版注册</button>
            <span class="explain">注册即同意<a href="">《北京好中医医生注册协议》</a></span>
        </div>
        <!-- 弹框 -->
        <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :text="toastText" :position="position" width="auto"></toast>
    </div>
</template>
<script>
import { Group, XAddress, ChinaAddressV4Data, XButton, Cell, Value2nameFilter as value2name, Toast } from 'vux'
    export default {
        components: {
            Group,
            XAddress,
            XButton,
            Cell,
            Toast
        },
        data() {
            return {
                //地区选择
                title: '',
                value: [],//地址初始值
                addressData: ChinaAddressV4Data,
                showAddress: false,
                istrue: false,
                doctorname: this.$route.query.doctorname || '',
                telephone: this.$route.query.telephone || '',
                phoneCode: this.$route.query.phoneCode || '',
                site: this.$route.query.site || '',//地址提交值
                hospitaid: this.$route.query.hospitaid || '',
                hospitainfoName: this.$route.query.hospitainfoName || '',
                count: '获取验证码',
                isGet: true,
                isSubmit: true,
                //弹框
                showPositionValue: false, //是否显示提示
                position: 'center', //提示信息的位置
                toastText: '', // 提示文本
            }
        },
        //挂载完成
        methods: {
            //地区组件
            doShowAddress () {
                this.showAddress = true
                setTimeout(() => {
                    this.showAddress = false
                }, 2000)
            },
            onShadowChange (val,names) {
                this.temporary = names;
                this.site = names.join();
            },
            //获取验证码
            getCode(){
                if(this.isGet){
                    let _this = this;
                    let reg = /^1[3456789]\d{9}$/;//18513176976
                    this.istrue = reg.test(this.telephone);
                    if(!this.istrue){
                        this.toastText = '请输入正确的手机号';
                        this.showPositionValue = true;
                        return;
                    }else{
                        this.$doRequest("/api/AppHomePage/getPcode",{parameters: this.telephone},res => {
                            if(res.result > 0){
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
                            }else{
                                this.toastText = res.message;
                                this.showPositionValue = true;
                            }
                        });
                    }
                }
            },
            //注册请求
            submitRegister(){
                //验证
                if(!this.doctorname){
                    this.toastText = '请输入正确格式的姓名';
                    this.showPositionValue = true;
                }else if(!this.telephone){
                    this.toastText = '请输入正确格式的手机号';
                    this.showPositionValue = true;
                }else if(!this.phoneCode){
                    this.toastText = '请输入正确格式的验证码';
                    this.showPositionValue = true;
                }else if(!this.site){
                    this.toastText = '地区不能为空';
                    this.showPositionValue = true;
                }else if(!this.hospitaid){
                    this.toastText = '请选中机构';
                    this.showPositionValue = true;
                }else{
                    this.isSubmit = false;
                    let params = {
                        doctorname: this.doctorname,
                        telephone: this.telephone,
                        phoneCode: this.phoneCode,
                        site: this.site,
                        hospitaid: this.hospitaid
                    };
                    this.$doRequest("api/AppHomePage/doctorRegister", params,res => {
                        if(res.result > 0){
                            this.toastText = res.message;
                            this.showPositionValue = true;
                            this.$router.push({path: '/explain',query: {telephone: this.telephone}});
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
                        site: this.site,
                        hospitaid: this.hospitaid,
                        hospitainfoName: this.hospitainfoName
                        }
                    });
            }
        },
        //生命周期之创建完成
        created: function() {
            this.$isLogin(window.location.search.substr(1), this.getCaseList);
            document.title = '邀请注册';
        }
    }
</script>
<style lang="less">
.login{
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
                width: 80%;
                height: 52px;
                line-height: 52px;
                text-align: right;
                float: right;
                font-size: 16px;
                color: #141414;
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
  

