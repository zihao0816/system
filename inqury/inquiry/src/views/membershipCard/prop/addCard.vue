<template>
    <div>
        <div class="headersers">
            <el-dialog title="添加会员" center  :visible="dialogaddcard"  @update:visible="v=>$emit('update:dialogaddcard',v)" width="50%">
                <el-form :label-position="labelPosition" :rules="rules" :model="formList" ref="formList">
                    <el-form-item label="会员姓名:" prop="name"><el-input width="60%" v-model="formList.name"></el-input></el-form-item>
                    <el-form-item label="会员手机号:" prop="phone"><el-input v-model.number="formList.phone"></el-input></el-form-item>
                    <el-form-item label="性别:" prop="sex">
                        <el-radio-group v-model="formList.sex">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="生日:" prop="birthday">
                         <el-date-picker
                            v-model="formList.birthday"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="身份证:" prop="idcard"><el-input v-model="formList.idcard"></el-input></el-form-item>
                    <div class="city">
                        <span>
                            <!-- <i style="color:red;margin-right:2px;">*</i>
                            地址: -->
                            <el-form-item label="地址:">
                                <el-cascader
                                :options="options"
                                v-model="selectedOptions"
                                @change="handleChange">
                                </el-cascader>
                            </el-form-item>
                        </span>
                    </div>
                    <div class="inpt">
                        <el-input placeholder="请输入内容" v-model="formList.address"></el-input>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="$emit('update:dialogaddcard',false)">取 消</el-button>
                    <el-button type="primary" @click="getaddcard('formList')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { regionData,CodeToText } from 'element-china-area-data'
export default {
    props:["dialogaddcard","getpage"],
     data() {
        var validatePass = (rule, value, callback) => {
            value=value+'';
            if(value.length!==11){
                callback(new Error('请输入11位手机号'));
            }else{
               callback(); 
            }
        };
        return {
            options:regionData,
            selectedOptions:[],
            labelPosition:'right',
            rules:{
               name:[{required:true,message:"必填",trigger: 'blur'}],
               phone:[{ type: 'number', message: '手机号必须为数字值'},{required:true,message:"必填",trigger: 'blur'}, { validator: validatePass, trigger: 'blur' }],
               sex:[{required:true,message:"请选择性别",trigger: 'blur'}],
               birthday:[{required:true,message:"必填",trigger: 'blur'}],
               idcard:[{required:true,message:"必填",trigger: 'blur'}],
               province:[{required:true,message:"必填",trigger: 'blur'}]
            },
            formList:{clinicid:"",name:"",phone:"",idcard:"",sex:"1",birthday:"",province:"",city:"",area:"",address:"",}
        }
     },
     methods:{
         getaddcard(formLists){
            for(var i=0;i<this.selectedOptions.length;i++){
                this.selectedOptions[i]=CodeToText[this.selectedOptions[i]];
            }
            this.formList.province=this.selectedOptions[0];
            this.formList.city=this.selectedOptions[1];
            this.formList.area=this.selectedOptions[2];
            this.formList.clinicid=JSON.parse(sessionStorage.loginDetail).parameters.cnameid;
            this.formList
            let _this=this;
            this.$refs[formLists].validate((valid) => {
                if(valid){
                    this.$doRequest("/api/membershipcard/save",_this.formList,res=>{
                        _this.getpage();
                        _this.$emit('update:dialogaddcard',false);
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
                    })
                }
            })

        },
        handleChange(){

        }
     }

}
</script>

<style lang="less">
    .el-cascader-menu__item.is-active {
        color: #07A591;
    }
.headersers{
   
    /deep/.el-radio__input.is-checked+.el-radio__label{
        color:#07A591;
    }
    /deep/.el-radio__input.is-checked .el-radio__inner{
        border-color: #07A591;
        background-color: #07A591;
    }
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
        display: block;
        width:100px;
        text-align: right;
    }
    .el-input{
        width:100%;
    }
    .el-form-item{
        display: flex;
        width:50%;
        float:left;
    }
    .el-form-item:nth-of-type(5){
        width:100%;
        .el-form-item__content{
            width:80%;
            .el-input{
                width:90%;
            }
        }
    }
    .city{
        width:100%;

        box-sizing: border-box;
        padding-left:40px;
        margin-bottom:30px; 
        .el-form-item__label{
            text-align: left;
            width:54px;
            padding-right:8px;
        }
        .el-cascader{
            margin-left:5px;
            height: 15px;
            .el-cascader__label{
                height:30px;
                font-size: 14px;
                width:100%;
            }
            .el-input{
                width:100%;
                height:20px;
                .el-input__inner{
                    height:40px;
                }
            }
        }
    }
    .inpt{
        .el-input{
            width:78%;
            margin-left:84px;
        }
    }
}

</style>
