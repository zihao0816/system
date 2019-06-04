<template>
    <div>
        <div class="addName fr" >
            <el-button style="background:#07A591;margin-bottom:21px;color:#fff;" @click="dialogtable=true">添加医生</el-button>
        </div>
        <el-table :data="tableData" style="width:100%;" border >
            <el-table-column  label="序号"  align="center" width="60">
                <template slot-scope="scope">
                    <span> {{scope.$index+(pageIndex-1) * 10 + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" prop="doctorname"  align="center"></el-table-column>      
            <el-table-column label="电话" prop="telephone"  align="center"></el-table-column>  
            <el-table-column label="性别"  align="center">
               <template slot-scope="scope">
                    <span> {{scope.row.sex==1?"男":"女"}}</span>
                </template> 
            </el-table-column>    
            <el-table-column label="加入时间" prop="createtime"  align="center">
                 <template slot-scope="scope">
                    <span> {{$timestampToTime(scope.row.createtime,1)}}</span>
                </template>
            </el-table-column>  
            <el-table-column label="坐诊费(元)" prop="diagnosticfee"  align="center"></el-table-column>      
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">坐诊费</el-button>     
                    <el-button @click="qrcode(scope.row.id)" type="text" size="small">二维码</el-button>    
                </template>
            </el-table-column>
        </el-table>
         <!-- 分页 -->
        <div class="block" style="float:right;font-size：16px;margin-top:10px;">
            <el-pagination  
	            @current-change="getPage"
                background
                :current-page.sync="pageIndex"
                layout="total, prev, pager, next, jumper"
                :page-count="pageSum">
            </el-pagination>
        </div>
        <adddoc :getPage="getPage" v-if="dialogtable" :dialogtable.sync="dialogtable"></adddoc>  
        <money :qrcodeId="qrcodeId" :dialogqrcode="dialogqrcode"  :getPage="getPage" :doclist="doclist" v-if="dialogprobit" :dialogprobit.sync="dialogprobit"> </money> 
    </div> 
</template>
<script>
import axios from "axios"
import adddoc from "./prop/adddoc"//添加医生弹窗
import money from "./prop/money"//坐诊费弹窗
export default {
    data(){
        return {
            tableData:[],
            dialogprobit:false,
            dialogtable:false,
            pageIndex:1,
            pageSum:1,
            doclist:"",
            dialogqrcode:false,
            qrcodeId:""
        }
    },
    methods:{
        qrcode(id){
           this.dialogprobit=true; 
           this.dialogqrcode=true;
           this.qrcodeId=id;

        },
        handleClick(doclist){
            this.dialogprobit=true;
            this.doclist=doclist;
            this.dialogqrcode=false;
        },
        getPage(){
            let _this=this;
            this.$doRequest("/api/diagnosisdoctor/pagelist",{"pageLength":10,"pagination":this.pageIndex},res=>{
                _this.tableData=res.parameters.rows;
                _this.pageSum=res.parameters.total;
            })
        }
    },
    created(){

    },
    components:{
        money,
        adddoc
    },
    mounted(){
        this.getPage();

        // console.log(22222222,this.dialogtable);
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
