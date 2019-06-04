<template>
    <el-aside width="120px" style="background-color: #fff;" id="asidetwo">
        <el-menu router text-color='#000' active-text-color='#07A591' background-color="#fff" :default-active='url'>
            <el-menu-item  :index='url' >
                <div class="titles">
                    <span slot="title" style="color:#000 !important;font-weight: 600;">{{title}}</span>
                </div>
            </el-menu-item>
        </el-menu>
        <el-menu router v-if="son.length != 0"  >
            <el-menu-item v-for="(item,index) in son" :key="index" :index="item.url">
                <span>{{item.title}}</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script>
export default {
    name: 'asidetwo',
    data () {
        return {
            title:'',
            url:'',
            son:[]
        }
    },
    created(){
        this.title= sessionStorage.title;
        if(sessionStorage.son != 'undefined'){
            this.son = JSON.parse(sessionStorage.son);
        }else{
            this.son = [];
        }
    },  
    methods:{
    
    },
    watch:{
        '$store.state.routerlist.title': function () {
            this.title= sessionStorage.title;
            this.url = sessionStorage.url
            if(sessionStorage.son != 'undefined'){
                this.son = JSON.parse(sessionStorage.son);
            }else{
                this.son = [];
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  .titles{
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }
</style>
