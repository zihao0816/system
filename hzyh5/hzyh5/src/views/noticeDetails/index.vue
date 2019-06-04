<template>
    <div class="noticedetails">
        <div class="page">
            <div class="notice-one">
                <div class="top clearfix">
                    <div class="left">
                        <p>{{details.day}}</p>
                        <p>{{details.month}}月</p>
                        <p>{{details.year}}年</p>
                    </div>
                    <p class="right">{{details.content}}</p>
                </div>
                <div class="footer">
                    <span>发布于&emsp;{{details.time}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../../api/common'
export default {
    created(){
        document.title = '查看医生公告';
        this.$isLogin(window.location.search.substr(1),this.inits);
    },
    data(){
        return {
            details: {}
        }
    },
    methods: {
        inits(){
            var url = window.location.search.substr(1);
            if(this.$route.query.data == null){
                var id = common.getQueryString(url,'id');
                this.$doRequest('/api/doctornotice/getById?id='+id,null,res=>{
                    res.parameters.year = new Date(res.parameters.updatetime).getFullYear();
                    res.parameters.month = new Date(res.parameters.updatetime).getMonth()+1;
                    res.parameters.day = new Date(res.parameters.updatetime).getDate();
                    res.parameters.time = common.timestampToTime(res.parameters.updatetime,3);
                    this.details = res.parameters;
                })
            }else{
                this.details = this.$route.query.data;
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
