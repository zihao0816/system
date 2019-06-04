<template>
    <div>
        <div class="headers"> 
            <el-dialog title="理疗核销" center  :visible="dialogpaycancle"  @update:visible="v=>$emit('update:dialogpaycancle',v)" width="40%">               
                <div class="pay">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#07A591">
                        <el-menu-item index="1" @click="istrue=true">会员支付</el-menu-item>
                        <el-menu-item index="2" @click="paycodes">二维码付款</el-menu-item>
                    </el-menu>
                </div>
                <!-- 核销 -->
                <div v-if="istrue" class="paycancless">
                    <ul>
                        <li>手机号:<span>{{paycancles.patientel}}</span> </li>
                        <li>会员状态:<span>{{memberstate==1?"已开通":"未开通"}}</span></li>
                        <li>会员卡余额:<span>{{accountbalance}}元</span></li>
                        <li>待支付费用:<span>{{paycancles.consumption}}元</span></li> 
                    </ul>
                </div>
    <!-- 二维码支付分页-->
        <div v-if="!istrue">
            <!-- 扫码 -->
            <div class="sweepCode" v-if="ispay">
               <img :src="srcs" alt="">
               <div>
                    <p>请患者微信扫码付款！</p>
               </div>
            </div>
            <!-- 支付成功 -->
             <div class="paySuccess" v-if="!ispay"> 
                <p>问诊处方订单支付成功！</p>
                <p>患者可在公众号内查看扣费详情！</p>
                <p>交易流水号:<span></span></p>
                <p>支付微信ID:<span></span></p>
                <p>问诊处方号:<span></span></p>
            </div>
        </div>
             <div slot="footer" class="dialog-footer"> 
                <el-button @click="$emit('update:dialogpaycancle',false)" >返 回</el-button>
                <el-button type="primary" @click="getpaycancle" v-if="istrue">确认支付</el-button>
            </div> 
            </el-dialog> 
        </div>
    </div>
</template>
<script>

export default {
    props:["dialogpaycancle","paycancles","accountbalance","getpage","memberstate"],
     data() {
        return {
            labelPosition:'right',
            istrue:true,//是否是会员支付
            send:"",//是否自己取
            isShow:true,//余额是否充足
            ispay:true,
            activeIndex:"1",
            srcs:""
        }
     },
     methods:{
         getpaycancle(){
            let _this=this;
            var obj={
                id:this.paycancles.id,
                consumption:this.paycancles.consumption,
                physiotherapistid:this.paycancles.physiotherapistid,
                physiotherapistname:this.paycancles.physiotherapistname,
                patientid:this.paycancles.patientid,
                clinicid:this.paycancles.clinicid
            };
            if(this.accountbalance/1>=this.paycancles.consumption/1){
                this.$doRequest("api/physiotherapysheet/cancellationPhysiotherapyOrders",obj,res=>{
                _this.$emit('update:dialogpaycancle',false);
                _this.getpage();
                })
            }else{
                _this.$message({
                    message: '你的余额不足',
                    type: 'error'
                });
            }
         },
         paycodes(){
            let _this=this;
            this.istrue=false;
            var obj={
                id:this.paycancles.id,
                consumption:this.paycancles.consumption,
                physiotherapistid:this.paycancles.physiotherapistid,
                physiotherapistname:this.paycancles.physiotherapistname,
                patientid:this.paycancles.patientid,
                clinicid:this.paycancles.clinicid
            }
            this.$doRequest("/api/physiotherapysheet/paymentPrescriptions",obj,res=>{
                _this.srcs="https://service.51bjhzy.com/api/StaticFile/orderqr/"+res.message;
                   
            },res=>{
                if(res.message="该订单已支付"){
                    _this.$message({
                        message: "该订单已支付",
                        type: 'success' 
                    });
                }
            })
         },
     } 
}
</script>
 
<style lang="less">

.headers{
     /deep/.el-button--primary{
        border-color: #07A591;
        background-color: #07A591;
    }
    /deep/.el-button{
        width:98px;
    }
    /deep/.el-button{
        border-color: #07A591;
        color:#07A591;
    }
    /deep/.el-button:nth-of-type(2){
        color:#fff;
    }
    li{
        list-style: none;
    }
    .el-button--primary{
        margin-left:100px;
    }
    .el-dialog__header{
        padding: 0;
        width:100%;
        line-height:62px;
        background-color: rgba(241, 240, 245, 1);
        .el-dialog__headerbtn{
            top:0px;
        }
    }
    .pay{
        width:100%;
        height:30px;
        margin-bottom:40px;
        ul{
            width:100%;
            li{
                float:left;
                margin:0 50px;
            }
        }
    }
    .el-input{
        width:70%;
    }
    .paycancless{
        width:100%;
        height:120px;
        padding-top:30px;
        font-size: 16px;
        li{
            float:left;
            width:50%;
            text-indent: 40px;
            margin-bottom:24px;
        }
        .addDetail{
           width:100%;
           text-indent: 40px;
           input{
               margin-left:8px;
                width:66%;
                outline: none;
           }  
        }
    }
    .sweepCode{
        width:500px;
        height: 200px;
        img{
            float:left;
            width:200px;
            height:200px;
        }
        div{
            float:left;
            height: 30px;
            width:260px;
            margin-left:20px;
            padding-top:70px
        }
        p{
           margin-bottom: 10px;

        }
    }
    .paySuccess{
        width:500px;
        p{
            text-indent:120px;
            margin-bottom:6px;
        }
    }
}

</style>
