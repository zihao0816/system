<template>
  <div class="footer">
    <div class="footone">
        <div class="son">
            <div class='erweima'><img src="../../assets/img/qrcode.jpg" ></div>
            <div class="hr"></div>
            <div class="phonesrc"><span class="phone">400-666-0101</span> <span  class="time">（工作时间09:00 ～ 20:00）</span></div><br>
            <div class="phonesrc"> <span class="srcs">地址：北京市顺义区国泰宏城5层</span></div>
        </div>
    </div>
    <div class="foottwo">
        Copyright © 2018 Beijinghaozhongyi. All Rights Reserved. 京ICP备18043331号-1
    </div>
  </div>
</template>

<script>
export default {
  name: 'footer',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
  .footer{
    width: 100%;
      .footone{
        width: 100%;
        height: 305px;
        background: #32303B 100%;
        .son{
            width: 70%;
            margin: auto;
            height: 130px;
            padding: 90px 0 0 15%;  
          .hr{
            float: left;
            display: inline-block;
            width: 1;
            height: 100px;
            border-left: 1px solid #fff;
            margin-top:10px; 
          }
          .erweima{
            width: 130px;
            height: 130px;
            padding-right: 15%;
            display: inline-block;
            float: left;
            img{
              width: 100%;
              height: 100%;
              
            }
          }
          .phonesrc{
            display: inline-block;
            margin-left: 10%;
            margin-top: 25px; 
            .phone{
              height: 42px;
              color: rgba(255, 120, 96, 1);
              font-size: 30px;
              text-align: left;
            }
            .time{
              height: 22px;
              color: rgba(255, 255, 255, 1);
              font-size: 16px;
              text-align: left;
            }
            .srcs{
              height: 22px;
              color: rgba(255, 255, 255, 1);
              font-size: 16px;
              text-align: left;
            }
          }
        }
      }
      .foottwo{
        // width: 100%;
        height: 50px;
        text-align: center;
        padding: 14px;
        background: #141414 100%;
        line-height: 50px;
        color:#fff;
      }
  }
</style>
