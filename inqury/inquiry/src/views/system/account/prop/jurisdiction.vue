<template>
    <div>
        <div class="accountheaders"> 
            <el-dialog title="权限管理" center  :visible="dialogjur"  @update:visible="v=>$emit('update:dialogjur',v)" width="34%">
                <el-form :label-position="labelPosition" label-width="100px" :model="formlist">
                    <el-form-item label="登录账号:"><el-input width="60%" v-model="juriId.accountname"></el-input></el-form-item> 
                    <p style="margin-left:12px;">请选择可见项:</p>
                    <el-form-item style="margin-left:14px;"> 
                        <el-checkbox-group style="margin-left:0;" v-model="formlist.function">
                            <el-checkbox label="问诊开方"  style="margin:0 15px 0 0;"></el-checkbox>
                            <el-checkbox label="历史问诊处方"  style="margin:0 15px 0 0"></el-checkbox>
                            <el-checkbox label="挂号大厅"  style="margin:0 15px 0 0;"></el-checkbox>
                            <el-checkbox label="系统设置"  style="margin:0 20px 0 0"></el-checkbox>
                            <el-checkbox label="会员卡"  style="margin-left:0;"></el-checkbox>
                            <el-checkbox label="历史理疗处方"  style="margin-left:0;"></el-checkbox> 
                        </el-checkbox-group>
                    </el-form-item>     
                </el-form> 
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:dialogjur',false)">取 消</el-button>
                    <el-button type="primary" @click="getjuri">确 定</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogjur","juriId","getpage"],
     data() {
        return {
            formlist:{id:"",function:[]},
            labelPosition:'right',
            functions:[],
            checked:true
        }
     },
     computed:{
         newlist(){
             return this.juriId
         }
     },
     watch:{
        formlist:function(){
            
        }
     },
     methods:{
        getjuri(){
            var types="";
            for(var i=0;i<this.formlist.function.length;i++){
                for(var j=0;j<this.functions.length;j++){
                    if(this.formlist.function[i]==this.functions[j].fname){
                        types+=this.functions[j].id+",";
                    }
                }
            }
            let _this=this;
            this.$doRequest("api/userfunction/insertfunction",{"parameters":this.juriId.id,"parametersone":types},res=>{
                if(res.result>0){
                        _this.$message({
                            message: '修改权限成功',
                            type: 'success'
                        });
                    }else{
                        _this.$message({
                            message: '修改权限失败',
                            type: 'erroe'
                        });
                    } 
                _this.getpage();
                _this.$emit('update:dialogjur',false);
            })
        },
        getfunction(){
            let _this=this;
            this.$doRequest("/api/functionblock/getfunction",{ "parameters":  "2"},res=>{
                _this.functions=res.function;
            })
        }
     },
     created(){
         console.log(this.juriId);
        this.formlist.function=this.juriId.authdetails.split(',');
        
     },
     mounted(){
        this.getfunction();
     }    
}
</script>
 
<style lang="less">
.accountheaders{
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
        background-color: rgba(241, 240, 245, 1);
        line-height: 62px;
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