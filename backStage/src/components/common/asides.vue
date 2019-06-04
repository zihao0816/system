<template>
    <div class="asides">
        <el-aside  width="90px" style="min-width: 90px; background-color: #262636;">
            <el-menu router text-color='#fff' active-text-color='#07A591'>
                <el-menu-item v-for="(item,index) in asidelist" :key="index" :index='item.url'>
                    <div @click='setindexof(item.title,item.url,item.son)'>
                        <i class="iconfont" :class="item.icon"></i>
                        <span style="font-size: 14px;" slot="title" >{{item.title}}</span>
                    </div>
                </el-menu-item>
            </el-menu>
        </el-aside>
    </div>
</template>

<script>
export default {
    name: "asides",
    data() {
        return {
            asidelist: [
                {
                    url: "/index",
                    icon: "icon-home",
                    title: "首页"
                },
                {
                    url: "/index?token=1",
                    icon: "icon-patient",
                    title: "药材中心"
                },
                {
                    url: "/warehouse",
                    icon: "icon-account",
                    title: "账号中心",
                    son: [{
                            url: "/warehouse",
                            title: "库房管理"
                        },{
                            url: "/doctorhouse",
                            title: "医生账号管理"
                        },{
                            url: "/examine",
                            title: "门诊管理"
                        },{
                            url: "/institution",
                            title: "机构管理"
                        },{
                            url: "/patientInformationManagement",
                            title: "患者信息管理"   
                        }
                    ]
                },
                {
                    url: "/registerOrder",
                    icon: "icon-order",
                    title: "订单中心",
                    son: [{
                            url: "/registerOrder",
                            title: "线下问诊订单"
                        },{
                            url: "/consultOrder",
                            title: "线上问诊订单"
                        },{
                            url: "/recipeOrder",
                            title: "处方订单"
                        },{
                            url: "/therapyOrder",
                            title: "理疗订单"
                        }]
                },
                {
                    url: "/doctorService",
                    icon: "icon-service",
                    title: "服务中心",
                    son: [{
                            url: "/",
                            title: "问诊预警"
                        },{
                            url: "/",
                            title: "交易预警"
                        },{
                            url: "/",
                            title: "物流梳理"
                        },{
                            url: "/doctorService",
                            title: "医生服务"
                        },{
                            url: "/",
                            title: "患者服务"
                        }]
                },
                {
                    url: "/finance",
                    icon: "icon-finance",
                    title: "结算中心",
                    son: [
                        {
                            url: "/financeWX",
                            title: "微信提现"
                        },
                        {
                            url: "/financebank",
                            title: "银行卡打款"
                        },
                        {
                            url: "/index",
                            icon: "el-icon-menu",
                            title: "收入明细"
                        }
                    ]
                },
                {
                    url: "/index?token=3",
                    icon: "icon-data",
                    title: "数据中心",
                },
                {
                    url: "/index?token=6",
                    icon: "icon-news",
                    title: "消息中心"
                },
                {
                    url: "/articleManage",
                    icon: "icon-operate",
                    title: "运营中心",
                     son: [
                        {
                            url: "/articleManage",
                            title: "文章管理"
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        setindexof(title, url, son) {
            sessionStorage.title = title;
            this.$store.state.routerlist.title = title;
            sessionStorage.url = url;
            sessionStorage.son = JSON.stringify(son);
        }
    }
};
</script>
<style scoped>
@import "./css/iconfont.css";
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
.asides {
  /deep/ .icon--yaofangguanli:before {
    margin-left: -2px;
  }
  /deep/ .icon--huanzheguanli:before {
    margin-left: -2px;
  }
  /deep/ .el-menu-item {
    padding-top: 20px;
    padding-bottom: 20px;
    height: 90px !important;
  }
}
.el-submenu {
    background: #262636;
    color: #fff;
}
.el-menu {
    border: 0px !important;
}
.el-submenu__title i {
    color: #fff !important;
}
.el-icon-arrow-down:before {
    display: none;
}
.el-menu-item:hover {
    background-color: #263b39 !important;
}
.el-submenu__title:focus,
.el-submenu__title:hover {
    background-color: #263b39 !important;
}
.el-aside .el-menu-item.is-active span{
    color: #07A591;
}
.el-menu-item,
.el-submenu__title {
    height: 65px;
    line-height: 30px;
    text-align: center;
    background: #262636;
    color: #fff;
}
.iconfont{
    display: block;
    width: 24px;
    height: 24px;
    margin: 0 auto;
    background-image: url('../../assets/img/ht_icon@3x.png');
    background-size: 24px;
    background-repeat: no-repeat; 
}
.icon-home{
    background-position: 0 0;
}
.icon-patient{
    background-position: 0 -47px;
}
.icon-account{
    background-position: 0 -95px;
}
.icon-data{
    background-position: 0 -289px;
}
.icon-finance{
    background-position: 0 -240px;
}
.icon-order{
    background-position: 0 -143px;
}
.icon-news{
    background-position: 0 -337px;
}
.icon-operate{
    background-position: 0 -384px;
}
.icon-service{
    background-position: 0 -192px;
}
.is-active .icon-home{
    background-position: 0 -23px;
}
.is-active .icon-patient{
    background-position: 0 -71px;
}
.is-active .icon-account{
    background-position: 0 -119px;
}
.is-active .icon-data{
    background-position: 0 -313px;
}
.is-active .icon-finance{
    background-position: 0 -264px;
}
.is-active .icon-order{
    background-position: 0 -168px;
}
.is-active .icon-news{
    background-position: 0 -360px;
}
.is-active .icon-operate{
    background-position: 0 -408px;
}
.is-active .icon-service{
    background-position: 0 -216px;
}
</style>


