<template>
    <div>
        <div class="headers"> 
            <el-dialog title="问诊处方核销" center  :visible="dialogFormVisible"  @update:visible="v=>$emit('update:dialogFormVisible',v)" width="40%">               
                <div class="pay">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#07A591">
                        <el-menu-item index="1" @click="istrue=true">会员支付</el-menu-item>
                        <el-menu-item index="2" @click="sweepcode">二维码付款</el-menu-item>
                    </el-menu>             
                </div>
                <!-- 核销 -->
                <div v-if="istrue" class="paycancle">
                    <ul>
                        <li>手机号:<span>{{queryiny[0].telephone}}</span></li>
                        <li>会员状态:<span>{{memberstate==1?"已开通":"未开通"}}</span></li>
                        <li>会员卡余额:<span>{{accountBalance}}元</span></li>
                        <li>待支付费用:<span>{{price}}</span></li> 
                    </ul>
                    <p class="send">
                        <span>请选择取药方式:</span>
                        <el-radio v-model="send" label="1">邮寄</el-radio>
                        <el-radio v-model="send" label="2" >自取</el-radio>
                    </p>
                    <div class="address" v-if="accountBalance>=price && send == 1">
                        <span>收货地址:
                            <el-cascader
                            :options="options"
                            v-model="selectedOptions"
                            @change="handleChange">
                            </el-cascader>
                        </span>   
                    </div>
                    <div class="addDetail" v-if="accountBalance>=price && send == 1">详细地址:<input type="text" v-model="detailaddress"></div>
                     <div class="nomoney">
                         <span v-if="accountBalance>=price?false:true">{{accountBalance>=price?'':'您的余额不足'}}</span>
                     </div>
                </div>
    <!-- 二维码支付分页 -->
        <div v-if="!istrue">
            <!-- 扫码 -->
            <div class="sweepCode" v-if="ispay">
               <img :src="srcs" alt="">
               <div>
                    <p>请患者微信扫码查看处方详情，</p>
                    <p>并完成付款。</p>
               </div>
            </div>
            <!-- 支付成功 -->
             <div class="paySuccess" v-if="!ispay"> 
                <p>问诊处方订单支付成功！</p>
                <p>患者可在公众号内查看扣费详情!</p>
                <p>交易流水号:<span></span></p>
                <p>支付微信ID:<span></span></p>
                <p>问诊处方号:<span></span></p>
            </div>
        </div>
             <div slot="footer" class="dialog-footer"> 
                <el-button @click="$emit('update:dialogFormVisible',false)" >返 回</el-button>
                <el-button type="primary" @click="getcancle" v-if="istrue">确认支付</el-button>
            </div> 
            </el-dialog> 
        </div>
    </div>
</template>
<script>
import { regionData,CodeToText} from 'element-china-area-data'
export default {
    props:["dialogFormVisible","queryiny","accountBalance","istrueupdate","memberstate","price"],
     data() {
        return {
            labelPosition:'right',
            istrue:true,//是否是会员支付
            send:"1",//是否自己取
            isShow:true,//余额是否充足
            ispay:true,
            options:regionData,
            selectedOptions:[],
            activeIndex:"1",
            srcs:"",
            isBalance:false,
            address:"",
            detailaddress:""
        }
     },
    methods:{
        getcancle(){
            let _this=this;
            let ids = [];
            this.queryiny.forEach((item,i) => {
                ids.push(item.id);
            });
            for(var i=0;i<this.selectedOptions.length;i++){
                this.selectedOptions[i]=CodeToText[this.selectedOptions[i]];
            }
            this.address=this.selectedOptions.join(",");
            let params = {
                ids: ids,
                sendtype: this.send,
                address: this.address+this.detailaddress,

            };
            if(((this.selectedOptions.length>0&&this.detailaddress.length>0)||this.send==2)&&this.accountBalance>=this.price){
                this.$doRequest("/api/DiagnosisPlan/batchverification", params,function(res){
                        _this.$emit('update:dialogFormVisible',false);
                        if(res.result==1){
                            _this.$message({
                                message: '核销成功！',
                                type: 'success'
                            });
                            _this.$emit('update:istrueupdate',_this.queryiny.orderid);
                        }else{
                            _this.$message("核销失败");
                        }
                });
            }else if(this.accountBalance<this.price){
                _this.$message({
                    message: '你的余额不足',
                    type: 'error'
                });
            }else if( this.selectedOptions.length<=0||this.detailaddress.length<=0){
                _this.$message({
                    message: '地址不能为空',
                    type: 'error'
                });
            }
        },
        handleChange(value){
               
        },
        sweepcode(){
            if(this.queryiny.length > 1){
                this.$message({
                    message: '批量核销暂时不支持二维码支付！',
                    type: 'error'
                });
            }else{
                let _this=this;
                this.istrue=false;
                this.$doRequest("/api/DiagnosisPlan/barCodePrescriptionPayment",{
                    "expensespaid":this.price,
                    "doctorid":this.queryiny[0].doctorid,
                    "patientid":this.queryiny[0].patientid,
                    "orderid":this.queryiny[0].orderid
                },res=>{
                    _this.srcs='https://service.51bjhzy.com/api/StaticFile/orderqr/'+res.message;
                },res=>{
                    if(res.message="该订单已支付"){
                        _this.$message({
                            message: "该订单已支付",
                            type: 'success' 
                        });
                    }
                })
            }
        }
    },
    created: function(){
        
    },
}
</script>
 
<style lang="less">
.el-cascader-menu__item.is-active {
        color: #07A591;
    }

.headers{
    /deep/.el-radio__input.is-checked+.el-radio__label{
        color:#07A591;
    }
    /deep/.el-radio__input.is-checked .el-radio__inner{
        border-color: #07A591;
        background-color: #07A591;
    }
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
    .borders{
        border-bottom: 1px solid #07A591;
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
        margin-bottom:20px;
        ul{
            width:100%;
            li{
                float:left;
                margin:0 50px;
            }
        }
    }
    .el-input{
        width:80%;
    }
    .paycancle{
        width:100%;
        height:190px;
        padding-top:20px;
        font-size: 14px;
        li{
            float:left;
            width:50%;
            text-indent: 40px;
            margin-bottom:10px;
        }
        .send{
            width:100%;
            padding-left:40px;    
            margin-bottom:10px;
            
        }
        .address{
           width:100%;
           box-sizing: border-box;
           padding-left:40px; 
           margin-bottom:20px; 
           .el-cascader{
               margin-left:8px;
               height: 15px;
               .el-cascader__label{
                   height:30px;
                   font-size: 14px;
                   width:100%;
               }
               .el-input{
                   width:100%;
                   height:20px;
                   .el-input__inner{
                        height:30px;
                    }
               }
           }
        }
        .addDetail{
           width:100%;
           text-indent: 40px;
           input{
                margin-left:8px;
                width:66%;
                outline: none;
                border-radius: 5px;
                border:0; 
                border:1px solid #dcdfe6;
                height:30px;
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
    .nomoney{
        text-indent: 120px;
        color:red;
    }
}

</style>
