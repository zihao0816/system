<template>
  <div class="financeWXinfo">
         <el-button @click="gotolist()" style="margin-left:5px;" icon="el-icon-back" size="mini">返回</el-button>
      <div class="father" style="height: 90%;">
          <div class="fatherlist">
            <div class="card img">
                <img :src="headimgurl" alt="">
            </div>
            <div class="card name">
                <div>{{name}}<span class="three">{{duties}}</span></div>
                <div class="three"> {{phone}}</div>
                <div class="three">{{hospitalname}}</div>
            </div>
            <div class="card">
                <div class="one">￥{{titinfo.balance}}</div>
                <div class="two">账户总余额</div>
                <div class="three">下月发放:￥{{titinfo.nextbalance}}</div>
            </div><div class="xian"></div>
            <div class="card">
                <div class="one">￥{{titinfo.allbalance}}</div>
                <div class="two">累计总收入</div>
                <div class="three">成交{{titinfo.allcount}}笔</div>
            </div><div class="xian"></div>
            <div class="card">
               <div class="one">￥{{wxpack.money}}</div>
                <div class="two">累计微信提现金额</div>
                <div class="three">微信已提现{{wxpack.count}}笔</div>
            </div><div class="xian"></div>
            <div class="card">
                <div class="one">￥{{bankcard.money}}</div>
                <div class="two">累计银行提现金额</div>
                <div class="three">银行卡已提现{{bankcard.count}}笔</div>
            </div>
          </div>
      <div class="infolist" style="height:73.5%">
                <el-table
                        :data="listinfo"
                        style="width: 100%;"
                        :span-method="objectSpanMethod"
                        height="90%">
                    
                    <el-table-column
                        label="提现时间"
                        width="200">
                         <template slot-scope="scope">
                            <div v-if="scope.row.time != undefined" style="text-align:left;"><strong>{{scope.row.time}}月</strong></div>  
                            <div else>{{scope.row.withdrawtime}}</div>  
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="提现方式"
                        width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.time == undefined">微信</div>
                           </template>
                    </el-table-column>
                    <el-table-column
                        label="用户订单号"
                        width="300">
                         <template slot-scope="scope">
                            <div  v-if="scope.row.time == undefined">{{scope.row.apporder}} <input type="text" class="nones" :value="scope.row.apporder" :id="scope.row.apporder"> <span @click="copyapp(scope.row.apporder)" style="color:blue;">复制</span></div>
                             </template>
                    </el-table-column>
                    <el-table-column
                        label="微信昵称"
                        width="120">
                         <template slot-scope="scope">
                            <div  v-if="scope.row.time == undefined">{{scope.row.nickname}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="微信OPENID"
                        width="300">
                        <template slot-scope="scope">
                            <div  v-if="scope.row.time == undefined">{{scope.row.openid}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="提现金额"
                        width="80">
                        <template slot-scope="scope">
                            <div  v-if="scope.row.time == undefined">{{scope.row.money}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="手续费"
                        width="80">
                        <template slot-scope="scope">
                            <div  v-if="scope.row.time == undefined">{{scope.row.costmoney}}</div>
                        </template>
                    </el-table-column>
                    
                    <el-table-column
                        label="平台总支出"
                        width="120">
                    <template slot-scope="scope">
                            <div  v-if="scope.row.time == undefined">{{scope.row.status=='success'?((scope.row.money*1)+(scope.row.costmoney*1)).toFixed(2):"0.00"}}</div>
                    </template>
                    </el-table-column>
                </el-table>
            
                <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="20"
                    layout="total, prev, pager, next, jumper"
                    :total="pagesize">
                </el-pagination>
      </div>
      </div>
  </div>
</template>

<script>

import navigation from '@/components/common/navigation'
export default {
    
  name: 'financeWXinfo',
   components: {
        navigation,
    },
  data () {
    return {
     month:'',
     year:'',
    listinfo:[],
    titinfo:{},
    wxpack:{},
    bankcard:{},
    name:'',
    duties:'',
    phone:'',
    hospitalname:'',
    pagesize:0,
    headimgurl:'',
    }
  },
  created(){
      var date = new Date
        this.month = date.getMonth()+1;
        this.year = date.getFullYear();
    this.query();
  },
  methods:{
     query(){
         var _this = this;
         this.name =this.$store.state.userInfo.name;
         this.duties =this.$store.state.userInfo.duties;
         this.phone =this.$store.state.userInfo.phone;
         this.hospitalname =this.$store.state.userInfo.hospitalname;
         this.headimgurl =this.$store.state.userInfo.headimgurl;
         this.$doRequest('/api/doctorwithdraw/queryUserWxStatistics?userid='+this.$store.state.userInfo.userid,null,function(res){
            _this.titinfo = res;
            _this.wxpack = res.wxpack;
            _this.bankcard = res.bankcard;
        })
         this.$doRequest('/api/doctorwithdraw/queryUserWithDraw?userid='+this.$store.state.userInfo.userid+'&pageLength=20&pagination=1',null,function(res){
          _this.pagesize = parseInt(res.valCount);
          _this.listinfo = res.pageVal;
        })
     },
    gotolist(){
         this.$router.push({
                path: "/financeWX"
            })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }){
        console.log(row.time,column)
        
            if (row.time != undefined) {
                return {
                rowspan: 1,
                colspan: 8
                };
            } else {
                return {
                rowspan: 1,
                colspan: 1
                };
            }
         
            
    },
    handleCurrentChange(item){
    },
    copyapp(appid){
            var Url2=document.getElementById(appid);
            Url2.select(); // 选择对象
            document.execCommand("Copy")
             this.$message({
                message: '复制成功！',
                type: 'warning'
            });
        },
  },
  watch:{
     
  }
}
</script>
<style lang="less" scoped>
  @import 'index.less';
</style>

