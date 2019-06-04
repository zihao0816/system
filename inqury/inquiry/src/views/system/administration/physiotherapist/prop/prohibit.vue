<template>
    <div>
        <div class="headers"> 
            <el-dialog title="禁用理疗师" center  :visible="dialogprobit"  @update:visible="v=>$emit('update:dialogprobit',v)" width="34%">
               <span style="font-size:18px;">禁用理疗师后，开具理疗单时将无法选择该理疗师。</span>
               <p style="font-size:18px;margin-top:20px;">确认禁用理疗师：<span>{{docname.name}}</span> ？</p>
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
    props:["dialogprobit","docname","getpage"],
     data() {
        return {
            name:""
        }
     },
      methods:{
       getprohit(){
           let _this=this;
           this.$doRequest("/api/physiotherapist/enable",{id:this.docname.id},res=>{
               if(res.result>0){
                     _this.$message({
                        message: '禁用成功',
                        type: 'success'
                    });
                    _this.getpage();
                    _this.$emit("prohtits");
                }else{
                      _this.$message({
                        message: '禁用失败',
                        type: 'error'
                    });
                };
                _this.$emit('update:dialogprobit',false);
           })
       }

    },
    created(){
        console.log(33333,this.docname);
    }
    
}
</script>
 
<style lang="less">
.headers{
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
    
}
.el-dialog--center .el-dialog__body{
    width:100%;
}
</style>

