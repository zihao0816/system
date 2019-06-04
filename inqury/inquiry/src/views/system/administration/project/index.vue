<template>
    <div>
        <div class="addName fr" @click="dialogFormVisible=true">
            <el-button style="background:#07A591;margin-bottom:21px;color:#fff;" @click="addProject()">添加理疗项目</el-button>
        </div>
        <el-table :data="tableData" style="width:100%;" border >
           <el-table-column label="序号" align="center" width="60">
                <template slot-scope="scope">
                    <span> {{scope.$index+(pageIndex-1) * 10 + 1}}</span>
                </template>   
            </el-table-column> 
            <el-table-column label="理疗项目" prop="name"  align="center"></el-table-column>      
            <el-table-column label="创建时间"   align="center">
                 <template slot-scope="scope">
                    <span>{{scope.row.createtime}}</span>        
                </template>
            </el-table-column>  
            <el-table-column label="创建人" prop="createname"  align="center"></el-table-column>  
            <el-table-column label="收费金额" prop="collectfees"  align="center"></el-table-column>       
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
                    <el-button type="text" size="small" @click="proht(scope.row)" ref='nihoa'>{{scope.row.enable==1?'禁用':'启用'}}</el-button>        
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
        <addproject :prolist="prolist" :type="type" :getpage="getpage" v-if="dialogFormVisible" :dialogFormVisible.sync="dialogFormVisible"> </addproject>
        <prohibit :getpage="getpage" v-on:propihit="propihitss" :proname="proname" v-if="dialogprobit" :dialogprobit.sync="dialogprobit"> </prohibit> 
    </div> 
</template>
<script>
 import addproject from "./prop/addproject"
 import prohibit from "./prop/prohibit"
export default {
    data(){
        return {
            tableData:[],
            dialogFormVisible:false,
            dialogprobit:false,
            pageIndex:1,
            pageSum:1,
            type:"",
            prolist:{},
            isproject:true,
            isgo:"禁用",
            proname:{}
        }
    },
    methods:{
        handleClick(list){
            this.dialogFormVisible=true;
            this.type=1;
            this.prolist=list;
        },
        proht(list){
            if(list.enable==1){
                this.proname=list; 
                this.dialogprobit=true;
            }else if(list.enable==0){
                let _this=this;
                this.$doRequest("/api/physiotherapylist/enable",{id:list.id},res=>{
                    _this.getpage();
                    _this.isgo="禁用";
                })
            }
        },
        getpage(){
            let _this=this;
            this.$doRequest("/api/physiotherapylist/pagelist",{"pageLength":10,"pagination":_this.pageIndex},res=>{
                _this.tableData=res.parameters.rows;
                _this.pageSum=res.parameters.total;
            })
        },
        addProject(){
           this.dialogFormVisible=true;
           this.prolist = {
                collectfees: '',
                createname: '',
                createtime: '',
                enable: '',
                id: '',
                name: ''
           }
           this.type=2;
        },
        propihitss(){
            this.isgo="开启";
        }
    },
    components:{
       addproject ,
       prohibit
    },
    mounted(){
        this. getpage();
    },
    created(){
        this.tableData=[{a:"医生",b:"18815687551",c:"2018-12-22 12:33",d:"自经济",e:"18815687551",f:"会员卡，挂号大厅，历史问诊处方"}];
    },
    
}
</script>
<style lang="less" scoped>
.fr{
    float:right;
}
// .el-table--border{
//     margin-bottom: 8px;
// }
.el-pagination{
     margin-bottom:40px;
      position:static!important;
    // position: fixed;
    // bottom:30px;
    // right:16px;
}
.el-button--text{
    color:#07A591 !important;
}
// .el-pagination.is-background .el-pager li:not(.disabled).active {
//     background-color: #07A591;
// }
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #07A591 !important;    
    }
    /deep/ .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
        background-color: #07A591 !important;    
    }

</style>