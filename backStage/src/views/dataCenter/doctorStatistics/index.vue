<template>
    <div class="doctorStatistics">
       <div class="main">
            <ul>
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#07A591" >
                    <el-menu-item index="1" @click="getType(1)"><router-link to="/doctorStatistics" >医生数据统计</router-link></el-menu-item>
                    <el-menu-item index="2" @click="getType(2)"><router-link to="/doctorStatistics/docActive">医生活跃度分析</router-link></el-menu-item>
                    <el-menu-item index="3" @click="getType(3)"><router-link to="/doctorStatistics/docQualification">医生资质分析</router-link></el-menu-item>
                </el-menu>
            </ul>
            <div class="title">
                <i>当前位置：</i>
                <span style="color: #07A591;">{{type==1?'医生数据统计':type==2?'医生活跃度分析':'医生资质分析'}}</span>
            </div>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
   data(){
        return {
            activeIndex: '1',
            type:1
        }
    },
    methods:{
       getType(index){
           this.type=index;
       } 
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
