import common from '../api/common'
import getphone from "../../static/public"

//环信IM
// 单聊发送文本消息
export function sendPrivateText(_this, username, msgs, dosome, ext) {
    var id = _this.$imConn.getUniqueId();                 // 生成本地消息id
    var msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
        msg: msgs,                              // 消息内容
        to: username,                          // 接收消息对象（用户id）
        roomType: false,
        ext: ext,
        success: function (id, serverMsgId) {
            console.log('send private text Success');
            console.log(msg.body)
            console.log(id, serverMsgId)
            _this.$msgDatas(_this, "msgsuccess", msg.body, msg.body.to, null, dosome);
        },
        fail: function (e) {
            console.log("Send private text error");
            console.log(e)
        }
    });
    msg.body.chatType = 'singleChat';
    _this.$imConn.send(msg.body);
};

// 单聊发送图片消息
export function sendPrivateImg(_this, username, inputname, dosome) {
    var id = _this.$imConn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('img', id);        // 创建图片消息
    var input = document.getElementById(inputname);  // 选择图片的input
    var file = _this.$WebIM.utils.getFileUrl(input);      // 将图片转化为二进制文件
    var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true,
        'jpeg': true
    };
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            apiUrl: _this.$WebIM.config.apiURL,
            file: file,
            to: username,                       // 接收消息对象
            roomType: false,
            chatType: 'singleChat',
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log('onFileUploadComplete');
            },
            success: function () {                // 消息发送成功
                console.log('Success');
                _this.$msgDatas(_this, "msgsuccess", msg.body, msg.body.to, null, dosome);
            },
            flashUpload: _this.$WebIM.flashUpload
        };
        msg.set(option);
        _this.$imConn.send(msg.body);
    }
};

// 单聊发送文件消息(图片、压缩包、文档)
export function sendPrivateFile(_this, username, inputname) {
    var id = _this.$imConn.getUniqueId();                   // 生成本地消息id
    var msg = new WebIM.message('file', id);        // 创建文件消息
    var input = document.getElementById(inputname);  // 选择文件的input
    var file = _this.$WebIM.utils.getFileUrl(input);      // 将文件转化为二进制文件
    var allowType = {
        'jpg': true,
        'gif': true,
        'png': true,
        'bmp': true,
        'zip': true,
        'txt': true,
        'doc': true,
        'pdf': true
    };
    console.log(file.filetype)
    if (file.filetype.toLowerCase() in allowType) {
        var option = {
            apiUrl: _this.$WebIM.config.apiURL,
            file: file,
            to: username,                       // 接收消息对象
            roomType: false,
            chatType: 'singleChat',
            onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
            },
            onFileUploadComplete: function () {   // 消息上传成功
                console.log('onFileUploadComplete');
            },
            success: function () {                // 消息发送成功
                console.log('Success');
            },
            flashUpload: _this.$WebIM.flashUpload
        };
        msg.set(option);
        _this.$imConn.send(msg.body);
    }
};


/**
 * 存储成功发送接收的消息
 * @param {msgsuccess} type
 * @param {} msg
 * @param {} doctorId
 */
export function msgDatas(_this, type, msg, doctorId, types, dosome) {
    common.tryLock(_this, 'msgdatas', msg.id, function () {
        msg.time = msg.time == null ? new Date().getTime() : msg.time;
        if (types != null) {
            msg.types = msg.types == null ? types : msg.types;
        }
        var msgdatas = localStorage.getItem(type) ? JSON.parse(localStorage.getItem(type)) : {};
        if (msgdatas[doctorId]) {
            msgdatas[doctorId].push(msg)
        } else {
            var arr = [];
            arr.push(msg);
            msgdatas[doctorId] = arr;
        }
        var local = window.localStorage;
        if (!!local) {
            try {
                local.setItem(type, JSON.stringify(msgdatas));
                if (dosome != null && typeof (dosome) == 'function') {
                    try {
                      dosome(msg);
                    }catch (e) {
                    }
                }
                common.unLock(_this, 'msgdatas', msg.id);
                return true;
            } catch (error) {
              common.unLock(_this, 'msgdatas', msg.id);
                return false
            }
        } else {
          common.unLock(_this, 'msgdatas', msg.id);
            return false;
        }
    })
}

export function login(that,userInfo) {
    that.$imConn.open({
        apiUrl: that.$WebIM.config.apiURL,
        user: userInfo.id,
        pwd: getphone.Encrypt(userInfo.id),
        appKey: that.$WebIM.config.appkey
    });
    setTimeout(function(){
        login(that,userInfo);
    },4000);
}

export function register(that) {
    var options = {
      username: that.$store.state.userInfo.id,
      password: getphone.Encrypt(that.$store.state.userInfo.id),
      nickname: that.$store.state.userInfo.id,
      appKey: that.$WebIM.config.appkey,
      success: function() {
        that.$login(that);
      },
      error: function() {},
      apiUrl: that.$WebIM.config.apiURL
    };
    that.$imConn.registerUser(options);
  }
