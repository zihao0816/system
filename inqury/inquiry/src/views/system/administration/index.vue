<template>
    <div>
        <el-tabs v-model="tabPosition" type="card" @tab-click="handleClick">
            <el-tab-pane label="理疗项目管理" name="first"><physiotherapist></physiotherapist></el-tab-pane>
            <el-tab-pane label="理疗师管理" name="second"><administration></administration></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import administration from '../../system/administration/physiotherapist/index'
import physiotherapist from '../../system/administration/project/index'
export default {
    data(){
        return {
            tabPosition:"first"
        }
    },
    methods:{       
        handleClick(tab, event) {
            console.log(tab, event);
        }
    },
    components:{
        administration,
        physiotherapist
    }
    
}
</script>
<style lang="less" scoped>
a{
    display: inline-block;
    text-decoration: none;
    color:black;
}
.el-pagination{
        position: fixed;
        bottom:30px;
        right:16px;
    }
/deep/ .el-tabs__item.is-active{
    color:#fff;
    border:none;
    background-color: rgba(7, 165, 145, 1);

}
/deep/.el-tabs--card>.el-tabs__header{
    border:0;
}
/deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
    border-bottom: 1px solid #e4e7ed;
}
.el-button--text{
        color:#07A591;
}
</style>


