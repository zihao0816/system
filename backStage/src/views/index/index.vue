<template>
  <div class="index">
    <!-- <div class="center">
      页面正在快马加鞭制作中...
    </div> -->
  </div>
</template>

<script>

export default {
  name: 'index',
  data () {
    return {
      doclist:[]
    }
  },
  created(){
    this.query();
  },
  methods:{
     query(){

     }
  }
}
</script>
<style scoped>
  .center{
    width: 300px;
    height: 100px;
    margin: auto;
    margin-top: 200px;
    line-height: 100px;
    text-align: center;
    background: #fff;
    border-radius: 30px;
    background: url(./bj.jpg);
    background-size:100% 100%;
  }
</style>

<style lang="less" scoped>
  @import 'index.less';
</style>

