<template>
    <div class="notice">
        <div class="page">
            <scroller :on-refresh='refresh' :on-infinite='infinite' ref="my_scroller" :noDataText="noDataText">
                <div class="notice-one" v-for="(item,index) in noticeList" :key="index">
                    <div class="top clearfix">
                        <div class="left">
                            <p>{{item.day}}</p>
                            <p>{{item.month}}月</p>
                            <p>{{item.year}}年</p>
                        </div>
                        <p class="right">{{item.content}}</p>
                    </div>
                    <div class="footer clearfix">
                        <span>发布于&emsp;{{item.time}}</span>
                        <span @click="routerToDetails(item)">查看全文</span>
                    </div>
                </div>
            </scroller>
        </div>
    </div>
</template>
<script>
import common from '../../api/common'
import { setTimeout } from 'timers';
export default {
    data(){
        return {
            noticeList: [],
            noDataText: '',
            pagination: 1,
            total: 0
        }
    },
    created(){
        document.title = '全部公告';
    },
    methods:{
        routerToDetails(datas){
            this.$router.push({ path: '/noticeDetails',query: {data: datas}})
        },
        query(done){
            var data = {
                pagination: this.pagination,
                condition: {
                    doctorid: this.$route.query.id
                }
            }
            this.$doRequest('/api/doctornotice/getDoctorNotice',data,res=>{
                for(var i=0;i<res.parameters.rows.length;i++){
                    res.parameters.rows[i].year = new Date(res.parameters.rows[i].updatetime).getFullYear();
                    res.parameters.rows[i].month = new Date(res.parameters.rows[i].updatetime).getMonth()+1;
                    res.parameters.rows[i].day = new Date(res.parameters.rows[i].updatetime).getDate();
                    res.parameters.rows[i].time = common.timestampToTime(res.parameters.rows[i].updatetime,3)
                }
                if(this.pagination == 1){
                    this.noticeList = res.parameters.rows;
                }else{
                    for(var i=0;i<res.parameters.rows.length;i++){
                        this.noticeList.push(res.parameters.rows[i]);
                    }
                }
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
                    this.noDataText = '没有更多公告了';
                }else{
                    this.query(done);
                }
            },1500)
        }
    },
    mounted(){
        this.refresh();
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
