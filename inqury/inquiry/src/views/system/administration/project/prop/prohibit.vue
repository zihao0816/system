<template>
    <div>
        <div class="headers"> 
            <el-dialog title="禁用理疗项" center  :visible="dialogprobit"  @update:visible="v=>$emit('update:dialogprobit',v)" width="34%">
               <span style="font-size:18px;">禁用理疗项后，理疗师开方将不再可见该项理疗内容。</span>
               <p style="font-size:18px;margin-top:20px;">确认禁用理疗项目：<span>{{proname.name}}</span> ？</p>
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:dialogprobit',false)">取 消</el-button>
                    <el-button type="primary" @click="getprohit">确定</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogprobit","proname","getpage"],
     data() {
        return {

        }
     },
     methods:{
       getprohit(){
           let _this=this;
           this.$doRequest("/api/physiotherapylist/enable",{id:this.proname.id},res=>{
                if(res.result==1){
                     _this.$message({
                        message: '禁用成功',
                        type: 'success'
                    });
                    _this.getpage();
                    _this.$emit("propihit");
                }else{
                      _this.$message({
                        message: '禁用失败',
                        type: 'error'
                    });
                };
                _this.$emit('update:dialogprobit',false);
           })
       }

    }    
}
</script>
 
<style lang="less">
.headers{
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

