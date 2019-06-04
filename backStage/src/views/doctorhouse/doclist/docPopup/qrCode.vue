<template>
    <div class="qrcode">
        <el-dialog title="二维码信息" center  :visible="docqrcodedialog"  @update:visible="v=>$emit('update:docqrcodedialog',v)" width="750px">
            <div class="main">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#07A591" >
                    <el-menu-item index="1" @click="isShow=1"><a href="javascript:;">APP二维码</a></el-menu-item>
                    <el-menu-item index="2" @click="getpages(2)"><a href="javascript:;">门诊二维码</a></el-menu-item>
                    <el-menu-item index="3" @click="getpages(3)"><a href="javascript:;">机构二维码</a></el-menu-item>
                </el-menu>
                <div class="appCode">
                    <div class="appCode_left" v-if="isShow==1">
                        <p >
                            <img  :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+codeslist.qrbigurl" alt=""/>
                        </p>
                        <p >
                            <span class="texts">医生姓名:{{codeslist.doctorname}}</span>
                            <span class="texts">注册手机:{{codeslist.telephone}}</span>
                            <!-- <i class="advice">
                                <切换后，患者扫码将直接与微信客服沟通，医生无法获取患者咨询 -->
                            <!-- </i>  -->
                            <b>
                                <el-checkbox v-model="checked" style="clear:both;" @change="qrCode">切换客服微信支持
                                    <el-tooltip  placement="top" effect='light'>
                                        <div slot="content">切换后，患者扫码将直接与微信<br/>客服沟通，医生无法获取患者咨询</div>
                                        <i class="el-icon-info"></i>
                                    </el-tooltip>
                                </el-checkbox>
                                
                            </b>
                        </p>
                    </div>
                    <div class="appCode_right" v-if="isShow==2">
                        <p><img :src="codess" alt=""/></p>
                        <p class="inquryaddress">
                           <i :class="{activeStyleall:index==ids}"  style="cursor:pointer" v-for="(item,index) in num" :key="index" @click="getcode(index)">坐诊诊所: {{item.outpatientname}}</i>
                        </p>
                    </div>
                    <div class="appCode_right" v-if="isShow==3">
                        <p><img :src="hospitalImg" alt=""/></p>
                        <p class="inquryaddress">
                           <i :class="{activeStyleall:index==ids}"  style="cursor:pointer" v-for="(item,index) in doctorhospital" :key="index" @click="getcode(index)">出诊机构: {{item.hospitaname}}</i>
                        </p>
                    </div>
                </div>
                
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:["docqrcodedialog","codeslist","getpage"],
    data(){
        return {
            activeIndex: '1',
            isShow:true,
            codess:"",
            num:[],
            ids:0,
            checked:false,
            doctorhospital:[],
            hospitalImg:''
        }
    },
    methods:{
        qrCode(){
            let _this=this;
            let index=this.checked?"1":"2";
            this.$doRequest("/api/doctorinfo1.5.1/upOrcodeSwitcher",{"id":this.codeslist.id,"orcodestatus":index},res=>{
                _this.getpage();
            })
        },
        getpages(index){             
            this.isShow=index;
            let _this=this;
            this.$doRequest("/api/doctorinfo1.5.1/getOutpatientQrcode",{doctorid:this.codeslist.id},res=>{
                if(index==2){
                    _this.num=res.diagnosisDoctor;
                    _this.codess=res.diagnosisDoctor[0].qrcode||'';  
                }else{
                    _this.doctorhospital=res.doctorhospital;
                    _this.hospitalImg=res.doctorhospital[0].qrcode;
                }
            })
        },
        getcode(list){
            console.log(88888,list);
            if(this.isShow==2){
                this.codess=this.num[list].qrcode;  
            }else{
                this.hospitalImg=this.doctorhospital[list].qrcode;
            }
            this.ids=list;
        },
    },
    mounted(){
      this.checked=this.codeslist.orcodestatus==2?false:true;
    }
}
</script>
<style lang="less">
 .el-dialog--center .el-dialog__body{
     box-sizing: border-box;
 }
    .qrcode{
        .activeStyleall{
            background:#ccc;
        }
        .el-dialog__header{
            background:#ccc;
        }
        .el-dialog--center .el-dialog__body{
            padding-top:0;
            
        }
        .main{
            width: 100%;
            min-height:300px;
            background: #fff;
            padding-left:6px;
            padding-top:0;
            ul{
                margin-bottom:10px;
                width:100%;
                height:60px;
                padding-bottom:20px;
                border:0;
                
                a{
                    float:left;
                    display: block;
                    text-decoration: none;
                    color:black;
                    padding-bottom:7px;
                    width:100px;
                    text-align: center;
                    width:50%;
                }
                li{
                    font-size:20px;  
                    padding:0 12px;
                    margin-left:15%;
                }
                .borders{
                    border-bottom:3px  solid #008000;
                }
                .el-button--text{
                    color:#07A591;
                }
            }
            .appCode{
                width:100%;
                height:200px;
                .appCode_left{
                    height:100%;
                    .el-icon-info{
                        // background:#ccc;
                    }
                   .advice{
                       display: block;
                       font-style: normal;
                       margin-top:20px;
                       text-align: left;
                       width:100%;
                       box-sizing: border-box;
                       background:#ccc;
                       padding:4px 20px;
                       line-height:20px;
                   }
                   b{
                       font-family: normal;
                       display: block;
                    //    clear: both;
                    //    overflow: hidden;
                       width:100%;
                       text-align: left;
                       margin-top:14px;
                       color:#000;
                       .el-checkbox__inner{
                           background: #fff!important;
                           border-color:#ccc!important;
                           color:#000;
                       }
                       .el-checkbox__inner::after{
                           border-color: #07A591;
                       }
                       .el-checkbox__label{
                             color:#000!important; 
                       }
                       span{
                           width:14px;
                       }
                   }
               }
                .appCode_right{
                    height:100%;
                }
                p{
                    float:left;
                    width:50%;
                    height:100%;
                    text-align: center;
                    img{
                        display:inline-block;
                        width:200px;
                        height:100%;
                        text-align: center;
                    }
                    .texts{
                        display: block;
                        // padding-left:15%;
                        width:100%;
                        padding-top:14%;
                        margin-bottom:20px;
                        box-sizing: border-box;
                        font-size: 16px;
                        // margin:15px 0;
                        text-align: left;
                    }
                    .texts:nth-of-type(1){
                        margin-bottom:20px;
                    }
                     .texts:nth-of-type(2){
                         padding-top:0;
                         margin-bottom:60px;
                     }
                }
                .inquryaddress{
                    height:200px;
                    overflow-y: auto;
                    box-sizing: border-box;
                  
                    i{
                        display: block;
                        width:100%;
                        font-style: normal;
                        text-align: left;
                        height:50px;
                        font-size: 16px;
                        line-height: 50px;  
                        // background:#ccc; 
                    }
                    .color{
                       background:#c1c1c1;  
                    }
                }
                
            }
        }
    }
</style>