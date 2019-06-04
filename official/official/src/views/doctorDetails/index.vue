<template>
    <div class="doctordetails">
        <navs></navs>
        <div class="page">
            <div class="doctor">
                <div class="headimg">
                    <img width="208" height="208" :src="doctorDetail.headphoto" alt="">
                </div>
                <div class="top">
                    <h3>{{doctorDetail.doctorname}}</h3>
                    <p>{{doctorDetail.duties}}</p>
                </div>
                <div class="code clearfix">
                    <img class="always" src="../../assets/img/sssd@3x.png" alt="">
                    <div class="fr">
                        <img width="160" height="160" :src="doctorDetail.qrbigurl" alt="">
                        <p>微信扫码上方我的二维码</p>
                        <p>即可随时在微信与我沟通，在家找我复诊</p>
                    </div>
                </div>
                <div class="synopsis">
                    <p class="title"><span></span><span>医生简介</span></p>
                    <p class="content">北京好中医特邀医生</p>
                    <p class="content">{{doctorDetail.intro}}</p>
                </div>
                <div class="synopsis">
                    <p class="title"><span></span><span>擅长调理</span></p>
                    <ul class="clearfix">
                        <li v-for="(item,index) in doctorDetail.skilled" :key="index" class="fl">{{item.skillname}}</li>
                    </ul>
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
            doctorDetail: {}
        }
    },
    created(){
        this.query();
    },
    methods:{
        query(){
            var _this = this;
            var doctorId = this.$route.fullPath.split('&')[1];
            this.$doRequest('/api/doctorinfo/getDoctorInfoById',{"parameters":doctorId},function(res){
                res.qrbigurl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.qrbigurl;
                _this.doctorDetail = res;
            })
        }
    },
    components:{
        navs,
        footers
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>


