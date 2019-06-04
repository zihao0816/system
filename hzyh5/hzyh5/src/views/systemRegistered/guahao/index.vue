<template>
    <div class="guahao">
        <div class="page">
            <div class="top">
                <p v-if="doctorData.diagnosticstatus">北京好中医</p>
                <p v-if="doctorData.diagnosticstatus">{{doctorData.clinicname}}在线挂号服务</p>
                <p v-else style="margin:16px 0;">医生当前暂未坐诊</p>
            </div>
            <div class="content">
                <div class="doctorinfo clearfix"> 
                    <div>
                        <img :src="doctorData.doctorFace" alt="">    
                    </div>
                    <div>
                        <p class="doctorname">{{doctorData.doctorName}}</p>
                        <p class="position">{{doctorData.duties}}</p>
                    </div>
                    <div>
                        <p>门诊挂号费</p>
                        <p class="thes">￥{{doctorData.diagnosticfee}}/次</p>
                    </div>
                </div>
                <div class='adept-zy'>
                    <div class='heads-zy'>
                        <span>擅长调理</span>
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
                        {{doctorData.intro}}
                    </div>
                </div>
            </div>
            <div class="btn">
                <el-button v-if="doctorData.diagnosticstatus" type="primary" @click="routerToPay">开始挂号</el-button>
                <el-button v-else>暂无号源</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../../../api/common.js'
export default {
    data(){
        return {
            doctorData : {},
            skillname: []
        }
    },
    created(){
        var ua = navigator.userAgent.toLowerCase();
        var wptype;
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            wptype = 'jsapi';
        } else {
            wptype = 'h5';
        }
        if(wptype=='jsapi'){
            if(this.$route.query.code==null){
                this.$doRequest('/api/WeiXin/getUrl',{parameters:window.location.href},res=>{
                    // this.$store.state.url = res.parameters;
                    location.href = res.parameters;
                    // this.$router.push({path: '/'});
                })
            }else{
                this.$doRequest('/api/WeiXin/getOpenId',{parameters:this.$route.query.code},res=>{
                    this.$store.state.openid=res.parameters;
                })
            }
        }
        document.title = '门诊挂号';
        var doctorId = common.getQueryString(window.location.search.substr(1),'doctorid'),
            clinicId = common.getQueryString(window.location.search.substr(1),'clinicid'),
            origin = common.getQueryString(window.location.search.substr(1),'origin');
        if(doctorId != null && doctorId != '' && clinicId != null && clinicId != ''){
            this.$store.state.doctorId = doctorId;
            this.$store.state.clinicId = clinicId;
            this.$store.state.origin = origin;
        }
        this.query();
    },
    methods: {
        query(){
            var data = {
                parameters: this.$store.state.doctorId,
                parametersone: this.$store.state.clinicId
            }
            this.$store.state.userInfo.sessionId = this.$store.state.userInfo.sessionId == null ||  this.$store.state.userInfo.sessionId == '' ? 'haozhongyi' : this.$store.state.userInfo.sessionId;
            this.$doRequest('/api/AppHomePage/Index',data,res=>{
                res.doctorFace = '/'+ res.doctorFace;
                this.doctorData = res;
                this.skillname = res.skillname.split(',');
                this.$store.state.price = res.diagnosticfee;
            })
        },
        routerToPay(){
            if(this.doctorData.diagnosticfee == '0'){
                this.$store.state.free = true;
            }
            this.$router.push({path: '/boundPhone'})
        }
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
