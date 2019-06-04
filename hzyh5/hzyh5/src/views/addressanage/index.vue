<template>
    <div class="orderDetailsYF">
        <!-- 订单状态 -->
        <div class="header">
            <span>待支付</span>
            <span>剩71小时34分自动关闭</span>
            <i></i>
        </div>

        <!-- 地址信息 -->
        <div class="address">
            <div class="add">
                <i class="el-icon-circle-plus-outline"></i>
                <span>新增收货人地址</span>
            </div>
            <div class="addressList">

            </div>
            <div class="addInfo">
                <spa><span>顺丰快递：</span>满80包邮，17:00前下单90%地区次日达</spa>
            </div>
        </div>

        <!-- 医生和病症信息 -->
        <div class="info">
            <div class="orderCode">
                <span>订单号：190010101</span>
                <span>2018/07/22</span>
            </div>
            <div>
                <div class="doctorInfo">
                    <div><img src=""></div>
                    <div>
                        <span>张震岳</span>
                        <span>主任医师  北京中医药大学东直门医院</span>
                    </div>
                </div>
                <div class="result">
                    <div>
                        <span>【患者】</span>
                        <span>陈惠敏</span>
                    </div>
                    <div>
                        <span>【诊断】</span>
                        <span>胃寒、胃溃疡、月经不调、胃寒溃疡胃寒、胃溃疡月经不调、胃寒</span>
                    </div>
                    <div>
                        <span>【药方用量】</span>
                        <span>共7剂</span>
                    </div>
                </div>
            </div>
            <div class="tit">
                <span>*购药后即可查看药方</span>
                <span>共20味药</span>
            </div>
        </div>

        <!-- 药单支付相关信息 -->
        <div class="infolist">
            <div>
                <span>药方金额</span>
                <span>¥{{orderinfo.totalprice}}</span>
            </div>

            <!-- NEW优惠券 -->
            <!-- 未开始订单选择默认优惠券 -->
            <div class="sale" v-if="orderinfo.orderstate == 1 && couponSum" @click="goCoupon(orderinfo.orderstate)">
                <span><i>减</i><span>优惠券</span></span>
                <i class="el-icon-arrow-right"></i>
                <span class="state">-¥{{couponSum}}</span>
            </div>
            <!-- 已开始订单没有优惠券或者未开始订单不使用优惠券 -->
            <div class="sale" v-if="orderinfo.orderstate != 1 && orderinfo.saletype == 1 || orderinfo.orderstate == 1 && isSelect && couponSum == ''">
                <span><i>减</i><span>优惠券</span></span>
                <i class="el-icon-arrow-right" v-if="orderinfo.orderstate == 1" @click="goCoupon(orderinfo.orderstate)"></i>
                <span class="nosale" @click="goCoupon(orderinfo.orderstate)">暂无优惠</span>
            </div>
            <!-- 一开始优惠券有优惠券 -->
            <div class="sale" v-if="orderinfo.orderstate != 1 && orderinfo.saletype == 2">
                <span><i>减</i><span>优惠券</span></span>
                <span class="state">-¥{{orderinfo.saleprice}}</span>
            </div>

            <div>
                <span>运费</span>
                <span>¥0</span>
            </div>
            <span class="tit">平台推广期间免运费</span>
            <div v-if="orderinfo.paystate != 1">
                <span>实付款</span>
                <span class="state">¥{{orderinfo.actualprice}}</span>
            </div>
            <div>
                <span>订单号</span>
                <span>{{orderinfo.orderid}}</span>
            </div>
            <div>
                <span>下单时间</span>
                <span>{{resultBuyTime}}</span>
            </div>
            <div v-if="orderinfo.paystate != 1">
                <span>支付时间</span>
                <span>{{resultTime}}</span>
            </div>
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
                
            }
        },
        // 生命周期之挂载完成
        methods: {
           //获取订单详情
            getOrderDetails(){
                let params = {
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
                }


                this.$doRequest("/api/Inquiry/orderDetails", params, res=>{
                    this.doctor = res.doctor;//医生信息
                    this.patient = res.patient;//患者信息
                    this.orderinfo = res.orderprescriptioninfos[0];//订单信息（药方订单信息）
                    if (this.orderinfo.paystate == 1 && this.orderinfo.orderstate != 4) {
                        this.time(this.orderinfo.servicetime,this.orderinfo.buytime);
                    }
                    this.orderCode = this.orderinfo.orderid;//支付的时候用
                    this.resultBuyTime = common.timestampToTime(this.orderinfo.buytime)//下单时间
                    this.resultTime = common.timestampToTime(this.orderinfo.paytime);//支付时间

                    //非支付状态下收件人
                    if(this.orderinfo.paystate != 1){
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
                })
            },

        },
        //生命周期之创建完成
        created: function(){
            this.$isLogin(window.location.search.substr(1),this.init);
            document.title = '订单详情';
        },
    }
</script>

