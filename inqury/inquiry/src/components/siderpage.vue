<template>
    <div id="siderpage">
        <div  class="sidernav" v-for="(item,index) in sidePage" :key="index" :class="{checks:checks==index+1}">
            <div @click="routerinfo(index+1,item)" >
                <Icon :type="item.imgurl"  class="imgmargin"/><span>{{item.fname}}</span>
            </div>
            <div v-if="item.fname == '问诊开方'"  class="infos" v-show="checks==1">
               <tabs></tabs>
            </div>
        </div>
    </div>
</template>
<script>
import tabs from './tabs'
    export default {
        data(){
            return {
                checks:1,
                sidePage:[]
            }
        },
        components: {
            tabs,
        },
        //生命周期之挂载完成
        methods: {
            routerinfo(indexs,item){
                this.checks = indexs;
                this.$router.push({ path:item.url});
            }
        },
        //生命周期之创建完成
        created: function(){
            this.sidePage = JSON.parse(sessionStorage.getItem('sidePage'));
        },
    }
</script>
<style lang="less" scoped>
 #siderpage{
     cursor:pointer;
     cursor:hand;
    .sidernav{
        width: 100%;
        line-height: 52px;
        font-size: 16px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        color: #fff;
        text-align: left;
        .imgmargin{
            margin: 0 20px;
        }
        .infos{
            width: 100%;
            height: 35vh;
            overflow: hidden;
            background: #fff;
            color: #000;
        }
    }
        .checks{
            background: #07A591 !important;
        }
 }
</style>
