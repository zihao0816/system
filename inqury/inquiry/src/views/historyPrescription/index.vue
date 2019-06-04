<template>
    <div class="history">
        <!-- 问诊历史处方 -->
       <div class="search">
            <p><span>患者姓名：</span><input type="text" placeholder="请输入姓名" v-model="paName" /></p>
            <p><span class="phone">患者手机号：</span><input type="text" placeholder="请输入手机号" v-model="paPhone" /></p>
            <p><span>处方编号：</span><input type="text" placeholder="请输入处方编号" v-model="paId"/></p>
            <p><span>选择时间:</span>
            <el-date-picker
                v-model="paTime"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd">
                </el-date-picker></p>  
            
            <a class="btn" @click="searchinfo" style="float:right">搜索</a>  
            <a class="btn" style="float:right" @click="resetpre">重置</a>   
        </div>
        <el-table :data="tableData" style="width:100%;" border ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" fixed="left"></el-table-column>
            <el-table-column label="处方编号" prop="orderid" width="220" align="center"></el-table-column>      
            <el-table-column label="处方时间" prop="createtime" width="160" align="center"></el-table-column>  
            <el-table-column label="剂型" prop="prescriptionshape" width="80" align="center"></el-table-column>  
            <el-table-column label="姓名" prop="hispatientname" width="80" align="center"></el-table-column>  
            <el-table-column label="电话" prop="telephone" width="110" align="center"></el-table-column>  
            <el-table-column label="金额" prop="totalprice" width="80" align="center"></el-table-column>
            <el-table-column label="支付状态"  width="80" align="center">
                 <template slot-scope="scope">
                    <span>{{scope.row.paystate==null?"-":scope.row.paystate}}  </span>        
                </template>       
            </el-table-column>
            <el-table-column label="支付方式" width="80" align="center">
                 <template slot-scope="scope">
                    <span>{{scope.row.paystate==1?"微信":"会员卡"}} </span>        
                </template>    
            </el-table-column>
            <el-table-column label="诊断信息"  width="300" align="center">
                 <template slot-scope="scope">
                    <span>{{scope.row.arguedisease}}{{scope.row.arguedisease?'；':''}}{{scope.row.doctorconclusion}}</span>        
                </template>  
            </el-table-column>   
            <el-table-column label="总剂数" prop="totaldosage" width="70" align="center"></el-table-column>  
            <el-table-column label="科别" prop="departmentname" width="140" align="center"></el-table-column>  
            <el-table-column label="开方医生" prop="hisdoctorname" width="80" align="center"></el-table-column>
            
            <el-table-column label="交易时间"  width="160" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.paytime==null?"-":scope.row.paytime}}  </span>        
                </template>   </el-table-column>    
            <el-table-column label="操作" align="center" width="160" fixed="right">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.paystate!=='已支付'"  @click="handleClick(scope.row)" type="text" size="small">核销</el-button>
                    <el-button type="text" size="small" @click="getclick(scope.row)">就诊记录</el-button>        
                </template>
            </el-table-column>
        </el-table>
        <div class="block" style="width:100%;float:right;font-size：16px;">
            <el-button type="primary" style="float:left;background:#07A591;border:#07A591 1px solid;" @click="handleClick('all')">核销已选项</el-button>
            <el-pagination
            background
            @current-change="iscreat"
            :current-page.sync="pageIndex"
            layout="total, prev, pager, next, jumper"
            :page-count="pageSum"
            style="float:right">
            </el-pagination>
        </div>
        <cancle :memberstate=memberstate :accountBalance="accountBalance" :queryiny="queryiny" v-if="dialogFormVisible" :dialogFormVisible.sync="dialogFormVisible" :istrueupdate.sync="istrueupdate" :price="price"> </cancle> 
        <record :historyrecord="historyrecord" v-if="dialogrecord" :dialogrecord.sync="dialogrecord"> </record>
        <!-- 提示弹框 -->
        <el-dialog title="批量核销提示" :visible="dialog" :before-close="clear" width="20%">
            <div>
                <p>当前所选择的患者信息冲突（非同一个患者）</p>
                <p>请再次确认后进行核销</p>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="clear()">知道了</Button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import cancle from "./prop/cancle"
    import record from "./prop/record"
