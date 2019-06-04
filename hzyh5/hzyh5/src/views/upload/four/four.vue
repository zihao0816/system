<template>
  <div class="four">
    <div class="page-py">
      <div class="photos-py">
        <p class="title-py">舌照</p>
        <div class="addphoto-py">
          <ul>
            <li class="lis-item-py" v-for="item of photo.sz" :key="item"><img width="90" height="90" :src="item.fileurl" alt="" /><img v-if="message.isup" class="del-py" uptype="sz" :durl="item.url" @click="del" width="18" height="18" src="../../../assets/upload/-@3x.png" alt=""></li>
            <li v-if="photo.sz.length<2&&message.isup">
              <img width="90" height="90" src="../../../assets/upload/tjtp@3x.png" alt="" />
              <input type="file" @change="chooseImg" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;opacity: 0;" uptype="sz" />
            </li>
          </ul>
          <p>拍舌苔时，舌头向下伸长；拍舌底时，舌头向上抬起</p>
          <div>
            <img width="50" height="50" src="../../../assets/upload/szl@3x.png" alt="">
            <img width="50" height="50" src="../../../assets/upload/sz@3x.png" alt="">
          </div>
        </div>
      </div>
      <div class="photos-py">
        <p class="title-py">面照</p>
        <div class="addphoto-py">
          <ul>
            <li class="lis-item-py" v-for="item of photo.mz" :key="item"><img width="90" height="90" :src="item.fileurl" alt="" /><img v-if="message.isup" class="del-py" uptype="mz" :durl="item.url" @click="del" width="18" height="18" src="../../../assets/upload/-@3x.png" alt=""></li>
            <li v-if="photo.mz.length<2&&message.isup">
              <img width="90" height="90" src="../../../assets/upload/tjtp@3x.png" alt="" />
              <input type="file" @change="chooseImg" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;opacity: 0;" uptype="mz" />
            </li>
          </ul>
          <p>自然光线下拍摄面部素颜照片，如有需要也可拍摄其他患部照片</p>
          <div>
            <img width="50" height="50" src="../../../assets/upload/Group2Copy@3x.png" alt="">
            <img width="50" height="50" src="../../../assets/upload/mz-hcopy@3x.png" alt="">
          </div>
        </div>
      </div>
      <div class="photos-py" style="margin-bottom:20px;">
        <p class="title-py">其他资料（选填）</p>
        <div class="addphoto-py">
          <ul>
            <li class="lis-item-py" v-for="item of photo.qt" :key="item"><img width="90" height="90" :src="item.fileurl" alt="" /><img v-if="message.isup" class="del-py" uptype="qt" :durl="item.url" @click="del" width="18" height="18" src="../../../assets/upload/-@3x.png" alt=""></li>
            <li v-if="photo.qt.length<9&&message.isup">
              <img width="90" height="90" src="../../../assets/upload/tjtp@3x.png" alt="" />
              <input type="file" @change="chooseImg" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;opacity: 0;" uptype="qt" />
            </li>
          </ul>
          <p style="text-align:left;">如有相关的检查报告或化验单，请上传照片，以便医生更准确的为您诊疗</p>
        </div>
      </div>
      <div class="btn-py" v-if="message.isup">
        <el-button type="primary" @click="success">发送给医生</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
