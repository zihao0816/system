<template>
    <div class='case'>
        <div class='headBg'>
            <div class='name'>
                <div class='border'>
                   <img :src="doclist.doctorFace" alt="" class='docHead'>
                </div>
                <div>
                   <span class='docName'>{{doclist.doctorName}}</span>
                   <img  src="../../assets/buy/yirenzhen.png" alt="" class='attest'>
                </div>
                <div>
                   <span class='mainDoc'>{{doclist.duties}}</span>
                   <span class='place'>{{doclist.hospitaname}}</span>
                </div>
            </div>
        </div>
        <div class='sickPersonInfo'>
            <div class='sickCon'>【<span>患者信息</span>】</div>
            <div class='sickInfo'>
                <span>{{patlist.patientname}}</span>
                <span>{{patlist.sex == 1?"男":"女"}}</span>
                <span>{{patlist.age}}</span>
            </div>
        </div>
        <div class='weightInfo'>
            <div class='height'>
                <span>身高</span>
                <span>{{patlist.height}}cm</span>
            </div>
            <div class='weight'>
                <span>体重</span>
                <span>{{patlist.weight}}kg</span>
            </div>
            <div class='disease'>
                <span>病症自述</span>
                <div class='diseaseCon'>
                    {{ordermaintellinfo.symptom}}
                </div>
            </div>
            <div class='before'>
                <span>既往病史</span>
                <div class='beforeCon'>{{ordermaintellinfo.pastcase}}</div>
            </div>
            <div class='allergy'>
                <span>过敏史</span>
                <div class='allergyCon'>{{ordermaintellinfo.allergichistory}}</div>
            </div>
        </div>
        <div v-for="(item,index) in orderprescriptioninfos" :key="index" >
            <div class="title"  v-if="orderprescriptioninfos.length >= 2">病例{{index+1}}</div>
        <div class='doctorDialectical'>
            <span>医生辨证</span>
            <div class='doctorCon'>
                {{item.doctorconclusion}}
            </div>
        </div>
        <div class='pharmacy'>
            <div class='place'>
                <span>药房</span>
                <span>{{item.hospitaName}}</span>
            </div>
            <div class='medicineState'>
                <span>药态</span>
                <span>{{item.prescriptionshape}}</span>
            </div>
        </div>
        <div class='medicine'>
            <p>R:</p>
            <span>{{item.medicinalDetails}}</span>
            
        </div>

            <div class='medicalInformation'>
                <span>用药说明</span>
                <div class='information'>
                    <span>共<em>{{item.totaldosage}}</em>剂</span>,
                    <span>每日<em>{{item.daydosage}}</em>剂</span>,
                    <span>每集分<em>{{item.taketime}}</em>次服用</span>
                </div>
                <span>医嘱</span>
                <div class='doctorAdvice'>
                    {{item.specialadvice}}
                </div>
                <span>用药禁忌</span>
                <div class='medCon'>
                {{item.taboo}}
                </div>
            </div>
            <!-- <div class='distribution'>
                <span>配送信息</span>
                <div>
                    <span>收货人：{{item.address.split("$")[1]}}</span>
                    <span>{{item.telephone}}</span>
                </div>
                <div>
                    <span>收货地址:</span>
                    <span>{{item.address.split("$")[0]}}</span>
                </div>
                <div>
                    <span>配送方式:</span>
                    <span>顺丰快递 </span>
                </div>
            </div> -->
            <!-- 这个页面上边已经调差不多，就剩配送信息，已有实在难调，所以自己重新布了局，再稍作调整，上边是新布局，下边是旧版，样式错乱-->
            
            <div class='distribution'>
                <span>配送信息</span>
                <div class='people'>
                    收货人:<div class='all'><span>{{item.address.split("$")[1]}}</span><span class='number'>{{item.telephone}}</span></div>
                </div>
                <div class='address'>
                    <span>收货地址:</span>
                    <div class='con'>{{item.address.split("$")[0]}}</div>
                </div>
                <div class='way'>
                    配送方式:<div class='ways'><span>顺丰快递</span></div>
                </div>
            </div>
           
            <div class='allPrice'>
                <div class='prices'>
                    <span>药方总价</span>
                    <span>￥<em>{{item.totalprice}}</em></span>
                </div>
                <div class='discounts'>
                    <!-- <img src="../../assets/" alt=""> -->
                    <span>优惠券</span>
                    <span>-￥<em>{{item.saleprice}}</em></span>
                </div>
                <div class='money'>
                    <span>运费</span>
                    <span>-￥<em>0</em></span>
                </div>
                <div class='nomoney'><p>平台推广期间免运费</p></div>
                <div class='havemoney'>
                    <span>实付款</span>
                    <span>￥<em>{{item.actualprice}}</em></span>
                </div>
                <div class='orderNumber'>
                    <span>订单号</span>
                    <span>{{item.trackingnumber}}</span>
                </div>
                <div class='downOrder'>
                    <span>下单时间</span>
                    <span>{{new Date(item.buytime).toLocaleString()}}</span>
                </div>
                <div class='payment'>
                    <span>支付时间</span>
                    <span>{{new Date(item.paytime).toLocaleString()}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import times from "../../../src/api/common.js"
export default {
    data(){
        return {
            docid:"",
            item:{},
            datalist:"",
            skillname:[],
            counts:"",
            doclist:{},
            patlist:{},
            ordermaintellinfo:{},
            orderprescriptioninfos:{},
        }
    },
    methods:{
        
        query(){
            var _this  = this;
            this.$doRequest(
                        "/api/Inquiry/orderDetails",{
                            getOrder:1,
                            // orderID:this.docid,
                            orderID:this.$route.query.id,
                            getDoctor:1,
                            getPatient:1,
                            isaction:1,
                            isInterrogationsingle:1,
                            getPrescriptionOrder:1,
                            }
                    ,res => {
                        this.doclist = res.doctor;   
                        this.patlist.patientname = res.patient.patientname;
                        this.patlist.age = res.ordermaintellinfo.age;
                        this.patlist.sex = res.patient.sex;
                        this.patlist.height = res.ordermaintellinfo.height;
                        this.patlist.weight = res.ordermaintellinfo.weight;
                        this.ordermaintellinfo = res.ordermaintellinfo;
                        this.orderprescriptioninfos = res.orderprescriptioninfos;
                    }); 
        }
    },
    //生命周期之挂载完成
    mounted: function() {
       
    },
    //生命周期之创建完成
    created: function() {
        this.$isLogin(window.location.search.substr(1), this.query);
        
    },
    //生命周期之更新
    updated: function () {
        
    },
    //生命周期之销毁
    destroyed: function () {
        
    }
}
</script>
<style lang="less">
    @import "index.less";
</style>

