<template>
  <div id="app">
    <Header v-if="source == true"></Header>
    <Menu v-if="source == true"></Menu>
    <div class="centrer" v-if="source == true">
      <router-view/>
    </div>
    <router-view v-if="source == false"/>
  </div>
</template>

<script>
import Header from '@/components/header/index.vue'
import Menu from '@/components/nav/index.vue'
export default {
  components: {
    Header,
    Menu
  },
  data() {
    return {
      source: false
    }
  },
  name: 'App',
  created: function(){
    if(sessionStorage.getItem('userInfo') == null){
      this.$router.push({path: './'})
    }
    var path = this.$route.path.split('/');
    if(path[1] == '' || path[1] == 'printing'){
      this.source = false;
    }else{
      this.source = true;
    }
  },
  watch:{
    "$route": function(to,from){
      if(to.name === 'login'){
        this.source = false;
      }else{
        this.source = true;
      }
    },
    'source' : function(value,newvalue){
      this.source = value;
    }
  }
}
</script>

<style lang="less">
*{
  padding: 0;
  margin: 0;
}
#app {
  font-family: "PingFangSC-Regular", "Avenir";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #141414;
}
html,body {
  margin: 0;
  height: 100%;
  min-height: 100vh;
  font-family: "PingFangSC-Regular", "Avenir";
  -webkit-overflow-scrolling: touch;
  user-select: none;
  text-decoration: none;
  overflow: auto;
  font-size: 16px;
  flex-direction: column;
  font-weight: 400;
  background: #F1F0F5;
}
a,button,input,optgroup,select,textarea,label {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
  -webkit-appearance: none;
  outline: none !important;
  text-decoration: none;
}
:focus {
  outline: none !important;
}
/* 主框架 */
.centrer{
  width: calc(100% - 200px);
  height: calc(100vh - 70px);
  float: right;
  overflow-y: auto;
  overflow-x: hidden;
}
/* 面包屑 */
.title{
  height: 17px;
  line-height: 16px;
  font-size: 16px;
  border-left: 3px solid #07A591;
  margin: 23px 0;
  padding: 0 6px;
  span{
    color: #07A591;
  }
}
.clearfix:after{
    clear: both;
    content: "";
    display: block;
    overflow: hidden;
}
/* 弹框 */
.el-dialog--center .el-dialog__body{
  padding: 20px;
}
/* table */
.el-table,.el-table thead{
  color: #141414;
}
.el-popper{
    height: auto !important;
}
.el-form-item.is-success .el-input__inner, 
.el-form-item.is-success .el-input__inner:focus, 
.el-form-item.is-success .el-textarea__inner, 
.el-form-item.is-success .el-textarea__inner:focus{
    border-color: #d8d8d8;
}
</style>
