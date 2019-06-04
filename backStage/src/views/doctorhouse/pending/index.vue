<template>
    <div class="doclists">
        <div class="search">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item label="医生姓名:">
                    <el-input v-model="paName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="医生手机号:">
                    <el-input v-model="paPhone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="注册时间:">
                      <el-date-picker
                        v-model="deailtime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getpage">搜 索</el-button>
                    <el-button type="primary" @click="resetpre">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- table列表 -->
        <div>
            <el-table :data="tableData" style="width:100%;" border highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column  label="序号" width="60" align="center" fixed>
                <template slot-scope="scope">
                    <span> {{scope.$index+(pageIndex-1) * 10 + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="医生姓名" prop="doctorname"  align="center"></el-table-column>      
            <el-table-column label="手机号" prop="telephone"  align="center"></el-table-column>  
            <el-table-column label="所属机构" prop="hospitaname"  align="center"></el-table-column>  
            <el-table-column label="所属科室" prop="departmentname"  align="center"></el-table-column>  
            <el-table-column label="性别" prop="sex" width="60" align="center">
                <template slot-scope="scope">
                    <span> {{scope.row.sex==1?"男":"女"}} </span>
                </template>
            </el-table-column>  
            <el-table-column label="职称"   align="center" prop="dutiesname"></el-table-column>   
            <el-table-column label="所在城市" prop="city"  align="center"></el-table-column>  
            <el-table-column label="所在区域" prop="contry"  align="center"></el-table-column>  
            <el-table-column label="注册时间"  width="150" align="center">
                 <template slot-scope="scope">
                    <span> {{createtime.timestampToTime(scope.row.createtime,1)}} </span>
                </template>
            </el-table-column>
            <el-table-column label="账号状态"   align="center">
                <template slot-scope="scope">
                    <span> {{scope.row.confirmstate==1?"已认证":scope.row.createtime==2?"未认证":"待认证 "}} </span>
                </template>
            </el-table-column>
            <el-table-column label="操作"  fixed="right" width="200px" align="center">
                <template slot-scope="scope">
                    <el-button  type="text" size="small" @click="profitClick(scope.row.id)">资料详情</el-button>
                    <el-button type="text" size="small" @click="rejectClick(scope.row)">拒绝</el-button> 
                    <el-button  type="text" size="small" @click="passClick(scope.row)">通过</el-button> 
                </template>
            </el-table-column>
        </el-table>
        </div>
        <!-- 分页 -->
        <div class="block" style="float:right;font-size：16px;">
            <el-pagination
            @current-change="getpage"
            :current-page.sync="pageIndex"
            layout="total, prev, pager, next"
            :page-count="pageSum">
            </el-pagination>
        </div>
       <reject :getpage="getpage" :doctname="doctname" v-if="docdialogtype" :docdialogtype.sync="docdialogtype"></reject>    
       <adopt :getpage="getpage" :doctname="doctname" v-if="dialogprobit" :dialogprobit.sync="dialogprobit"></adopt>  
       <publicpopup :getpagedetail="getpage"  :docsid="docsid" :types="types" v-if="publicdialog" :publicdialog.sync="publicdialog"></publicpopup>     
    </div>
</template>
<script>
import reject from "./popup/reject";
import adopt from "./popup/adopt";
import publicpopup from "./../publicpopup"//添加医生和资料详情
import common from '../../../api/common';
export default {
    data(){
        return {
            createtime:common,
            tableData:[],
            pageIndex:1,
            pageSum:1,
            cities: [
                 {
                value: '1，2，3',
                label: '全部'
                }, {
                value: '3',
                label: '已注册'
                }, {
                value: '2',
                label: '待认证'
                }, {
                value: '1',
                label: '已认证'
                }],
            paName:"",
            paPhone:"",
            statevalue:"",
            deailtime:"",
            paId:"",
            paTime:"",
            dialogprobit:false,
            doctname:'',
            docdialogtype:false,
            starttime:'',
            endtime:'',
            publicdialog:false,
            types:"",
            docsid:"",
            currentRow:null
        }
    },
    methods:{
        handleCurrentChange(val){
             this.currentRow = val;
        },
        profitClick(list){
            this.publicdialog=true;
            this.types=3;
            this.docsid=list;
        },
        getpage(){
            for(let i=0;i<2;i++){
                if(this.deailtime.length>0){
                    let  d=new Date(this.deailtime[i]);
                    if(i==0){
                        this.starttime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
                    }else{
                        this.endtime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();  
                    }
                }
            }
           let obj={
                "pageLength":"10",
                "pagination":this.pageIndex,
                 "condition":{
                    confirmstate:2, //未认证 2待认证 1已认证，
                    doctornamel:this.paName,
                    createtimestart:this.starttime,
                    createtimeend:this.endtime,
                    telephone:this.paPhone,
                    "orderby":"createtime"
                }
            }
            let _this=this;
            this.$doRequest("/api/doctorinfo1.5.1/queryDoctor",obj,res=>{
               _this.tableData=res.pageVal;
               _this.pageSum=res.pageCount/1;
            })
        },
        searchinfo(){

        },
        resetpre(){
            this.paName="";
            this.paPhone="";
            this.statevalue="";
            this.deailtime=null;
        },
        passClick(name){
            this.doctname=name;
            this.dialogprobit=true;
        },
        rejectClick(name){
            this.doctname=name;
            this.docdialogtype=true;
        }
    },
    components:{
        reject,
        adopt,
        publicpopup
    },
    mounted(){
        this.getpage();
    }
}
</script>
<style lang="less">
   @import './index.less';
</style>