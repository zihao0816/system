<template>
    <div class="therapyDetails">
        <div class="page">
            <div class="nav">
                <navigation></navigation>
                <span @click="goBack">返回</span>
            </div>
            <div class="content">
                <main>
                    <div class="orderList">
                        <div class="orderinfo">
                            <span>理疗单号：{{orderInfo.orderid}}</span>
                            <span>下单时间：{{orderInfo.createtime}}</span>
                            <span>{{orderInfo.paystatus}}</span>
                        </div>
                        <div class="medicinalMaterials">
                            <div>
                                <p>费用：<span>¥ {{orderInfo.consumption}}</span></p>
                                <p>实付款：
                                    <span>¥ {{orderInfo.paystatus == '未支付'?'0': orderInfo.consumption}}</span>
                                </p>
                                <p>支付时间：<span>{{orderInfo.paydatetime}}</span></p>
                                <p>支付方式：<span>{{orderInfo.paymentmethod}}</span></p>
                            </div>
                            <div>
                                <p>问诊患者：<span>{{orderInfo.patienname}}</span></p>
                                <p>性别：<span>{{orderInfo.patiensex}}</span></p>
                                <p>年龄：<span>{{orderInfo.patienage}}</span></p>
                                <p>手机号：<span>{{orderInfo.patientel}}</span></p>
                            </div>
                        </div>
                        <div class="orderprescription">
                            <div>
                                <p>理疗服务：<span>{{orderInfo.phynames}}</span></p>
                                <p>理疗周期：<span>{{orderInfo.cycle}}</span></p>
                                <p>理疗次数：<span>{{orderInfo.times}}</span></p>
                                <p>创建人：<span>{{orderInfo.accountname}}</span></p>
                            </div>
                        </div>
                        <div class="medicinalMaterials">
                            <div>
                                <p>交易流水号：<span>{{orderInfo.payno}}</span></p>
                                <p>交易时间：<span>{{orderInfo.paydatetime}}</span></p>
                                <p>交易渠道：<span>{{orderInfo.paymentmethod}}</span></p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>
<script>
import navigation from '../../components/common/navigation'
import common from '../../api/common';
export default {
    components: {
        navigation,
    },
    data(){
        return {
            id: this.$route.query.id,
            orderInfo: {}
        }
    },
    methods:{
       getOrderInfo(){
            let params = {
                parameter: this.id
            }
            let _this = this;
            this.$doRequest('api/order/physiotherapy/info', params,function(res){
                _this.orderInfo = res.parameters;
            });
       },
       goBack(){
           this.$router.go(-1);
       }
    },
    created(){
        this.getOrderInfo();
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
