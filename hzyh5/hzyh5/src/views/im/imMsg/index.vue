<template>
    <div class="im-msg" :style="height">
        <div class="container-py" ref="container" :style="height">
            <div class="unnetwork-py" v-show='isshow'>
                <img src="../../../assets/im/sigh.png">
                <span>当前网络不可用，请检查你的网络设置</span>
            </div>
            <scroller :on-refresh='refresh' ref='myScroller' :refreshText='refreshs' :style='"top:"+heightShow'>
                <div ref="main">
                    <div v-for="(item,index) in messageInfoshow" :key="index">
                        <!-- 医生聊天信息 -->
                        <div v-if="item.from == messages.doctorId">
                            <!-- 聊天时间 -->
                            <div class="firstmsg-py" v-show="!(index!=0 && messageInfoshow[index].time-messageInfoshow[index-1].time<300000)">
                                <span>{{item.newdate}}</span>
                            </div>
                            <!-- 结束服务信息 -->
                            <div class="firstmsg-py over" v-if="item.ext.businessType != null && item.ext.businessType != '' && (item.ext.businessType == 'EndOrder' || item.ext.businessType == 'doctorEndOrder')">
                                <p v-html="item.data" style="color:#c1c1c1;"></p>
                                <span></span><span></span>
                            </div>
                            <!-- 普通文本信息 -->
                            <div class="other-record-py" v-if="item.types=='txt' && (item.ext.businessType == null || item.ext.businessType == '' || item.ext.businessType == 'doctornotice' || item.ext.businessType == 'doctorPtientAsociationGreeting')">
                                <img class="other-head-img-py" :src="messages.doctorFace" alt="">
                                <div class="other-record-content-py">{{item.data}}</div>
                            </div>
                            <!-- 普通语音信息 -->
                            <div class="other-record-py" v-else-if="item.types=='voice' && (item.ext.businessType == null || item.ext.businessType == '')">
                                <img class="other-head-img-py" :src="messages.doctorFace" alt="">
                                <div class="other-record-content-py" @click="playAudio(item,index)">
                                    <audio :index='index' :src="item.url"></audio>
                                    <img width="16" height="16" :src="voiceImgs[index] == null ? voiceImgUrl : voiceImgs[index]" alt="">
                                    <span style="float:right;color:#818181;">{{item.length}}s</span>
                                </div>
                            </div>
                            <!-- 电话录音信息 -->
                            <div class="other-record-py conversation" v-else-if="item.types=='voice' && item.ext.businessType != null && item.ext.businessType != '' && item.ext.businessType == 'callPhoneRecords'">
                                <img class="other-head-img-py" :src="messages.doctorFace" alt="">
                                <div class="other-record-contents-py" @click="playAudio(item,index)">
                                    <audio :index='index' :src="item.url"></audio>
                                    <img :src="voiceImgs[index] == null ? voiceImgUrl : voiceImgs[index]" alt="">
                                    <p>已通话{{item.ext.businessBody.duration}}分钟</p>
                                </div>
                            </div>
                            <!-- 图片信息 -->
                            <div class="other-record-py" v-else-if="item.types=='img'">
                                <img class="other-head-img-py" :src="messages.doctorFace" alt="">
                                <div>
                                    <viewer>
                                        <img style="border-radius:5px;margin:5px 0px 0px 8px;width:126px;" :src="item.url" alt="">
                                    </viewer>
                                </div>
                            </div>
                            
                            <!-- 推送文本信息 -->
                            <div v-else-if="item.types=='txt' && item.ext.businessType != null && item.ext.businessType != '' && item.ext.businessType=='doctor_prescription'">
                                <div class="public">
                                    <span>点击气泡查看调理方案，建议根据调理方案按时吃药购药如对药材质量、煎药方法、购药方法有疑问，请<a href="tel:4006660101" style="text-decoration:underline">联系客服</a></span>
                                </div>
                                <div @click="routerToMake(item)">
                                    <imPrescription :list='item.ext.businessBody' :dates='item.time'></imPrescription>
                                </div>
                            </div>
                            <!-- 推送文本信息-购买服务成功 -->
                            <div class="other-record-py new-hints" v-else-if="item.types=='txt' && item.ext.businessType != null && item.ext.businessType != '' && item.ext.businessType=='inputSickInfo'">
                                <div class="public">
                                    <span><i></i>已成功购买在线复诊服务，若有疑问请<a href="tel:4006660101" style="text-decoration:underline">联系客服</a></span>
                                </div>
                                <div class='other-record-contents-py' @click="routerToUpload(item)">
                                    <img src='../../../assets/im/btwzd@3x.png'/>
                                    <div>
                                        <p>问诊资料</p>
                                        <p>请填写真实信息和症状，<span style="color:#FE5858">点此填写</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="other-record-py" v-else-if="item.types=='txt' && item.ext.businessType != null && item.ext.businessType != '' && (item.ext.businessType=='inputProfile' || item.ext.businessType=='uploadFacePic')" @click="routerToUpload(item)">
                                <div class='other-record-contents-py'>
                                    <img v-if="item.ext.businessType=='inputProfile'" src='../../../assets/im/btwzd.png'/>
                                    <img v-else-if='item.ext.businessType=="uploadFacePic"' src='../../../assets/im/szmz@3x.png'/>
                                    <div v-if="item.ext.businessType=='inputProfile'">
                                        <p>问诊单</p>
                                        <p>请认真填写问诊单，<span style="color:#FE5858">点此填写</span></p>
                                    </div>
                                    <div v-else-if="item.ext.businessType=='uploadFacePic'">
                                        <p>舌照面照</p>
                                        <p>请上传清晰的舌照面照，<span style="color:#FE5858">点此上传</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 患者聊天信息 -->
                        <div v-else-if="item.to == messages.doctorId">
                            <!-- 聊天时间 -->
                            <div class="firstmsg-py" v-show="!(index!=0 && messageInfoshow[index].time-messageInfoshow[index-1].time<300000)">
                                <span>{{item.newdate}}</span>
                            </div>
                            <!-- 结束服务信息 -->
                            <div class="firstmsg-py" v-if="item.ext.businessType != null && item.ext.businessType != '' && (item.ext.businessType == 'EndOrder' || item.ext.businessType == 'doctorEndOrder')">
                                <p v-html="item.data" style="color:#c1c1c1;"></p>
                            </div>
                            <!-- 普通文本信息 -->
                            <div class="own-record-py" v-if="(item.type=='txt' || item.types == 'txt') && (item.ext.businessType == null || item.ext.businessType == '')">
                                <div class='own-record-content-py'>{{item.msg}}</div>
                                <img class='own-head-img-py' :src='userInfo.headphoto'/>
                            </div>
                            <!-- 图片信息 -->
                            <div class="own-record-py" v-else-if="item.type=='img'">
                                <div>
                                    <viewer>
                                        <img style="border-radius:5px;margin:5px 8px 0px 0px;width:126px;" :src="item.body.url" alt="">
                                    </viewer>
                                </div>
                                <img class='own-head-img-py' :src='userInfo.headphoto'/>
                            </div>
                            <!-- 推送文本信息 -->
                            <div class="own-record-py" v-else-if="item.type=='txt' && item.ext.businessType != null && item.ext.businessType != ''" @click="routerToUpload(item)">
                                <div class='other-record-contents-py'>
                                    <img v-if="item.ext.businessType=='patient_profile'" src='../../../assets/im/btwzd@3x.png'/>
                                    <img v-else-if="item.ext.businessType=='profileFinish'" src='../../../assets/im/btwzd.png'/>
                                    <img v-else-if='item.ext.businessType=="facePicFinish"' src='../../../assets/im/szmz@3x.png'/>
                                    <div v-if="item.ext.businessType=='patient_profile'">
                                        <p>问诊资料</p>
                                        <p>已发送患者信息和症状，<span style="color:#FE5858">点此查看</span></p>
                                    </div>
                                    <div v-else-if="item.ext.businessType=='profileFinish'">
                                        <p>问诊单</p>
                                        <p>已发送问诊单，<span style="color:#FE5858">点此查看</span></p>
                                    </div>
                                    <div v-else-if="item.ext.businessType=='facePicFinish'">
                                        <p>舌照面照</p>
                                        <p>已发送舌照面照，<span style="color:#FE5858">点此查看</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 公共气泡 -->
                        <div>
                            <div class="public" @click="routerToUpload(item)">
                                <span v-if="item.ext.businessType=='buyMedicineRemindSuccessfully'"><i></i>恭喜您，购药成功<a href="javascript:;">点此查看</a></span>
                                <span v-if="item.ext.businessType=='doctornotice'">此消息为医生群发公告内容</span>
                            </div>
                        </div>
                    </div>
                    <!-- 复诊弹框（请购买在线复诊） -->
                </div>
            </scroller>
        </div>
        <div class="footer-py heightTop-py" v-if="messages.isOrder == '1'">
            <div class="f-main-py">
                <div style="position:relative;">
                    <img src="../../../assets/im/tupiantubiaop@3x.png" alt="">
                    <input class="choose-py" id="chooseImgs" type="file" @change="chooseImg($event)"/>
                </div>
                <input class="sendall-text-py" type="text" ref="inputsend" v-model="input" @focus="updateHeights" @blur="updateHeight"/>
                <div>
                    <button class="send-msg-py" style="width:32px;" @click='enterSend($event)'>发送</button>
                </div>
            </div>
        </div>
        <div class="footers-py heightTop-py" v-else>
            <div style='padding:12px 20px;'>
                <div class="onlines-py">
                    <p>在线复诊</p>
                    <p>自由图文交流，开方调药</p>
                </div>
                <button class="button-py" @click="second" v-if="messages.isOrder == '2'">点此复诊</button>
                <button class="button-py button-remove" v-if="messages.isOrder == '0'">停止接诊</button>
            </div>
        </div>
        <div class="buy-medicine" @click="routerTomedicine">
            <img width="28" height="28" src="../../../assets/im/bianzhengkaifang@3x.png" alt="">
            <p>购药</p>
        </div>
    </div>
