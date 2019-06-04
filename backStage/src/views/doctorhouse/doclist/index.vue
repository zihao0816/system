<template>
    <div class="doclists">
       <div class="addName">
            <el-button style="background:#07A591;margin-bottom:20px;color:#fff;" @click="adddoc">添加医生</el-button>
        </div>
        <div class="search">
            <el-form :inline="true"  class="demo-form-inline">
                <el-form-item label="医生姓名:"  >
                    <el-input style="width:140px" v-model="paName" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="医生手机号:">
                    <el-input style="width:140px" v-model="paPhone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="出诊机构:" >
                     <el-select style="width:160px" filterable v-model="institutionalName" placeholder="请选择">
                        <el-option
                            v-for="item in institutionalList"
                            :key="item.id"
                            :label="item.hospitaname"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号状态:">
                     <el-select style="width:140px" v-model="statevalue" placeholder="请选择">
                        <el-option
                            v-for="item in cities"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间:">
                      <el-date-picker
                      style="width:280px"
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
            <el-table :data="tableData" style="width:100%;" border  highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column  label="序号" width="60" align="center" fixed>
                <template slot-scope="scope">
                    <span> {{scope.$index+(pageIndex-1) * 10 + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="医生姓名" prop="doctorname"  align="center"></el-table-column>      
            <el-table-column label="手机号" prop="telephone" align="center"></el-table-column>  
            <el-table-column label="所属机构" prop="hospitaname"  align="center" ></el-table-column>  
            <el-table-column label="所属科室" prop="departmentname"  align="center" ></el-table-column>  
            <el-table-column label="性别" prop="sex"  align="center">
                <template slot-scope="scope">
                    <span> {{scope.row.sex==1?"男":"女"}} </span>
                </template>
            </el-table-column>  
            <el-table-column label="职称"   align="center" prop="dutiesname"></el-table-column>   
            <el-table-column label="所在城市" prop="city"  align="center"></el-table-column>  
            <el-table-column label="所在区域" prop="contry"  align="center"></el-table-column>  
            <el-table-column label="注册时间"  width="150" align="center" >
                <template slot-scope="scope">
                    <span> {{createtime.timestampToTime(scope.row.createtime,1)}} </span>
                </template>
            </el-table-column>
            <el-table-column label="账号状态"   align="center">
                <template slot-scope="scope">
                    <span> {{scope.row.confirmstate==1?"已认证":scope.row.confirmstate==3?"未认证":"待认证 "}} </span>
                </template>
            </el-table-column>
            <el-table-column label="审核结果"   align="center" prop="remark" ></el-table-column>
            <el-table-column label="公号显示"   align="center">
                <template slot-scope="scope">
                    <span> {{scope.row.ordernum?scope.row.ordernum:"-"}} </span>
                </template>
            </el-table-column>
            <el-table-column label="官网显示"   align="center">
                 <template slot-scope="scope">
                    <span> {{scope.row.websiteranking?scope.row.websiteranking:"-"}} </span>
                </template>
            </el-table-column>
            <el-table-column label="操作"  fixed="right" width="250" align="center">
                <template slot-scope="scope">
                    <el-button  type="text" size="small" @click="profitClick(scope.row)">收益管理</el-button>
                    <el-button type="text" size="small" @click="detaillist(scope.row)">资料详情</el-button> 
                    <el-button  type="text" size="small" @click="patientClick(scope.row)">患者关系</el-button>
                    <el-button type="text" size="small" @click="stateClick(scope.row)">显示状态</el-button> 
                    <el-button  type="text" size="small" @click="handleClick(scope.row)">订单与收益</el-button>
                    <el-button type="text" size="small" @click="codeClick(scope.row)">二维码</el-button>   
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
        <order :orderss="orderss" v-if="docorderdialog" :docorderdialog.sync="docorderdialog"></order>  
        <patients :patinetlist="patinetlist" v-if="patientdocdialog" :patientdocdialog.sync="patientdocdialog"></patients> 
        <qrCode :getpage="getpage" :codeslist="codeslist"   :doclist="doclist" v-if="docqrcodedialog" :docqrcodedialog.sync="docqrcodedialog"></qrCode>  
        <profitmanage :profit="profit" :getpage="getpage" :profitlist="profitlist" v-if="docProfitdialog" :docProfitdialog.sync="docProfitdialog"></profitmanage>
        <docState :getpage="getpage" :docstate="docstate" v-if="docstatedialog" :docstatedialog.sync="docstatedialog"></docState>
        <publicpopup :docadd="docadd" :getpagedoc="getpage" :doclistId="doclistId" :types="types" v-if="publicdialog" :publicdialog.sync="publicdialog"></publicpopup>
    </div>
</template>
<script>
import order from "./docPopup/order"//订单收益
import patients from "./docPopup/patient"//患者关系
import qrCode from "./docPopup/qrCode"//二维码
import profitmanage from "./docPopup/profitmanage"//收益管理
import docState from "./docPopup/docState"//显示状态
import publicpopup from "./../publicpopup"//添加医生和资料详情
import common from '../../../api/common';
export default {
    data(){
        return {
            institutionalName:"",
            institutionalList:[],
            createtime:common,
            tableData:[],
            pageIndex:1,
            pageSum:1,
            paName:"",
            paPhone:"",
            statevalue:"",
            deailtime:"",
            valuetime:"",
            docid:'',
            profitlist:{},
            docstate:{},
            patinetlist:{},
            orderss:{},
            cities:[
                 {
                value: '',
                label: '全部'
                },
                {
                value: '1',
                label: '已认证'
                }, {
                value: '2',
                label: '待认证'
                }],
            value6: '',
            docorderdialog:false,
            patientdocdialog:false,
            docqrcodedialog:false,
            docProfitdialog:false,
            docstatedialog:false,
            publicdialog:false,
            doclist:{},
            codeslist:{},
            starttime:'',
            endtime:"",
            types:"",
            doclistId:"",
            profit:[],
            docadd:"",
            currentRow:null
        }
    },
    methods:{
        handleCurrentChange(val){
             this.currentRow = val;
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
                    confirmstate:this.statevalue||"", //未认证 2待认证 1已认证，
                    doctornamel:this.paName ||"",
                    createtimestart:this.starttime||"",
                    createtimeend:this.endtime||"",
                    telephone:this.paPhone||"",
                    "orderby":"createtime desc",
                    hospitaiddoc:this.institutionalName
                }
            }
            let _this=this;
            this.$doRequest("/api/doctorinfo1.5.1/queryDoctor",obj,res=>{
               _this.tableData=res.pageVal
               _this.pageSum=res.pageCount/1;
            })
        },
        searchinfo(){

        },
        detaillist(list){
            this.publicdialog=true;
            this.types=2;
            this.doclistId=list.id;
            this.docadd=list;
        },
        adddoc(){
           this.publicdialog=true;
           this.types=1;
        },
        resetpre(){
            this.paName="";
            this.paPhone="";
            this.statevalue="";
            this.deailtime='';
            this.institutionalName="";
        },
        handleClick(list){//收益与订单
            this.docorderdialog=true;
            this.orderss=list;
        },
        patientClick(name){//患者关系
            this.patientdocdialog=true;
            this.patinetlist=name;
        },
        codeClick(list){
            this.docqrcodedialog=true;
            this.codeslist=list;
        },
        profitClick(list){
           this.docProfitdialog=true;
           this.profitlist=list;
           this.profit=this.profitlist.aftermedicalfee?this.profitlist.aftermedicalfee.split("-"):"";
        },
        stateClick(list){
            this.docstatedialog=true;
            this.docstate=list;
        },
        getInstitution(){
            let _this=this;
            this.$doRequest("/api/hospitainfo/geOrganization",{},res=>{
                _this.institutionalList=res;
            })
        }
    },
    components:{
        order,
        patients,
        qrCode,
        profitmanage,
        docState,
        publicpopup

    },
    created(){
        let _this=this;
         document.onkeydown=function(e){
            if(e.keyCode==13){
                _this.getpage();
            }
        }
    },
    mounted(){
        this.getpage();
        this.getInstitution();
        
       
    }
    
}
</script>
<style lang="less">
   @import 'index.less';
</style>


