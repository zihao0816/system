<template>
    <div id="navigation">
        <div class="title" @click="gotorouter()">
            当前位置：<span style="color: #07A591;">{{title}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'navigation',
    data () {
        return {
            title:'',
            url:'',
        }
    },
    created(){
        this.title= sessionStorage.title;
        this.url = sessionStorage.url;
    },
    methods:{
        gotorouter(){
            this.$router.push({path:this.url});
        },
    }
}
</script>

<style lang='less' scoped>
 .title{
        font-size: 16px;
        border-left: 4px solid #07A591;
        padding-left: 6px;
        height:16px;
        line-height: 16px;
        .span{
            color: #07A591 ;
        }
    }
</style>
