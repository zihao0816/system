<template>
    <div class="homePage">
        <!-- 卡片区域 -->
        <p class="title">当前位置：<span>首页</span></p>
       <!-- <div class="card">
            <div>
                <h3>999999</h3>
                <p>当前库存药品种类（单位：个）</p>
                <span></span>
            </div>
            <div>
                <h3>999999</h3>
                <p>当前库存药品种类（单位：个）</p>
                <span></span>
            </div>
            <div>
                <h3>999999</h3>
                <p>当前库存药品种类（单位：个）</p>
                <span></span>
            </div>
            <div>
                <h3>999999</h3>
                <p>当前库存药品种类（单位：个）</p>
            </div>
        </div>-->
        <div class="path">
            <!--<span>药品字典</span>-->
            <div @click="goPath('/pushStorage')">
                <i></i>
                <span>入库</span>
            </div>
            <div @click="goPath('/pullStorage')">
                <i></i>
                <span>出库</span>
            </div>
            <!-- <span>审核</span>
            <span>补仓</span>
            <span>供应商管理</span>-->
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    export default {
       components: {

        },
        data() {
            return {

            }
        },
        //生命周期之挂载完成
        methods: {
            goPath(val){
                this.$router.push({path: val});
            }
        },
        //生命周期之创建完成
        created: function(){

        },
    }
</script>

