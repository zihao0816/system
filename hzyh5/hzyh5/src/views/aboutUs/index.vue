<template>
    <div class="aboutUs">
        <div class="header">
            <img src="../../assets/aboutus/logo.jpg">
            <h3>北京好中医用户端</h3>
            <span>版本v1.5.4</span>
        </div>
        <div class="list">
            <div>
                <i></i>
                <span>微信服务号</span>
                <span>北京好中医</span>
            </div>
            <div>
                <a href="tel:400-666-0101">
                <i></i>
                <span>客服电话</span>
                <span>400-666-0101</span>
                </a>
            </div>
            <div @click="goAgreement">
                <i></i>
                <span>用户协议</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
              
            }
        },
        //生命周期之挂载完成
        methods: {
            goAgreement(){
                this.$router.push({path: '/userAgreement'});
            }
        },
        created: function(){
            document.title = '关于我们';
        }
    }
</script>
<style lang="less">
.aboutUs{
    .header{
        width: 100%;
        padding: 30px 0;
        text-align: center;
        background: #fff;
        margin-bottom: 6px;
        img{
            width: 72px;
            height: auto;
            display: block;
            margin: 0 auto;
            border-radius: 10px;
        }
        h3{
            font-size: 18px;
            color: #141414;
            text-align: center;
            width: 100%;
            margin-top: 16px;
        }
        span{
            color: #818181;
        }
    }
    .list{
        background: #fff;
        div{
            height: 54px;
            line-height: 54px;
            padding: 0 20px;
            border-bottom: 1px solid #F1F0F5;
            overflow: hidden;
            i{
                width: 22px;
                height: 22px;
                display: inline-block;
                margin: 16px 10px 0 0;
                float: left;
                background-repeat: no-repeat;
            }
            span{
                color: #141414;
            }
            span:nth-child(2){
                float: left;
            }
            span:nth-child(3){
                float: right;
            }
        }
        div:nth-child(1) i{
            background-image: url(../../assets/aboutus/weixin@2x.png);
            background-size: 22px auto;
        }
        div:nth-child(2) i{
            background-image: url(../../assets/aboutus/kefudianhua@2x.png);
            background-size: 22px auto;
        }
        div:nth-child(3) i{
            background-image: url(../../assets/aboutus/yonghuxieyi@2xpng.png);
            background-size: 18px auto;
            margin: 14px 7px 0 3px;
        }
        div:nth-child(3) i:nth-child(3){
            background-image: none;
            float: right;
            margin: 20px 0;
            width: 12px;
        }
        div:nth-child(1) span:nth-child(3){
            font-size: 14px;
        }
    }
}
</style>
