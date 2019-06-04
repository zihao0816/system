<template>
  <div class="financeWX">
     <div class="title">
        当前位置：<span style="color: #07A591;">微信提现</span>
      </div>
      <div class="father">
          <div class="card">
              <div class="one">今日提现</div>
              <div class="two">￥{{today.money}}</div>
              <div class="three">提现{{today.strokecount}}笔，{{today.peoplenum}}人</div>
              <div class="three">手续费:￥{{today.costmoney}}</div>
          </div><div class="xian"></div>
          <div class="card">
              <div class="one">昨日提现</div>
              <div class="two">￥{{yesterday.money}}</div>
              <div class="three">提现{{yesterday.strokecount}}笔，{{yesterday.peoplenum}}人</div>
              <div class="three">手续费:￥{{yesterday.costmoney}}</div>
          </div><div class="xian">
            </div><div class="card">
              <div class="one">本周提现</div>
              <div class="two">￥{{week.money}}</div>
              <div class="three">提现{{week.strokecount}}笔，{{week.peoplenum}}人</div>
              <div class="three">手续费:￥{{week.costmoney}}</div>
          </div><div class="xian">
            </div><div class="card">
              <div class="one">{{month}}月总提现</div>
              <div class="two">￥{{monthlist.money}}</div>
              <div class="three">提现{{monthlist.strokecount}}笔，{{monthlist.peoplenum}}人</div>
              <div class="three">手续费:￥{{monthlist.costmoney}}</div>
          </div><div class="xian">
            </div><div class="card">
              <div class="one">{{year}}年度总提现</div>
              <div class="two">￥{{yearlist.money}}</div>
              <div class="three">提现{{yearlist.strokecount}}笔，{{yearlist.peoplenum}}人</div>
              <div class="three">手续费:￥{{yearlist.costmoney}}</div>
          </div>
      </div>
      <div class="infolist">
          <div>
              <!-- <span style="padding-top:10px;"><input type="checkbox" name="" id="">&nbsp;本页全选</span>
              <span><input type="checkbox" name="" id="">&nbsp;全部全选</span> -->
              <span class="foright">
                <el-date-picker
                    v-model="startendtime"
                    type="daterange"
                    align="center"
                    unlink-panels
                    value-format="yyyy-MM-dd"
                    range-separator="至"    
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                 <el-autocomplete
                    class="inline-input"
                    v-model="hospitallist"
                    :fetch-suggestions="querySearch"
                    @select="handleSelect"
                    placeholder="全部机构"
                    style="margin-left:-6px"
                ></el-autocomplete>
                 <el-input class="inputs" v-model="doclist" placeholder="医生姓名"></el-input>
                <el-button @click="gotolist(startendtime,doclist)" type="primary">搜索</el-button> 
              </span>
          </div>
            <div style="margin-top:40px;height: 80%;font-size:14px; ">
                <el-table
                        :data="listinfo"
                        style="width: 100%;"
                        height="100%">
                    <el-table-column
                        fixed
                        label="提现时间"
                        width="150">
                         <template slot-scope="scope">
                            <div>{{scope.row.ymd}}</div>
                            <div>{{scope.row.hms}}</div>    
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="医生姓名"
                        width="120">
                        <template slot-scope="scope">
                            <div>{{scope.row.username}}</div>
                            <div class="cl">{{scope.row.duties}}</div>
                            <div class="cl">{{scope.row.phone.substr(0,3)+'****'+scope.row.phone.substr(7)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="所属医院"
                        width="120">
                         <template slot-scope="scope">
                            <div>{{scope.row.hospitalname}}</div>
                             </template>
                    </el-table-column>
                    <el-table-column
                        label="微信昵称/微信OPENINID"
                        width="220">
                         <template slot-scope="scope">
                            <div>{{scope.row.nickname}}</div>
                            <div class="cl">{{scope.row.openid}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="提现方式/商户订单号"
                        width="220">
                        <template slot-scope="scope">
                            <div>微信</div>
                            <div id="app">{{scope.row.apporder}}<input type="text" class="nones" :value="scope.row.apporder" :id="scope.row.apporder"></div>
                            <div @click="copyapp(scope.row.apporder)" style="color:blue;">复制</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="提现金额/手续费"
                        width="150">
                        <template slot-scope="scope">
                            <div>￥ {{scope.row.money}}</div>
                            <div class="cl">手续费： ￥{{scope.row.costmoney}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="平台合计支出"
                        width="120">
                        <template slot-scope="scope">
                                <div style="color:red;">￥ {{((scope.row.money*1) + (scope.row.costmoney*1)).toFixed(2)}}</div>
                            </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <!-- @click.native.prevent="deleteRow(scope.$index, tableData4)" -->
                        <!-- size="small" @click="gotoinfo(scope.row.userid,scope.row.username,scope.row.duties,scope.row.phone.substr(0,3)+'****'+scope.row.phone.substr(7)),scope.row.hospitalname"> -->
                        <el-button
                        type="text"
                        size="small" @click="gotoinfo(scope.row)">
                        详情
                        </el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="10"
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
    
  name: 'financeWX',
   components: {
        navigation,
    },
  data () {
    return {
     month:'',
     year:'',
     yesterday:[],
     week:[],
     monthlist:[],
     yearlist:[],
     today:[],
     startendtime:[],
     hospitallist:'',
     restaurants: [],   
     doclist:'',
     pagesize:0,
     listinfo: [],
    hosid:'',
    time:'',
    name:'',
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
        this.$doRequest('/api/doctorwithdraw/queryAllWxStatistics',null,function(res){
          _this.yesterday = res.yesterday;
          _this.week = res.week;
          _this.monthlist = res.month;
          _this.yearlist = res.year;
          _this.today = res.today;
        })
        this.$doRequest('/api/doctorwithdraw/doctorwithdrawPageList',{
                pageLength:10,
                status:'success',
                pagination:1,
            },function(res){
                _this.pagesize = parseInt(res.valCount);
                _this.listinfo = res.pageVal     
                   
        })
         this.$doRequest('/api/hospitainfo/getListByKey',{},function(res){
                for(var i in res){
                    var obj = {};
                    obj.id = res[i].id;
                    obj.value = res[i].hospitashortname;
                    _this.restaurants.push(obj);
                }
        //  _this.hospitallist = res
        })
     },
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleCurrentChange(news){
          var stime = this.time[0]?time[0]:'';
          var etime = this.time[0]?time[1]:'';
          var _this = this;
         this.$doRequest('/api/doctorwithdraw/doctorwithdrawPageList',{
                pageLength:10,
                pagination:news,
                username:this.name,
                starttime:stime,
                endtime:etime,
                status:'success',
                hospitalid:this.hosid,
            },function(res){
            _this.pagesize = parseInt(res.valCount);
            _this.listinfo = []
            _this.listinfo = res.pageVal
        })
      },
      handleSelect(item){
          this.hosid = item.id
      },
      gotolist(time,name){
         if(time == null){
            var stime = ''
            var etime = ''
            }else{
            var stime = time[0]?time[0]:'';
            var etime = time[0]?time[1]:'';
         }
          if(!this.hospitallist){
              this.hosid = ''
          }
          var _this = this;
          this.time = time;
          this.name = name;
           this.$doRequest('/api/doctorwithdraw/doctorwithdrawPageList',{
                pageLength:10,
                pagination:1,
                username:name,
                status:'success',
                starttime:stime,
                endtime:etime,
                hospitalid:this.hosid,
            },function(res){
        _this.pagesize = parseInt(res.valCount);
        _this.listinfo = res.pageVal;
      })
      },
      gotoinfo(item){
          this.$store.state.userInfo.userid = item.userid;
          this.$store.state.userInfo.name = item.username;
          this.$store.state.userInfo.duties = item.duties;
          this.$store.state.userInfo.phone = item.phone.substr(0,3)+'****'+item.phone.substr(7);
          this.$store.state.userInfo.hospitalname = item.hospitalname;
          this.$store.state.userInfo.headimgurl = item.headphoto;
          this.$router.push({
                path: "/financeWXinfo"
            })
      },
      copyapp(appid){
        var Url2=document.getElementById(appid);
        Url2.select(); // 选择对象
        document.execCommand("Copy");
         this.$message({
          message: '复制成功！',
          type: 'warning'
        });
      }
  },
  watch:{
     
  }
}
</script>
<style lang="less" scoped>
  @import 'index.less';
</style>

