<template>
    <div class="physicianVisits">
        <div class="page-py">
            <div class="choose-py clearfix">
                <span></span><span>选择您要问诊的医生</span><span @click="moreDoctor">更多名医</span>
            </div>
            <ul v-if="doctorList.length>0" class="aaa">
                <li :class="[item.isOrder == '1' ? 'bgcolor-py' : 'bgcolors-py']" v-for="(item,index) in doctorList" :key="index" class="li-item-py" @click="routerTo(item)">
                    <!-- <img width="50" height="50" class="photo-py" :src="item.doctorFace" alt=""> -->
                    <div class="photo-py" :style="item.style"></div>
                    <div class="badges-py" v-show='item.myMessages != null && item.myMessages.isRead == false'>
                        <wv-badge :is-dot="true"></wv-badge>
                    </div>
                    <div class="contents-py">
                        <p class="clearfix">
                            <span>{{item.doctorName}}</span>
                            <span>{{item.duties}}</span>
                            <span>{{item.myMessages !=null?item.myMessages.times:''}}</span>
                        </p>
                        <p class="message-py"><span v-if="item.isdialectics == '3'" style="color:#D74326;margin-right:6px;">[待购药]</span>{{item.myMessages !=null?item.myMessages.data:''}}</p>
                    </div>
                    
                </li> 
            </ul>
            <div v-else style="text-align:center;">
                <img width="190" height="190" style="margin-top:60px;" src="../../assets/wnr@3x.png" alt="">
                <div style="text-align:center;color:#C1C1C1;">
                    <p style="margin-top:40px;margin-bottom:8px;">扫医生二维码，购买问诊服务</p>
                    <p>点击“医生”按钮，查找医生，购买问诊服务</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import common from "../../api/common";
