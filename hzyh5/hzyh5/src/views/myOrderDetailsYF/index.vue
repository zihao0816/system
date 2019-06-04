<template>
    <div class="myOrderDetailsYF">
        <div class="header unfinished" v-if="orderinfo.paystate == 1 && orderinfo.orderstate != 4">
            <span>待支付</span>
            <span>剩{{hours}}时{{minutes}}分自动取消</span>
            <i></i>
        </div>
        <div class="header over" v-if="orderinfo.paystate == 2">
            <span>已支付</span>
            <span>支付时间：{{resultTime}}</span>
            <i></i>
        </div>
        <div class="header cancel" v-if="orderinfo.orderstate == 4">
            <span>交易关闭</span>
            <span class="cancleTitle">{{orderinfo.cancelstate==1?"(支付超时)":"(人工取消)"}}</span>
            <i></i>
        </div>
        <!-- 配送，自提 -->
        <div class="pickGoods" v-if="(orderinfo.paystate == 1 && orderinfo.orderstate != 4)">
             <tab>
                <tab-item selected @on-item-click="getGoods(1)">配送</tab-item>
                <tab-item @on-item-click="getGoods(2)">自提</tab-item>
            </tab>
        </div>
        <!-- 新增地址 -->
        <div class="addAddress" @click="addAddress(1)" v-if="(orderinfo.paystate == 1 && orderinfo.orderstate != 4)&& !(addressItem)&& goodsType==1">
            <i class="el-icon-circle-plus-outline"></i>
            <span ref="addAddressItem">新增收货地址</span>
        </div> 
        <div class="addAddress" @click="addAddress(2)" v-if="(orderinfo.paystate == 1 && orderinfo.orderstate != 4)&& addressItem&& goodsType==1&&$route.query.addressType!=2">
            <i class="el-icon-circle-plus-outline"></i>
            <span ref="addressItem">选择收货地址</span>
        </div>
        <!-- 已支付地址 -->
        <div class="site" v-if="orderinfo.paystate == 2&&orderinfo.sendtype=='自取'">
            <i></i>
            <div>
                <span>{{selfMention.receiver}}</span>
                <span style="display:block;float:left;width:100%;">{{selfMention.telephone}}<a :href="'tel:'+selfMention.telephone">拨打</a></span>
                <span style="font-weight:400;">{{selfMention.province}}{{selfMention.city=="北京市"?"市辖区":selfMention.city}}{{selfMention.county+selfMention.address}}</span>
            </div>
        </div>
        <div class="site"  v-if="orderinfo.paystate == 2 && orderinfo.sendtype=='快递'">
            <i></i>
            <div>
                <span>{{orderinfo.receiver}}</span>
                <span>{{orderinfo.telephone}}</span>
                <span style="font-weight:400">{{overaddress}}</span>
            </div>
        </div>
        <!-- 支付关闭地址 -->
         <div class="site" v-if="orderinfo.orderstate == 4&&orderinfo.sendtype=='自取'">
            <i></i>
            <div>
                <span>{{selfMention.receiver}}</span>
                <span style="display:block;float:left;width:100%;">{{selfMention.telephone}}<a :href="'tel:'+selfMention.telephone">拨打</a></span>
                <span style="font-weight:400;">{{selfMention.province}}{{selfMention.city=="北京市"?"市辖区":selfMention.city}}{{selfMention.county+selfMention.address}}</span>
            </div>
        </div>
        <div class="site"  v-if="orderinfo.orderstate == 4 && orderinfo.sendtype!='自取'">
            <i></i>
            <div>
                <span>{{addressOver.receiver}}</span>
                <span>{{addressOver.telephone}}</span>
                <span style="font-weight:400">{{addressOver.province}}{{addressOver.city=='市辖区'?'':addressOver.city}}{{addressOver.county}}{{addressOver.address}}</span>
            </div>
        </div>
        <!-- 待支付地址列表  -->
        <div class="addressList" v-if="orderinfo.paystate == 1 && orderinfo.orderstate != 4 ">
            <div class="addressAll" v-if="(($route.query.addressType==2)||goodsType==2)">
                <div class="addressLogo" >
                    <img  src="../../assets/icon_dizhi.png" alt="" v-if="addressItem||goodsType==2">
                </div>
                <div class="center" v-if="(addressItem||goodsType==2)&&(orderinfo.paystate == 1 && orderinfo.orderstate != 4 )">
                    <div class="center_content" @click="getaddressEdit" v-if="goodsType==1&&addressItem" >    
                        <div class="center_content_number content_number">
                            <span>{{addressItem.receiver||""}}</span>
                            <span>{{addressItem.telephone||""}}</span>
                        </div>
                        <div class="center_content_number">
                            <span class="addressCity">{{addressItem.province}}{{addressItem.city=='北京市'?'市辖区':addressItem.city+addressItem.county+''+addressItem.address}}</span>
                        </div>
                    </div>      
                    <div class="center_content" v-if="goodsType==2&&orderinfo.paystate == 1 && orderinfo.orderstate != 4">    
                        <div class="hostipalTel_content">
                            <span class="hostipalTel">{{selfMention.receiver}}</span>
                            <span class="hostipalTel">{{selfMention.telephone}}<a :href="'tel:'+selfMention.telephone">拨打</a></span>
                        </div>
                        <div class="center_content_number"> 
                            <span class="addressCity">{{selfMention.province+''+selfMention.city=="北京市"?"市辖区":selfMention.city+selfMention.county+selfMention.address}}</span>
                        </div>
                    </div>
                </div>
                <div class="removeLogo" v-if="addressItem&&goodsType==1">
                    <!-- <span><img src="../../assets/goPath.png" alt=""></span>     -->
                    
                     <!-- <i class="el-icon-arrow-right"></i> -->
                </div> 
            </div>
        <!-- 已取消已结束状态下的地址 -->
        <span class="line_list" :style="(orderinfo.paystate == 1 && orderinfo.orderstate != 4)&& addressItem&& goodsType==1&&$route.query.addressType!=2?'padding:0':'padding:0 15px'" v-if="(orderinfo.paystate == 1 && orderinfo.orderstate != 4)||(orderinfo.paystate==2&&orderinfo.sendtype=='自取')">
            <i></i>
        </span>
         </div>
        <div class="expressCompany" v-if="goodsType==1&&orderinfo.paystate == 1 && orderinfo.orderstate != 4">
            <span>配送: 京东快递、顺丰快递; </span>
            <span> 平台推广期间免运费</span>
        </div>
         <!-- 已支付时间-->
        <div class="expressTime" v-if="orderinfo.sendtype=='自取'&&orderinfo.paystate == 2">
            <span>自提时间：预计<span class="dayTime">{{paystateTime}}</span> 可以取药</span>
        </div>
        <!-- 待支付时间 -->
        <div class="expressTime" v-if="goodsType==2&&orderinfo.paystate == 1 && orderinfo.orderstate != 4">
            <span>自提时间：预计<span class="dayTime">{{orderinfo.cancelstate==1||orderinfo.cancelstate==2?selfTime:medicine.name=="代煎"||medicine.name=="不代煎"?selfTime:'需选择是否代煎后，显示预计自提时间'}}</span> 可以取药</span>
        </div>
        <!-- 配送信息 -->
        <div class="delivery">
            <!-- <span><span>顺丰快递：</span>满80包邮，17:00前下单90%地区次日达</span> -->
        </div>

        <div class="doctor">
            <div class="orderCode clearfix">
                <span>订单号：{{orderinfo.orderid}}</span>
                <span>{{resultBuyTime}}</span>
            </div>
            <!-- NEW ../../assets/icon_dizhi.png-->
            <div class="drugInfoList">
                <div class='clearfix'>
                    <div><img :src="doctor.doctorFace"></div>
                    <div>
                        <span class="admitAll">{{doctor.doctorName}}<i class="admit">已认证</i></span>
                        <span>{{doctor.duties}}  {{doctor.hospitaname}}</span>
                    </div>
                </div>
                <div :style="orderinfo.isprescription == 2?'border-bottom:none':''">
                    <p>
                        <span>【患者】</span>
                        <span>{{patient.patientname}}</span>
                    </p>
                    <p>
                        <span>【诊断】</span>
                        <span>{{orderinfo.arguedisease}}、{{orderinfo.doctorconclusion}}</span>
                    </p>
                    <p v-if="orderinfo.isprescription == '1' || orderinfo.paystate == 2">
                        <span>【药房】</span>
                        <span>{{orderinfo.hospitaName}}</span>
                    </p>
                    <p class="gongyingshang" v-if="orderinfo.isprescription == '1' || orderinfo.paystate == 2">
                        <span >【剂型/供应商】</span>
                        <span >{{orderinfo.prescriptionshape}}·{{orderinfo.brand}}</span>
                    </p>
                    <p class="special" v-if="orderinfo.isprescription == '2' && orderinfo.paystate != 2" >
                        <span class="docNums">【药方用量】</span>
                        <span>共{{orderinfo.totaldosage}}剂量</span>
                    </p>
                </div> 
                <div class="bill" v-if="(orderinfo.isprescription == 1 || orderinfo.paystate == 2) && orderinfo.isprescription != 3">
                    <h3>R:<span>共{{quantity}}味药</span></h3>
                    <div>
                        <span v-for="(item,index) in medicinalDetails" :key="index">{{item}}</span>
                    </div>
                </div>
            </div>
            <div class="hide" v-if="(orderinfo.isprescription == '2' && orderinfo.paystate == 1) || orderinfo.isprescription == '3'">
                <span v-if="orderinfo.isprescription == '2'">*购药后即可查看药方</span>
                <span v-else>*【秘方】不可查看药方</span>
                <span>共{{quantity}}味药</span>
            </div>
            <div class='other' v-if="orderinfo.orderstate == 4||orderinfo.paystate == 2||(orderinfo.paystate == 1&&(orderinfo.isprescription != 3&&orderinfo.isprescription != 2))">
                <p><span>【用药说明】</span><span>共{{orderinfo.totaldosage}}剂，每日{{orderinfo.daydosage}}剂，每剂分{{orderinfo.taketime}}次服用</span></p>
                <p v-if="orderinfo.prescriptionshapeid == 'yt1002'&&orderinfo.prescriptionshape!='颗粒'"><span>【煎药说明】</span><span>{{declare}}</span></p>
                <b></b>
                <p><span>【用药禁忌】</span><span>{{orderinfo.taboo}}</span></p>
                <p><span>【服药时间】</span><span>{{orderinfo.medicationtime||''}}</span></p>
                <p><span>【特殊医嘱】</span><span>{{orderinfo.specialadvice}}</span></p>
            </div>
        </div>

        <!-- 支付信息 -->
        <div class="infolist">
            <div class="infolist_div">
                <span>药方总价</span>
                <span>¥{{orderinfo.totalprice}}</span>
            </div>
             <div class="border infolist_div">
                <span>运费</span>
                <span>¥0</span>
                <span></span>
            </div>
            <span class="line_list lineList" v-if="orderinfo.prescriptionshape=='饮片'">
                <i></i>
            </span>
            <div class="sale infolist_div daijian" @click="PickerShow = true"  v-if="(orderinfo.paystate == 1 && orderinfo.orderstate != 4)&&(orderinfo.yfgenerationfry=='2'&&orderinfo.prescriptionshape=='饮片'&&(orderinfo.decoctionren==2&&orderinfo.generationfry!=3))||orderinfo.yfgenerationfry=='2'&&orderinfo.generationfry==3&&orderinfo.prescriptionshape=='饮片'">
                <span><span>代煎</span></span>
                <i class="el-icon-arrow-right"></i>
                <span class="state stateSelector" :id="medicine.name=='请选择'?'selectFont':''"><b class="selecter">购前必选</b>{{medicine.name}}</span>
            </div>
            <wv-picker
            :visible.sync="PickerShow"
            :columns="medicineColumns"
            value-key="name"
            @confirm="confirmYao"
            @cancel="cancelYao"
            />
            <div class="infolist_div daijian" v-if="(orderinfo.generationfry!=3&&orderinfo.decoctionren==1||orderinfo.paystate == 2&&orderinfo.generationfry!=3)&&orderinfo.yfgenerationfry=='2'&&orderinfo.prescriptionshape=='饮片'">
                <span style="float:left;">代煎</span>                
                <span >{{orderinfo.generationfry==1?"不代煎 ¥0":"代煎 ¥0"}}</span>
                <b class="doctorList" v-if="orderinfo.paystate == 1 && orderinfo.orderstate != 4">医生已选</b>
            </div>
            <div class="infolist_div daijian" v-if="orderinfo.yfgenerationfry=='1'&&orderinfo.prescriptionshape=='饮片'">
                <span>代煎</span>
                <span>此药房暂不支持代煎</span>
            </div>
            <!-- NEW优惠券 -->
            <!-- 未开始订单选择默认优惠券 -->
            <div class="sale infolist_div" v-if="orderinfo.orderstate == 1 && couponSum" @click="goCoupon(orderinfo.orderstate)">
                <span><span>优惠</span></span>
                <i class="el-icon-arrow-right"></i>
                <span class="state">- ¥{{couponSum}}</span>
            </div>
            <!-- 已开始订单没有优惠券或者未开始订单不使用优惠券 -->
            <div class="sale not infolist_div" v-if="orderinfo.orderstate != 1 && orderinfo.saletype == 1 || orderinfo.orderstate == 1 && isSelect && couponSum == ''">
                <span><span>优惠</span></span>
                <i class="el-icon-arrow-right" v-if="orderinfo.orderstate == 1" @click="goCoupon(orderinfo.orderstate)"></i>
                <span class="nosale" @click="goCoupon(orderinfo.orderstate)">暂无优惠</span>
            </div>
            <!-- 一开始优惠券有优惠券 -->
            <div class="sale infolist_div" v-if="orderinfo.orderstate != 1 && orderinfo.saletype == 2">
                <span><span>优惠</span></span>
                <span class="state">- ¥{{orderinfo.saleprice}}</span>
            </div>
            
            <!-- <div class="infolist_div" v-if="orderinfo.prescriptionshape=='颗粒'">
                <span>代煎</span>
                <span>颗粒无需不代煎</span>
            </div> -->
            <!-- orderinfo.prescriptionshape=='颗粒' -->
            <span class="line_list lineList" >
                <i></i>
            </span>
            <div class="addMoney">
                <span>合计：</span>
                <span>（推广期免运费、免代煎费）</span>
                <span class="state">¥{{orderinfo.totalprice - this.couponSum >= 0?(orderinfo.totalprice - this.couponSum).toFixed(2):0}}</span>
            </div>
        </div>
        <div style="width:100%;height:46px;" v-if="orderinfo.paystate == 1"></div>
        <div class="pay" v-if="orderinfo.paystate == 1 && orderinfo.orderstate != 4">
            <div class="service">
                <a href="tel:400-666-0101">
                    <i></i>
                    <span>客服</span>
                </a>
            </div>
            <div class="payInfo">
                <!-- NEW实付 -->
                <span>实付：<i>¥</i></span>
                <span class="state">{{orderinfo.totalprice - this.couponSum >= 0?(orderinfo.totalprice - this.couponSum).toFixed(2):0}}<span></span></span>
            </div>
            <button :class="isSubmit?'paySubmit':'paySubmit gray'" @click="paySubmit">
                {{isSubmit?'立即支付':'正在支付...'}}
            </button>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    // import { Picker } from 'we-vue'
    import common from "../../api/common";
    import { Group, XAddress, XButton, Cell, Value2nameFilter as value2name } from 'vux'
    export default {
        data() {
            return {
                daiName:"请选择",
                commonList:common,
                medicineColumns: [{values: [{name: '代煎',price: 10},{name: '不代煎',price: 0.5} ]}],
                discountColumns:[{values: [{name: '优惠',price: 10},{name: '无',price: 0.5} ]}],
                discount:{name: '优惠',price: 10},
                pickDiscount:false,
                medicine: {name: '请选择',price: 10},
                PickerShow:false,
                patientid: this.$store.state.userInfo.id,//患者id
                doctorId: this.$store.state.AllOfValue.doctorId =this.$store.state.AllOfValue.doctorId==null?this.$route.query.doctorId:this.$store.state.AllOfValue.doctorId,
                orederId: this.$route.query.id,//订单id
                orderCode: '',//订单编号
                openid: this.$store.state.userInfo.openid,
                state: '',
                lasttime: '',//倒计时时
                hours: '',//倒计时分
                minutes: '',//倒计时秒
                doctor: {},//医生信息
                patient: {},//患者信息
                orderinfo: {},//药方订单信息
                checked: true,
                address: [],//地址列表
                addressLen: '',//地址总数
                addressList: '',
                addressItem:{},
                isSubmit: true,
                befrom: this.$route.query.befrom || '',
                showIndex: 999,
                resultBuyTime: '',
                resultTime: '',
                //结束状态下收件人信息
                overname: '',
                overaddress: '',
                //默认优惠券（11.19新增需求）
                isSelect: this.$route.query.isSelect || false,
                couponId: this.$route.query.couponId || '',
                couponSum: this.$route.query.couponSum || '',
                quantity: '',//药方数量ordermedicines
                declare: '',//煎药说明
                medicinalDetails: [],//药方详情
                addressOver: {},//交易关闭状态下默认地址
                colortext:'',
                goodsType:1,
                daijian:"",//是否代煎
                selfMention:{},
                selfTime:"",
                paystateTime:""

            }
        },
        // 生命周期之挂载完成
        methods: {
            confirmDiscount(picker){
                this.discount=picker.currentValue[0];
            },
            cancelYao(){
                this.PickerShow=false;
            },
            confirmYao(picker){
               this.medicine=picker.currentValue.length>0?picker.currentValue[0]:{name:"代煎",price:18};
            },
            getaddressEdit(){
                this.$router.push({path: '/addressedit'});
            },
            //自提/配送
            getGoods(index){
                this.goodsType=index;
                let _this=this;
                if(index==2&&this.orderinfo.hospitaName.length>3){
                    let dateTime=new Date();
                    let params={
                        receiver:this.orderinfo.hospitaName=="北京好中医中央大药房"?"好中医中央药房":"好中医潘家园药房"
                    }
                    this.$doRequest("/api/patientaddressinfo/getListByKey",params ,res=>{
                        let hfmTime=common.timestampToTime(_this.orderinfo.paytime,3);
                        let dateTime=new Date();
                        let payTime=common.timestampToTime(dateTime,3); 
                        if(_this.orderinfo.paystate == 2){
                            // 已支付判断时间
                            if(_this.orderinfo.generationfry=="2"){
                                _this.paystateTime=hfmTime<"12:00:00"?common.timestampToTime(new Date(),9):common.timestampToTime(dateTime.setDate(dateTime.getDate()+1),9);
                            }else if(_this.orderinfo.generationfry=="1"){
                                _this.paystateTime=hfmTime<"15:00:00"?common.timestampToTime(new Date(),9):_this.paystateTime=common.timestampToTime(dateTime.setDate(dateTime.getDate()+1),9);  
                            }
                        }else if(_this.orderinfo.paystate == 1 && _this.orderinfo.orderstate != 4){
                            /未支付时间判断/ 
                            if(_this.orderinfo.generationfry=="2"){
                                _this.selfTime=payTime<"12:00:00"?common.timestampToTime(new Date(),9): _this.selfTime=common.timestampToTime(dateTime.setDate(dateTime.getDate()+1),9);
                            }else if(_this.orderinfo.generationfry=="1"){
                                _this.selfTime=payTime<"15:00:00"?common.timestampToTime(new Date(),9):common.timestampToTime(dateTime.setDate(dateTime.getDate()+1),9);
                            }else if(_this.medicine.name=="代煎"){
                                _this.selfTime=payTime<"12:00:00"?common.timestampToTime(new Date(),9):common.timestampToTime(dateTime.setDate(dateTime.getDate()+1),9);
                            }else{
                                _this.selfTime=payTime<"15:00:00"?common.timestampToTime(new Date(),9):common.timestampToTime(dateTime.setDate(dateTime.getDate()+1),9);
                            }
                        }
                        _this.selfMention=res[0];
                     })
                }
            },
            //倒计时
            time(servicetime,buytime){
                let newtime = servicetime * 60 * 60 * 1000 + buytime;
                let oldtime = new Date();
                this.lasttime = newtime - oldtime.getTime();
                this.hours = parseInt((this.lasttime / (1000 * 60 * 60)));
                this.minutes = parseInt((parseFloat(this.lasttime / (1000 * 60 * 60)) - parseInt(this.lasttime / (1000 * 60 * 60))) * 60);
            },
            //删除和编辑的时候左滑事件
            onSwipeLeft(i){
                this.showIndex = i;
            },
            onSwiperight(i){
                this.showIndex = 999;
            },
            //获取收获地址
            getAddress(){
                let params = {
                    patientid: this.patientid
                };
                let that=this;
                this.addressList='';
                this.$doRequest("/api/patientaddressinfo/getListByKey", params, res=>{
                    that.address = res;
                    if(that.$route.query.addressType==2){
                        that.addressItem=that.$store.state.addressList;
                    }else{
                        for(let i=0;i<res.length;i++){
                            if(res[i].isdefault==1){
                                that.addressItem =res[i];
                                break;
                            }
                        }
                        that.addressItem=that.addressItem.receiver?that.addressItem:res[0];
                    }
                    this.addressLen = res.length;
                    let _this = this;
                    if(res.length != 0){
                        this.address.forEach(function (item) {
                            if(item.isdefault == 1){
                                _this.addressList = item.id;
                            }
                        });
                        if(_this.addressList == null || _this.addressList == ''){
                            _this.addressList = this.address[0].id;
                        }
                        this.addressOver = res[0];
                    }
                 });
            },
            getAddressCS(){
                let params = {
                    patientid: this.patientid
                };
                this.addressList='';
                this.$doRequest("/api/patientaddressinfo/getListByKey", params, res=>{
                    this.address = res;
                    this.addressLen = res.length;
                    let _this = this;
                    if(res[0] != ''){
                        this.address.forEach(function (item) {
                            if(item.isdefault == 1){
                                _this.addressList = item.id;
                            }
                        });
                        if(_this.addressList == null || _this.addressList == ''){
                            _this.addressList = this.address[0].id;
                        }
                        this.addressOver = res[0];
                    }
                 });
            },
            //新增地址跳转
            addAddress(index){
                if(index==1){
                    this.$router.push({path: '/address'});
                }else{
                    this.$router.push({path: '/addressedit'});
                }
            },
            //编辑地址
            upAddress(item){
                this.$router.push({path: '/address',query:{id: item.id,receiver: item.receiver,telephone: item.telephone,province: item.province,city: item.city,county: item.county,address: item.address}});
            },
            //删除地址
            removeAddress(id){
                this.$doRequest("/api/patientaddressinfo/delete", [id], res=>{
                    if(res.res != -1){
                        this.$toastMsg('收货地址删除成功');
                        this.showIndex = 999;
                        // this.getAddressCS();
                        this.$router.push({path: '/sx'});
                        // this.getOrderDetails();
                    }
                });
            },
            //设置默认地址
            defaultAddress(){
                let params = {
                    patientid: this.patientid,
                    addressid: this.addressList
                }
                this.$doRequest("/api/Personal/setDefaultAddress", params, res=>{

                });
            },
            //去选择优惠券
            goCoupon(state){
                if(state == 1){
                    this.$store.state.sun.pd = 1;
                    this.$router.push({path: '/myCoupon',query:{orderId: this.orederId,fromType: 'myOrderDetailsYF',type: this.befrom}});
                }
            },
            //获取默认优惠券（未开始订单设置默认优惠券）
            getCoupon(){
                this.$doRequest("/api/PlacingOrder/getMypreferentialPrice", { parameters: this.patientid }).then(res => {
                    if(res.result == 0){
                        let list = [];
                        res.parameters.forEach(function (item) {
                            if(item.state == 2 && item.invalidity == 1){
                                list.push(item);
                            }
                        });
                        if(list != '' ){
                            this.couponId = list[0].id || '';
                            this.couponSum = list[0].price || '';
                        }

                    }
                })
            },
            //获取订单详情
            getOrderDetails(islook){
                if(islook==null){
                    islook=true;
                }
                this.$store.state.addressId=this.orederId;
                let params = islook?{
                    /*是否获取医生详情信息 1 获取2 不获取*/
                    getDoctor: '1',
                    /*是否获取患者详情信息 1 获取2 不获取*/
                    getPatient: '1',
                    /*是否获取主诉  1 获取2 不获取*/
                    isaction: '1',
                    /*是否获取此订单的药方订单详细信息 1 获取2 不获取*/
                    getPrescriptionOrder: '1',
                    /*药方订单id，如果想获取问诊订单下面的所有药方订单，此处可不传*/
                    prescriptionOrderId: this.orederId,
                }:{
                    /*是否获取此订单的药方订单详细信息 1 获取2 不获取*/
                    getPrescriptionOrder: '1',
                    /*药方订单id，如果想获取问诊订单下面的所有药方订单，此处可不传*/
                    prescriptionOrderId: this.orederId,
                }

                
                this.$doRequest("/api/Inquiry/orderDetails", params, res=>{
                    if(islook){
                        this.doctor = res.doctor;//医生信息
                        this.patient = res.patient;//患者信息
                        this.orderinfo = res.orderprescriptioninfos[0];//订单信息（药方订单信息)
                        if(this.orderinfo.paystate==2){
                            this.getGoods(2);
                        }
                        
                        this.quantity = this.orderinfo.ordermedicines.length;
                        //煎药说明和药方明细
                        let _this = this;
                        _this.medicinalDetails = [];
                        this.orderinfo.ordermedicines.forEach(function (item) {
                            _this.medicinalDetails.push(item.medicinename+' '+item.dosage+item.medicineunit);
                            if(item.decoctionid != null){
                                _this.declare += item.medicinename + '('+ item.decoctionname +')     ';
                            }
                        });
                        if (this.orderinfo.paystate == 1 && this.orderinfo.orderstate != 4) {
                            this.time(this.orderinfo.servicetime,this.orderinfo.buytime);
                        }
                        this.orderCode = this.orderinfo.orderid;//支付的时候用
                        this.resultBuyTime = common.timestampToTime(this.orderinfo.buytime,1)//下单时间
                        this.resultTime = common.timestampToTime(this.orderinfo.paytime);//支付时间

                        //非支付状态下收货信息
                        if(this.orderinfo.paystate != 1){
                            let eq = this.orderinfo.address.indexOf('$');
                            let total = this.orderinfo.address.length;
                            this.overaddress = this.orderinfo.address.substring(0,eq);
                            this.overname = this.orderinfo.address.substring(eq+1,total);
                        }
                        //交易关闭状态下收货信息
                        if(this.orderinfo.paystate == 4){
                            let eq = this.orderinfo.address.indexOf('$');
                            let total = this.orderinfo.address.length;
                            this.overaddress = this.orderinfo.address.substring(0,eq);
                            this.overname = this.orderinfo.address.substring(eq+1,total);
                        }

                        if(this.isSelect){
                            //选择后的优惠券以选择的为准
                            this.couponId = this.$route.query.couponId;
                            this.couponSum = this.$route.query.couponSum;
                        }else{
                            if(this.orderinfo.orderstate == 1){
                                this.getCoupon();
                            }else if(this.orderinfo.orderstate == 2){
                                if(this.orderinfo.saletype == 2){
                                    this.couponId = this.orderinfo.couponid;
                                    this.couponSum = this.orderinfo.saleprice;
                                }
                            }
                        }
                    }
                })
            },

            //立即支付
            paySubmit(){
                if(this.$refs.addAddressItem||this.$refs.addressItem){
                    this.$toastMsg('请选择收货地址');
                    return;
                };
                if(this.isSubmit){
                    this.isSubmit = false;
                    if((!this.addressList || this.addressList == '')&&this.goodsType==1){
                        this.isSubmit = true;
                        this.$toastMsg('请选择收货地址');
                        return;
                    }
                    let _this = this;
                    if(this.goodsType==1){
                        _this.defaultAddress();
                    }
                    if(_this.orderinfo.prescriptionshape=='颗粒'){
                        _this.daijian="1";
                    }else if(_this.orderinfo.yfgenerationfry=="1"){
                         _this.daijian="1";
                    }else if(_this.orderinfo.generationfry!=3){
                        _this.daijian=_this.orderinfo.generationfry+'';
                    }else{
                         _this.daijian=_this.medicine.name=="代煎"?"2":_this.medicine.name=="不代煎"?"1":"";
                    }
                    let decoctionren=_this.orderinfo.generationfry==1||_this.orderinfo.generationfry==2?"1":"2";
                    console.log();
                    if(_this.daijian=="1"||_this.daijian=="2"){
                        _this.$doRequest("/api/weixinpay/sendWeiPayRequest?ordercode="+this.orderCode+"&kfc="+ this.couponId +"&addressId="+ this.addressList +"&openid="+this.$store.state.userInfo.patientcode+"&yfdj="+_this.daijian+"&sendtype="+_this.goodsType+"&decoctionren="+decoctionren,null,res => {
                            try {
                                if(res.return_code=="SUCCESS"){
                                    //0元判断：1元的时候不走微信支付
                                    if(res.totalfee*1>0){
                                        WeixinJSBridge.invoke('getBrandWCPayRequest', res.weiAppLetEntity,function(res){
                                            _this.isSubmit = true;
                                            if(res.err_msg=='get_brand_wcpay_request:ok'){
                                                //入口判断（成功后跳回对应的页面）
                                                if((_this.befrom && _this.befrom == 'orderList')||(_this.$route.query.ptid!=null&&_this.$route.query.ptid!='')){
                                                    _this.$router.push({path: '/sx'});
                                                }else{
                                                    _this.getOrderDetails(false);
                                                    common.unLock(_this, "todoctorLock" + _this.docid)
                                                    _this.$router.push({path: '/physicianVisits?doctorId=' + _this.doctorId});
                                                }
                                            }else{
                                                if(res.err_msg=='get_brand_wcpay_request:fail'){
                                                    _this.$toastMsg("支付失败");
                                                }
                                                _this.$router.push({path: '/sx'});
                                            }
                                        });
                                    }else{
                                        _this.isSubmit = true;
                                        //入口判断（成功后跳回对应的页面）
                                        if((_this.befrom && _this.befrom == 'orderList')||(_this.$route.query.ptid!=null&&_this.$route.query.ptid!='')){
                                            _this.$router.push({path: '/sx'});
                                        }else{
                                            _this.getOrderDetails(false);
                                            common.unLock(_this, "todoctorLock" + _this.docid)
                                            _this.$router.push({path: '/physicianVisits?doctorId=' + _this.doctorId});
                                        }
                                    }
                                }else{
                                    _this.isSubmit = true;
                                    _this.$toastMsg(res.return_msg);
                                }
                            }catch (e) {
                                _this.isSubmit = true;
                            }
                        },
                        err =>{
                        _this.isSubmit = true;
                        });
                    }else{
                        _this.$toastMsg("请选择代煎");
                        _this.isSubmit=true;
                    }

                }
            },
            init(){
                
                if(this.$store.state.userInfo.telephone == null || this.$store.state.userInfo.telephone == ''){
                    this.$toastMsg('请完善手机号');
                    this.$router.push({path: '/boundPhone', query:{form:'myOrderDetailsYF'}});
                }
                this.patientid = this.$store.state.userInfo.id;
                this.getAddress();
                this.getOrderDetails();
            }
        },
        //生命周期之创建完成
        created: function(){
            this.$isLogin(window.location.search.substr(1),this.init);
            document.title = '订单详情';
        },
       
    }
</script>

