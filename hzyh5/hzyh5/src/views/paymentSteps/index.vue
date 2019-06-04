<template>
    <div>
        <div class="paySteps">
            <div class="payTops" > 
                <img src="../../assets/paysteps2@3x.png"/>
            </div>
            <div class="PicContent" >
                <div class="qrCode" ref="imageWrapper" v-if="data.length<=0">
                  <p>
                      <img src="../../assets/qdt@3x.png" alt="">
                  </p>
                  <p id="qrcode">
                      <img  :src="picData.qrcodebase64"/>
                  </p>
                  <p>
                      <!-- 001YvRd30bgkaJ1Oydc30VsHd30YvRdF -->
                      处方二维码
                  </p>
                  <p>开方医生  {{' '+ picData.doctorname}}</p>  
                </div>
                <div class="compositePic" v-else>
                    <img :src="data" alt="">
                </div>
                <p class="qrCodeTimes">[ 二维码有效期30天 ]</p>
            </div>
            
            <div class="payTops" >
               <img src="../../assets/paidssss3@3x.png" /> 
            </div>
        </div>
    </div>
</template>
<script>

import {qrcanvas} from "qrcanvas"
import html2canvas from 'html2canvas'
import { setTimeout } from 'timers';
export default {
    data(){
        return {
            data:'',
            picData:'',
            numRandom:this.$route.query.random
        }
    },
    methods:{
       getImg(){
           let _this=this;
           html2canvas(this.$refs.imageWrapper,{
               backgroundColor: null
           }).then((canvas)=>{
                let dataURL = canvas.toDataURL("image/png");
                _this.data = dataURL;
           })
       },
       getQrcode(){
            let that=this;
            let qrCodeImg= document.getElementById('qrcodeimg');
            let sessionId= this.$store.state.userInfo.sessionId;
            this.$store.state.userInfo.sessionId='';
            this.$store.state.userInfo.sessionId='haozhongyi';
            this.$doRequest('/api/photoprescribing/qrcodeinfo',{ "parameters":this.numRandom},res=>{
                that.picData=res.parameters;
                that.getImg();
                that.$store.state.userInfo.sessionId=sessionId;
            })
       }
    },
    created(){
        document.title="支付步骤";
    },
    mounted(){
        this.getQrcode();
        
    }
}
</script>
<style lang='less'>
    @import "index.less";
</style>


