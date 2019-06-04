<template>
    <div class="login">
        <div class="page">
            <img class="beef" src="../../assets/1.png">
            <img class="titles" src="../../assets/title.png" alt="">
            <img class="lock" src="../../assets/6.png" alt="">
            <div class="logins">
                <p class="login-title">医生登录</p>
                <el-form class="form-login">
                    <el-form-item prop="username">
                        <img width="14" height="20" src="../../assets/phone.png" alt="">
                        <el-input placeholder='请输入您的手机号' v-model="telephone" oninput="if(value.length>11)value=value.slice(0,11)"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <img width="14" height="20" src="../../assets/password.png" alt="">
                        <el-input  @keyup.enter.native="submitRegister" v-model="phoneCode" oninput="if(value.length>4)value=value.slice(0,4)"></el-input>
                        <span style="cursor: pointer;" @click="getCode">{{count}}</span>
                    </el-form-item>
                    <el-form-item prop="outpatientid" v-if="isOutpatient">
                        <el-select v-model="outpatientid" placeholder="请选择所属机构">
                            <el-option
                            v-for="item in outpatientList"
                            :key="item.id"
                            :label="item.outpatientname"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button @click="submitRegister" style="width:100%;" size="small" type="primary">登录</el-button>
                </el-form>
                <p style="margin-bottom:30px;cursor: pointer;color: #07A591;" @click="centerDialogVisible = true">系统人员登录<i class="el-icon-d-arrow-right"></i></p>
            </div>
            <p class="footers">北京好中医医疗信息有限公司</p>
        </div>
        <el-dialog class="dialog-login" title="登录" :visible.sync="centerDialogVisible" width="20%" center>
            <el-form class="form-login">
                <el-form-item prop="username">
                    <img width="14" height="20" src="../../assets/phone.png" alt="">
                    <el-input type="text" placeholder='请输入您的账号' v-model="name" oninput="if(value.length>11)value=value.slice(0,11)"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <img width="14" height="20" src="../../assets/password.png" alt="">
                    <el-input  @keyup.enter.native="getlanding" type="password" v-model="pwd" placeholder='请输入您的密码' style=""></el-input>
                </el-form-item>
                <el-button @click="getlanding" style="width:100%;"  size="small" type="primary">登录</el-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
   import getphone from "../../../static/public.js"
