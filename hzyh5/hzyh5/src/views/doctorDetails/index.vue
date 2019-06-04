<template>
    <div class='visitDoctor' >
        <div class='head-zy' :class="{'istrue':!istrue}">
            <div class="information-zy">
              <div class="imgs">
                <img :src="datalist.doctorFace" alt="" class='docHead-zy'>
                <img class="yes" src="../../assets/buy/rzcg_y@3x.png" alt="">
              </div>
              <p>
                <span class='docName-zy'>{{datalist.doctorName}}</span>
              </p>
              <div class="pl-zy">
                <span class='mainDoc-zy'>{{datalist.duties}}&ensp;/</span>
                <span class='place-zy'>{{datalist.hospitaname}}</span>
              </div>
            </div>
        </div>
        <div class="content-zy">
            <div class='online-zy'>
                <div class='heads-zy clearfix'>
                  <div class="left">
                    <p>在线复诊</p>
                    <p>如需再次就诊，点击复诊按钮</p>
                    <p>￥{{counts}}/次</p>
                  </div>
                  <div class="right">
                    <button class="btn" @click="gotoinfo()" v-if="datalist.isOrder==2">点此复诊</button>
                    <button :class="datalist.isOrder==0?'btns':datalist.isOrder==1?'btns_remove':''" @click="gotoinfo()" v-else>{{datalist.isOrder==0?'停止接诊':datalist.isOrder==1?'继续沟通':''}}</button>
                  </div>
                </div>
            </div>
            <div class="notice" v-if="datalist.doctornotice != null">
              <p class="clearfix"><span>医生公告</span><span @click="routerToNotice()">查看全部</span></p>
              <div class="time-notice">
                <div class="notices clearfix">
                  <div>
                    <p>{{datalist.doctornotice.day}}</p>
                    <p>{{datalist.doctornotice.month}}月</p>
                    <p>{{datalist.doctornotice.year}}年</p>
                  </div>
                  <p class="texts">{{datalist.doctornotice.content}}</p>
                </div>
                <p class="see clearfix"><span @click="routerToNoticeDetails(datalist.doctornotice)">查看全文</span></p>
              </div>
            </div>
            <div class='adept-zy'>
                <div class='heads-zy'>
                    <span>擅长</span>
                </div>
                <div class='adeptCon-zy'>
                    <p class='one-zy' v-for="(item,index) in skillname" :key="index">{{item}}</p>
                </div>
            </div>
            <div class='introduce-zy'>
                <div class='heads-zy'>
                    <span>医生介绍</span>
                </div>
                <div class='introCon-zy'>
                    {{datalist.intro}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import common from "../../api/common";
export default {
    data() {
        return {
            docid: "",
            item: {},
            datalist: "",
            skillname: [],
            counts: "",
            istrue: 0
        };
    },
    methods: {
        query() {
            var _this = this;
            console.log(111,_this.$store.state.userInfo);
            this.$doRequest("/api/AppHomePage/Index",{ parameters: _this.docid,twoParameter:_this.$store.state.userInfo.id},res => {
                if(res.doctornotice != null){
                    res.doctornotice.year = new Date(res.doctornotice.updatetime).getFullYear();
                    res.doctornotice.month = new Date(res.doctornotice.updatetime).getMonth()+1;
                    res.doctornotice.day = new Date(res.doctornotice.updatetime).getDate();
                    res.doctornotice.time = common.timestampToTime(res.doctornotice.updatetime,3);
                }
                this.datalist = res;
                this.skillname = res.skillname.split(",");
                if (typeof res.thagainprice == "number") {
                    this.counts = res.thagainprice;
                } else {
                    var inquiringprice = this.$store.state.common.inquiringprice;
                    var datas = inquiringprice.filter(function(item) {
                        return item.itemcode == res.thagainprice;
                    });
                    this.counts = datas[0].itemname;
                }
                this.$store.state.sun.price = this.counts;
            });
        },
        gotoinfo() {
            if(this.datalist.isOrder!=0){
                this.$router.push({ path: "/buyServiceDetails" });
            }
        },
        routerToNotice(){
            this.$router.push({ path: '/notice',query: {id: this.docid}});
        },
        routerToNoticeDetails(datas){
            this.$router.push({ path: '/noticeDetails',query: {data: datas}})
        }
    },
    //生命周期之挂载完成
    mounted: function() {
        // console.log(this.datalist);
    },
    //生命周期之创建完成
    created: function() {
        document.title = '复诊医生';
        var state = common.getQueryString(window.location.search.substr(1),"states");
        var doctorId = common.getQueryString(window.location.search.substr(1),"doctorId");
        if(state!=null&&state!=''&&doctorId!=null&&doctorId!=''){
            this.docid =doctorId;
            this.$store.state.AllOfValue.doctorId=doctorId;
            if (state== "g8t7r3") {
                this.istrue = 1;
            } else {
                this.istrue = 0;
            }
        }else{
            this.docid = this.$store.state.AllOfValue.doctorId;
            if (this.$route.query.state == "g8t7r3") {
                this.istrue = 1;
            } else {
                this.istrue = 0;
            }
        }
        this.$isLogin(window.location.search.substr(1), this.query);
    },
    //生命周期之更新
    updated: function() {},
    //生命周期之销毁
    destroyed: function() {},
    watch: {
        istrue: function(value, newvalue) {
            this.istrue = value;
        }
    }
};
</script>
<style lang="less">
@import "index.less";
</style>

