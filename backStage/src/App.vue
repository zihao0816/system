<template>
  <div id="app"  v-if="anquan">
      <commNav></commNav>
      <el-container>
        <comm-aside></comm-aside>
        <el-main style="display:flex;">
            <comm-aside-son></comm-aside-son>
            <router-view  class="xo" />
        </el-main>
    </el-container>
  </div>
</template>


<script>
import commNav from '@/components/common/navs'
import commAside from '@/components/common/asides'
import commAsideSon from '@/components/common/asides-two'
export default {
  name: 'App',
    components: {
        commNav,
        commAside,
        commAsideSon
  },
  data () {
    return {
      anquan:true
    }
  },
  created(){
        function GetQueryString(name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return 'zhege00000jiade';
        }
        var a = GetQueryString("code");
        if(a.substr(5,5)!= '00000'||a.substr(5,5)=='z94sb'){
            this.anquan = true;
        }

  }
}
</script>

<style lang="less">
*{
  padding: 0;
  margin: 0;
  -webkit-user-select:text; -moz-user-select:text; -ms-user-select:text; user-select:text; 
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
.el-container{
  height: calc(100vh - 70px);
}

//element样式
.el-button--primary,.el-button--primary:focus, .el-button--primary:hover{
  background-color: #07a591;
  border-color: #07a591;
}
.el-button--default:focus, .el-button--default:hover{
  border-color: #07a591;
  color: #07a591;
}
.el-dialog__headerbtn .el-dialog__close:focus, .el-dialog__headerbtn .el-dialog__close:hover{
  color: #07a591;
}
.el-button--text,.el-button--text:focus,.el-button--text:hover{
  color: #07a591;
}
.el-pager li.active{
  color: #07a591
}
.el-pager li:focus,.el-pager li:hover{
  color: #07a591
}
</style>


<style lang="less">
#asidetwo{
  /deep/ .el-submenu .el-menu-item{
    min-width: 50px !important;
    padding: 0 0 0 20px; 
  }
 
    
 
  /deep/  .el-menu-item, .el-submenu__title{
    height: 62px;
    line-height:62px;
    text-align: left;     
  }
  /deep/  .el-aside{
    height: 100% !important;
  }
  /deep/  .el-submenu .el-menu-item{
    padding: 0px 0 0 30px !important;
    text-align: left !important;
  }
  /deep/  .el-submenu__icon-arrow{
    left: 15px !important;
    right: auto !important;
  }
  /deep/  .el-submenu__title{
    text-align: left;
    padding: 0 !important;
    padding-left: 40px !important;
  }
  /deep/ .el-menu{
    border:none !important;
    }
 }
#app {
  font-family: 'PingFang-SC','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
   margin:0;
    padding:0;
    height: 100%;
}
      

.asidetwo{
    height: 100%;
}
.xx{
    max-width: 10% !important;
    min-width: 10% !important;
}
.xo{
    min-width: 90% !important;
    max-width: 90% !important;
}
/*!
 * @名称：base.css
 * @功能：1、重设浏览器默认样式
 *       2、设置通用原子类
 */
/* 内外边距通常让各个浏览器样式的表现位置不同 */
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,textarea,p,blockquote,th,td,hr,button,article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section {
    margin:0;
    padding:0;
}
/* 去除默认边框 */
fieldset,img {
    border:none;
}
/* 去掉列表前的标识，li 会继承 */
ol,ul {
    list-style:none;
}
/* 清除浮动 */
.clearfix:before,.clearfix:after {
    content:"";
    display:table;
}
.clearfix:after {
    clear:both;
    display: block;
    content: "";
}
/* 设置显示和隐藏，通常用来与 js 配合 */
.hide {
    display:none;
}
.show{
    display:block;
}
/* 设置浮动，减少浮动带来的 bug */
.fl,.fr {
    display:inline;
}
.fl {
    float:left;
}
.fr {
    float:right;
}
.el-main{
    padding: 0 !important;
    height: 100%;
    overflow: hidden;
}
.page{
  >div:nth-child(1){
    height: 16px;
    padding: 12px 0;
    line-height: 40px;
    content{
      
    }
  }
}
/* element组件 */
.el-radio__input.is-checked .el-radio__inner,.el-radio__inner:hover{
    background: #07A591;
    border-color: #07A591;
}
.el-radio__inner:hover{
    border-color: #07A591;
}
.el-radio__input.is-checked+.el-radio__label{
    color: #07A591;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background: #07A591;
    border-color: #07A591;
}
.el-checkbox__input.is-checked+.el-checkbox__label{
  color: #07A591;
}
.el-input__inner:focus{
  border-color: #07A591;
}
.el-select .el-input.is-focus .el-input__inner{
  border-color: #07A591;
}
.el-checkbox__input:hover,.el-checkbox__input:focus{
  border-color: #07A591;
}
</style>
