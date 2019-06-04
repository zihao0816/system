<template>
    <div>
        <div class="addName fr">
            <el-button style="background:#07A591;margin-bottom:21px;color:#fff;" @click="dialogaddaccount=true">添加账号</el-button>
        </div>
        <el-table :data="tableData" style="width:100%;" border >
            <el-table-column  label="序号"  align="center" width="60">
                <template slot-scope="scope">
                    <span> {{scope.$index+(pageIndex-1) * 10 + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="账号类型" prop="usertype"  align="center" width="100"></el-table-column>      
            <el-table-column label="账号" prop="accountname"  align="center" width="120"></el-table-column>  
            <el-table-column label="创建时间"  align="center" width="160">
                 <template slot-scope="scope">
                    <span> {{$timestampToTime(scope.row.createtime,1)}}</span>
                </template>
            </el-table-column>  
            <el-table-column label="姓名" prop="username"  align="center"  width="80"></el-table-column>  
            <el-table-column label="联系方式" prop="telephone"  align="center" width="120"></el-table-column>  
            <el-table-column label="权限" prop="authdetails"  align="center"></el-table-column>      
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">权限</el-button>
                    <el-button type="text" size="small" v-if="scope.row.usertype=='医生'?false:true" @click="edit(scope.row.id)">修改密码</el-button>        
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
        <prop :getpage="getpage" v-if="dialogaddaccount" :dialogaddaccount.sync="dialogaddaccount"></prop>
        <jurisdiction :getpage="getpage" :juriId="juriId" v-if="dialogjur" :dialogjur.sync="dialogjur"></jurisdiction>
        <modify :getpage="getpage" :modiyId="modiyId" v-if="dialogmo" :dialogmo.sync="dialogmo"></modify>
    </div> 
</template>
<script>
import prop from "./prop/add"//添加账号弹窗
import jurisdiction from "./prop/jurisdiction"//权限弹窗
import modify from "./prop/modify"//修改密码弹窗
export default {
    props:[""],
    data(){
        return {
            tableData:[],
            dialogaddaccount:false,//添加账号弹窗
            dialogjur:false,//权限弹窗
            dialogmo:false,//修改密码弹窗
            pageIndex:1,
            pageSum:1,
            juriId:{},
            modiyId:""
        }
    },
    methods:{
        handleClick(list){
            this.dialogjur=true;
            this.juriId=list;
        },
        edit(list){
            this.dialogmo=true;
            this.modiyId=list;
        },
        getpage(){
            let _this=this;
            let inquryId=JSON.parse(sessionStorage.loginDetail).parameters.cnameid;
            this.$doRequest("/api/backgrounduser/queryAuthDetails",{"pageLength":"10","pagination":this.pageIndex,"condition":{"type":2,"cnameid":inquryId}},res=>{
                _this.tableData=res.rows;
               _this.pageSum=res.total;
            })
        },

    },
    components:{
        prop,
        modify,
        jurisdiction

    },
    created(){
        this.tableData=[{a:"内部",b:"18815687551",c:"2018-12-22 12:33",d:"自经济",e:"18815687551",f:"会员卡，挂号大厅，历史问诊处方"}];
    },
    mounted(){
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