import commNav from "@/components/nav/index.vue";
import { Badge } from "we-vue";
export default {
    components: {
        commNav
    }, 
    props: {},
    data() {
        return {
            doctorList: [],
            patientId: "",
            msgList: {} //最新一条聊天记录
        };
    },
    created() {
        var _this = this;
        document.title = '复诊医生'
        this.$isLogin(window.location.search.substr(1), _this.query);
        this.$store.state.websocketdosome['onTextMessage'] = function(message){
            _this.query();
        },
        this.$store.state.websocketdosome['onPictureMessage'] = function(message){
            _this.query();
        },
        this.$store.state.websocketdosome['onAudioMessage'] = function(message){
            _this.query();
        }
    },
    methods: {
        query() {
            var id = this.$store.state.userInfo.id;
            this.patientId = this.$store.state.userInfo.id;
            var _this = this;
            this.$doRequest("/api/Inquiry/GetDoctors", { parameters: id }, res => {
                _this.doctorList = [];
                var msg = localStorage.getItem('msgsuccess') ? JSON.parse(localStorage.getItem('msgsuccess')) : {};
                var oldList = [];
                var newList = [];
                for (var i = 0; i < res.doctorsItems.length; i++) {
                    var doctorId = res.doctorsItems[i].doctorId;
                    var msgList = msg[doctorId];
                    if(msgList != null && msgList.length>0){
                        var lastMsg = msgList[msgList.length-1];
                        if((lastMsg.ext.businessType == null || lastMsg.ext.businessType == 'patient_profile' || lastMsg.ext.businessType == 'profileFinish' || lastMsg.ext.businessType == 'facePicFinish') && (lastMsg.type == 'txt' || lastMsg.types == 'txt')){
                            if(lastMsg.data == null || lastMsg.data == ''){
                                lastMsg.data = lastMsg.body.msg;
                            }
                        }else if(lastMsg.type == 'img' || lastMsg.types == 'img'){
                            lastMsg.data = '[图片]';
                        }else if(lastMsg.types == 'voice'){
                            lastMsg.data = '[语音]';
                        }else if(lastMsg.ext.businessType != null && (lastMsg.ext.businessType == 'EndOrder' || lastMsg.ext.businessType == 'doctorEndOrder')){
                            lastMsg.data = '本次服务已结束';
                        }
                        var newYear = new Date().getFullYear();
                        var newMonth= new Date().getMonth()+ 1;
                        var newDay = new Date().getDate();
                        var newDays = new Date().getDate()-7;
                        var newTime = newYear + '/' + newMonth + '/' + newDay + ' 00:00:00';
                        var newTimee = '';
                        var newTimes = new Date(newTime).getTime();
                        if(newDays == 0){
                            var oldMonth = newMonth - 1;
                            var oldDay = new Date(newYear, oldMonth, newDays).getDate();
                            newTimee = newYear + "/" + oldMonth + "/" + oldDay + " 00:00:00";
                        }else if(newDays < 0){
                            var oldMonth = newMonth - 1;
                            var oldDay = new Date(newYear, oldMonth, 0).getDate() + newDays;
                            newTimee = newYear + "/" + oldMonth + "/" + oldDay + " 00:00:00";
                        }else{
                            newTimee = newYear + "/" + oldMonth + "/" + newDays + " 00:00:00";
                        }
                        var newTimese = new Date(newTimee).getTime();
                        if(lastMsg.time > newTimes){
                            lastMsg.times = common.timestampToTime(lastMsg.time,5);
                        }else if(lastMsg.time < newTimes && lastMsg.time > newTimese){
                            lastMsg.times = common.timestampToTime(lastMsg.time,8);
                        }else{
                            lastMsg.times = common.timestampToTime(lastMsg.time,2);
                        }
                        res.doctorsItems[i].myMessages = lastMsg;
                    }
                    res.doctorsItems[i].buytime = new Date(res.doctorsItems[i].buytime).getTime();
                    res.doctorsItems[i].style = {'background-image': 'url('+res.doctorsItems[i].doctorFace+')'};
                    if(res.doctorsItems[i].myMessages == null || res.doctorsItems[i].myMessages == ''){
                        oldList.push(res.doctorsItems[i]);
                    }else{
                        newList.push(res.doctorsItems[i]);
                    }
                }
                oldList.sort(_this.sortTime);
                newList.sort(_this.sortTime);
                for(var j=0;j<oldList.length;j++){
                    _this.doctorList.push(oldList[j]);
                }
                for(var n=0;n<newList.length;n++){
                    _this.doctorList.unshift(newList[n]);
                }
                var doctorId = common.getQueryString(window.location.search.substr(1),"doctorId");
                if (doctorId != null && doctorId != "") {
                    if (common.getLock(_this, "todoctorLock" + doctorId, null, false)) {
                        for (var i = 0; i < _this.doctorList.length; i++) {
                            if (_this.doctorList[i].doctorId == doctorId) {
                                _this.$store.state.AllOfValue.ImDoctorInfo = _this.doctorList[i];
                                _this.$store.state.AllOfValue.doctorId = _this.doctorList[i].doctorId;
                                _this.$router.push({ path: "/im" });
                                this.$store.state.tabIndex= 'immsg';
                            }
                        }
                    }
                }
                if(_this.doctorList.length == 1){
                    var doctorId = _this.doctorList[0].doctorId;
                    if(common.getLock(_this,'todoctorLock' + doctorId, null, false)) {
                        _this.$store.state.AllOfValue.ImDoctorInfo = _this.doctorList[0];
                        _this.$store.state.AllOfValue.doctorId = _this.doctorList[0].doctorId;
                        _this.$router.push({ path: '/im'});
                        this.$store.state.tabIndex= 'immsg';
                    }
                }
                if(_this.doctorList.length == 0){
                    _this.moreDoctor();
                }
            });
        },
        sortTime(a, b) {
            if (a.myMessages != null) {
                return a.myMessages.time - b.myMessages.time;
            }
            return b.buytime - a.buytime;
        },
        routerTo(doctorInfo) {
            if (doctorInfo != "") {
                //im内医生信息
                this.$store.state.AllOfValue.ImDoctorInfo = doctorInfo;
                this.$store.state.AllOfValue.doctorId = doctorInfo.doctorId;
                this.$store.state.tabIndex= 'immsg';
                this.$router.push({ path: "/im" });
            }
        },
        moreDoctor(){
            this.$router.push({ path: '/doctorList'})
        }
    },
    destroyed() {},
    updated() {
        var _this = this;
    }
};
</script>
<style lang="less" scoped>
@import "index.less";
</style>

