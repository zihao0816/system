<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import getphone from "../static/public.js";
export default {
  name: "App",
  data() {
    return {
      patientId: "",
      patientPwd: ""
    };
  },
  methods:{
    details(id,list){
      this.$doRequest('/api/Inquiry/orderDetails',{getPrescriptionOrder:'1',prescriptionOrderId:id.id},function(res){
        id.paystate = res.orderprescriptioninfos[0].paystate;
        list.ext.businessBody = JSON.stringify(id)
      })
    },
  },
  mounted() {
    var that = this;
    this.$imConn.listen({
      //im连接打开
      onOpened: function(message) {
        if (
          that.$store.state.websocketdosome["onOpened"] != null &&
          typeof that.$store.state.websocketdosome["onOpened"] == "function"
        ) {
          that.$store.state.websocketdosome["onOpened"](message);
        }
      },
      //接收普通文本信息
      onTextMessage: function(message) {
        message.isRead = false;
        if(message.ext.businessBody!=null &&typeof(message.ext.businessBody)=='string' &&message.ext.businessBody!=''){
          message.ext.businessBody=JSON.parse(message.ext.businessBody);
        }
        if(message.ext.businessType != null && message.ext.businessType != '' && message.ext.businessType == 'doctor_prescription'){
          message.ext.businessBody.paystate = '1';
        }
        if (
          that.$store.state.websocketdosome["onTextMessage"] != null &&
          typeof that.$store.state.websocketdosome["onTextMessage"] ==
            "function"
        ) {
          that.$msgDatas(
            that,
            "msgsuccess",
            message,
            message.from,
            "txt",
            that.$store.state.websocketdosome["onTextMessage"]
          );
        } else {
          that.$msgDatas(that, "msgsuccess", message, message.from, "txt");
        }
      },
      //im连接关闭
      onClosed: function(message) {
      },
      //im网络离线
      onOffline: function() {
        that.$imConn.close();
        if (that.$store.state.websocketdosome["onOffline"] != null && typeof that.$store.state.websocketdosome["onOffline"] == "function") {
          that.$store.state.websocketdosome["onOffline"]();
        } 
      },
      onError: function(message) {
        if (message.data.data && typeof message.data.data == "string") {
          var data = JSON.parse(message.data.data);
          if (data.error_description == "user not found") {
            that.$register(that)
          }
        }
        if (that.$store.state.websocketdosome["onError"] != null && typeof that.$store.state.websocketdosome["onError"] == "function") {
          that.$store.state.websocketdosome["onError"](message)
        } 
      },
      //接收表情信息
      onEmojiMessage: function(message) {
        message.isRead = false;
        if (
          that.$store.state.websocketdosome["onEmojiMessage"] != null &&
          typeof that.$store.state.websocketdosome["onEmojiMessage"] ==
            "function"
        ) {
          that.$msgDatas(
            that,
            "msgsuccess",
            message,
            message.from,
            "emoji",
            that.$store.state.websocketdosome["onEmojiMessage"]
          );
        } else {
          that.$msgDatas(that, "msgsuccess", message, message.from, "emoji");
        }
      },
      //接收图片消息
      onPictureMessage: function(message) {
        message.isRead = false;
        if (
          that.$store.state.websocketdosome["onPictureMessage"] != null &&
          typeof that.$store.state.websocketdosome["onPictureMessage"] ==
            "function"
        ) {
          that.$msgDatas(
            that,
            "msgsuccess",
            message,
            message.from,
            "img",
            that.$store.state.websocketdosome["onPictureMessage"]
          );
        } else {
          that.$msgDatas(that, "msgsuccess", message, message.from, "img");
        }
      },
      //接收音频消息
      onAudioMessage: function(message) {
        message.isRead = false;
        if (
          that.$store.state.websocketdosome["onAudioMessage"] != null &&
          typeof that.$store.state.websocketdosome["onAudioMessage"] ==
            "function"
        ) {
          that.$msgDatas(
            that,
            "msgsuccess",
            message,
            message.from,
            "voice",
            that.$store.state.websocketdosome["onAudioMessage"]
          );
        } else {
          that.$msgDatas(that, "msgsuccess", message, message.from, "voice");
        }
      },
      //收到消息已读回执
      onReadMessage: function(message) {
        
      },
      //收到消息送达服务器回执
      onReceivedMessage: function(message) {
        
      },
      //收到消息送达客户端回执
      onDeliveredMessage: function(message) {
        
      }
    });
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  height: 100%;
  min-height: 100vh;
  font-family: "PingFangSC-Regular", "微软雅黑";
  -webkit-overflow-scrolling: touch;
  user-select: none;
  text-decoration: none;
  overflow: auto;
  font-size: 16px;
  background: #f1f0f5;
}
body {
  display: flex;
  flex-direction: column;
}

a,
button,
input,
optgroup,
select,
textarea,
label {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
  -webkit-appearance: none;
  outline: none !important;
}

:focus {
  outline: none !important;
}
/* 状态文字 */
.state {
  color: #d74326;
}
.gray {
  color: #818181;
}
/* 关于a的公共样式 */
a {
  text-decoration: none;
}
/* 关于支付底部的公共样式 */
.pay {
  width: 100%;
  position: fixed;
  padding: 10px 0 10px;
  bottom: 0;
  left: 0;
  overflow: hidden;
  box-shadow: 0 0 15px #f1f0f5;
  .service {
    width: 50px;
    height: 36px;
    float: left;
    border-right: 1px solid #f1f0f5;
    i {
      width: 20px;
      height: 22px;
      background-image: url(assets/buy/kf@3x.png);
      background-size: 100% auto;
      background-repeat: no-repeat;
      display: block;
      margin: 0 auto;
    }
    span {
      width: 100%;
      color: #818181;
      text-align: center;
      display: block;
      line-height: 18px;
      font-size: 12px;
    }
  }
  .payInfo {
    float: left;
    padding-left: 10px;
    span:nth-child(1) {
      color: #818181;
      font-size: 12px;
      i{
        font-style: normal;
        color:#d74326;
      }
    }
    .state {
      font-size: 18px;
      span {
        font-size: 12px;
        color: #818181;
        left: 143px;
        display: inline-block;
      }
    }
  }
  .paySubmit {
    padding: 17px 28px;
    background: #d74326;
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 16px;
    color: #fff;
    border: none;
  }
  .gray {
    background: #666;
  }
}
#app {
  // font-family: "Avenir", Helvetica, Arial, sans-serif;
  height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #141414;
}
</style>
