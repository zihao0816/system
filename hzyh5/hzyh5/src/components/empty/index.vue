<template>
    <div class="empty">
        <img src="../../assets/wnr@3x.png">
        <span>{{message}}</span>
    </div>
</template>
<style lang="less">
    .empty{
        width: 100%;
        height: 100%;
        background: #f1f0f5;
        img{
            width: 60%;
            height: auto;
            display: block;
            margin: 10vh auto 20px;
        }
        span{
            width: 100%;
            text-align: center;
            color: #C1C1C1;
            display: block;
        }
    }
</style>
<script>
    export default {
        props: {
            message: String  //定义传值的类型
        },
        data() {
            return {
                // tit: '暂无订单',
            }
        },
        //生命周期之挂载完成
        methods: {
            
        }
    }
</script>

