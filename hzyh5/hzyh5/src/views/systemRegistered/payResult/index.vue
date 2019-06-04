<template>
    <div class="payresult">
        <div class="page">
            <div class="top" v-show="type != 1">
                <img width="60" src="../../../assets/buy/pay.png" alt="">
                <p>支付成功！</p>
            </div>
            <div class="content" :class="[type != 1 ? 'contents' : '']">
                <ul>
                    <li><span>坐诊医生：</span><span>{{list.doctor}}</span></li>
                    <li><span>坐诊诊所：</span><span>{{list.clinic}}</span></li>
                    <li><span>当前号源：</span><span>{{list.no}}</span></li>
                    <li><span>当前等待人数：</span><span>{{list.before}}人</span></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            type: this.$route.query.type,
            list: {}
        }
    },
    created(){
        this.query();
    },
    methods: {
        query(){
            var data = {
                patientid: this.$route.query.patientid == null || this.$route.query.patientid == '' ? sessionStorage.patientid : this.$route.query.patientid,
                hospitainid: this.$store.state.clinicId == null || this.$store.state.clinicId == '' ? (sessionStorage.hospitainid == null || sessionStorage.hospitainid == '' ? this.$route.query.hospitainid : sessionStorage.hospitainid) : this.$store.state.clinicId,
                doctorid: this.$store.state.doctorId == null || this.$store.state.doctorId == '' ? (sessionStorage.doctorid == null || sessionStorage.doctorid == '' ? this.$route.query.doctorid : sessionStorage.doctorid) : this.$store.state.doctorId
            }
            if(this.$store.state.userInfo.sessionId == null || this.$store.state.userInfo.sessionId == ''){
                this.$store.state.userInfo.sessionId = 'haozhongyi';
            }
            this.$doRequest('/api/diagnosisqueue/find', data, res=>{
                this.list = res.parameters;
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
