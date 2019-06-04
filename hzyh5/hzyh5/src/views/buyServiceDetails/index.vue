<template>
    <div class="buyServiceDetails">
        <div class="navs">
            <div class="tit">
                北京好中医承诺
            </div>
            <div class="tip">
                将由医生本人为您提供问诊服务
            </div>
        </div>
        <div class="doctorinfo clearfix"> 
            <div>
                <img :src="datalist.doctorFace" alt="">    
            </div>
            <div>
                <p class="doctorname">{{datalist.doctorName}}</p>
                <p class="position">{{datalist.duties}}</p>
            </div>
            <div>
                <p>在线复诊服务</p>
                <p class="thes">￥{{sun}}/次</p>
            </div>
        </div>
        <div class="featureselection">
            <div class="models">
                <img src="../../assets/buy/sfzdhgt@3x.png" alt="">
                <p>十分钟电话沟通</p>
            </div>
            <div class="models">
                <img src="../../assets/buy/zytwdh@3x.png" alt="">
                <p>自由图文对话</p>
            </div>
            <div class="models">            
                <img src="../../assets/buy/yjkf@3x.png" alt="">
                <p>严谨辨证开方</p>
            </div>
            <div class="models">
                <img src="../../assets/buy/zdtljy@3x.png" alt="">
                <p>制定调理建议</p>
            </div>
        </div>
        <div>
            <div class="amount">
                <div class="left">优惠券</div>
                <div class="right" @click="gotokfc()"><span class="reds" :class="{block:discount == 0}">{{discount != 0?"-￥"+discount:'暂无优惠'}}</span><img style="margin-left:6px;" width="6" height="12" src="../../assets/buy/zfjr_icon@3x.png" alt=""></div>
            </div>
            <div class="amount">
                <div class="left"><img src="../../assets/buy/wechat_icon@3x.png" alt=""><span>微信支付</span></div>
                <div class="right">
                    <el-checkbox v-model="pay"></el-checkbox>
                </div>
            </div>
        </div>
        <div class="reminder">
            <div class="navt">
                <span>•&emsp;温馨提示&emsp;•</span>
            </div>
            <div class="bodys">
                <div><span class="list">·</span>急重病不适宜在线问诊。</div>
                <div>
                    <span class="list">·</span>
                    <span>客服会尽快通知医生与您联系。</span>
                </div>
                <div><span class="list">·</span><span>医生将与您通过图片、文字进行交流。</span></div>
                <div><span class="lists">·</span><div>医生将根据患者实际情况辨证开方、给出调理建议。</div></div>
                <div><span class="lists">·</span><div>购买成功后请如实填写问诊单并发给医生，医生将按照接到问诊单先后顺序回复。</div></div>
                <div><span class="lists">·</span><div>问诊过程中请避免向医生咨询非患者本人的问题，否则医生有权提前结束咨询。</div></div>
                <div><span class="list">·</span><span>本服务有效期：72小时内有效。</span></div>
                <div style="padding-bottom:54px;"><span class="list">·</span>购买即同意<span style="padding-right:0;">《用户协议》</span>。</div>
            </div>
        </div>
        <div class="pay">
            <div class="service">
                <a href="tel:400-666-0101">
                    <i></i>
                    <span>客服</span>
                </a>
            </div>
            <div class="payInfo">
                <!-- NEW实付 -->
                <span>实付：</span>
                <span class="state">¥{{0 >= sun-discount?0:sun-discount}}<span>元</span></span>
            </div>
            <button :class="lock?'paySubmit':'paySubmit gray'" @click="gotoshop()">
                {{lock?'立即购买':'正在支付...'}}
            </button>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from "../../api/common";
    export default {
        data() {
            return {
               datalist:"",
               sun:"",
               discount:0,
               kfc:"",
               lock:1,
               docid:'',
               pay: true
            }
        },
        // 生命周期之挂载完成
        methods: {
            query(){
              var _this=this;
              if(this.$store.state.userInfo.telephone == null || this.$store.state.userInfo.telephone == ''){
                  this.$toastMsg('请完善手机号');
                  this.$router.push({path: '/boundPhone'});
              }
              _this.$doRequest(
                "/api/PlacingOrder/underway?patientid="+_this.$store.state.userInfo.id+"&doctorid="+_this.docid,null
                ,res => {
                 if(res.parameters*1>0){
                   common.unLock(_this,"todoctorLock"+_this.docid)
                   _this.$router.push({path: '/physicianVisits?doctorID=' + _this.docid});
                 }else{
                   _this.$doRequest(
                     "/api/AppHomePage/Index",{parameters:_this.docid}
                     ,res => {
                       _this.datalist = res;
                     });
                 }
                });

            },
            gotoshop(){
                if(this.lock == 0){
                    return
                }else{
                    this.lock = 0;
                    var _this = this
                    if(this.$store.state.userInfo.telephone == ""||this.$store.state.userInfo.telephone == null){
                        this.$router.push({path: '/boundPhone',query:{form: 'buyServiceDetails'}});
                    }else{
                      this.$doRequest(
                        "/api/PlacingOrder/DialecticalOpen", {
                          doctorid: this.docid,
                          patientid: this.$store.state.userInfo.id,
                          serviceid: 2,
                          paytype: 1,
                          kfc: this.kfcid
                        }
                        , res => {
                          try {
                            _this.datalist = res;
                            if (res.weiPayReturnEntiey.totalfee * 1 > 0) {
                              WeixinJSBridge.invoke('getBrandWCPayRequest', res.weiPayReturnEntiey.weiAppLetEntity, function (ress) {
                                _this.lock = 1;
                                // _this.$toastMsg(JSON.stringify(res),5000)
                                if (ress.err_msg == "get_brand_wcpay_request:ok") {
                                  _this.$doRequest("/api/Inquiry/orderDetails", {getOrder: 1, orderID: res.orderinfo.id,}, res => {
                                    var docid = _this.docid;
                                      common.unLock(_this, "todoctorLock" + _this.docid)
                                    _this.$router.push({path: '/physicianVisits?doctorID=' + docid});
                                  });
                                } else {
                                  _this.$doRequest("/api/orderinfo/cleanOrderForCode?orderId=" + res.orderinfo.id + "&type=1", null, res => {
                                  });
                                }
                              });
                            } else {
                              _this.lock = 1;
                              common.unLock(_this, "todoctorLock" + _this.docid)
                              _this.$router.push({path: '/physicianVisits?doctorID=' + _this.docid});
                            }
                          } catch (e) {
                            _this.lock = 1;
                          }
                        },
                        err => {
                          _this.lock = 1;
                          if (err.action == "1") {
                            common.unLock(_this, "todoctorLock" + _this.docid)
                            _this.$router.push({path: '/physicianVisits?doctorID=' + _this.docid});
                          }
                          _this.$toastMsg(err.message);
                        });
                    }
                }
            },
            gotokfc(){
                this.$store.state.sun.pd = 1;
                this.$router.push({path:'/myCoupon',query:{fromType: 'buy'}});
            }
        },
        //生命周期之创建完成
        created: function() {
            document.title = '购买在线复诊';
            this.docid = this.$store.state.AllOfValue.doctorId;
            this.sun =  this.$store.state.sun.price;
            if(this.$route.query.kfcSum != undefined){
                this.discount = this.$route.query.kfcSum;
            }else{
                this.discount = 0;
            }
            this.kfcid = this.$route.query.kfcId;
            this.$isLogin(window.location.search.substr(1), this.query);
        }
    }
</script>

