<template>
<div class="headers">
    <Row>
        <i-col span="8" style="font-size:24px; ">
            <div class="midle" style=" float:left;margin:0 20px 0 20px;">
                <!-- <span></span> -->
                <img src="../assets/0A7ED136-9059-4A77-B6A4-DD07F320A854@15x.png" alt="" class="pic1">
            </div>
            {{cname}}
        </i-col>
        <i-col span="8" style="font-size:20px; text-align:center;" >当前系统时间：{{date}}</i-col>
        <i-col span="8" style="font-size:16px;float:right;">
            <div style="float:right;line-height:60px">
            <span style="vertical-align: middle;">{{name}} / {{duties==null?'管理员':duties}}  </span>
            <!-- <Poptip trigger="click" title="提示标题" content="提示内容">                 
                    <div class="nav"></div>                
            </Poptip>             -->
            <span style="font-size:26px;margin:0 60px 0 46px;vertical-align: middle;cursor:pointer;" @click="logout">&#xe658;</span>
            </div>
            <div class="midle" style="float:right;margin-right:12px;">
                <!-- <span></span> -->
                <img src="../assets/0A7ED136-9059-4A77-B6A4-DD07F320A854@1x.png" alt="" class=" pic" >
            </div>
        </i-col>
    </Row>
</div>   
</template>
<script>
export default {
    name:"headers",
    data(){
        return {
            date:'',
            name:'',
            duties:null,
        }
    },
    methods: {
        lets(){
            var _this = this;
            setInterval(function(){
                _this.date = _this.$timestampToTime(Date.now(),1)
            },5000)
        },
        logout(){
            let _this=this;
            //  _this.$router.replace({path: '/'});
            //     sessionStorage.session='';
            //     _this.$router.go(0);
            this.$doRequest('/api/doctorinterrogation/offwork',{},res=>{
                _this.$router.replace({path: '/'});
                sessionStorage.session='';
                _this.$router.go(0);
            })
        }
    },
    //生命周期之创建完成
    created: function(){
        this.date = this.$timestampToTime(Date.now(),1);
        this.lets()
        if(sessionStorage.getItem('loginDetail')){
             var logindetail = JSON.parse(sessionStorage.getItem('loginDetail'))
            this.name = logindetail.parameters.username;
            this.duties = logindetail.parameters.duties;
            this.cname=logindetail.parameters.cname;
        }
    },
}
</script>
<style scoped lang="less">
@font-face {
  font-family: 'iconfont';
  src: url('../assets/font/iconfont.eot');
  src: url('../assets/font/iconfont.eot?#iefix') format('embedded-opentype'),
  url('../assets/font/iconfont.woff') format('woff'),
  url('../assets/font/iconfont.ttf') format('truetype'),
  url('../assets/font/iconfont.svg#iconfont') format('svg');
}
.ivu-poptip-popper{
    min-width:0!important;
}
.ivu-col{
        color: #FFF;
        line-height:62px;
        height:62px;
        font-family: 'iconfont';
    }
.nav{
    width: 0px;
    height: 0px;
    border-width:4px;
    border-style: solid;
    border-color: #FFF transparent transparent transparent;
    position: relative;
}
.midle{
    height:100%;
    width:40px;
    img{
        display:inline-block;
        vertical-align: middle;
        width: 32px;
        height: 32px;
    }
    .pic1{
        width: 40px;
        height: 40px; 
    }
}

</style>