export default {
        data () {
            return {
                id:'',
                tableData: [],
                paName:'',
                paPhone:'',
                paId:'',
                paTime:null,
                pageIndex:1,
                pageSum:1,
                dialogFormVisible:false,
                dialogrecord:false,
                queryiny: [],//核销时的传入弹框字段
                pageSum:1,
                historyrecord:{},
                accountBalance:"",
                istrueupdate:'1',
                memberstate:"",
                ids: [],
                aggregate: [],
                telephoneArr: [],
                itmeArr: [],
                price: 0,
                dialog: false,
            }
        },
         methods: {
            //全选操作
            handleSelectionChange(val){
                this.itmeArr = [];
                val.forEach((item)=>{
                    this.aggregate.push(item.id);
                    this.telephoneArr.push(item.telephone);
                    this.itmeArr.push(item);
                });
             },
             //取消全选
             clear(){
                 this.aggregate = [];
                 this.telephoneArr = [];
                 this.dialog = false;
             },
             getclick(list){
                this.dialogrecord=true;
                this.historyrecord=list;
             },
            iscreat(){
                var _this = this;
                var logindetail = JSON.parse(sessionStorage.getItem('loginDetail'))
                this.id = logindetail.parameters.id;
                this.$doRequest("/api/DiagnosisPlan/search",{doctorid:this.id,pageLength:10,pagination:this.pageIndex},function(res){
                    _this.tableData = res.rows;
                    _this.pageSum=res.total;
                })
            },
            handleClick(item){
                this.queryiny = [];
                let telephone = '';
                if(item == 'all'){
                    //批量操作
                    //校验手机号是否为同一患者
                    let index = this.telephoneArr[0];
                    let repeat = 0;
                    this.telephoneArr.forEach((item,i)=>{
                        if(item.indexOf(index) < 0){
                            repeat ++;
                        }
                    });
                    if(repeat>=1){
                        this.dialog = true;
                        return false;
                    }
                    telephone = this.telephoneArr[0];
                    this.queryiny = this.itmeArr;
                }else{
                    telephone = item.telephone;
                    this.queryiny.push(item);
                    this.aggregate.push(item.id);
                };
                let _this=this;
                this.dialogFormVisible=true;
                let params = {
                    ids: this.aggregate,
                    telephone: telephone
                };
                this.$doRequest("/api/DiagnosisPlan/batchverificationjg", params,res=>{
                    _this.price = res.parameters.price;
                    _this.accountBalance=res.parameters.accountbalance;
                    _this.memberstate=res.parameters.memberstate;
                    _this.iscreat();
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
                this.$doRequest("/api/DiagnosisPlan/search",{
                    "condition":{
                        "patientname":this.paName,
                        "telephone":this.paPhone,
                        "orderid":this.paId,
                        "starttime":stime,
                        "endtime":etime,
                    }
                },res=>{
                    _this.tableData = res.rows;
                })
            },
            resetpre(){
                this.paName="";
                this.paPhone="";
                this.paId="";
                this.paTime=null;
            },
           
        },
        //生命周期之创建完成
        created: function(){
            this.iscreat();
        },
        components:{
            cancle,
            record
        },
        mounted(){
            // this.xxx();
        },
        watch:{
            istrueupdate(news){
                var _this = this;
                 this.$doRequest("/api/DiagnosisPlan/search",{doctorid:this.id,pageLength:10,pagination:this.pageIndex},function(res){
                    _this.tableData = res.rows;
                    _this.pageSum=res.total;
                })
            }
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
  .search{
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
                border-radius: 5px;
                border: 1px solid #dcdfe6;
                outline: none;
           }
                        
       }     
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
        margin-left:10px;
        margin-bottom: 10px;
        border-radius: 5px;
    }
    .btn:nth-of-type(1){
        margin-left:40px;

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
    //复选框样式
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background-color: #07A591;
        border-color: #07A591;
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background-color: #07A591;
        border-color: #07A591;
    }
    /deep/.el-checkbox__inner:hover{
        border-color: #07A591;
    }
    /deep/.el-checkbox__inner:focus,.el-checkbox__inner:hover{
        border: #07A591 1px solid;
    }
    .el-dialog__footer{
        .ivu-btn-primary{
            background: #07A591;
            border-color: #07A591;
        }
    }
</style>


