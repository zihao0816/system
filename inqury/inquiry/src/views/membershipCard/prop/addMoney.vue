<template>
    <div class="addmoney">
        <el-dialog title="会员充值" center   :visible="dialogaddMoney"  @update:visible="v=>$emit('update:dialogaddMoney',v)" width="40%">
            <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
                <ul>
                    <li><span>会员姓名:</span><i>{{addmoneylist.name}}</i></li>
                    <li><span>会员手机号:</span><i>{{addmoneylist.phone}}</i></li>
                    <li style="width:45%;"><span>当前余额(元):</span><i>{{addmoneylist.balance}}</i></li>            
                    <li style="height:50px;width:55%;"><el-form-item prop="moneys" label="充值金额(元):"><el-input v-model.number="ruleForm.moneys"></el-input></el-form-item></li>
                    <li>
                        <el-form-item prop="method" label="充值方式:">
                            <el-select v-model="ruleForm.method" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item></li>
                    <li class="liitem">
                        <el-form-item prop="num"  label="交易单号:">
                            <el-input v-model="ruleForm.ticks"></el-input>
                            <p style="color:red;">*可选填</p>
                    </el-form-item>
                    
                    </li>
                </ul>
            </el-form>
            <div slot="footer" class="dialog-footer"> 
                <el-button @click="$emit('update:dialogaddMoney',false)">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
            </div> 
        </el-dialog>   
    </div>
</template>
<script>
export default {
    props:["dialogaddMoney","addmoneylist","getpage"],
    data(){
        var checkmoneys= (rule, value, callback) => {
            var reg = /^[1-9]\d*$/;
            if(!reg.test(value)){
                  callback(new Error("请输入整数金额"));
            }else if(value==''){
                 callback(new Error("必填"));
            }else{
                 callback();
            }
        }
        return {
            ruleForm:{moneys:"",method:"",num:"",ticks:""},
            rules:{
                moneys:[{required:true,message:"*整数金额",trigger: 'blur'},{ validator: checkmoneys, trigger: 'blur' }],
                method:[{required:true,message:"*必选",trigger: 'blur'}],
                // num:[{required:true,message:"*可选项，方便对账",trigger: 'blur'}]
            },
            options:[
                { value: 2,label: '现金充值'},{ value: 1,label: '微信充值'},
                { value: 3,label: '支付宝充值'},{ value: 4,label: '银联/POS充值'}
            ]
        }
    },
    methods:{
        submitForm(formName){
            let _this=this;
            var obj={
                id:this.addmoneylist.id,
                balance:this.ruleForm.moneys,
                paytype:this.ruleForm.method,
                transactionno:this.ruleForm.ticks||""
            }
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.$doRequest("/api/membershipcard/recharge",obj,res=>{
                        _this.$emit('update:dialogaddMoney',false);
                        if(res.result>0){
                            _this.$message({
                                message: '充值成功',
                                type: 'success'
                            });
                        }else{
                            _this.$message({
                                message: '充值失败',
                                type: 'error'
                            });
                        }
                        _this.getpage();
                    })
                }else{
                     _this.$message({
                                message: '请填写完整信息',
                                type: 'error'
                            });
                }
            })
        }
    }
}
</script>
<style lang="less">
    .addmoney{
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
        ul{
            width:100%;
            height:140px;
            font-size: 14px;
            li{
                list-style: none;
                float:left;
                width:50%;
                margin-bottom:10px;
                line-height: 40px;
                span{
                    float:left;
                    width:85px;
                    text-align: right;
                    margin-right:12px;
                }
                // .liitem{
                //   .el-form-item{
                //       margin-bottom:0!important;
                //   }  
                // }
                .el-form-item__content{
                    width:130px;
                    float:left;
                    .el-input{
                        width:100%;
                        height:34px;
                        .el-input__inner{
                            height:34px;
                        }
                    }
                    .el-input--suffix{
                        width:100%;
                        .el-input__inner{
                            width:100%;
                        }
                    }
                }
            }
        }
        .el-button{
            margin:0 50px 0 50px;
        }
    }
    i{
        font-style: normal;
    }
    /deep/.el-select{
        width:152px;
    } 
</style>