<template>
    <div>
        <ul>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#07A591" >
                <el-menu-item index="1"><router-link to="/system">管理账号</router-link></el-menu-item>
                <el-menu-item index="2"><router-link to="/system/docList">医生列表</router-link></el-menu-item>
                <el-menu-item index="3"><router-link to="/system/briefing">简报</router-link></el-menu-item>
                <el-menu-item index="4"><router-link to="/system/administration">项目管理</router-link> </el-menu-item>
            </el-menu>
        </ul>
         <router-view></router-view>
    </div>
</template>
<script>
export default {
    name:"historyPrescription",
    data(){
        return {
            datalist:4,
            changeborder:1,
            activeIndex: '1'
        }
    },
    methods:{
    },
    created(){
        this.changeborder=sessionStorage.id;
    }   
}
</script>
<style  lang="less" scoped>
ul{
    margin-bottom:30px;
    width:100%;
    height:60px;
}
a{
    float:left;
    display: block;
    text-decoration: none;
    color:black;
    padding-bottom:7px;
    width:130px;
    text-align: center;
}
li{
   font-size:20px;  
}
 .borders{
     border-bottom:3px  solid #008000;
 }
 .el-button--text{
        color:#07A591;
}
//  /deep/li{
//     border-bottom-color:#07A591!important ;
// }  
</style>


