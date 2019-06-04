<template>
    <div class="dochouse">
        <div>
            <div class="title">
                当前位置：<span style="color: #07A591;">账号中心首页</span>
            </div>
            <div class="main">
                <ul>
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#07A591" >
                        <el-menu-item index="1"><router-link to="/doctorhouse">医生列表</router-link></el-menu-item>
                        <el-menu-item index="2"><router-link to="/doctorhouse/pending">待审核列表</router-link></el-menu-item>
                    </el-menu>
                </ul>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            activeIndex: '1'
        }
    }
    
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>