export default {
  data() {
    return {
      photo: {
        sz: [], //舌照
        mz: [], //面照
        qt: [] //其他
      },
      deletePhoto: [],
      message: { isup: false }
    };
  },
  created() {
    this.$isLogin(window.location.search.substr(1), this.query);
    // this.$store.state.indexThis = this;
    // var _this = this;
    // this.$store.state.websocketdosome.onMessage[3] = function() {
    //   _this.query();
    // };
    // this.$store.state.websocketdosome.onMessage[8] = function() {
    //   _this.query();
    // };
  },
  methods: {
    query() {
      var _this = this;
      this.message = this.$store.state.AllOfValue.imuploadFacePic;
      this.$doRequest(
        "/api/Inquiry/orderDetails",
        {
          orderID: this.message.orderid,
          isAccordingexchanges: 1
        },
        res => {
          for (var i = 0; i < res.accordingTtongue.length; i++) {
            _this.photo.sz.push({
              url: res.accordingTtongue[i],
              fileurl: res.accordingTtongue[i]
            });
          }
          for (var i = 0; i < res.surfaceAccording.length; i++) {
            _this.photo.mz.push({
              url: res.surfaceAccording[i],
              fileurl: res.surfaceAccording[i]
            });
          }
          for (var i = 0; i < res.otherdetails.length; i++) {
            _this.photo.qt.push({
              url: res.otherdetails[i],
              fileurl: res.otherdetails[i]
            });
          }
        }
      );
    },
    chooseImg(e) {
      if(e.target.files[0].type.indexOf('video') > -1){
        this.$toastMsg('舌照面照仅支持图片上传');
        return false;
      }
      var _this = this;
      var type = e.srcElement.attributes.uptype.nodeValue;
      var formData = new FormData();
      formData.append("file", e.target.files[0]);
      var _this = this;
      let loadingInstance = Loading.service({
        text: "正在上传",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$doRequest(
        {
          url: "/api/FastDfs/uploadLocal",
          catchs: function(err) {
            _this.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
            });
            _this.$toastMsg('上传失败')
          }
        },
        formData,
        res => {
          _this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
          _this.photo[type].push({
            url: res[0].fileUrl,
            fileurl: "/api/StaticFile/fastdfsLocalURL/" + res[0].fileUrl
          });
        },
        null,
        null,
        true
      );
    },
    del(e) {
      var _this = this;
      var type = e.srcElement.attributes.uptype.nodeValue;
      var durl = e.srcElement.attributes.durl.nodeValue;
      var newphoto = [];
      this.deletePhoto.push(durl);
      for (var i = 0; i < _this.photo[type].length; i++) {
        if (_this.photo[type][i].url != durl) {
          newphoto.push(_this.photo[type][i]);
        }
      }
      _this.photo[type] = newphoto;
    },
    success() {
      var _this = this;
      var accordingTtongue = [],
        surfaceAccording = [],
        otherdetails = [];
      for (var i = 0; i < _this.photo.sz.length; i++) {
        accordingTtongue.push(_this.photo.sz[i].url);
      }
      for (var i = 0; i < _this.photo.mz.length; i++) {
        surfaceAccording.push(_this.photo.mz[i].url);
      }
      for (var i = 0; i < _this.photo.qt.length; i++) {
        otherdetails.push(_this.photo.qt[i].url);
      }
      if (accordingTtongue.length < 1) {
        _this.$toastMsg("请完善舌照");
        return false;
      }
      if (surfaceAccording.length < 1) {
        _this.$toastMsg("请完善面照");
        return false;
      }
      this.$doRequest(
        "/api/Inquiry/tongueFace",
        {
          orderid: this.message.orderid,
          doctorid: this.message.doctorid,
          parientid: this.$store.state.userInfo.id,
          deletePhoto: this.deletePhoto,
          accordingTtongue: accordingTtongue,
          surfaceAccording: surfaceAccording,
          otherdetails: otherdetails
        },
        res => {
          _this.$toastMsg("提交成功");
          var ext = {
            'businessType': 'facePicFinish',
            'orderid': _this.message.orderid
          }
          _this.$sendPrivateText(_this,_this.message.doctorid,'我已上传舌照面照',function(msg){
            _this.$router.go(-1);
            var data = {
              fromid: _this.$store.state.userInfo.id,
              toid: _this.messages.doctorId,
              msgtype: '3',
              val: '患者已上传舌照面照',
              fromType: '2',
              fromName: _this.$store.state.userInfo.patientnickname,
              orderid: _this.message.orderid
            }
            _this.$doRequest('/api/ImUtil/signIm',data,function(res){
            })
          },ext)
        }
      );
    }
  }
};
</script>
<style>
li {
  list-style: none;
  display: inline-block;
  position: relative;
}

.photos-py {
  background: #ffffff;
  margin-bottom: 6px;
}

.title-py {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f0f5;
}

.addphoto-py {
  padding: 16px 20px;
}

.addphoto-py ul {
  border-bottom: 1px dashed #c1c1c1;
}

.addphoto-py p {
  text-align: center;
  font-size: 14px;
  color: #c1c1c1;
  padding: 16px 0;
}

.addphoto-py div {
  text-align: center;
}

.addphoto-py div img:nth-child(1) {
  margin-right: 75px;
}

.lis-item-py {
  margin-right: 46px;
  margin-bottom: 20px;
}

.del-py {
  position: absolute;
  right: -8px;
  top: -6px;
}

.btn-py {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
}

.four .el-button--primary {
  background: #d74326;
  border-color: #d74326;
  width: 100%;
  border-radius: 0;
}

.four .el-button--primary:focus,
.four .el-button--primary:hover {
  background: #d74326;
  border-color: #d74326;
}
</style>


