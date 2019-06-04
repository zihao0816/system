<template>
    <div class="myregistered">
        <div class="page">
            <scroller :on-refresh='refresh' :on-infinite='infinite' ref="my_scroller" :noDataText="noDataText">
                <div class="content" @click="routerToDetails(item)" v-for="(item,index) in resgisteredList" :key="index">
                    <div class="top clearfix">
                        <img :src="item.headphoto" alt="">
                        <span>{{item.doctorname}}<span>医生的门诊</span></span>
                        <span>{{item.paymenttime}}</span>
                        <span>已支付</span>
                    </div>
                    <div class="footer">
                        <p><span>[诊疗机构]</span><span>{{item.outpatientname}}</span></p>
                        <p><span>[挂号费用]</span><span>{{item.consumption}}元</span></p>
                        <p><span>[就诊序号]</span><span>{{item.numberorder}}</span></p>
                    </div>
                </div>
            </scroller>
        </div>
    </div>
</template>
<script>
import common from '../../api/common'
export default {
    data(){
        return {
            resgisteredList: [],
            pagination: 1,
            total: 1,
            noDataText: ''
        }
    },
    created(){
        document.title = '门诊挂号';
        this.$isLogin(window.location.search.substr(1),this.init);
    },
    methods: {
        routerToDetails(datas){
            this.$router.push({path: '/myRegisteredDetails',query: {data:datas}});
        },
        init(){
            this.refresh();
        },
        query(done){
            var data = {
                pagination: 1,
                condition: {
                    parameters: this.$store.state.userInfo.id
                }
            } 
            this.$doRequest('/api/diagnosisqueue/queryPatientRegistration',data,res=>{
                for(var i=0;i<res.parameters.rows.length;i++){
                    var time = res.parameters.rows[i].paymenttime;
                    res.parameters.rows[i].paymenttime = common.timestampToTime(time,2);
                    res.parameters.rows[i].paymenttimes = common.timestampToTime(time,1);
                    res.parameters.rows[i].createtime = common.timestampToTime(res.parameters.rows[i].createtime,1);
                }
                this.resgisteredList = res.parameters.rows;
                this.total = res.parameters.total;
                if(typeof(done) == 'function'){
                    done();
                }
            })
        },
        refresh(done){
            setTimeout(()=>{
                this.pagination = 1;
                this.query(done);
            },1500)
        },
        infinite(done){
            this.pagination++;
            setTimeout(()=>{
                this.$refs.my_scroller.finishInfinite(true);
                if(this.pagination > this.total){
                    this.noDataText = '没有更多挂号信息了';
                }else{
                    this.query(done);
                }
            },1500)
        }
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>

