<template>
  <div class="navs">
      <el-container style="height: 100%;" direction='vertical'>
          <el-header style=" font-size: 12px;background:#262636;">
            <div class="logo">
              <img src="../../assets/img/logo@3x.png" alt="" srcset=""> 
            </div>
            <div class="search">
                <el-autocomplete
                  class="inline-input"
                  v-model="state1"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  @select="handleSelect"
                ></el-autocomplete>
            </div>
          </el-header>
      </el-container>
    </div>
</template>

<script>
export default {
  name: 'navs',
  data () {
    return {
      restaurants:[],
     state1:'',

    }
  },
  created(){
  },
  methods:{
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
      loadAll() {
        return [
          { "value": "首页", "url": "/index" },
          { "value": "患者首页", "url": "/hz" },
          { "value": "医生首页", "url": "/ys" },
          { "value": "药房首页", "url": "/yf" },
          { "value": "财务首页", "url": "/finance" },
          { "value": "微信提现", "url": "/financeWX" },
          { "value": "银行卡提现", "url": "/financebank" },
          { "value": "订单首页", "url": "/dd" },
          { "value": "反馈首页", "url": "/fk" },
          { "value": "优惠券首页", "url": "/yhj" },
          ];
      },
      handleSelect(item){
        this.$router.push({path:item.url});
      }
  },
    mounted() {
      this.restaurants = this.loadAll();
    }
}
</script>

<style lang='less' scoped>
.navs{
    height: 70px;
  .logo{
    margin: 15px 20px;
    height: 40px;
    width: 180px;
    display: inline-block;
    img{
      height: 100%;
      width: 100%;
    }
  }
  .search{
    display: inline-block;
    margin-left: 20px;
    margin-top: -54px;
  }
  /deep/ .el-autocomplete{
    top: -12px;
  }
  /deep/ .el-header {
    height: 100% !important;
  }
}


</style>
