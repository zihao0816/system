import common from './common'

export function initWebSocket(_this) {
    var websocket = new WebSocket('wss://www.51bjhzy.com?userid=' + _this.$store.state.userInfo.id + '&sessionid=' + _this.$store.state.userInfo.sessionId);
    console.log("尝试连接websocket")
    websocket.onopen = function (e) {
        var dosome = _this.$store.state.websocketdosome;
        _this.$store.state.dowebsocket.onOpen(e, dosome != null && dosome.onOpen != null && typeof (dosome.onOpen) == 'function' ? dosome.onOpen : null)
    };
    websocket.onmessage = function (e) {
        websocketonmessage(e, _this)
    };
    websocket.onclose = function () {
        _this.$store.state.dowebsocket.onClose();
    };
    websocket.onerror = websocketonerror;
    _this.$store.state.websocket = websocket;



}

export function sendMessage(msg, _this) {
    _this.$store.state.newSendQueue.push(msg);
    _this.$store.state.websocket.send(JSON.stringify(firstData(false, msg.receiverId, msg.senderId)))
}

export function websocketonmessage(e, _this) {
    _this.$store.state.sockettime = new Date().getTime();

    _this.$store.state.socketstate = 1
    var dosome = _this.$store.state.websocketdosome;
    var newdata = JSON.parse(e.data);
    if (newdata.messageStatus != 10) {
        console.log(newdata)
    }
    //走之前声明的监听方法
    if (_this.$store.state.dowebsocket.onMessage[newdata.messageStatus] != null && typeof (_this.$store.state.dowebsocket.onMessage[newdata.messageStatus]) == 'function') {
        _this.$store.state.dowebsocket.onMessage[newdata.messageStatus](newdata, dosome != null && dosome.onMessage[newdata.messageStatus] != null && typeof (dosome.onMessage[newdata.messageStatus]) == 'function' ? dosome.onMessage[newdata.messageStatus] : null)
    }
}



export function websocketonerror() {
    console.log("WebSocket连接失败");
}
//生成随机聊天id
export function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
//正常聊天发送模板
export function firstData(state, senderId, receiverId, types, body, orderid, messageSequence, messageStatus, duration) {
    var data = {};
    if (state) {
        data = {
            "messageId": guid(),
            "senderId": senderId,
            "senderType": "2",
            "receiverId": receiverId,
            "message": {
                "type": types,
                "body": body,
                "duration": duration
            },
            "orderid": orderid,
            "messageType": "ordinary",
            "messageStatus": messageStatus,
            "messageSequence": messageSequence,
            "snedTime": new Date().getTime()
        }
    } else {
        data = {
            "messageId": guid(),
            "senderId": senderId,
            "receiverId": receiverId,
            "messageStatus": "7",
        }
    }
    return data
}
//特殊聊天模板
export function secondDatas(senderId, receiverId, types, body, messageStatus, messageSequence, businessType, orderId) {
    var data = {
        "messageId": guid(),
        "senderId": senderId,
        "senderType": "2",
        "receiverId": receiverId,
        "message": {
            "type": types,
            "body": body
        },
        "messageType": "ordinary",
        "messageStatus": messageStatus,
        "messageSequence": messageSequence,
        'businessType': businessType,
        "orderid": orderId,
        'businessId': orderId
    }
    return data
}
export function getStoreMsg(_this) {
    return _this.$store.state.newSendQueue;
}

