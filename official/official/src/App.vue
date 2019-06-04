<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app {
  font-family: 'PingFang-SC','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
 .el-carousel__indicators{
        .el-carousel__indicator{
          height: 10px !important;
          width: 10px !important;
          border-radius: 50% !important;
          background: #D8D8D8 !important;
          padding: 0 !important;
          margin: 0 12px !important;
          .el-carousel__button{
            width: 10px !important;
            height: 10px !important;
            opacity: 0 !important;
          }
        }
        .is-active{
          background: #FF7860 !important;
        }
      }
</style>
