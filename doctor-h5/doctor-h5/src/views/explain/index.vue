<template>
    <div class="explain">
        <header>
            <h3><i></i>已完成注册</h3>
            <span>登陆app，完成医疗资质开启您的个人医馆</span>
        </header>
        <div class="center">
            <div class="logo">
                <img src="../../assets/icone66@3x.png">
                <img src="../../assets/hzyguidetext@3x.png">
            </div>
            <div>
                <p><span>1</span>下载北京好中医APP</p>
                <p><span>2</span>用<span>{{ telephone }}</span>登录北京好中医</p>
                <p><span>3</span>完成医疗资质即可</p>
            </div>
        </div>
        <a class="submit" :href="system == 'Android'?'https://fir.im/6wh8 ':'https://itunes.apple.com/cn/app/id1434008053?mt=8'">下载北京好中医医生版APP</a>
    </div>
</template>
<script>
export default {
    data() {
        return {
            telephone: this.$route.query.telephone || '',
            system: '',
        }
    },
    methods: {
        getSystem(){
            let u = navigator.userAgent;
            if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
                this.system = 'Android';
            }else if(u.indexOf('iPhone') > -1){
                this.system = 'iPhone';
            }else if(u.indexOf('Windows Phone') > -1){//winphone手机
                alert("winphone手机");
            }
        }
    },
    //生命周期之创建完成
    created: function() {
        this.getSystem();
        document.title = '注册';
    }
}
</script>

export default {

}
<style lang="less">
.explain{
    width: 100%;
    height: 100vh;
    background: #fff;
    header{
        width: 100%;
        // height: 138px;
        padding: 40px 0;
        background: url(../../assets/bj@3x.png);
        background-size: 100% 100%;
        h3{
            width: 100%;
            text-align: center;
            color: #fff;
            display:flex;
            justify-content:center;
            align-items:center;
            font-size: 18px;
            font-weight: 200;
            padding-bottom: 16px;
            i{
                width: 24px;
                height: 24px;
                background: url(../../assets/wc@3x.png);
                background-size: 100%;
                display: inline-block;
            }        
        }
        span{
            font-size: 14px;
            color: #fff;
            width: 100%;
            text-align:  center;
            display: block;
            font-weight: 200;
        }
    }
    .center{
        .logo{
            margin: 44px auto 22px;
            img:nth-child(1){
                width: 64px;
                height: 64px;
                border-radius: 10px;
                display: block;
                margin: 0 auto 14px;
            }
            img:nth-child(2){
                width: 110px;
                height: auto;
                display: block;
                margin: 0 auto;
            }
        }
        div:nth-child(2){
            padding: 0 16px;
            p{
                height: 42px;
                line-height: 42px;
                color: #141414;
                span:nth-child(1){
                    width: 20px;
                    height: 20px;
                    background: #D74326;
                    border-radius: 10px;
                    display: inline-block;
                    color: #fff;
                    font-size: 14px;
                    text-align: center;
                    line-height: 20px;
                    margin-right: 16px;
                }
                span:nth-child(2){
                    color: #D74326;
                }
            }
        }
    }
    .submit{
        width: 94%;
        position: fixed;
        bottom: 26px;
        left: 3%;
        text-decoration:none;
    }
}
</style>
  

