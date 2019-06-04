<template>
    <div class="consultDetails">
        <div class="page">
            <div class="nav">
                <navigation></navigation>
                <span @click="goBack">返回</span>
            </div>
            <div class="content">
                <header>
                    <div>
                        <img v-if="orderInfo.patient.headimgurl != undefined || orderInfo.patient.headimgurl" :src="orderInfo.patient.headimgurl">
                        <img v-else src="../../assets/img/wxtx_tx@3x.png" />
                        <div>
                            <h3>{{orderInfo.patient.name}}</h3>
                            <span>{{orderInfo.patient.age}} {{orderInfo.patient.sex}}</span>
                            <span>{{orderInfo.patient.telephone}}</span>
                        </div>
                        <div>
                            <span>¥ {{orderInfo.patient.payment}}</span>
                            <span>患者总付款</span>
                        </div>
                    </div>
                    <div>
                        <img v-if="orderInfo.doctor.headimgurl != undefined || orderInfo.doctor.headimgurl" :src="orderInfo.doctor.headimgurl">
                        <img v-else src="../../assets/img/wxtx_tx@3x.png">
                        <div>
                            <h3>{{orderInfo.doctor.name}}</h3>
                            <span>{{orderInfo.doctor.grade}}</span>
                            <span>{{orderInfo.doctor.origin}}</span>
                        </div>
                        <div>
                            <span>¥ {{orderInfo.doctor.income}}</span>
                            <span>医生总收益</span>
                        </div>
                    </div>
                    <!-- 问诊无机构信息 -->
                    <!-- <div>
                        <img src="../../assets/img/wxtx_tx@3x.png">
                        <div>
                            <span>¥ {{orderInfo.doctor.income}}</span>
                            <span>机构总收益</span>
                            <span>机构：未设置</span>
                        </div>
                    </div> -->
                    <div>
                        <img src="../../assets/img/icon_bjhzy@3x.png">
                        <div>
                            <span>¥ {{orderInfo.company.income}}</span>
                            <span>平台总收益</span>
                            <span>平台：{{orderInfo.company.name}}</span>
                        </div>
                    </div>
                </header>
                <main>
                    <div class="orderList" v-for="(item,i) in orderInfo.orderPrescriptionVos" :key="i">
                        <div class="orderinfo">
                            <span>处方单号：{{item.orderid}}</span>
                            <span>下单时间：{{item.buytime}}</span>
                            <span v-if="item.orderStep == '未支付'" style="color:#D74326">{{item.orderStep}}</span>
                            <span v-if="item.orderStep == '已支付待发货'" style="color:#60A8FC">{{item.orderStep}}</span>
                            <span v-if="item.orderStep == '已发货'">{{item.orderStep}}</span>
                            <span v-if="item.orderStep == '订单已经取消'">已取消</span>
                        </div>
                        <div class="orderprescription">
                            <div>
                                <p>药品费用：<span>¥ {{item.totalCosts || 0}}</span></p>
                                <p>诊后服务费：<span>¥ {{item.postTreatmentServiceFee || 0}}</span></p>
                                <p>代煎费：<span>¥ {{item.decoctfee || 0}}</span></p>
                                <p>运   费：<span>¥ {{item.transportfee || 0}}</span></p>
                                <p>优惠券：<span>¥ {{item.saleprice || 0}}</span></p>
                                <p>应付款：<span>¥ {{item.totalprice || 0}}</span></p>
                                <p>实付款：<span>¥ {{item.actualprice || 0}}</span></p>
                                <p>支付方式：<span>{{item.paytype}}</span></p>
                                <p>支付时间：<span>{{item.paytime}}</span></p>
                            </div>
                            <div>
                                <p>收货人：<span>{{item.receiver}}</span></p>
                                <p>联系方式：<span>{{item.contactWay}}</span></p>
                                <p>收货地址：<span>{{item.sendtype == 1 && (item.orderStep == '已支付待发货' || item.orderStep == '已发货')?item.deliveryAddress:''}}</span></p>
                            </div>
                            <div>
                                <p>药   房：<span>{{item.drugstore}}</span></p>
                                <p>剂   型：<span>{{item.dosageForms}}</span></p>
                                <p>品   牌：<span>{{item.brand}}</span></p>
                            </div>
                        </div>
                        <div class="medicinalMaterials" v-if="item.isShow">
                            <h3>R:</h3>
                            <div>
                                <p v-for="(durg,i) in item.r" :key="i">{{durg.name}}<span>{{durg.amount}} {{durg.unit}} <span v-if="durg.decoctingExplain">（{{durg.decoctingExplain}}）</span></span></p>
                            </div>
                            <div>
                                <p>用药说明：<span>{{item.medicationInstructions}}</span></p>
                                <p>用药禁忌：<span>{{item.contraindication}}</span></p>
                                <p>服药时间：<span>{{item.medicationtime}}</span></p>
                                <p>特殊医嘱：<span>{{item.specialadvice}}</span></p>
                                <p v-if="item.isDecocting == 1">饮片代煎：<span>不代煎</span></p>
                                <p v-if="item.isDecocting == 2">饮片代煎：<span>代煎</span></p>
                                <p v-if="item.isDecocting == 3">饮片代煎：<span>代煎，饮片都可选择</span></p>
                            </div>
                            <div>
                                <p>交易流水号：<span>{{item.transactionId}}</span></p>
                                <p>交易时间：<span>{{item.transactionTime}}</span></p>
                                <p>交易渠道：<span>{{item.transactionWay}}</span></p>
                            </div>
                            <div>
                                <p>配送单号：<span>{{item.deliveryId}}</span></p>
                                <p>配送方式：<span>{{item.deliveryWay}}</span></p>
                                <p>配送公司：<span>{{item.deliveryCompan}}</span></p>
                                <p>配送状态：<span>{{item.deliveryStatus}}</span></p>
                                <p>配送时间：<span>{{item.deliveryTime}}</span></p>
                                <p>送达时间：<span>{{item.deliveryReachTime}}</span></p>
                            </div>
                        </div>
                        <div class="toggle" @click="spread(i,item.isShow)">
                            <span class="toggle">{{item.isShow?'收起':'展开'}}</span>
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
            index: '',
            isShow: false,
            toggle: '展开',
            _orderInfo: {},
            get orderInfo() {
                return this._orderInfo;
            },
            set orderInfo(value) {
                this._orderInfo=value;
            },
            receiver: '',//收货人
            deliveryAddress: '',//收货地址
        }
    },
    methods:{
       spread(i,isShow){
            if(isShow){
                this.orderInfo.orderPrescriptionVos[i].isShow = false;
            }else{
                this.orderInfo.orderPrescriptionVos[i].isShow = true;
            }
       },
       getOrderInfo(){
            let params = {
                id: this.id
            }
            let _this = this;
            this.$doRequest('/api/diagnosisqueue/getdetails', params,function(res){
                // 处理收货地址和收货人
                res.parameters.orderPrescriptionVos.forEach(item => {
                    item.isShow = false;
                    if(item.deliveryAddress && item.sendtype == 1){
                        let eq = item.deliveryAddress.indexOf('$');
                        item.receiver = item.deliveryAddress.substring(eq+1,item.deliveryAddress.length);
                        item.deliveryAddress = item.deliveryAddress.substring(0,eq);
                    }else{
                        item.receiver = res.parameters.patient.name;
                        item.deliveryAddress = '';
                    }
                });
                _this.orderInfo = res.parameters;
                console.log(res)
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
