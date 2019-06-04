<template>
    <div class="nav">
         <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#232340"
            text-color="#fff"
            :unique-opened="true"
            @open="handleOpen"
            @close="handleClose">
            <el-menu-item index="1" @click="goPath('/homePage')">
                <i class="homePageIcon"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
                <template slot="title">
                    <i class="drugManageIcon"></i>
                    <span @click="goPath('/drugManage')">药品管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="2-1" @click="goPath('/drugStorage')">药品库</el-menu-item>
                    <el-menu-item index="2-2" @click="goPath('/addDrug')">新增药品</el-menu-item>
                    <el-menu-item index="2-3" @click="goPath('/drugCaution')">预警药品</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="storageManageIcon"></i>
                    <span @click="goPath('/storageManage')">库房管理</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="3-1" @click="goPath('/pushStorage')">入库</el-menu-item>
                    <el-menu-item index="3-2" @click="goPath('/pullStorage')">出库</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
           <!-- <el-menu-item index="4">
                <i class="el-icon-news"></i>
                <span slot="title">供应商管理</span>
            </el-menu-item>
            <el-menu-item index="5">
                <i class="el-icon-date"></i>
                <span slot="title">审批流</span>
            </el-menu-item>
            <el-menu-item index="6">
                <i class="el-icon-message"></i>
                <span slot="title">消息管理</span>
            </el-menu-item> -->
        </el-menu>
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
         handleOpen(key, keyPath) {
        },
        handleClose(key, keyPath) {
        },
        goPath(val){
            this.$router.push({path: val});
        }
    },
    //生命周期之创建完成
    created: function(){

    },
}
</script>
<style lang="less">
.nav{
    width: 200px;
    height: calc(100vh - 70px);
    float: left;
    background: #232340;
    .el-menu{
        width: 200px;
        .el-submenu .el-menu-item{
            min-width: 100%;
            font-size: 16px;
        }
        .el-submenu__title{
            font-size: 16px;
        }
        .el-menu-item{
            font-size: 16px;
        }
        .el-menu-item, .el-submenu__title{
            height: 64px;
            line-height: 64px;
        }
        .el-menu-item.is-active{
            background: #404076;
        }
        .el-menu-item i,.el-submenu__title i{
            width: 18px;
            height: 22px;
            display: inline-block;
            margin-right: 6px;
        }
        .el-menu-item i.homePageIcon{
            background: url('../../assets/sy_icon@3x.png');
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: 0 1px; 
        }
        .el-submenu__title i.drugManageIcon{
            background: url('../../assets/yp@3x.png');
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: 0 3px; 
        }
        .el-submenu__title i.storageManageIcon{
            background: url('../../assets/yp_icon@3x.png');
            background-size: 100% auto;
            background-repeat: no-repeat;
        }
    }
    .el-menu{
        .is-opened{
            .el-submenu__title{
                background-color: #404076 !important;
            }
        }
        .is-active{
            color: #fff;
        }
    }
}
</style>
