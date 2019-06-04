<template>
    <div class="nav">
        <div :class="isActive == '/physicianVisits' ? 'active' : ''" @click="goPath('physicianVisits')">
            <i></i>
            <span>问诊</span>
        </div>
        <div :class="isActive == '/doctorList' ? 'active' : ''" @click="goPath('doctorList')">
            <i></i>
            <span>医生</span>
        </div>
        <div :class="isActive == '/myOrderList' ? 'active' : ''" @click="goPath('myOrderList')">
            <i></i>
            <span>取药</span>
        </div>
        <div :class="isActive == '/myManage' ? 'active' : ''" @click="goPath('myManage')">
            <i></i>
            <span>我的</span>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    export default {
        data() {
            return {
                isActive: this.$route.path, //默认值为路由取下来的
            }
        },
        //生命周期之挂载完成
        methods: {
            goPath(val){
                this.$router.push({path: '/'+val,query: {source: 'commNav'}});
            }
        }
    }
</script>

