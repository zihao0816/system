<template>
    <div class="printing">
        <div class="state">
            <span class="isshow" v-if="state == 2">密</span>
            <span class="isstate">{{type == 1?'患者联':'医生联'}}</span>
        </div>
        <div class="patient">
            <div style="padding:10px 0;">
                <div class="left">
                    <span><strong>供应商：{{orderDetail.brand}}</strong></span>
                    <span><strong>剂型：{{orderDetail.prescriptionshape}}（共{{total}}味）  {{orderDetail.generationfry == 2?'代煎':''}}</strong></span>
                </div>
                <div class="right">
                    <span><strong>北京好中医处方笺</strong></span>
                    <span><strong>客服电话：400-666-0101</strong></span>
                </div>
            </div>
            <div>
                <span><strong>开方时间：</strong>{{buytime}}</span>
                <span><strong>订单编号：</strong>{{orderDetail.orderid}}</span>
            </div>
            <div>
                <span><strong>患者：</strong>{{orderDetail.hispatientname}}</span>
                <span><strong>性别：</strong>{{orderDetail.hissex == 1?'男':'女'}}</span>
                <span><strong>年龄：</strong>{{orderDetail.hisage}}</span>
            </div>
            <div>
                <span><strong>诊断：</strong>{{orderDetail.doctorconclusion}}{{orderDetail.doctorconclusion?'，':''}}{{orderDetail.arguedisease}}</span>
            </div>
            <div style="padding:10px 0;">
                <span>
                    <strong>邮寄信息：</strong>
                    <span v-if="orderDetail.sendtype == '1'">{{addressee}}  {{orderDetail.telephone}}  {{address}}</span>
                    <span v-else>自取</span>
                </span>
            </div>
        </div>
        <div class="drugs">
            <h3>R:</h3>
            <span class="drugsShowIcon" v-if="state == 2&&type == 2"></span>
            <div class="drugsList">
                <span v-for="(item,i) in drugsList" :key="i">
                    <span><strong>{{item.medicinename}}</strong></span>
                    <span>{{item.dosage}}{{item.medicineunit}} {{item.decoctionname?'(':''}} {{item.decoctionname}} {{item.decoctionname?')':''}}</span>
                </span>
            </div>
            <div class="secrecy" v-if="state == 2&&type == 1">
                <p>保密处方，处方内容不可见，如有用药疑问，请咨询医生。</p>
            </div>
            <div class="explain">
                <span><span>用药说明：</span>共{{parseInt(orderDetail.totaldosage)}}剂，每日{{parseInt(orderDetail.daydosage)}}剂，每剂分{{parseInt(orderDetail.taketime)}}次服用</span>
                <span><span>医嘱：</span>{{orderDetail.specialadvice}} </span>
                <span>医生签名：{{orderDetail.hisdoctorname}}</span>
            </div>
        </div>
        <div class="footer">
            <div>
                <span>审方：</span>
                <span>打印时间：<span>{{time}}</span></span>
                <span>发药：</span>
            </div>
            <div>
                <span>温馨提示：</span>
                <span>1、请遵医嘱用药 2、因各药房药名录入规则不同，同一种药在纸质处方与电子处方中的药名显示可能不同 3、请将药品放置于阴凉干燥处保存 4、本药方3日内有效</span>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from '../../api/common';
    export default {
        data() {
            return {
                id: this.$route.query.id,
                type: this.$route.query.type,
                orderDetail: {},
                drugsList: [],
                total: 0,
                state: 0,
                addressee: '',
                address: '',
                time: '',
                buytime: '',
            }
        },
        //生命周期之挂载完成
        methods: {
            getorderprescriptioninfokf(){
                let params = {
                    parameters: this.id
                }
                this.$doRequest("api/orderprescriptioninfo/getorderprescriptioninfokf", params,res => {
                    this.orderDetail = res;
                    this.drugsList = this.orderDetail.medicinalMaterials;
                    this.total = this.orderDetail.medicinalMaterials.length;
                    this.state = this.orderDetail.state;
                    let eq = this.orderDetail.address.indexOf('$');
                    if(this.orderDetail.sendtype != '2'){
                        this.addressee = this.orderDetail.address.substring(eq+1,this.orderDetail.address.length);
                        this.address = this.orderDetail.address.substring(0,eq);
                    }
                    this.buytime = common.timestampToTime(this.orderDetail.buytime,2);
                });
            },
            getNow(s) {
                return s < 10 ? '0' + s: s;
            },
            getDate(){
                var myDate = new Date();
                var year=myDate.getFullYear();
                var month=myDate.getMonth()+1;
                var date=myDate.getDate(); 
                var h=myDate.getHours();       
                var m=myDate.getMinutes();
                var s=myDate.getSeconds();  
                this.time = year+'.'+this.getNow(month)+"."+this.getNow(date)+" "+this.getNow(h)+':'+this.getNow(m)+":"+this.getNow(s);
            }
        },
        //生命周期之创建完成
        created: function(){
            let session = JSON.parse(sessionStorage.getItem('userInfo'));
            this.createby = session.id;
            this.getorderprescriptioninfokf();
            this.getDate();
        },
    }
</script>

