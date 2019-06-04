<template>
    <div>
        <div class="had"> 
            <el-dialog title="修改密码" center  :visible="dialogmo"  @update:visible="v=>$emit('update:dialogmo',v)" width="34%">
                <el-form :label-position="labelPosition"  :rules="rules2" label-width="100px" :model="ruleForm2" ref="ruleForm2">
                    <el-form-item label="密码:" prop="pass">
                        <el-input type="password" autocomplete="off" width="60%" v-model="ruleForm2.pass"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码:" prop="checkPass">
                        <el-input type="password" autocomplete="off" width="60%" v-model="ruleForm2.checkPass"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:dialogmo',false)">取 消</el-button>
                    <el-button type="primary" @click="gitmodify('ruleForm2')">确 定</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogmo","modiyId","getpage"],
     data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm2.checkPass !== '') {
                    this.$refs.ruleForm2.validateField('checkPass');
                }
                callback();
            }
        };
         var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm2.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            ruleForm2: {
                pass: '',
                checkPass: '',
            },
            rules2: {
            pass: [{ validator: validatePass, trigger: 'blur' } ],
            checkPass: [{ validator: validatePass2, trigger: 'blur' }]
            },
            labelPosition:'right'
        }
     },
     methods:{
         gitmodify(formName){
             let _this=this;
             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$doRequest("/api/backgrounduser/updatepassword",{"parameters":this.modiyId,"parametersone":this.$md5(this.ruleForm2.pass)},res=>{   
                        _this.getpage();
                        if(res.result==1){
                            _this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                        }else{
                            _this.$message({
                                message: '修改失败',
                                type: 'error'
                            });
                        }
                        _this.$emit('update:dialogmo',false); 
                    }); 
                } else {
                    return false;
                }
            }); 
         }
     }   
}
</script>
 
<style lang="less">
.had{
    /deep/.el-button--primary{
        border-color: #07A591;
        background-color: #07A591;
    }
    /deep/.el-button{
        width:98px;
    }
    /deep/.el-button{
        border-color: #07A591;
        color:#07A591;
    }
    /deep/.el-button:nth-of-type(2){
        color:#fff;
    }
    .el-form-item{
        width:100%;
    }
    .el-dialog__header{
        padding: 0;
        width:100%;
        line-height:62px;
        background-color: rgba(241, 240, 245, 1);
        .el-dialog__headerbtn{
            top:0px;
        }
    }
    .el-form-item__label{
            margin-left:12px;
    }
    .el-input{
        width:70%;
    }
}
</style>