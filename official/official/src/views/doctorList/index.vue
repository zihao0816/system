<template>
  <div class="doctorlist" ref="table">
    <navs></navs>
    <div class="page-py">
      <div class="top-py">
        <hr>
        <p class="">
          <img
            width="24"
            height="24"
            src="../../assets/img/zys_icn@3x.png"
            alt=""
          >
          <span>这里汇集专业中医师</span>
        </p>
        <hr>
      </div>
      <div class="list-py">   
        <ul> 
            <li v-for="(item,index) in doctorList" :key="index" class="clearfix" @click='routerToDetails(item.id,item.doctorname)'>
              <div class="fl headphoto-py">
                <img class="imgone-py" width="180" height="180" :src="item.headphoto" alt="">
                <div class="imgtwo-py">
                  <img width="130" height="130" :src="item.qrbigurl" alt="">
                </div>
              </div>
              
              <div class="fr content-py">
                <p class="name-py"><span>{{item.doctorname}}</span><span>{{item.duties}}</span></p>
                <div class="clearfix intro-py">
                  <img class="fl left-py" src="../../assets/img/none.png" alt="">
                  <p><span>擅长：</span><span>{{item.skillname.split(',').join('&emsp;')}}</span></p>
                  <img class="fr right-py" src="../../assets/img/none.png" alt="">
                </div>
                <div class="fr see-py">
                  <span>查看</span>
                  <img src="../../assets/img/none.png" alt="">
                </div>
              </div>
            </li>
        </ul>
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="10"
            layout="prev, pager, next, jumper"
            :total=total
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <footers></footers>
  </div>
</template>
<script>
import navs from '@/components/common/navs';
import footers from '@/components/common/footers';
export default {
  data(){
    return{
      doctorList: [],
      total: 0,
      currentPage1: 1
    }
  },
  created(){
    this.query();
  }, 
  methods:{
    query(){
      var _this = this;
      this.doctorList = [];
      this.$doRequest('/api/doctorinfo/doctorPageList',{"pageLength":"10","pagination":"0"},function(res){
        _this.total = parseInt(res.valCount);
        for(var i=0;i<res.pageVal.length;i++){
          res.pageVal[i].qrbigurl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.pageVal[i].qrbigurl;
          _this.doctorList.push(res.pageVal[i]);
        }
      })
    },
    handleCurrentChange(val){
      var _this = this;
      this.doctorList = [];
      this.$doRequest('/api/doctorinfo/doctorPageList',{"pageLength":"10","pagination":val},function(res){
        _this.total = parseInt(res.valCount);
        for(var i=0;i<res.pageVal.length;i++){
          res.pageVal[i].qrbigurl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.pageVal[i].qrbigurl;
          _this.doctorList.push(res.pageVal[i]);
        }
      })
    },
    routerToDetails(doctorId,doctorname){
      let routeData = this.$router.resolve({
        path: "/doctordetails?"+doctorname+'&'+doctorId
      });
      // this.$store.state.doctorId = doctorId;
      // sessionStorage.setItem('doctorId',doctorId);
      window.open(routeData.href, '_blank');
    }
  },
  components:{
    navs,
    footers
  }
};
</script>
<style lang="less" scoped>
@import "index.less";
</style>


