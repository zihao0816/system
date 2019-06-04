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
                        <img :src="orderInfo.patient.headimgurl">
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
                        <img :src="orderInfo.doctor.headimgurl">
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
                        <div class="medicinalMaterials" v-if="index == i && isShow">
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
                        <div class="toggle">
                            <span class="cancel" v-if="item.orderStep == '未支付'" @click="cancel(item.id)">取消订单</span>
                            <span class="toggle" @click="spread(i)">{{index == i && isShow?'收起':'展开'}}</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        <!-- 取消订单 -->
        <el-dialog
        title="提示"
        :visible.sync="cancelVisible"
        width="20%"
        center>
        <span>确定取消该订单吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelVisible = false">取 消</el-button>
            <el-button type="primary" @click="cancelOrder()">确 定</el-button>
        </span>
        </el-dialog>

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
            orderInfo: {},
            cancelVisible: false,
            orderId: '',
        }
    },
    methods:{
        //展开or关闭
        spread(i){
            this.index = i;
            if(this.isShow){
                this.isShow = false;
            }else{
                this.isShow = true;
            }
        },
        // 获取订单详情
        getOrderInfo(){
                let params = {
                    parameter: this.id
                }
                let _this = this;
                this.$doRequest('/api/order/prescribe/info', params,function(res){
                    res.parameters.orderPrescriptionVos.forEach(item => {
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
                });
        },
        // 取消弹窗
        cancel(id){
            this.orderId = id;
            this.cancelVisible = true;
        },
        // 取消请求
        cancelOrder(){
            let params = {
                id: this.orderId,
                orderstate: '4'
            }
            let _this = this;
            this.$doRequest('api/orderprescriptioninfo/cancelorder', params,function(res){
                _this.$message({
                    message: '处方订单取消成功',
                    type: 'success'
                });
                _this.cancelVisible = false;
                _this.getOrderInfo();
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
