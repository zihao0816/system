<template>
    <div>
        <div class="proheaders"> 
            <el-dialog  highlight-current-row  @current-change="handleCurrentChange" :title="titles" center  :visible="dialogFormVisible"  @update:visible="v=>$emit('update:dialogFormVisible',v)" width="34%">
                <el-form :label-position="labelPosition" label-width="100px">
                    <el-form-item label="理疗项目名称:">
                        <el-input ref="proname" v-model="name"></el-input>
                    </el-form-item> 
                    <el-form-item label="收费金额(次):">
                        <el-input ref="money" v-model="collectfees"></el-input>
                    </el-form-item>  
                </el-form> 
                <div slot="footer" class="dialog-footer"> 
                    <el-button @click="$emit('update:dialogFormVisible',false)">取 消</el-button>
                    <el-button type="primary" @click="addPro()">保存</el-button>
                </div>            
            </el-dialog> 
        </div>
    </div>
</template>
<script>
export default {
    props:["dialogFormVisible","getpage","type","prolist"],
     data() {
        return {
            labelPosition:'right',
            titles:"",
            currentRow:null,
            id: '',//理疗项目id
            name: '',//理疗项目名称
            collectfees: '',//理疗项目金额
        }
     },
     methods:{
         addPro(){
            if(!this.name){
                 _this.$message({
                    message: '理疗项目名称不能为空',
                    type: 'error'
                });
            }else if(!this.collectfees){
                _this.$message({
                    message: '理疗项目金额不能为空',
                    type: 'error'
                });
            }else{
                let params = {
                    id: this.id,
                    name: this.name,
                    collectfees: this.collectfees,
                };
                let _this=this;
                if(_this.type==2){
                    _this.$doRequest("/api/physiotherapylist/save", params,res=>{
                        _this.$emit('update:dialogFormVisible',false);
                        _this.getpage();
                    })
                };
                if(this.type==1){
                    this.$doRequest("/api/physiotherapylist/update", params,res=>{
                        _this.$emit('update:dialogFormVisible',false);
                        _this.getpage();
                    })
                }
            }
        },
        handleCurrentChange(val){
            this.currentRow = val;
        }
    },
    created(){
        this.titles=this.type==1?'修改理疗项目':'添加理疗项目';
        if(this.type == 1){
            this.id = this.prolist.id;
            this.name = this.prolist.name;
            this.collectfees = this.prolist.collectfees;
        }
    }
}
</script>
 
<style lang="less">
.proheaders{
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

