<template>
    <div class="myregistereddetails">
        <div class="page">
            <div class="top clearfix">
                <img src="../../assets/my/fkcg_icon@3x.png" alt="">
                <span>付款成功</span>
                <span>￥{{details.consumption}}</span>
            </div>
            <p class="name"><span>患者姓名：</span><span>{{details.patientname}}</span><span>{{details.patientsex == '1' ? '男' : '女'}}</span><span v-show="details.patientage">{{details.patientage}}</span></p>
            <div class="registered">
                <div class="num">
                    <p>{{details.numberorder}}</p>
                    <span>就诊序号</span>
                </div>
                <p><span>预约医生：</span><span>{{details.doctorname}}</span></p>
                <p><span>诊疗机构：</span><span>{{details.outpatientname}}</span></p>
                <p><span>挂号费用：</span><span>{{details.consumption}}元</span></p>
                <p><span>挂号时间：</span><span>{{details.createtime}}</span></p>
            </div>
            <div class="order">
                <p><span>订单编号：</span><span>{{details.id}}</span></p>
                <p><span>支付方式：</span><span>{{details.paymentmethod == '1' ? '微信支付' : '会员支付'}}</span></p>
                <p><span>支付时间：</span><span>{{details.paymenttimes}}</span></p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            details: this.$route.query.data
        }
    },
    created(){
       
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
