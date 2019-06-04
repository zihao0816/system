<template>
  <div class="finance">
     <navigation></navigation>
      <div class="bodys">
          <div class="putForward cards">
              <div class="tit" >提现统计</div>
            <el-tabs v-model="withdraw" value="1">
                <el-tab-pane v-for="item in 4" :key="item" :label="getlabel(item)" :name="item+''">
                    <div class="list">
                        <div class="one">
                            <span v-if="item == '1'">今日提现</span>
                            <span v-if="item == '2'">昨日提现</span>
                            <span v-if="item == '3'">本周提现</span>
                            <span v-if="item == '4'">本月提现</span>
                        </div>
                        <div class="two">￥&nbsp;{{withdrawStatistics.moneysum}}</div>
                        <div class="three" >提现<span>{{withdrawStatistics.withdrawcount}}</span>笔，<span>{{withdrawStatistics.peoplecount}}</span>人</div>
                    </div>
                    <div class="list">
                        <div class="one">微信平台手续费</div>
                        <div class="two">￥&nbsp;{{withdrawStatistics.servicecharge}}</div>
                        <div class="three" >收取比例：{{withdrawStatistics.proportion}}%</div>
                    </div>
                    <div style="width:33%;">
                        <div class="one">合计支出金额</div>
                        <div class="two">￥&nbsp;{{withdrawStatistics.moneytotal}}</div>
                        <div class="three" >微信商户平台总支出</div>
                    </div>
                </el-tab-pane>
            </el-tabs>
          </div>
          <div class="income cards">
                <div class="tit">统计收入</div>
             <el-tabs v-model="income" value="1">
                <el-tab-pane v-for="item in 4" :key="item" :label="getlabel(item)" :name="item+''">
                    <div class="list">
                        <div class="one">在线复诊</div> 
                        <div class="two">￥&nbsp;{{incomeStatistics.ordermoney}}</div>
                        <div class="three" >成交<span>{{incomeStatistics.ordernumber}}</span>笔</div>
                    </div>
                    <div class="list">
                        <div class="one">在线开方</div>
                        <div class="two">￥&nbsp;{{incomeStatistics.orderpresmoney}}</div>
                        <div class="three" >成交{{incomeStatistics.orderpresnumber}}笔</div>
                    </div>
                    <div style="width:33%;">
                        <div class="one">合计金额</div>
                        <div class="two">￥&nbsp;{{incomeStatistics.totalmoney}}</div>
                    </div>
                </el-tab-pane>
            </el-tabs>
          </div>
          <div class="bank cards">
            <div class="tit">银行提现</div>
            <el-tabs v-model="bank" value="1">
                <el-tab-pane  :label="month+'月'" name="1" style="color:#000 !important;" >
                    <div class="list" style="background:rgb(255,247,226)">
                        <div class="one" style="color:rgb(65,117,5)">{{month-0+1>12?'1':(month-0+1)}}月份预计发放金额</div> 
                        <div class="two" style="color:rgb(215,67,38)">￥&nbsp;{{bankGrant.predictMoney}}</div>
                    </div>
                    <div class="list">
                        <div class="one">{{month}}月已发放金额</div>
                        <div class="two">￥&nbsp;{{bankGrant.money}}</div>
                        <div class="three" >手续费￥{{bankGrant.costmoney}}</div>
                    </div>
                    <div style="width:33%;">
                        <div class="one">人数</div>
                        <div class="two">{{bankGrant.peoplecount}}</div>
                    </div>
                </el-tab-pane>
            </el-tabs>
          </div>
      </div>
  </div>
</template>

<script>

import navigation from '@/components/common/navigation'
export default {
    
  name: 'finance',
   components: {
        navigation,
    },
  data () {
    return {
      title:'',
      doclist:[],
      withdraw:'1',
      income:'1',
      bank:'1',
      withdrawStatistics:{},
      incomeStatistics:{},
      bankGrant:{},
      month:''
    }
  },
  created(){
    this.query();
    var date = new Date
    this.month = date.getMonth()+1;
  },
  methods:{
     query(){
        this.title= sessionStorage.title;
        this.url = sessionStorage.url;
        var _this = this;
        this.$doRequest('api/accountdetals/withdrawStatistics',{parameters:this.withdraw},function(res){
          _this.withdrawStatistics = res;
        })
        this.$doRequest('api/accountdetals/incomeStatistics',{parameters:this.income},function(res){
          _this.incomeStatistics = res;
        })
        this.$doRequest('api/accountdetals/bankGrant',{},function(res){
          _this.bankGrant = res;
        })
     },
    
    getlabel(item){
        if(item == 1){
            return '今日'
        }else if(item == 2){
            return '昨日'
        }else if(item == 3){
            return '本周'
        }else if(item == 4){
            return '本月'
        }
    }

  },
  watch:{
      withdraw(news){
          var _this = this;
          this.$doRequest('api/accountdetals/withdrawStatistics',{parameters:news},function(res){
          _this.withdrawStatistics = res;
        })
      },
      income(news){
          var _this = this;
          this.$doRequest('api/accountdetals/incomeStatistics',{parameters:news},function(res){
          _this.incomeStatistics = res;
        })
      }
  }
}
</script>
<style>
#tab-1{
        padding-left: 10px !important;
    }
</style>

<style lang="less" scoped>
  @import 'index.less';
</style>