export default {

    data(){
        return {
            count:'',
            telephone:'',
            count: '获取验证码',
            isGet: true,
            phoneCode:"",
            isSubmit: true,
            showPositionValue:false,
            toastText:"",
            istrue: false,
            isShow:false,//判断是否点击后台登录
            name:"",
            pwd:"",
            centerDialogVisible: false,
            rock:false,//手机号验证锁
            isOutpatient: false,
            outpatientList: [],
            outpatientid: ''
        }
    },
    //挂载完成
    methods:{
        //后台登陆
        keyDown(event){
            var e = event || window.event;
            if(e&&e.keyCode==13){ // enter 键
                this.getlanding(); 
            }
        },
        getlanding(){
            let _this = this;
            var pwds=this.$md5(this.pwd);
            this.$doRequest("/api/backgrounduser/crtvLogin",{"accountname": this.name,"password":pwds,type:"2"},function(res){
                _this.$store.state.session=res.parameters.session;
                if(res.parameters.funtionblock){
                    sessionStorage.setItem("sidePage",JSON.stringify(res.parameters.funtionblock));//后台登陆权限
                }
                if(res.parameters.session){
                    sessionStorage.setItem("session",res.parameters.session);//后台登陆session
                }
                if(res){
                    sessionStorage.setItem("loginDetail",JSON.stringify(res))//登录返回所有信息
                }
                _this.$router.push({path: res.parameters.funtionblock[0].url});
           })
        },
        landing(){
            this.isShow=!this.isShow;
        },
        //获取验证码
        getCode(){
            if(this.isGet){
                this.count="获取验证码";
                let _this = this;
                let reg = /^1[3456789]\d{9}$/;//18513176976
                this.istrue = reg.test(this.telephone);
                if(!this.istrue){
                    if(this.rock != this.telephone){
                        this.$Message.error('请输入正确的手机号');
                        this.toastText = '请输入正确的手机号';
                    }
                    this.showPositionValue = true;
                    this.rock = this.telephone;
                    return;
                }else{
                     this.$doRequest("/api/backgrounduser/getphonecode",{"parameters": this.telephone},res => {
                        if(res.result =="1"){
                            let num = 60;
                            let timer = setInterval(function (){
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
                            this.$message(res.message);
                            this.showPositionValue = true;
                        }
                     });
                }
            };
            //获取机构
            this.$doRequest("/api/backgrounduser/outpatientDoctorLoginbefore",{"parameters": this.telephone},res => {
                if(res.parameters.length > 0){
                    this.outpatientList = res.parameters;
                    this.isOutpatient = true;
                }
                
            });
        },
        //医生登录请求
        submitRegister(){
                //验证
                var _this=this;
                if(!this.telephone){
                    this.toastText = '请输入正确格式的手机号';
                    this.$message(this.toastText);
                    this.showPositionValue = true;
                }else if(!this.phoneCode){
                    this.toastText = '请输入正确格式的验证码';
                    this.$message(this.toastText);
                    this.showPositionValue = true;
                }else{
                    this.isSubmit = false;
                     var tel = getphone.Encrypt(this.telephone);
                    let params = {
                        parameters: this.telephone,
                        parametersone: this.phoneCode,
                        outpatientid: this.outpatientid
                    };
                    this.$doRequest("/api/backgrounduser/outpatientDoctorLogin", params,res => {
                        if(res.result==1){
                            _this.$store.state.session=res.parameters.session;
                            if(res.parameters.funtionblock){
                                sessionStorage.setItem("sidePage",JSON.stringify(res.parameters.funtionblock));//后台登陆权限
                            }
                            if(res.parameters.session){
                                sessionStorage.setItem("session",res.parameters.session);//后台登陆session
                            }
                            if(res){
                                sessionStorage.setItem("loginDetail",JSON.stringify(res))//登录返回所有信息
                            }
                            _this.$doRequest("/api/doctorinterrogation/towork",{},res=>{
                            })
                            _this.$router.push({path: res.parameters.funtionblock[0].url});
                        }else if(res.result==3){
                            _this.$message({
                                message: '后台未查询到该医生,请联系管理员添加!',
                                type: 'error'
                            });
                        }else{
                            _this.toastText = res.message;
                            _this.showPositionValue = true;
                        }
                    });
                }
            },
    },
    mounted(){
        // var that=this;
        // document.onkeydown=function(e){
        //     if(e.keyCode==13){
        //         that.getlanding();
        //     }
        // }
    }
}
</script>
<style lang="less" scoped>
.login{
        .page{
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background-image: url('../../assets/border.png');
            background-size: 100% 100%;
            background-repeat: repeat-y;
            
            .beef{
                width: 56%;
                height: auto;
                position: absolute;
                top: 20%;
                left: 12%;
                z-index: 9;
            }
            .titles{
                position: absolute;
                top: 16%;
                left: 8%;
                z-index: 500;
            }
            .lock{
                position: absolute;
                left: 9%;
                top: 28%;
                z-index: 500;
            }
            .logins{
                @media screen and (max-width: 2059px){
                    width: 18%;
                }
                @media screen and (max-width: 1809px){
                    width: 20%;
                }
                @media screen and (max-width: 1559px){
                    width: 22%;
                }
                @media screen and (max-width: 1309px){
                    width: 24%;
                }
                @media screen and (max-width: 1059px){
                    width: 26%;
                }
                position: absolute;
                top: 34%;
                right: 10%;
                background: #ffffff;
                border-radius: 6px;
                padding: 0 20px;
                z-index:2;
                .login-title{
                    text-align: center;
                    color: #07A591;
                    padding: 16px 0;
                    border-bottom: 1px solid #c1c1c1;
                    font-size: 18px;
                }
                .form-login{
                    margin: 30px 0 20px;
                    .el-form-item:nth-child(1){
                        border: 1px solid #e3e3e3;
                        border-radius: 4px;
                        .el-form-item__content{
                            img{
                                margin: 0 14px;
                                vertical-align: middle;
                            }
                            .el-input{
                                width: calc(100% - 48px);
                                padding-left: 10px;
                                vertical-align: middle;
                            }
                        }
                    }
                    .el-form-item:nth-child(2){
                        border: 1px solid #e3e3e3;
                        border-radius: 4px;
                        .el-form-item__content{
                            img{
                                margin: 0 14px;
                                vertical-align: middle;
                            }
                            .el-input{
                                width: calc(100% - 150px);
                                padding-left: 10px;
                                vertical-align: middle;
                            }
                        }
                    }
                    /deep/ .el-input__inner{
                        border: none;
                    }
                    /deep/ .el-button--primary{
                        color: #ffffff;
                        background: #07A591;
                        border-color: #07A591;
                    }
                    /deep/ .el-button--primary:hover{
                        color: #ffffff;
                        background: #07A591;
                        border-color: #07A591;
                    }
                }
            }
            .footers{
                position: absolute;
                font-size: 14px;
                bottom: 20px;
                left: 50%;
                margin-left: -90px;
                color: #ffffff;
                font-weight: lighter;
            }
        }
        /deep/ .el-dialog__header{
            border-bottom: 1px solid #eeeeee;
        }
        .el-dialog{
            .form-login{
                    margin: 30px 0 20px;
                    .el-form-item:nth-child(1){
                        border: 1px solid #e3e3e3;
                        border-radius: 4px;
                        .el-form-item__content{
                            img{
                                margin: 0 14px;
                                vertical-align: middle;
                            }
                            .el-input{
                                width: calc(100% - 48px);
                                padding-left: 10px;
                                vertical-align: middle;
                            }
                        }
                    }
                    .el-form-item:nth-child(2){
                        border: 1px solid #e3e3e3;
                        border-radius: 4px;
                        .el-form-item__content{
                            img{
                                margin: 0 14px;
                                vertical-align: middle;
                            }
                            .el-input{
                                width: calc(100% - 48px);
                                padding-left: 10px;
                                vertical-align: middle;
                            }
                        }
                    }
                    /deep/ .el-input__inner{
                        border: none;
                    }
                    /deep/ .el-button--primary{
                        color: #ffffff;
                        background: #07A591;
                        border-color: #07A591;
                    }
                    /deep/ .el-button--primary:hover{
                        color: #ffffff;
                        background: #07A591;
                        border-color: #07A591;
                    }
                }
        }
        .el-select{
            width: 100%;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
        }
    }
</style>


