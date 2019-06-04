<template>
    <div class="login">
        <div class="page">
            <img class="beef" src="../../assets/1.png">
            <img class="lock" src="../../assets/10.png" alt="">
            <div class="logins">
                <p class="login-title">登录</p>
                <el-form class="form-login">
                    <el-form-item prop="username">
                        <img width="14" height="20" src="../../assets/phone.png" alt="">
                        <el-input v-model="username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <img width="14" height="20" src="../../assets/password.png" alt="">
                        <el-input @keyup.enter.native='routerToHome' v-model="password" type="password"></el-input>
                    </el-form-item>
                    <el-button @click="routerToHome" style="width:100%;" size="small" type="primary">登录</el-button>
                </el-form>
            </div>
            <p class="footers">北京好中医医疗信息有限公司</p>
        </div>
    </div>
</template>
<script>
import md5 from 'js-md5';
export default {
    data(){
        return{
            username: '',
            password: ''
        }
    },
    methods:{
        routerToHome(){
            var that = this;
            if(this.username == ''){
                this.$dialogMsg('请填写用户名','error');
                return;
            }else if(this.password == ''){
                this.$dialogMsg('请填写密码','error');
                return;
            }
            var data = {
                accountname: this.username,
                type: '3',
                password: md5(that.password)
            }
            this.$doRequest('/api/backgrounduser/crtvLogin', data, function(res){
                sessionStorage.setItem('userInfo',JSON.stringify(res.parameters));
                that.$router.push({path:'/homePage'});
            })
        }
    },
    mounted(){
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
            .lock{
                position: absolute;
                left: 9%;
                top: 18%;
                z-index: 1000;
            }
            .logins{
                width: 18%;
                position: absolute;
                top: 34%;
                right: 10%;
                background: #ffffff;
                border-radius: 6px;
                padding: 0 20px;
                .login-title{
                    text-align: center;
                    color: #07A591;
                    padding: 16px 0;
                    border-bottom: 1px solid #c1c1c1;
                    font-size: 18px;
                }
                .form-login{
                    margin: 30px 0 40px;
                    .el-form-item{
                        border: 1px solid #e3e3e3;
                        background: #f5f5f5;
                        border-radius: 4px;
                        .el-form-item__content{
                            img{
                                padding: 8px 10px 8px 14px;
                                vertical-align: middle;
                            }
                            .el-input{
                                width: calc(100% - 44px);
                                // padding-left: 22px;
                                vertical-align: middle;
                                background: #ffffff;
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
    }
</style>
