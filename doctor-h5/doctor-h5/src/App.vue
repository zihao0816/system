<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

html,body {
  margin: 0;
  height: 100%;
  min-height: 100vh;
  -webkit-overflow-scrolling: touch;
  user-select: none;
  text-decoration: none;
  font-size: 16px;
  background: #f1f0f5;
  font-weight: 200;
  // font-family: -apple-system, BlinkMacSystemFont,
  //   "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell",
  //   "Fira Sans", "Droid Sans", "Helvetica Neue",
  //   sans-serif;
}

body {
  display: flex;
  flex-direction: column;
}

a,button,input,optgroup,select,textarea,label{
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
  -webkit-appearance: none;
  outline: none !important;
}

:focus {
  outline: none !important;
}
input{
  border: none;
  background: none;
}
input::-webkit-input-placeholder{
  font-weight: 200;
  font-size: 14px;
}
input:-moz-placeholder{
  font-weight: 200;
  font-size: 14px;
}
input::-moz-placeholder{
  font-weight: 200;
  font-size: 14px;
}              
input:-ms-input-placeholder{
  font-weight: 200;
  font-size: 14px;
}
.submit,.nosubmit{
    width: 98%;
    height: 42px;
    text-align: center;
    line-height: 42px;
    background: #D74326;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    display: block;
    margin: 36px auto 18px;
    font-weight: 200;
}
.nosubmit{
  background: #dcdcdc;
}
/* 弹框 */
    .dialog{
        width: 100%;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        display:flex;
        justify-content:center;
        align-items:center;
        // display: none;
        .lucency{
            width: 100%;
            height: 100vh;
            background: #000;
            filter:alpha(Opacity=30);
            -moz-opacity:0.3;opacity: 0.3; 
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
        }
        .main{
            width: 94%;
            background: #fff;
            border-radius: 4px;
            overflow: hidden;
            position: absolute;
            margin-left: auto;
            margin-right: auto;
            z-index: 2;
            padding: 16px 0;
            h3{
                font-size: 16px;
                color: #030303;
                font-weight: 400;
                margin-bottom: 28px;
                padding: 0 16px;
            }
            span{
                color: #32303B;
                line-height: 20px;
                display: block;
                font-size: 14px;
                padding: 0 16px;
            }
            span:last-child{
                color: #D74326;
                font-size: 14px;
                margin: 16px 0 0;
                padding: 0 6px;
            }
            p{
              padding: 0 16px;
              line-height: 24px;
            }
            .submit{
              width: 94%;
              margin: 10px auto;
            }
        }
    }
</style>
