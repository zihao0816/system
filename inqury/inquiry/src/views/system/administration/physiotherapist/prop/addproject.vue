<template>
    <div>
        <div class="phyheaders"> 
            <el-dialog :title="titles" center  :visible="dialogform"  @update:visible="v=>$emit('update:dialogform',v)" width="34%">
                <el-form  label-width="100px" >
                    <el-form-item label="理疗师姓名:" ><el-input width="60%" ref="docname" :value="type==1?tableDatafirst.name:''"></el-input></el-form-item> 
                    <el-form-item label="理疗师电话："><el-input ref="phone"  :value="type==1?tableDatafirst.phone:''"></el-input></el-form-item>  
                </el-form> 
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:dialogform',false)">取 消</el-button>
                    <el-button type="primary" @click="adddoc()">保存</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogform","getpage","tableDatafirst","type"],
     data() {
        return {
            formLabelAlign:{
                name:"",
                phone:"",
                titles:""
            }
        }
     },
     methods:{
        adddoc(){
            var _this=this;
            var name=this.$refs.docname.currentValue;
            var phone=this.$refs.phone.currentValue;
            if(this.type==2){
                this.$doRequest("/api/physiotherapist/save",{"name":name,"phone":phone},res=>{
                    if(res.result>0){
                        _this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        _this.$emit('update:dialogform',false);
                    }else{
                        _this.$message({
                            message: '添加失败',
                            type: 'error'
                        });
                    }
                    _this.getpage();
                })
            }if(this.type==1){
                this.$doRequest("/api/physiotherapist/update",{"id":this.tableDatafirst.id,"name":name,"phone":phone},res=>{
                    if(res.result>0){
                        _this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        _this.$emit('update:dialogform',false);
                    }else{
                        _this.$message({
                            message: '修改失败',
                            type: 'error'
                        });
                    }
                    _this.getpage();
                })
            }
            
        }
    },
    created(){
        this.titles=this.type==1?'修改理疗师':'添加理疗师';
    }
}
</script>
 
<style lang="less">
.phyheaders{
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
    .el-form-item{
        width:414px;
    }
    .el-form-item__label{
            width:100px;
            margin-left:12px;
    }
    .el-input{
        width:220px;
    }
}
</style>

