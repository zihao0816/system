<template>
    <div>
        <div class="headerss"> 
            <el-dialog :append-to-body="true" title="添加管理员" center  :visible="dialogaddaccount"  @update:visible="v=>$emit('update:dialogaddaccount',v)" width="36%">
                <el-form :rules="rules2" :label-position="labelPosition" label-width="100px" :model="formlist" ref="formlist">
                    <el-form-item label="登录账号:" prop="accountname"><el-input width="60%" v-model="formlist.accountname"></el-input></el-form-item> 
                    <el-form-item label="登陆密码:" prop="password"><el-input type="password" v-model="formlist.password"></el-input></el-form-item> 
                    <el-form-item label="确认密码:" prop="pwd"><el-input type="password" v-model="formlist.pwd"></el-input></el-form-item> 
                    <el-form-item label="姓名:" prop="username"><el-input v-model="formlist.username"></el-input></el-form-item> 
                    <el-form-item label="手机号:" prop="telephone"><el-input v-model.number="formlist.telephone"></el-input></el-form-item>
                    <p style="margin-left:12px;">请选择可见项:</p>
                    <el-form-item style="margin-left:14px;" label="" prop="function"> 
                            <el-checkbox-group style="margin-left:0;" v-model="formlist.function">
                            <el-checkbox label="问诊开方" name="function" style="margin:0 20px 0 0;"></el-checkbox>
                            <el-checkbox label="历史问诊处方" name="function" style="margin:0 20px 0 0"></el-checkbox>
                            <el-checkbox label="挂号大厅" name="function" style="margin:0 20px 0 0;"></el-checkbox>
                            <el-checkbox label="系统设置" name="function" style="margin:0 20px 0 0"></el-checkbox>
                            <el-checkbox label="会员卡" name="function" style="margin-left:0;"></el-checkbox> 
                            <el-checkbox label="历史理疗处方" name="function" style="margin-left:0;"></el-checkbox> 
                        </el-checkbox-group>
                    </el-form-item>     
                </el-form> 
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:dialogaddaccount',false)" style="width:98px; border-color: #07A591;color:#07A591;">取 消</el-button>
                    <el-button type="primary" @click="addacountlist('formlist')" style="width:98px; border-color: #07A591;
            background-color: #07A591;">确 定</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogaddaccount","getpage"],
     data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formlist.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
       var checkPhone = (rule, value, callback) => {
            value=value+'';
            if(value.length!==11){
                callback(new Error('请输入11位手机号'));
            }else{
               callback(); 
            }
        };
        var checkpwd=(rule, value, callback) => {
            var reg = /^(\w){6,12}$/;
            if(!reg.test(value)){
                  callback(new Error("请输入6-12位英文、数字"));
            }else{
                callback();
            }
        };
        return {
            formlist:{accountname:"",password:"",pwd:"",username:"",telephone:"",function:[],},
            labelPosition:'right',
            rules2:{
                accountname:[ { required: true, message: '请输入6-12位英文、数字', trigger: 'blur' },{ validator: checkpwd, trigger: 'blur' }],
                password:[{ required: true, message: '请输入6-12位英文、数字', trigger: 'blur' },{ validator: checkpwd, trigger: 'blur' } ],
                pwd:[{ validator: validatePass2, trigger: 'blur' }],
                telephone:[{ required: true, message: '请输入手机号', trigger: 'blur' },{ type: 'number', message: '手机号必须为数字值'},{ validator: checkPhone, trigger: 'blur' }],
                username:[{ required: true, message: '请输入使用人姓名', trigger: 'blur' }],
                function:[{ required: true, message: '必填', trigger: 'blur' }]
            }

        }
     },
     methods:{
         addacountlist(formName){
            let _this=this;
            var types="";
            var functionid=JSON.parse(sessionStorage.getItem('loginDetail')).parameters.funtionblock;
            for(var i=0;i<this.formlist.function.length;i++){
                for(var j=0;j<functionid.length;j++){
                    if(this.formlist.function[i]==functionid[j].fname){
                        if(i<this.formlist.function.length-1){
                            types+=functionid[j].id+",";
                        }else if(i=this.formlist.function.length-1){
                            types+=functionid[j].id; 
                        }
                    }
                }
            }
            var obj={
                accountname:this.formlist.accountname,
                password:this.$md5(this.formlist.password),
                username:this.formlist.username,
                telephone:this.formlist.telephone,
                function:types,
                type:"2",
                usertype:"1",
                outpatientname:JSON.parse(sessionStorage.getItem('loginDetail')).parameters.cname,
                parentid:JSON.parse(sessionStorage.getItem('loginDetail')).parameters.id,
                cnameid:JSON.parse(sessionStorage.getItem('loginDetail')).parameters.cnameid,
                cname:JSON.parse(sessionStorage.getItem('loginDetail')).parameters.cname
            }
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.$doRequest("/api/backgrounduser/getaccountname",{"parameters":this.formlist.accountname},res=>{
                        if(res.result>0){
                            _this.$doRequest("/api/backgrounduser/insertbypassaccount",obj,res=>{
                                if(res.result>0){
                                    _this.$message({
                                        message: '添加成功',
                                        type: 'success'
                                    });
                                }else{
                                    _this.$message({
                                        message: '添加失败',
                                        type: 'error'
                                    });
                                }
                                _this.getpage();
                                _this.$emit('update:dialogaddaccount',false);
                            })
                        }
                    });
                }

            });
            //console.log(obj);
 
         }
     }   
}
</script>
<style lang="less">
.headerss{
    .dialog-footer{
        .el-button--primary{
            border-color: #07A591;
            background-color: #07A591;
        }
        .el-button{
            width:98px;
        }
        .el-button{
            border-color: #07A591;
            color:#07A591;
        }
        .el-button:nth-of-type(2){
            color:#fff;
        }
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
    .el-form-item{
        .el-form-item__label{
            margin-left:12px;
         
        }
    }
    .el-input{
        width:70%;
    }
}
.v-modal{
    opacity:.5;
    background:#000;
}
</style>