export function initwebsoct(_this) {
    var state = _this.$store.state;
    var dowebsocket = {
        onOpen: function (e, dosome) {
            console.log("websocket连接开启")
            state.sockettime = new Date().getTime();
            //链接websocket成功后  查看发送队列里有没有值  有的话去请求序列号
            state.socketstate = 1
            var sendQue = state.newSendQueue;

            if (sendQue != null && sendQue.length > 0) {
                state.websocket.send(JSON.stringify(firstData(false, sendQue[0].receiverId, sendQue[0].senderId)))
            }
            //有特殊业务操作执行当前业务操作
            if (dosome != null && typeof (dosome) == 'function') {
                try {
                    dosome(e)
                } catch (error) {

                }
            }
        },
        onMessage: {
            "2_success": function (newdata, dosome) {
                //停止发送1的定时任务
                if (_this.$store.state.redistribute[newdata.messageId] != null) {
                    clearInterval(_this.$store.state.redistribute[newdata.messageId])
                    _this.$store.state.redistribute[newdata.messageId] = null;
                }
                //有特殊业务操作执行当前业务操作
                if (dosome != null && typeof (dosome) == 'function') {
                    try {
                        dosome(newdata)
                    } catch (error) {

                    }

                }
            },
            3: function (newdata, dosome) {
                //接收到3后 存入缓存  发送4
                // if (newdata.businessType == 'doctor_prescription') {
                //     wx.showTabBarRedDot({
                //         index: 2,
                //     })
                // }
                var msg = {
                    "senderId": newdata.receiverId,
                    "receiverId": newdata.senderId,
                    "messageId": newdata.messageId,
                    "messageStatus": '4',
                    "messageType": 'system'
                }
                _this.$store.state.websocket.send(JSON.stringify(msg));
                //启动反复发送的定时任务 直到收到5
                if (_this.$store.state.redistribute[msg.messageId] != null) {
                    clearInterval(_this.$store.state.redistribute[msg.messageId])
                }
                _this.$store.state.redistribute[msg.messageId] = setInterval(function () {
                    _this.$store.state.websocket.send(JSON.stringify(msg))
                }, 5000)

                if (dosome != null && typeof (dosome) == 'function') {
                    try {
                        dosome(newdata)
                    } catch (error) {

                    }

                }
            },
            5: function (newdata, dosome) {
                //停止发送4的定时任务
                if (_this.$store.state.redistribute[newdata.messageId] != null) {
                    clearInterval(_this.$store.state.redistribute[newdata.messageId])
                    _this.$store.state.redistribute[newdata.messageId] = null;
                }
            },
            7: function (newdata, dosome) {
                //接收到7  获取序列后左边
                var uniond = _this.$store.state.userInfo;
                var index = newdata.messageSequence;
                if (index != null && index != '') {
                    var doctorid = newdata.senderId == uniond.id ? newdata.receiverId : newdata.senderId;
                    //请求此医生的序列后右边序列号
                    getIndex(doctorid, function (id) {
                        //获取发送队列
                        var sendQue = _this.$store.state.newSendQueue;
                        if (sendQue == null || sendQue.length == 0) {
                            return
                        };
                        var oldsendQue = sendQue;
                        var sendQueone = null;
                        sendQue = [];
                        //取出发送队列中这个序列号的医生最先发送的一条数据
                        for (var i = 0; i < oldsendQue.length; i++) {
                            if (sendQueone == null && oldsendQue[i].receiverId == doctorid) {
                                sendQueone = oldsendQue[i];
                            } else {
                                sendQue.push(oldsendQue[i])
                            }
                        }
                        if (sendQueone == null || sendQueone.length == 0) {
                            return
                        }
                        _this.$store.state.newSendQueue = sendQue;
                        //取出发送队列里的消息后  发现消息队列里还有数据  继续发送获取序列号
                        if (sendQue.length > 0) {
                            _this.$store.state.websocket.send(JSON.stringify(firstData(false, sendQue[0].receiverId, sendQue[0].senderId)))
                        }
                        //拼接序列号
                        var sequence = index + '-' + id;
                        sendQueone.messageSequence = sequence;
                        //发送前存入本地缓存
                        var messageBuffer = window.localStorage.getItem('messageBuffer');
                        try {
                            messageBuffer = messageBuffer == null ? [] : JSON.parse(messageBuffer);
                        } catch (e) {
                            messageBuffer = [];
                        }

                        messageBuffer.push(sendQueone);
                        window.localStorage.setItem('messageBuffer', JSON.stringify(messageBuffer))
                        //发送数据
                        _this.$store.state.websocket.send(JSON.stringify(sendQueone))
                        //启动定时任务  每过5秒发送一次这个消息 直到收到2_success
                        if (_this.$store.state.redistribute[sendQueone.messageId] != null) {
                            clearInterval(_this.$store.state.redistribute[sendQueone.messageId])
                        }
                        _this.$store.state.redistribute[sendQueone.messageId] = setInterval(function () {
                            _this.$store.state.websocket.send(JSON.stringify(sendQueone))
                        }, 5000)
                        //将右边的序列号存入缓存
                        var todoctorindex = _this.$store.state.todoctorindex;
                        todoctorindex = todoctorindex == null || todoctorindex.length == 0 ? {} : todoctorindex;
                        todoctorindex[doctorid] = id;
                        _this.$store.state.todoctorindex = todoctorindex;
                        //执行特殊业务操作
                        if (dosome != null && typeof (dosome) == 'function') {
                            try {
                                dosome(newdata)
                            } catch (error) {

                            }

                        }
                    }, _this)
                }
            },
            '7a': function (newdata, dosome) {
                // 接到7a后 在缓存中找到此消息 然后再发一遍
                var imkey = window.localStorage.getItem('messageBuffer');
                try {
                    imkey = imkey == null ? [] : JSON.parse(imkey);
                } catch (e) {
                    imkey = [];
                }
                for (var i = 0; i < imkey.length; i++) {
                    if (newdata.receiverId == imkey[i].receiverId && newdata.senderId == imkey[i].senderId && imkey[i].messageSequence.indexOf(newdata.messageSequence) > -1) {
                        _this.$store.state.websocket.send(JSON.stringify(imkey[i]))
                        if (_this.$store.state.redistribute[imkey[i].messageId] != null) {
                            clearInterval(_this.$store.state.redistribute[imkey[i].messageId])
                        }
                        _this.$store.state.redistribute[imkey[i].messageId] = setInterval(function () {
                            _this.$store.state.websocket.send(JSON.stringify(imkey[i]))
                        },
                            5000)
                        if (dosome != null && typeof (dosome) == 'function') {
                            try {
                                dosome(newdata)
                            } catch (error) {

                            }

                        }
                        break
                    }
                }
            },
            8: function (newdata, dosome) {

                if (dosome != null && typeof (dosome) == 'function') {
                    try {
                        dosome(newdata)
                    } catch (error) {

                    }

                }
            }
        },
        onClose: function () {
            console.log("WebSocket关闭");
            _this.$store.state.socketstate = 2;
        }
    }
    return dowebsocket;
}

