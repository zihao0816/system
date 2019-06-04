<template>
    <div class="addmoneys">
        <el-dialog title="会员退款" center  :visible="dialogrefund"  @update:visible="v=>$emit('update:dialogrefund',v)" width="40%">
            <el-form :rules="rules" ref="releform" :model="releform">
                <ul>
                    <li><span>会员姓名:</span><i>{{refundlist.name}}</i></li>
                    <li><span>会员手机号:</span><i>{{refundlist.phone}}</i></li>
                    <li><span>当前余额(元):</span><i>{{refundlist.balance}}</i></li>            
                    <li style="height:40px;"><el-form-item prop="refundss" label="退款金额(元):"><el-input v-model="releform.refundss"></el-input></el-form-item></li>
                    <li style="width:100%;">
                        <el-form-item prop="selectvalue" label="退款原因:">
                            <el-select v-model="releform.selectvalue" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </li>
                </ul>
            </el-form>
            <div slot="footer" class="dialog-footer"> 
                <el-button @click="$emit('update:dialogrefund',false)">取 消</el-button>
                <el-button type="primary" @click="getrefunds">确 定</el-button>
            </div> 
        </el-dialog>   
    </div>
</template>
<script>
export default {
    props:["dialogrefund","refundlist","getpage"],
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('*必填'));
            } else if(this.refundlist.balance<value/1){
                callback(new Error('*退款金额不可大于余额'));
            }else{
                callback();
            }
           
        }
        return {
            rules:{
                refundss:[{required:true,message:"*必填",trigger: 'blur'},{ validator: validatePass, trigger: 'blur' }],
                selectvalue:[{required:true,message:"*必选",trigger: 'blur'}]                
            },
            releform:{refundss:"",selectvalue:""},
            options:[
                { value: 1,label: '充值错误'},{ value: 2,label: '扣款错误'},
                { value: 3,label: '退卡'}
          
            ]
        }
    },
    methods:{
        getrefunds(){
           let _this=this;
            var obj={
                id:this.refundlist.id,
                balance:this.releform.refundss,
                paytype:this.releform.selectvalue
            }
            this.$doRequest("/api/membershipcard/refund",obj,res=>{
               _this.$emit('update:dialogrefund',false);
               if(res.result>0){
                   _this.$message({
                        message: '退款成功',
                        type: 'success'
                    });
               }else{
                    _this.$message({
                        message: '退款失败',
                        type: 'error'
                    });
               }
               _this.getpage();
            })  
        }
    },
    mounted(){
    }
}
</script>
<style lang="less">
    .addmoneys{
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
     .el-select-dropdown__item.hover, .el-select-dropdown__item:hover{
        color:black;
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
        .el-dialog__footer{
            width:100%;
            .dialog__footer{
                width:100%;
            }
        }
        ul{
            width:100%;
            height:140px;
            li{
                list-style: none;
                float:left;
                width:50%;
                line-height:40px;
                margin-bottom: 10px;
                .el-form-item__content{
                    .el-select{
                        width:153px;
                    }
                    .el-input{
                        width:50%;
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
        .el-form-item__error{
            left:40%;
        }
    }
    i{
        font-style: normal;
    }  
   /deep/.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
        background: #07a591 !important;
        color: black;
}
</style>