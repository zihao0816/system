<template >
    <div class="wxQrcode">
        <div class="wxQrcode_header">
            <p>
                <img :src="'http://www.51bjhzy.com/'+list.headphoto" alt="">
            </p>
            <span>{{list.doctorname}}</span>
            <span>{{list.duties}} / {{list.hospitaname}}</span>
        </div> 
        <div class="wxQrcode_center" ref="imageWrapper" v-if="data.length<=0">
            <span>调理药方</span>
            <span>
                <img :src="list.qrcode" alt="" v-if="list.qrcode">
            </span>
            <b class="">长按识别二维码</b>
            <i><p>·</p>关注【 北京好中医 】公众号 </i>
            <i><p>·</p>即可购买调理药方, 送药到家</i>
        </div>
         <!--图片-->
        <div class="compositePic" v-else>
            <img :src="data" alt="" >
        </div> 
    </div>
</template>
<script>
import html2canvas from 'html2canvas'
export default {
    data(){
        return {
            data:"",
            list:{},
            id:this.$route.query.id,
            doctorid:this.$route.query.doctorid
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
        getWxcode(){
            let _this = this;
            this.$doRequest("/api/phoneinvitepatient/getbusinesscard",{parameters:this.doctorid,parametersone:this.id},res=>{
                _this.list=res;
                _this.getImg();
            })
        }
    },
    mounted(){
        document.title="调理药方"
        this.getWxcode();
    }

}
</script>
<style lang="less">
    .wxQrcode{
        height:100%;
        overflow: hidden;
        box-sizing: border-box;
        padding:30px 28px 0;
        background: linear-gradient(#FF9B71,#FF665D);
        .wxQrcode_header{
            width:100%;
            min-height: 0;
            overflow: hidden;
            text-align: center;
            margin-bottom:30px;
            p{
                height:64px;
                width:100%;
                text-align: center;
                margin-bottom:10px;
                img{
                    display: inline-block;
                    max-height:100%;
                    max-width:64px;
                    height:64px;
                    border-radius: 50%;
                }
            }
            span{
                 display: block;
                 
                 color:#FFF;
            }
            span:first-child{
               font-size: 20px;
               padding: 4px 0;
            }
            span:last-child{
                font-size: 12px;
            }
        }
        .wxQrcode_center{
            width:100%;
            overflow: hidden;
            min-height: 0;
            background: #FFF;
            border-radius: 24px;
            span{
                display: block;
                text-align: center;
                width:100%;
                img{
                    width:140px;
                    height:140px;
                    display: inline-block;
                    // background:red;
                }
            }
            span:first-child{
                font-size: 20px;
                padding:4px 0;
                margin:22px 0  30px;
                color:#141414;
                font-weight: bold;
            }
            b{
                display: block;
                font-weight: 100;
                width:100%;
                line-height: 40px;
                text-align: center;
                color:#FFF;
                background:#D74326;
                margin:26px 0 20px
            }
            i{
                display: block;
                width:100%;
                text-align: center;
                line-height: 20px;
                font-style: normal;
                margin-bottom:10px;
                font-size: 14px;
                color:#6B6B6B;
                p{
                    display: inline;
                    margin-right:10px;
                    color:#FF6666;
                }
            }
            i:last-child{
                margin-bottom:20px;
            }
        }
        .compositePic{
            width:100%;
            background:#FFF;
            border-radius: 24px;
            overflow: hidden;
            height:auto;
            img{
                width:100%;
                height:auto;
                display: block;
                // background:red;
            }
        }
    }
</style>
