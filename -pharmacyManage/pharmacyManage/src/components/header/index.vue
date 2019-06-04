<template>
    <div class="header">
        <div class="logo">
            <img src="../../assets/icone66@3x.png">
            <h3>药房管理系统 V1.0</h3>
        </div>
        <div class="operation">
            <img src="../../assets/icone66@3x.png">
            <el-popover
                placement="top-start"
                width="120"
                :visible-arrow='false'
                trigger="click">
                <span @click="upPassword()">修改密码</span>
                <el-button slot="reference">{{ accountname }}</el-button>
            </el-popover>
            <a href="javascript:;" @click="signOut()">退出系统</a>
        </div>
        <!-- 修改密码弹框 -->
        <el-dialog
            title="密码修改提醒"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <div>
                <el-form :model="formItem" :rules="rules" ref="formItem" label-width="90px" class="demo-ruleForm">
                    <el-form-item label="原密码:" prop="oldPassword">
                        <el-input v-model="formItem.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码:" prop="newPassword">
                        <el-input v-model="formItem.newPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码:" prop="password">
                        <el-input v-model="formItem.password"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="subpassword('formItem')">保存修改</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import md5 from 'js-md5';
export default {
    data() {
        return {
            accountname: '',
            createby: '',
            centerDialogVisible: false,
            formItem: {
                oldPassword: '',
                newPassword: '',
                password: '',
            },
            rules: {
                oldPassword: [{
                    required: true, 
                    message: '请输入原密码', 
                    trigger: 'blur'
                }],
                newPassword: [{
                    required: true, 
                    message: '请输入新密码', 
                    trigger: 'blur'
                    },{
                    min: 6, 
                    max: 12, 
                    message: '请输入6～12位的新密码', 
                    trigger: 'blur'
                }],
                password: [{
                    required: true, 
                    message: '请输入确认密码', 
                    trigger: 'blur'
                }],
            }
        }
    },
    //生命周期之挂载完成
    methods: {
        upPassword(){
            this.centerDialogVisible = true;
        },
        subpassword(formItem){
            this.$refs[formItem].validate((valid) => {
                if (valid){
                    //确认密码
                    if(this.formItem.newPassword === this.formItem.password){
                        let params = {
                            parameters: this.createby,
                            parametersone: md5(this.formItem.password)
                        };
                        this.$doRequest("api/backgrounduser/updatepassword", params,res => {
                            if(res.result >= 0){
                                this.$message({
                                    message: '密码修改成功！',
                                    type: 'success'
                                });
                                //修改之后更新sessionStorage
                                var data = {
                                    accountname: this.accountname,
                                    password: md5(this.formItem.password)
                                }
                                this.$doRequest('/api/backgrounduser/crtvLogin', data, function(res){
                                    sessionStorage.setItem('userInfo',JSON.stringify(res.parameters));
                                });
                                this.centerDialogVisible = false;
                            }else{
                                this.$message.error(res.message);
                            }
                        });
                    }else{
                        this.$message.error('确认密码与新密码不一致');
                    }
                }
            });
        },
        signOut(){
            sessionStorage.clear();
            this.$router.push({path: '/'});
        }
    },
    //生命周期之创建完成
    created: function(){
        let session = JSON.parse(sessionStorage.getItem('userInfo'));
        this.accountname = session.accountname;
        this.createby = session.id;
    },
}
</script>
<style lang="less">
.header{
    width: 100%;
    height: 70px;
    background: #232340;
    overflow: hidden;
    .logo{
        width: 50%;
        height: 70px;
        float: left;
        overflow: hidden;
        img{
            width: 40px;
            height: 40px;
            float: left;
            margin: 15px 20px;
            border-radius: 20px;
        }
        h3{
            font-size: 24px;
            color: #fff;
            line-height: 70px;
            font-weight: normal;
            margin: 0;
            height: 70px;
        }
    }
    .operation{
        width: 50%;
        height: 70px;
        float: right;
        text-align: right;
        img{
            width: 32px;
            height: 32px;
            vertical-align: middle;
            border-radius: 16px;
        }
        a{
            color: #fff;
            line-height: 70px;
            font-size: 16px;
            margin: 0 20px;
            display: inline-block;
        }
        .el-popover__reference{
            border: none;
            background: none;
            color: #fff;
            font-size: 16px;
        }
    }
    
}
.el-popper{
    min-width: 120px;
    padding: 0;
    text-align: center;
    height: 38px;
    line-height: 38px;
    border-radius: 0;
    .popper__arrow{
        display: none;
    }
}
</style>
