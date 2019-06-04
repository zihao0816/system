<template>
  <div class="index">
    <commNav></commNav>


    <div class="banner">
      <img src="../../assets/img/banner-xg.jpg" alt=""> 
    </div>
 

    <div class="lbt-list">
        <div class="zys-tit"><hr class="hr"><span><img src="../../assets/img/zys_ic@3x.png" alt=""><span class="st">这里汇集专业中医师</span></span> <hr class="hr"></div>
        <el-carousel height="720px"  class="wdith">
          <el-carousel-item v-for="item in doclist.length" :key="item" :autoplay='false'>
            <div>
                <div class="mingpian" v-for="(items,indexs) in doclist[item-1]" :key="indexs" @click="gotoinfo(items.doctorname,items.id)"> 
                    <div class="imgs">
                      <img class="imgone" :src="items.headphoto" alt="">
                      <div class="imgtwo">
                        <img width="130" height="130" :src="items.qrbigurl" alt="">
                      </div>
                    </div>    
                    <div class="fuji">
                      <div><span class="docname">{{items.doctorname}}</span><span>{{items.duties}}</span></div>             
                      <div><img class="lj" src="../../assets/img/Path 311@2x.png" alt=""></div> 
                      <div class="scfuji"><span class="shanchang">擅长：</span><span class="shanchangnr">{{items.skillname.split(',').join('&emsp;')}}</span></div>              
                      <div><img class="ls" src="../../assets/img/Path 31245@2x.png" alt=""></div> 
                      <div class="ckinfo"><span>查看</span> &nbsp;&nbsp;<img class="ckicon" src="../../assets/img/none.png" alt=""> </div> 
                    </div>
                </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="gengduo" @click="gotomore()">
          了解更多医生 >>
        </div>
    </div>
    <div class="zys-list">
        <div class="zys-tit"><hr class="hr"><span><img class="DSB" src="../../assets/img/hz_ic@3x.png" alt=""><span class="st">战略合作伙伴</span></span> <hr class="hr"></div>
        <div class="fons">
           <div>
            <img src="../../assets/img/zk-logo@2x.png" alt="">
          </div>
           <div>
            <img src="../../assets/img/krt-logo@2x.png" alt="">
          </div>
          <div>
            <img src="../../assets/img/tx_logo@2x.png" alt="">
          </div>
           <div>
            <img src="../../assets/img/aly_logo@2x.png" alt="">
          </div>
           <div>
            <img src="../../assets/img/dxy_logo@2x.png" alt="">
          </div>
           <div>
            <img src="../../assets/img/sf_logo@2x.png" alt="">
          </div>
           <div>
            <img src="../../assets/img/jd_logo@2x.png" alt="">
          </div>
        </div>
    </div>


    <commFooter></commFooter>
  </div>
</template>

<script>
import commNav from '@/components/common/navs'
import commFooter from '@/components/common/footers'
export default {
  name: 'index',
   components: {
        commNav,
        commFooter,
  },
  data () {
    return {
      doclist:[]
    }
  },
  created(){
    this.query();
  },
  methods:{
      gotomore(){
          this.$router.push({path: '/doctorlist'});
      },
       gotoinfo(doctorname,doctorId){
         let routeData = this.$router.resolve({
          path: "/doctordetails?"+doctorname+'&'+doctorId
        });
        window.open(routeData.href, '_blank');
      },
    arrsplit(arr,len){
        var slan = arr.length;
        var result = [];
        for(var i=0;i<slan;i+=len){
            result.push(arr.slice(i,i+len));
        }
        return result;
    },
    query(){
        var _this = this;
        this.$doRequest('/api/doctorinfo/getWebsiteList',{},function(res){
          for(var i=0;i<res.length;i++){
            res[i].qrbigurl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res[i].qrbigurl;
          }
          _this.doclist = _this.arrsplit(res,6);
        })
    }
  }
}
</script>
<style lang="less" scoped>
  @import 'index.less';
</style>