</template>
<script>
import common from "../../../api/common";
import imPrescription from "@/components/im/imPrescription/index.vue";
import { setTimeout } from 'timers';
export default {
    components: {
        imPrescription
    },
    data() {
        return {
            messageInfo: [], //历史聊天记录 操作值
            messageInfoshow: [], //历史聊天记录 显示值
            messages: {}, //父组件传入子组件存入的值(医生信息)
            userInfo: {}, //患者基本信息
            input: "",
            height: {
                height: ""
            }, //聊天内容样式
            menuHeight: 0, //底部菜单高度
            blurInput: false, //input是否获取焦点
            displayShow: false, //是否显示底部菜单
            isopen: false, //默认关闭
            voiceImgUrl: require("../../../assets/im/left-3@3x.png"), //语音显示图片
            voiceShow: false, //语音是否显示
            interval: null, //定时器
            isVoice: true, //是否播放语音
            voiceImgs: {}, //语音图片集合
            refreshs: "",
            index: 0,
            isshow: false,
            heightShow: "",
        };
    },
    created() {
        var _this = this;
        this.userInfo = this.$store.state.userInfo;
        this.messages = this.$store.state.AllOfValue.ImDoctorInfo;
        if (this.messages != null && this.messages.doctorId != null) {
            var msgData = localStorage.getItem("msgsuccess") ? JSON.parse(localStorage.getItem("msgsuccess")) : {};
            var data = msgData[this.messages.doctorId];
            if (data != null && data.length > 0) {
                this.query(data, data.length, _this.messageInfo.length);
            }
        }
        this.$store.state.websocketdosome["onTextMessage"] = function(message) {
            if ( message.ext.businessType != null && message.ext.businessType != "" && (message.ext.businessType == "doctorEndOrder" || message.ext.businessType == "EndOrder")) {
                if (message.from == _this.messages.doctorId) {
                    _this.messages.isOrder = "2";
                }
            }
            _this.messageInfo.push(message);
            _this.getmessage();
        };
        this.$store.state.websocketdosome["onPictureMessage"] = function(message) {
            _this.messageInfo.push(message);
            _this.getmessage();
        };
        this.$store.state.websocketdosome["onAudioMessage"] = function(message) {
            _this.messageInfo.push(message);
            _this.getmessage();
        };
        this.$store.state.websocketdosome["onOffline"] = function() {
            _this.isshow = true;
        };
        this.$store.state.websocketdosome["onOpened"] = function() {
            _this.isshow = false;
        };
    },
    mounted() {
        this.heightTop();
        //ios 触发button后input不主动失焦
        //mousedown事件的默认行为是使除了你点击的对象之外的有焦点的对象失去焦点,所以只要在 mousedown 事件中阻止默认事件发生就可以了
        var btn = document.querySelector(".send-msg-py");
        if (btn) {
            btn.onmousedown = function(event) {
                event.preventDefault();
            };
        }
        //Android 在input获焦时，聊天内容不被遮挡
        var _this = this;
        var a = parseInt(this.height.height);
        window.onresize = function() {
            var heightTop = _this.$el.querySelector(".heightTop-py");
            _this.menuHeight = heightTop.offsetHeight;
            var b = window.innerHeight - _this.menuHeight - 44;
            _this.heightShow = b - a + "px";
        };
    },
    methods: {
        //下拉加载数据，重新计算滚动条位置
        refresh(done) {
            this.index++;
            var _this = this;
            //加载数据之前的聊天内容高度
            var oldheight = this.$refs.main.offsetHeight;
            var msgData = localStorage.getItem("msgsuccess") ? JSON.parse(localStorage.getItem("msgsuccess")) : {};
            var data = msgData[this.messages.doctorId];
            var datas = this.messageInfo;
            setTimeout(() => {
                _this.query(data, data.length, datas.length, () => {
                    setTimeout(() => {
                    //加载数据之后的聊天内容高度
                        var newheight = this.$refs.main.offsetHeight;
                        var heights = newheight - oldheight;
                        this.$refs.myScroller.scrollTo(0, heights, true);
                    }, 500);
                });
                done();
            }, 500);
        },
        //input框获焦失焦就更新container置底
        updateHeight() {
            window.scroll(0, 0);
            this.scrollToBottom();
        },
        updateHeights() {
            var u = navigator.userAgent, app = navigator.appVersion;
            var isiOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(u);
            //兼容iPhoneX以上的input遮挡问题
            if (isiOS) {
                var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                //去除iphone6以下的机型
                if(width > 321){
                    window.setTimeout(function() {
                        window.scrollTo(0, document.body.clientHeight);
                    }, 100);
                }
            }
            this.scrollToBottom();
        },
        //初始化container的高度，并且置底
        heightTop() {
            var _this = this;
            var heightTop = this.$el.querySelector(".heightTop-py");
            this.menuHeight = heightTop.offsetHeight;
            this.height.height = window.innerHeight - this.menuHeight - 44 + "px";
            this.scrollToBottom();
        },
        //获取的聊天数据进行格式化
        getmessage() {
            var _this = this;
            var uid = this.$imConn.getUniqueId();
            var datas = this.messageInfo;
            common.tryLock(this, "getmessage", uid, function() {
                try {
                    _this.getmessagedetail(datas, 0, uid, {});
                }catch (e) {
                    common.unLock(_this, "getmessage", uid);
                }
            });
        },
        getmessagedetail(datas, i, uid, updatalist) {
            var _this = this;
            if (i >= datas.length) {
                var ids = _this.$imConn.getUniqueId();
                common.tryLock(_this, "msgdatas", ids, function() {
                    try {
                        var newList = localStorage.getItem("msgsuccess") ? JSON.parse(localStorage.getItem("msgsuccess")) : {};
                        var list = newList[_this.messages.doctorId];
                        list[list.length - 1].isRead = true;
                        if (JSON.stringify(updatalist) != "{}") {
                            for (var j = list.length - 1; j >= 0; j--) {
                                if (list[j].ext.businessType != null && list[j].ext.businessType != "" && list[j].ext.businessType == "doctor_prescription" && list[j].ext.businessBody.paystate == 1 && list[j].ext.businessBody.orderstate != 4) {
                                    if (updatalist[list[j].ext.businessBody.id] != null) {
                                        list[j].ext.businessBody.paystate = updatalist[list[j].ext.businessBody.id].ext.businessBody.paystate;
                                        list[j].ext.businessBody.orderstate = updatalist[list[j].ext.businessBody.id].ext.businessBody.orderstate;
                                        delete updatalist[list[j].ext.businessBody.id];
                                        if (JSON.stringify(updatalist) == "{}") {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        localStorage.setItem("msgsuccess", JSON.stringify(newList));
                        _this.messageInfo = datas;

                        //通话时间处理
                        datas.forEach((item) => {
                            if(item.ext.businessBody){
                                if(item.ext.businessBody.duration){
                                    let secondTime = parseInt(item.ext.businessBody.duration);
                                    let minuteTime = 0;//分
                                    let hourTime = 0;//小时
                                    let result = '';
                                    if(secondTime > 60) {
                                        minuteTime = parseInt(secondTime / 60);
                                        secondTime = parseInt(secondTime % 60);
                                        if(minuteTime > 60) {
                                            hourTime = parseInt(minuteTime / 60);
                                            minuteTime = parseInt(minuteTime % 60);
                                        }
                                        result = parseInt(secondTime);
                                        if(minuteTime > 0) {
                                            result = parseInt(minuteTime)>9?parseInt(minuteTime):'0'+parseInt(minuteTime)+':' + result;
                                        }
                                        if(hourTime > 0) {
                                            result = parseInt(hourTime)>9?parseInt(hourTime):'0'+parseInt(hourTime)+ ':' + result;
                                        }
                                    }else{
                                        result = '00:'+parseInt(secondTime);
                                    }
                                    item.ext.businessBody.duration = result;
                                }
                            }
                        });
                        _this.messageInfoshow = datas;
                        _this.scrollToBottom();
                    }catch (e) {
                    }finally {
                        common.unLock(_this, "msgdatas", ids);
                        common.unLock(_this, "getmessage", uid);
                    }
                });
            } else {
                var data = datas[i];
                var isnew = true;
                var newyear = new Date().getFullYear();
                var newmouth = new Date().getMonth() + 1;
                var newday = new Date().getDate();
                var newtime = newyear + "-" + newmouth + "-" + newday + " 00:00:00";
                var newtimes = new Date(newtime).getTime();
                if (data.time > newtimes) {
                    data.newdate = common.timestampToTime(data.time, 5);
                } else {
                    data.newdate = common.timestampToTime(data.time, 1);
                }
                if (data.ext.businessType != null && data.ext.businessType != "" && data.ext.businessType == "EndOrder") {
                    data.data = data.data.replace(/\\n/gm, "<br/>");
                }
                if (data.ext.businessType != null && data.ext.businessType != "" && data.ext.businessType == "doctorEndOrder") {
                    data.data = "服务已结束<span style='display:block;font-size:12px;'>若有疑问<a href='tel:4006660101' style='color:#4DBFFF;text-decoration:underline'>联系客服</a></span>";
                }
                var from = data.from;
                var to = data.to;
                if (data.ext.sendReversal != null && data.ext.sendReversal != "" && data.ext.sendReversal == true) {
                    data.from = to;
                    data.to = from;
                    data.msg = data.data;
                }
                if (data.ext.businessBody != null && JSON.stringify(data.ext.businessBody) != "{}") {
                    if (data.ext.businessType != null && data.ext.businessType != "" && data.ext.businessType == "doctor_prescription" && data.ext.businessBody.paystate == "1" && data.ext.businessBody.orderstate != "4") {
                        this.$doRequest({url: "/api/Inquiry/orderDetails",catchs: function(e) {
                            _this.getmessagedetail(datas, ++i, uid, updatalist);
                        }},{getPrescriptionOrder: "1",prescriptionOrderId: data.ext.businessBody.id},function(res) {
                            if (res.orderprescriptioninfos[0].paystate == 2 || res.orderprescriptioninfos[0].orderstate == 4) {
                                data.ext.businessBody.paystate = res.orderprescriptioninfos[0].paystate;
                                data.ext.businessBody.orderstate = res.orderprescriptioninfos[0].orderstate;
                                updatalist[data.ext.businessBody.id] = data;
                            }
                            _this.getmessagedetail(datas, ++i, uid, updatalist);
                        },function(error){
                            _this.getmessagedetail(datas, ++i, uid, updatalist);
                        });
                    } else {
                        this.getmessagedetail(datas, ++i, uid, updatalist);
                    }
                } else {
                    this.getmessagedetail(datas, ++i, uid, updatalist);
                }
            }
        },
        query(array, totalPage, displayed, dosome) {
            var _this = this;
            var list = parseInt(totalPage) - parseInt(displayed);
            if (list > 10) {
                for (var i = list - 1; i >= list - 10; i--) {
                    _this.messageInfo.unshift(array[i]);
                }
            } else {
                for (var j = list - 1; j >= 0; j--) {
                    _this.messageInfo.unshift(array[j]);
                }
            }
            this.getmessage();
            if (dosome != null && typeof dosome == "function") {
                dosome();
            }
        },
        //发送文本消息
        enterSend() {
            var _this = this;
            if (this.input == "") {
                return false;
            }
            var input = this.input;
            var ext = {
                orderid: _this.messages.orderid
            };
            this.input = "";
            this.$sendPrivateText(_this,_this.messages.doctorId,input,function(msg) {
                _this.messageInfo.push(msg);
                _this.getmessage();
                var data = {
                    fromid: _this.$store.state.userInfo.id,
                    toid: _this.messages.doctorId,
                    msgtype: "3",
                    val: input,
                    fromType: "2",
                    fromName: _this.$store.state.userInfo.patientnickname,
                    orderid: _this.messages.orderid
                };
                _this.$doRequest("/api/ImUtil/signIm", data, function(res) {
                });
            },ext);
        },
        //上传图片
        chooseImg(e) {
            var _this = this;
            var ext = {
                orderid: _this.messages.orderid
            };
            this.$sendPrivateImg(_this,_this.messages.doctorId,"chooseImgs",function(msg) {
                _this.messageInfo.push(msg);
                _this.getmessage();
                var data = {
                    fromid: _this.$store.state.userInfo.id,
                    toid: _this.messages.doctorId,
                    msgtype: "1",
                    fromType: "2",
                    fromName: _this.$store.state.userInfo.patientnickname,
                    orderid: _this.messages.orderid
                };
                _this.$doRequest("/api/ImUtil/signIm", data, function(res) {
                });
            },ext);
        },
        //特殊聊天记录router处理
        routerToUpload(item) {
            if((item.ext.businessType == "inputSickInfo" || item.ext.businessType == "inputProfile" || item.ext.businessType == "uploadFacePic") && this.messages.isOrder == '2'){
                this.$toastMsg('请购买在线复诊');
                return;
            }
            switch (item.ext.businessType) {
                case "inputSickInfo": //问诊资料模板
                    this.$router.push({
                        path: "/two",
                        query: { orderId: item.ext.orderid }
                    });
                break;
                case "patient_profile": //查看问诊资料
                    this.$router.push({
                        path: "/twos",
                        query: { orderId: item.ext.orderid }
                    });
                break;
                case "inputProfile": //问诊单模板
                    this.$router.push({
                        path: "/one",
                        query: { orderId: item.ext.orderid }
                    });
                break;
                case "profileFinish": //查看问诊单
                    this.$router.push({
                        path: "/ones",
                        query: { orderId: item.ext.orderid }
                    });
                break;
                case "uploadFacePic": //舌照面照模板
                    this.$store.state.AllOfValue.imuploadFacePic = {
                        isup: true,
                        orderid: item.ext.orderid,
                        doctorid: this.messages.doctorId
                    };
                    this.$router.push({
                        path: "/four"
                    });
                break;
                case "facePicFinish": //舌照面照查看
                    this.$store.state.AllOfValue.imuploadFacePic = {
                        isup: false,
                        orderid: item.ext.orderid,
                        doctorid: this.messages.doctorId
                    };
                    this.$router.push({
                        path: "/four"
                    });
                break;
                case "doctor_prescription": //医生开方
                    this.$store.state.AllOfValue.imuploadFacePic = {
                        isup: false,
                        orderid: item.ext.orderid,
                        doctorid: this.messages.doctorId
                    };
                    this.$router.push({
                        path: "/myOrderDetailsYF",
                        query: { id: item.ext.businessBody.id }
                    });
                break;
                case "buyMedicineRemindSuccessfully": //购药成功
                    this.$store.state.AllOfValue.imuploadFacePic = {
                        isup: false,
                        orderid: item.ext.orderid,
                        doctorid: this.messages.doctorId
                    };
                    this.$router.push({
                        path: "/myOrderDetailsYF",
                        query: { id: item.ext.businessBody.id }
                    });
                break;
            }
        },
        //滚动条置底
        scrollToBottom() {
            this.$nextTick(() => {
                var container = this.$refs.main.offsetHeight;
                setTimeout(() => {
                    this.$refs.myScroller.scrollBy(0, container, true);
                },160);
            });
        },
        //进入医生详情
        second() {
            this.$router.push({ path: "/doctorDetails", query: { state: "g8t7r3" } });
        },
        //进入我的病历
        routerTomedicine() {
            this.$router.push({ path: "/myOrderList", query: { source: "qy" } });
        },
        //播放语音
        playAudio(item, indexes) {
            var index = 0;
            var indexs = 0;
            var _this = this;
            try {
                _this.$set(_this.voiceImgs,{});
                clearInterval(_this.interval);
            } catch (error) {}
            this.interval = setInterval(function() {
                index++;
                indexs++;
                if (index > 3) {
                    index = 1;
                }
                _this.$set(_this.voiceImgs,indexes,require("../../../assets/im/left-" + index + "@3x.png"));
                if (indexs > item.length - 1) {
                    _this.$set(_this.voiceImgs, indexes, null);
                    clearInterval(_this.interval);
                }
            }, 1000);
            var bo = true;
            var audio = document.querySelectorAll("audio");
            var thisAudio = null;
            for(var j=0;j<audio.length;j++){
                if(audio[j].attributes.index.nodeValue == indexes){
                    thisAudio = audio[j];
                }
            }
            if(thisAudio == null)return;
            if (!thisAudio.paused) {
                bo = false;
            }
            for (var i = 0; i < audio.length; i++) {
                audio[i].pause();
                audio[i].currentTime = 0;
            }
            if (thisAudio.paused) {
                if (bo) {
                    thisAudio.play();
                } else {
                        clearInterval(_this.interval);
                    _this.$set(_this.voiceImgs,indexes,require("../../../assets/im/left-3@3x.png"));
                }
            } else {
                thisAudio.pause();
                clearInterval(_this.interval);
                 _this.$set(iceImgs,indexes,require("../../../assets/im/left-3@3x.png"));
            }
        },
        routerToMake(item) {
            this.$router.push({
                path: "/myOrderDetailsYF",
                query: { id: item.ext.businessBody.id }
            });
            this.$store.state.addressId=item.ext.businessBody.id;

        },
    },
    updated: function() {
        var _this = this;
        var heightTop = this.$el.querySelector(".heightTop-py");
        this.menuHeight = heightTop.offsetHeight;
    },
    destroyed() {},
    watch: {
        menuHeight: function(value, oldValue) {
            this.height.height = window.innerHeight - value - 44 + "px";
        },
        messageInfo: function(value, oldValue) {
            this.messageInfo = value;
        },
        messages: function(value, oldValue) {
            this.messages = value;
        },
        isshow: function(val, oldValue) {
            this.isshow = val;
        },
        heightShow: function(val, oldValue) {
            this.heightShow = val;
        },
        immediate: true
    }
};
</script>
<style scoped>
@import 'index.css';
</style>



