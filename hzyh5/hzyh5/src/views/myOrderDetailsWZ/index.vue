<template>
    <div class="myOrderDetailsWZ">
        <!-- 未支付 -->
        <!-- <div class="header unfinished" v-if="orderinfo.paystate == 1 && orderinfo.orderstate != 4">
            <i></i>
            <span>等待支付</span>
            <span>剩{{lasttime}}时{{hours}}分{{minutes}}秒自动取消</span>
        </div> -->
        <!-- 已完成 -->
        <div class="header over" v-if="orderinfo.paystate == 2">
            <i></i>
            <span>支付已完成</span>
        </div>
        <!-- 已取消 -->
        <div class="header cancel" v-if="orderinfo.orderstate ==  4">
            <i></i>
            <span>已取消</span>
        </div>

        <div class="doctor">
            <h2>医生信息</h2>
            <div>
                <img :src="doctor.doctorFace">
                <div>
                    <span>{{doctor.doctorName}}</span>
                    <span>{{doctor.duties}}  {{doctor.hospitaname}}</span>
                </div>
            </div>
        </div>

        <div class="infolist" v-if="orderType != 2">
            <div>
                <span>问诊金额</span>
                <span>¥{{orderinfo.actualprice}}</span>
            </div>
            <div v-if="orderinfo.saletype == 2">
                <span><i>减</i><span>优惠券</span></span><!--支付的时候如果有优惠券，不可再选优惠券-->
                <span class="state">-¥{{orderinfo.saleprice}}</span>
            </div>
            <div v-if="orderinfo.saletype == 1">
                <span><i>减</i><span>优惠券</span></span><!--支付的时候如果有优惠券，不可再选优惠券-->
                <span class="gray">暂无优惠</span>
            </div>
            <div>
                <span>实付款</span>
                <span class="state">¥{{orderinfo.actualprice}}</span>
            </div>
            <div>
                <span>订单号</span>
                <span>{{orderinfo.ordercode}}</span>
            </div>
            <div>
                <span>下单时间</span>
                <span>{{orderinfo.buytime}}</span>
            </div>
            <div v-if="orderinfo.paystate == 2">
                <span>支付时间</span>
                <span>{{orderinfo.paytime}}</span>
            </div>
        </div>
        
        <div class="pay" v-if="orderinfo.paystate == 1 && orderinfo.orderstate != 4">
            <div class="service">
                <a href="tel:400-666-0101">
                <i></i>
                <span>客服</span>
                </a>
            </div>
            <div class="payInfo">
                <span>实付：</span>
                <span class="state">¥270.10<span>元</span></span>
            </div>
            <button class="paySubmit">立即支付</button>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from '../../api/common'
    export default {
        data() {
            return {
                orederId: this.$route.query.id,
                orderType: this.$route.query.type,
                state: '',
                service: '',
                doctor: {},//医生信息
                patient: {},//患者信息
                orderinfo: {},//问诊订单信息
            }
        },
        // 生命周期之挂载完成
        methods: {
            //获取订单详情
            getOrderDetails(){
                let params = {
                    /*是否获取问诊订单详情信息 1 获取2 不获取*/
                    getOrder: '1',
                    /*订单id*/
                    orderID: this.orederId,
                    /*是否获取医生详情信息 1 获取2 不获取*/
                    getDoctor: '1',
                    /*是否获取问诊单  1 获取2 不获取*/
                    isInterrogationsingle: '1',
                    /*问诊单   1只获取选择的答案2只获取不选择的答案 不传获取全部 */
                    ischecked: '1',
                }
                
                this.$doRequest("/api/Inquiry/orderDetails", params, res=>{
                    this.doctor = res.doctor;//医生信息
                    this.patient = res.patient;//患者信息
                    this.orderinfo = res.orderinfo;//订单信息
                    this.orderinfo.buytime = common.timestampToTime(this.orderinfo.buytime,2);
                    this.orderinfo.paytime = common.timestampToTime(this.orderinfo.paytime,2);
                })
            }
        },
        //生命周期之创建完成
        created: function(){
            this.$isLogin(window.location.search.substr(1), this.getOrderDetails);
            document.title = '订单详情';
        },
    }
</script>

