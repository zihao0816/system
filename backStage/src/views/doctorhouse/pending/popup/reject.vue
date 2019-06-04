<template>
    <div>
        <div class="docReject"> 
            <el-dialog title="审核通过" center  :visible="docdialogtype"  @update:visible="v=>$emit('update:docdialogtype',v)" width="37%">
               <span style="font-size:16px;">正在审核医生：{{doctname.doctorname}} 的注册资料</span>
               <p style="font-size:16px;margin-bottom:20px;">审核拒绝后，对方将收到短信或微信提示，请选至少选择一项未通过原因。</p>
               <div style="width:100%;text-align:center;">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox label="基础资料未通过"></el-checkbox>
                        <el-checkbox label="资质信息未通过"></el-checkbox>
                    </el-checkbox-group>
               </div>              
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:docdialogtype',false)">取 消</el-button>
                    <el-button type="primary" @click="getclick">确定</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["docdialogtype","doctname","getpage"],
     data() {
        return {
            checkList: []
        }
     },
    methods:{
        getclick(){
            let _this=this;
            let obj={
                id:this.doctname.id,
                confirmstate:3,
                remark:this.checkList.join(",")
            }
            if(this.checkList.length>0){
                this.$doRequest("/api/doctorinfo/doctorCertified",obj,res=>{
                    _this.$emit('update:docdialogtype',false);
                    _this.getpage();
                    _this.$message({
                        message: '拒绝成功',
                        type: 'success'
                    });
                })
            }else{
                _this.$message({
                    message: '请填写拒绝原因',
                    type: 'error'
                });
            }
            
        }
    },
    created(){
        
    },
    mounted(){
       
    }
  
}
</script>
 
<style lang="less">
.docReject{
    .el-dialog__header{
        padding: 0;
        width:100%;
        line-height:40px;
        background-color: rgba(241, 240, 245, 1);
        .el-dialog__headerbtn{
            top:0px;
        }
    }
    .el-dialog__headerbtn .el-dialog__close{
        height:40px;
        line-height: 40px;
    }
    .el-dialog--center .el-dialog__body{
        box-sizing: border-box;
    }
    .el-checkbox-group{
        .el-checkbox__label{
            font-size: 16px;
        }
        .el-checkbox:nth-of-type(2){
            margin-left:30px;
        }
    }
    .el-button--default{
        margin-right:40px;
    }
}
.el-dialog--center .el-dialog__body{
    width:100%;
}
</style>