//获取与此医生右边的值
//医生id  dosome获取序列号后要做的事情
export function getIndex(doctorid, dosome, _this) {
    var lockKey = guid();
    common.tryLock(_this, 'getIndexlock', lockKey, function () {
        //如果缓存里有与此医生的序列号  直接使用缓存中的序列后 然后+1
        var todoctorindex = _this.$store.state.todoctorindex;
        if (todoctorindex[doctorid] != null) {
            //拿到序列号后执行方法
            try {
                dosome(todoctorindex[doctorid] + 1)
            } catch (error) {

            }
            //执行完方法后  释放锁
            common.unLock(_this, 'getIndexlock', lockKey)
            return
        }
        //如果缓存中没有与此医生的序列号,向后台请求序列后 然后+1执行，如果后台也没有  序列后就是1
        var uniond = _this.$store.state.userInfo;
        _this.$post('/api/im/getMessages/' + uniond.id + '/' + doctorid + '/0/1', null).then(res => {
            if (res.content != null && res.content.length > 0) {
                for (var i = 0; i < res.content.length; i++) {
                    if (res.content[i].senderId == uniond.id && res.content[i].receiverId == doctorid) {
                        //拿到序列号后执行方法
                        try {
                            dosome(res.content[i].messageSequence.split('-')[1] * 1 + 1)
                        } catch (error) {

                        }
                        //执行完方法后  释放锁
                        common.unLock(_this, 'getIndexlock', lockKey);
                        return
                    }
                }
            }
            //拿到序列号后执行方法
            try {
                dosome(1)
            } catch (error) {

            }

            //执行完方法后  释放锁
            common.unLock(_this, 'getIndexlock', lockKey);
        }).catch(err => {
            common.unLock(_this, 'getIndexlock', lockKey);
        })
    })
}
//发送websocket心跳  每5秒向服务器发一次10  服务器会立刻想我们发一次10
export function sendsocketping(_this) {
    var unionid = _this.$store.state.userInfo;
    setInterval(function () {
        _this.$store.state.websocket.send(JSON.stringify({
            "senderId": unionid.id,
            "messageStatus": "10"
        }),
        )
    }, 5000)
}
//监听接收的websocket心跳  检测接收到10的事件  如果超过8秒都没接收到一次10  就进行重连
export function jiantingsocket(_this) {
    setInterval(function () {
        if (_this.$store.state.sockettime == null || new Date().getTime() - _this.$store.state.sockettime > 8000) {
            _this.$store.state.socketstate = 2;
            //Websocketlink  最快4秒进行一次Websocket重连
            if (common.getLock(_this, 'Websocketlink', guid(), 4800) == false) {
                return
            }
            //websocket重连

            if (_this.$store.state.websocket != null) {
                try {
                    //关闭以前的websocket  启动新的websocket链接
                    _this.$store.state.websocket.close();
                    _this.$store.state.websocket = null;
                } catch (e) { }
            }
            initWebSocket(_this)
        }
    }, 5000)
}


