<template>
    <div>
        <div class="docorder"> 
            <el-dialog  title="订单与收益" center  :visible="docorderdialog"  @update:visible="v=>$emit('update:docorderdialog',v)" width="80%">
                <div class="search">
                    <p class="fr inputall"><span class="fontsleft">订单来源：</span> 
                        <el-select v-model="orderlist" placeholder="请选择">
                            <el-option
                            v-for="item in order"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </p>
                    <p class="fr inputall"><span class="fontsleft">订单类型：</span> 
                        <el-select v-model="typelist" placeholder="请选择">
                            <el-option
                            v-for="item in mechanism"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </p>
                    <p class="daystimes"><span class="fontsleft">成交时间:</span>
                        <el-date-picker
                            v-model="deailtime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </p>  
                    <a class="btn" @click="getdetails" >搜索</a>  
                    <a class="btn" @click="resetpre">重置</a>   
                </div>
                <div class="orderdocdetail">
                    <ul>
                        <li>医生姓名：{{orderss.doctorname}}</li>
                        <li>问诊订单(成交/笔): {{headersss.orsum}}</li>
                        <li>问诊收益(元)：{{headersss.odoctorprice}}</li>
                        <li>处方订单(成交/笔): {{headersss.orpsum}}</li>
                        <li>处方收益(元)：{{headersss.opdoctorprice}}</li> 
                    </ul>              
                </div>
                <el-table border  :data="tableData">
                    <el-table-column  label="订单号" align="center" prop="ordercode" width="220"></el-table-column>
                    <el-table-column  label="订单来源"  align="center" prop="ordertype" width="80">
                        <template slot-scope="scope">
                            <span> {{scope.row.ordertype=="app"?scope.row.ordertype:"门诊"}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="机构关系" align="center" prop="hospitaname" width="150"></el-table-column>
                    <el-table-column  label="成交时间" align="center" width="150">
                         <template slot-scope="scope">
                            <span> {{daytimess.timestampToTime(scope.row.paytime,1)}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="订单类型" align="center" prop="ordertypes" width="80"></el-table-column>
                    <el-table-column  label="订单金额" align="center" prop="totalprice"></el-table-column>
                    <el-table-column  label="优惠券" align="center" prop="saleprice"></el-table-column>
                    <el-table-column  label="成交金额" align="center" prop="actualprice"></el-table-column>
                    <el-table-column  label="收益金额" align="center" prop="doctorprice"></el-table-column>
                </el-table> 
                 <!-- 分页 -->
                <div class="block" v-if="tableData.length>0" style="float:right;font-size：16px;float：right;margin-bottom:20px">
                    <el-pagination
                    @current-change="getdetails"
                    :current-page.sync="pageIndex"
                    layout="total, prev, pager, next"
                    :page-count="pageSum">
                    </el-pagination>
                </div>
            </el-dialog> 
        </div>     
    </div>
</template>
<script>
import common from "../../../../api/common.js"
export default {
    props:["docorderdialog","orderss"],
     data() {
        return {
            daytimess:common,
            labelPosition:'right',
            tableData:[],
            pageIndex:1,
            pageSum:1,
            valuetime:'',
            value6:"",
            order: [{
                value: '',
                label: '全部'
                }, {
                value: 'APP',
                label: 'APP'
                }, {
                value: 'clinic',
                label: '门诊'
            }],
            mechanism: [{
                value: '问诊/处方',
                label: '全部'
                }, {
                value: '问诊',
                label: '问诊'
                }, {
                value: '处方',
                label: '处方'
            }],
            type: [{
                value: '',
                label: '全部'
                }, {
                value: '个人',
                label: '个人'
                }, {
                value: '机构',
                label: '机构'
                }, {
                value: '诊所',
                label: '诊所'
            }],
            headersss:{},
            ruleForm2:{
                name:"",
                phone:""
            },
            orderlist:"",
            typelist:"",
            deailtime:"",
            starttime:'',
            endtime:"",
            tableData:[{name:"12345",phone:"12345",createtime:"机构关系",businesstype:"1234567",remarks:"问诊",createname:"2018-12-21 12:09:12",sourcemoney:"1234",thismoney:"12345",aftermoney:"1111"}]
        }
     },
     methods:{
         getdetails(){
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
            let _this=this;
            let obj={
                    "pageLength":"3",
                    "pagination":this.pageIndex,
                    "condition":{
                        "doctorid":this.orderss.id, //医生id
                        "ordersource":this.orderlist,   // 订单来源
                        "ordertype":this.typelist,    //订单类型
                        "starttime":this.starttime,   //开始时间
                        "endtime": this.endtime        //借宿时间
                    } 
            }
            this.$doRequest("api/doctorinfo1.5.1/getorderOrEarnings",obj,res=>{
                _this.tableData=res.pageVal;
                _this.pageSum=res.pageCount/1;

            })
             this.$doRequest("api/doctorinfo1.5.1/getHeandmsg/"+this.orderss.id,null,res=>{
                 _this.headersss=res[0];
            })

         },
         searchinfo(){
            
            // this.$doRequest("")
        },
        resetpre(){
            this.paName="";
            this.paPhone="";
            this.orderlist="";
            this.typelist="";
            this.deailtime="";
        }
     },
     mounted(){
      this.getdetails();
     }    
}
</script>
 
<style lang="less">
.docorder{
    min-height:500px;
    .el-dialog{
         overflow: hidden;
    }
    // .daystimes{
    //     .el-range-input{
    //         border-left: 0;
    //         border-right: 0;
    //         box-sizing: border-box;
    //     }
    // }
    
    .el-dialog__headerbtn .el-dialog__close{
        height:40px;
        line-height: 40px;
    }
    .el-dialog--center .el-dialog__body {
        height:430px;
        box-sizing: border-box;
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
    .search{
        .inputall{
            input{
                text-indent: 10px;
                float:left;
                width: 150px;
                height: 40px;
                border-radius: 5px;
                border: 1px solid #dcdfe6;
                outline: none;
            } 
        }
        p{
            float:left;
            margin:0 20px 21px 0;
            .fontsleft{
                 float:left;
                 width: 70px;
                 line-height: 40px;
                 color: rgba(20, 20, 20, 1);
                 font-size: 14px;
                 text-align: left;
                 font-family: PingFang-SC-Medium;
                 font-weight:800;
            }
           
                          
        }
        .el-date-editor .el-input__inner{
            width:220px;
        }
        .el-date-editor .el-input__suffix {
            left:190px;
        }
        .fr span{
            text-align: right;
        }
        // p:nth-of-type(5) input{
        //    border:0;
           
        // }    
    }
    // p:nth-of-type(2) span{
    //     width:84px;
    // }
    .btn{
        float:left;
        width:96px;
        line-height:40px;
        background:#07A591;
        text-align:center; 
        font-size:14px;
        color:#FFF;
        margin-left:10px;
        margin-bottom: 10px;
        border-radius: 5px;
    }
    .btn:nth-of-type(1){
        margin-left:40px;
    } 
    .el-pagination{
        // margin-bottom:40px;
        // position:static!important;
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