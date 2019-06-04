<template>
    <div>
        <div class="docReject"> 
            <el-dialog title="审核通过" center  :visible="dialogprobit"  @update:visible="v=>$emit('update:dialogprobit',v)" width="37%">
               <span style="font-size:16px;">正在审核医生：{{doctname.doctorname}} 的注册资料。审核通过后，可在“医生列表”中设置其显示状态和位置信息。</span>
               <p style="font-size:16px;margin-top:20px;">确认审核通过 ？</p>
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:dialogprobit',false)">取 消</el-button>
                    <el-button type="primary" @click="getclick">确定</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogprobit","doctname","getpage"],
     data() {
        return {
            
        }
     },
     methods:{
        getclick(){
            let _this=this;
            let obj={
                id:this.doctname.id,
                confirmstate:1,
            }
            this.$doRequest("/api/doctorinfo/doctorCertified",obj,res=>{
                _this.getpage();
                 _this.$message({
                    message: '通过成功',
                    type: 'success'
                });
                 _this.$emit('update:dialogprobit',false);
            })
        }
    },
    
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
}
.el-dialog--center .el-dialog__body{
    width:100%;
}
</style>