<template>
    <div>
        <div class="addName fr">
            <el-button style="background:#07A591;margin-bottom:21px;color:#FFF;" @click="addoc()">添加理疗师</el-button>
        </div>
        <el-table :data="tableData" style="width:100%;" border >
            <el-table-column label="序号"  align="center" width="60">
                <template slot-scope="scope">
                    <span> {{scope.$index+(pageIndex-1) * 10 + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="理疗师姓名" prop="name"  align="center"></el-table-column>      
            <el-table-column label="理疗师电话" prop="phone"  align="center"></el-table-column>  
            <el-table-column label="创建时间"  align="center">
                <template slot-scope="scope">
                    <span> {{$timestampToTime(scope.row.createtime,1)}}</span>
                </template> 
            </el-table-column>  
            <el-table-column label="创建人" prop="createname"  align="center"></el-table-column>     
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                    <el-button type="text" size="small" @click="proht(scope.row)" >{{scope.row.enable==1?'禁用':'启用'}}</el-button>        
                </template>
            </el-table-column>
        </el-table>
         <!-- 分页 -->
        <div class="block" style="float:right;font-size：16px;margin-top:10px;">
            <el-pagination
                background
                @current-change="getpage"
                :current-page.sync="pageIndex"
                layout="total, prev, pager, next, jumper"
                :page-count="pageSum">
            </el-pagination>
        </div>
        <addproject :tableDatafirst="tableDatafirst" :type="type" :getpage="getpage" v-if="dialogform" :dialogform.sync="dialogform"> </addproject>
        <prohibit :getpage="getpage" v-on:prohtits="prohtits" :docname="docname" v-if="dialogprobit" :dialogprobit.sync="dialogprobit"> </prohibit> 
    </div> 
</template>
<script>
 import addproject from "./prop/addproject"
 import prohibit from "./prop/prohibit"
export default {
    data(){
        return {
            tableData:[],
            dialogform:false,
            dialogprobit:false,
            pageIndex:1,
            docname:{},
            type:"",
            tableDatafirst:{},
            pageSum:1,
            isgo:"禁用"//是否禁用或开启
        }
    },
    components:{
       addproject,
       prohibit
    },
    methods:{
        handleClick(list){
            this.dialogform=true;
            this.type=1;
            this.tableDatafirst=list;  
        },
        getpage(){
            let _this=this;
            this.$doRequest("/api/physiotherapist/pagelist",{"pageLength":10,"pagination":_this.pageIndex},res=>{
                _this.tableData=res.parameters.rows;
                _this.pageSum=res.parameters.total;
            })
        },
        proht(name){
            if(name.enable==1){
                this.docname=name; 
                this.dialogprobit=true;
            }else if(name.enable==0){
                let _this=this;
                this.$doRequest("/api/physiotherapist/enable",{id:name.id},res=>{
                    if(res.result>0){
                        _this.getpage();
                        _this.$message({
                            message: '开启成功',
                            type: 'success'
                        });
                        _this.isgo="禁用";
                    }
                })
            }
        },
        prohtits(){
            this.isgo="开启";
        },
        addoc(){
            this.dialogform=true;
            this.type=2;
        }
        
       
    },
    created(){
        this.getpage();
     }
    
}
</script>
<style lang="less" scoped>
.fr{
    float:right;
}
// .el-table--border{
//     margin-bottom: 8px;
// }
.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #000;
    color: #fff;
}
.el-pagination{
     margin-bottom:40px;
      position:static!important;
    // position: fixed;
    // bottom:30px;
    // right:16px;
}
.el-button--text{
    color:#07A591;
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #07A591;    
    }
</style>