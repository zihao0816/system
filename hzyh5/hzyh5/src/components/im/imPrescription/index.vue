<template>
    <div class="imprescription">
        <div class="page">
            <div class="top">
                <div>
                    <img width="50" height="50" src="../../../assets/im/bzkf_newcopy2@3x.png" alt="">
                    <div>
                        <p>调理药方</p>
                        <p>{{time}}</p>
                    </div>
                    <img width="56" height="56" v-show='list.paystate==2' src="../../../assets/im/yigouyao@3x.png" alt="">
                </div>
                <p class="patient">患者：{{list.name}}（{{list.sex}} · {{list.age}}）</p>
            </div> 
            <div class="diagnosis">诊断：{{list.conclusion}}</div>
                <div class="price" v-if='(list.paystate == 1 || list.paystate == 2) && list.orderstate != 4'>
                    <div class="left clearfix">
                        <p>总计：{{list.money}}</p>
                        <p>（不含代煎、快递费）</p>
                    </div>
                <div class="right" v-show='list.paystate == 1 && list.orderstate != 4'>
                    <button>点此取药</button>
                </div>
            </div>
            <div class="unprice" v-show='list.orderstate==4'>
                <span>因长时间未付款，系统自动关闭订单</span>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../../../api/common.js'
export default {
    props: ['list','dates'],
    data(){
        return {
            time: this.dates
        }
    },
    created(){
        this.time = common.timestampToTime(this.time);
    }
};
</script>
<style lang="less" scoped>
@import 'index.less';
</style>


