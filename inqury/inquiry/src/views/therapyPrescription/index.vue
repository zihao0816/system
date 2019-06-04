<template>
<div>
    <!--搜索框 -->
    <div class="searchthearpy">
        <el-form ref="searchs" :rules="rules2" :model="searchs" >
            <p><span>患者姓名：</span><el-form-item prop="paName"><input type="text" placeholder="请输入姓名" v-model="searchs.paName" /></el-form-item></p>
            <p><span class="phone">患者手机号：</span><el-form-item prop="paPone"><input type="text" placeholder="请输入手机号" v-model.number="searchs.paPone" /></el-form-item></p>
            <p><span>理疗单号：</span><el-form-item><input type="text" placeholder="请输入处方编号" v-model="searchs.paId"/></el-form-item></p>
        </el-form>
       <p><span>选择时间</span>
          <el-date-picker
            v-model="paTime"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
            </el-date-picker></p>
        <a class="btn" style="float:right;" @click="searchinfo">搜索</a>
        <a class="btn" style="float:right;" @click="resetpre">重置</a>

    </div>
    <!-- 历史理疗处方-->
    <el-table :data="tableData" style="width:100%;" border >
        <el-table-column label="理疗单号" prop="orderid" width='260px'  align="center" fixed></el-table-column>
        <el-table-column label="创建日期" prop="createtime" width='200px'  align="center"></el-table-column>
        <el-table-column label="患者姓名" prop="patienname"  align="center"></el-table-column>
        <el-table-column label="患者性别"  width="80"  align="center">
            <template slot-scope="scope">
                <span>{{scope.row.patiensex==1?"男":"女"}}</span>
            </template>
        </el-table-column>
        <el-table-column label="患者手机号" prop="patientel" align="center"></el-table-column>
        <el-table-column label="理疗项" prop="phynames"  align="center"></el-table-column>
        <el-table-column label="理疗师" align="center" prop="physiotherapistname"> </el-table-column>
        <el-table-column label="收费金额" width="120" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.consumption}} 元</span>
            </template>
        </el-table-column>
        <el-table-column label="付款方式" align="center">
             <template slot-scope="scope">
                <span>{{scope.row.paymentmethod==null?"-":scope.row.paymentmethod}}</span>
            </template>
        </el-table-column>
        <el-table-column label="状态"   align="center">
            <template slot-scope="scope">
                <span>{{scope.row.paystatus=="已支付"?"已支付":"未支付"}}</span>
            </template>
        </el-table-column>
        <el-table-column  label="操作" align="center" fixed="right">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small" v-if="scope.row.paystatus=='已支付'?false:true">核销</el-button>
                <el-button type="text" size="small" @click="findthreapys(scope.row)">查看详情</el-button>
            </template>
        </el-table-column>
    </el-table>
  <!-- 分页 -->
    <div class="block" style="float:right;font-size：16px;">
        <el-pagination
        background
        @current-change="getpage"
        :current-page.sync="pageIndex"
        layout="total, prev, pager, next, jumper"
        :page-count="pageSum">
        </el-pagination>
    </div>
    <paycancles :memberstate=memberstate :getpage="getpage" :accountbalance="accountbalance" :paycancles="paycancles" v-if="dialogpaycancle" :dialogpaycancle.sync="dialogpaycancle"></paycancles>
    <detail :findthreapy="findthreapy" v-if="theradetail" :theradetail.sync="theradetail"></detail>
</div>
</template>
<script>
import paycancles from "./prop/paycancles"//历史理疗核销弹窗
import detail from "./prop/detail"//历史理疗详情弹窗
export default {
    name:"historyPrescription",
    data(){
        return {

            tableData:[],
            dialogpaycancle:false,
            theradetail:false,
            pageIndex:1,
            pageSum:1,
            paycancles:{},
            findthreapy:[],
            paTime:null,
            searchs:{
                paName:'',
                paPone:'',
                paId:''
            },
            rules2:{
                paName:[{ min: 0, max: 5, message: '姓名不能超过五位', trigger: 'blur' }],
                paPone:[ { type: 'number', message: '手机号必须为数字值'},{ min: 11, max: 11, message: '请输入11位手机号', trigger: 'blur' }],
            },
            accountbalance:"",
            memberstate:""
        }
    },
    methods:{
        handleClick(id){
            let _this=this;//获取会员卡余额
            this.$doRequest("/api/diagnosisqueue/getPatientByTel",{"telephone":id.patientel},res=>{
               _this.paycancles=id;
               _this.dialogpaycancle=true;
               _this.accountbalance=res.accountbalance;
               _this.memberstate=res.memberstate;
            })
        },
        findthreapys(findthreapy){
            this.theradetail=true;
            this.findthreapy=findthreapy;
        },
        getpage(){
            var _this=this;
            this.$doRequest("/api/physiotherapysheet/pagelist",{pageLength:10,pagination:this.pageIndex},res=>{
                _this.tableData=res.rows;
                _this.pageSum=res.total;
            })
        },
         searchinfo(){
             let _this=this;
            var stime;
            var etime;
            if(this.paTime!=null){
                stime = this.paTime[0];
                etime = this.paTime[1];
            }
            this.$doRequest("/api/physiotherapysheet/pagelist",{
               "condition":{ patienname:this.searchs.paName,
                patientel:this.searchs.paPone,
                orderid:this.searchs.paId,
                starttime:stime,
                endtime:etime}
            },function(res){
                _this.tableData = res.rows;
            })
        },
         resetpre(){
            this.searchs.paName="";
            this.searchs.paPone="";
            this.searchs.paId="";
            this.paTime=null;
        }
    },
    created(){
        // this.getpage();

    },
    components:{
        paycancles,
        detail
    },
    mounted(){
         this.getpage();
    }


}
</script>
<style lang="less" scoped>
.fl{
    float:left;
}
.fr{
    float:right;
}
.el-table--border{
    margin-bottom: 8px;
}
  .searchthearpy{
       p{
           float:left;
           margin:0 20px 21px 0;
           span{
                float:left;
                width: 70px;
                line-height: 40px;
                color: rgba(20, 20, 20, 1);
                font-size: 14px;
                text-align: left;
                font-family: PingFang-SC-Medium;
                font-weight:800;
           }
           input{
               text-indent: 10px;
                float:left;
                width: 160px;
                height: 40px;
                border-radius: 2px;
                border: 1px solid #dcdfe6;
                border-radius: 5px;
                outline: none;
            }

       }
    }
    .el-form-item{
        float:left;
    }
    p:nth-of-type(2) span{
        width:84px;
    }
    .btn{
        float:right;
        width:96px;
        line-height:40px;
        background:#07A591;
        text-align:center;
        font-size:14px;
        color:#FFF;
        margin-left:20px;
        border-radius: 5px;


    }
    .el-pagination{
        margin-bottom:40px;
        position:static!important;
    }
    .pageSums{
        position: absolute;
        bottom:30px;
        right:500px;
        line-height: 28px;
    }
    .el-button--text{
        color:#07A591;
    }
    /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #07A591;
    }
</style>


