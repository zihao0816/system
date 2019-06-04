<template>
  <div class="nav">
      <div class="logo" @click=" gotomore()"><img src="../../assets/img/logos.png" alt=""></div>
      <!-- <div class="tip"><a href="#">关于我们</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#">加入我们</a></div> -->
    </div>
</template>

<script>
export default {
  name: 'nav',
  data () {
    return {
      
    }
  },
  created(){
  },
  methods:{
      gotomore(){
        this.$router.push({path: '/'});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
 a{ 
    text-decoration:none; 
    color:#333; 
  } 
  .nav{
    height: 70px;
    width: 100%;
    overflow: hidden;
    .logo{
      float: left;
      width: 214px;
      height: 56px;
      margin: 8px 10%;
      cursor:pointer;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .tip{
      margin: 7px 10%;
      width: 200px;
      line-height: 56px;
      font-size: 16px;
      float: right;
    }
  }
</style>
