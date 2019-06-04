<template>
    <div>
        <div class="heads"> 
            <el-dialog :title="dialogqrcode?'医生坐诊二维码':'坐诊费用'" center  :visible="dialogprobit"  @update:visible="v=>$emit('update:dialogprobit',v)" width="34%">
                <div v-if="dialogqrcode==false">
                    <p style="margin:20px 0 20px 30px;">医生姓名:<span style="margin-left:10px;">{{doclist.doctorname}}</span></p>
                    <el-form  label-width="100px">
                        <el-form-item label="坐诊费用:" :model="sizeForm">
                            <el-select  placeholder="" v-model="sizeForm.money">
                                <el-option label="0" value="0"></el-option>
                                <el-option label="20" value="20"></el-option>
                                <el-option label="60" value="60"></el-option>
                                <el-option label="100" value="100"></el-option>
                                <el-option label="200" value="200"></el-option>
                                <el-option label="300" value="300"></el-option>
                                <el-option label="500" value="500"></el-option>
                            </el-select>
                            <span>元</span>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer"> 
                        <el-button @click="$emit('update:dialogprobit',false)">取 消</el-button>
                        <el-button type="primary" @click="handClick">确定</el-button>
                    </div>    
                </div> 
                       <!-- 二维码 -->
                <div v-if="dialogqrcode" style="text-align:center;">
                    <p>患者<span style="color:red;">微信扫码</span>挂号</p>
                    <p>(非公众号二维码)</p>
                     <img :src="qrcodeImg" alt="" style=" display:inline-block;bakcground:red;width:200px;height:200px;">
                </div>
            </el-dialog> 
            <!-- 二维码 -->
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogprobit","doclist","getPage","dialogqrcode","qrcodeId"],
     data() {
        return {
            sizeForm:{
                money:"",
                xxx:"8"
            },
            cityList:[
                {
                    value:'value1',
                    label:20,
                },
                {
                    value:'value2',
                    label:600
                },
                {
                    value:'value3',
                    label:300
                }
            ],
            model1:"",
            qrcodeImg:""
        }
    },
    methods:{
        handClick(){
            let _this=this;
            this.$doRequest("/api/diagnosisdoctor/update",{"id":this.doclist.id,"diagnosticfee":this.sizeForm.money,"doctorid":this.doclist.doctorid},res=>{
                this.$emit('update:dialogprobit',false);
                _this.getPage();
                _this.$message({
                    message: '坐诊费修改成功',
                    type: 'success'
                });
            })
        },
        getcode(){
            let _this=this;
            this.$doRequest("/api/diagnosisdoctor/qrcode",{id:this.qrcodeId},res=>{
                this.qrcodeImg=res.parameters;
            })
        }
    },
    created(){
        this.sizeForm.money=this.doclist.diagnosticfee;
        console.log(this.sizeForm.money);
     },
     mounted(){
         if(this.dialogqrcode){
            this.getcode();
         }
        
     }

}
</script>
 
<style lang="less">
.heads{
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
    .el-select{
        width:160px;
    }
    .el-dialog__body{
        p{
            width:100%;
        }
        el-form{
            width:100%;
                .el-input__inner{
                line-height: 30px;
                width:60%;
            }
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
}
</style>