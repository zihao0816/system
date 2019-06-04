<template>
    <div class="patientsdoc">
        <el-dialog title="患者关系" center  :visible="patientdocdialog"  @update:visible="v=>$emit('update:patientdocdialog',v)" width="80%">
            <div class="orderdocdetail">
                <ul>
                    <li>医生姓名：{{patinetlist.doctorname}}</li>
                    <li>患者数量：{{headerss.psum}}</li>
                    <li>累积问诊次数：{{headerss.wsum}}</li>
                    <li>累积成交处方单数：{{headerss.csum}}</li>
                </ul>              
            </div> 
            <el-table border  :data="tableData">
                <el-table-column  label="患者姓名" align="center" prop="hispatientname"></el-table-column>
                <el-table-column  label="患者电话"  align="center" prop="telephone"></el-table-column>
                <el-table-column  label="累积问诊次数" align="center" prop="wenzhenshu"></el-table-column>
                <el-table-column  label="累积成交处方单数" align="center" prop="kaifangshu"></el-table-column>
                <el-table-column  label="累积成交金额" align="center" prop="zongactualprice"></el-table-column>
                <el-table-column  label="最近复诊日期" align="center" >
                    <template slot-scope="scope">
                        <span> {{dayTime.timestampToTime(scope.row.paytime,1)}} </span>
                    </template>
                </el-table-column>
            </el-table> 
            <!-- 分页 -->
            <div class="block" v-if="tableData.length>0" style="float:right;font-size：16px;float：right;">
                <el-pagination
                class="paganationsPatinet"
                @current-change="getpatients"
                :current-page.sync="pageIndex"
                layout="total, prev, pager, next"
                :page-count="pageSum">
                </el-pagination>    
            </div>
        </el-dialog> 
    </div>
</template>


<script>
import common from '../../../../api/common';
export default {
    props:["patientdocdialog","patinetlist"],
    data(){
        return {
            dayTime:common,
            tableData:[{name:"12345",phone:"12345",createtime:"机构关系",businesstype:"1234567",remarks:"问诊",createname:"2018-12-21 12:09:12",sourcemoney:"1234",thismoney:"12345",aftermoney:"1111"}], 
            pageIndex:1,
            pageSum:1,
            headerss:{psum:'',wsum:'',csum:''}
        }
    },
    methods:{
        getpatients(){
            let _this=this;
            this.$doRequest('/api/doctorinfo1.5.1/getPatientRelationheand/'+this.patinetlist.id,null,res=>{
                    _this.headerss=res;
            })
            let obj={
                "pageLength":"8",
                "pagination":this.pageIndex,
                "condition":{
                    "id":this.patinetlist.id//医生id
                }
            };
            this.$doRequest("api/doctorinfo1.5.1/PatientRelation",obj,res=>{
                    _this.tableData=res.pageVal;
                    _this.pageSum=res.pageCount/1;
            })
        }
    },
    mounted(){
        this.getpatients();
    }
}
</script>
<style lang="less">
  .patientsdoc{
     .paganationsPatinet{
         margin-bottom:0;
     }
    height:500px;
    .el-dialog__headerbtn .el-dialog__close{
        height:40px;
        line-height: 40px;
    }
    .el-dialog--center .el-dialog__body {
        min-height:400px;
        box-sizing: border-box;
        overflow: hidden;
    }
    .el-dialog__header{
        padding: 0;
        width:100%;
        line-height:40px;
        background-color: rgba(241, 240, 245, 1);
        .el-dialog__headerbtn{
            top:0px;
        }
    }
    .el-form-item__label{
        display: block;
        width:86px;
        text-align: right;
    }
    
    .el-form-item{
        display: flex;
        width:50%;
        float:left;
    }
    .el-form-item:nth-of-type(5){
        width:100%;
        .el-form-item__content{
            width:80%;
            .el-input{
                width:90%;
            }
        }
    }
}
.orderdocdetail{
        width:100%;
        height:30px;
        clear: both;
        margin-bottom:10px;
        // border-bottom:2px solid #ccc;
        ul{
            li{
                float: left;
                margin-right:30px;
                font-size: 14px;
            }
        }
    }

.city{
    .el-form-item{
            display: flex;
            height:40px;
            width:180px;
            .el-form-item__label{
                width:50px;
                margin-right:1px;
                text-align: left;
                padding:0;
                text-indent: 3px;
            }
            .el-form-item__content{
                width:130px;
            }
        }
    .el-form-item:nth-of-type(1){
        margin-left:35px;
        .el-form-item__label{
            text-indent:8px;  
        }
    }
    .area{
        float:left;
        line-height: 40px;
        margin-left:3px;
    }
}
    .el-pagination{
        position:absolute ;
        bottom:30px;
        right:72px;
    }
    .buton{
        border:1px solid #ccc;
        width:70px;
        line-height:40px;
        text-align:center;
        border-radius: 5px;
        position:absolute ;
        bottom:30px;
        left:30px;

    }
.inpt{
    .el-input{
        width:78%;
        margin-left:84px;
    }
}
</style>