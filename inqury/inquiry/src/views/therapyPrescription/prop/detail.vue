<template>
    <div>
        <div class="headers">
        <el-dialog title="理疗单详情" center  :visible="theradetail" @update:visible="v=>$emit('update:theradetail',v)" width="38%"> 
            <div>
                <ul class="phys">
                    <li style="width:100%">理疗单号:<span>{{findthreapy.accountid}}</span></li>
                    <li style="width:100%;">创建时间:<span>{{findthreapy.createtime}}</span></li>
                    <li class="ma">开方账号:<span>{{findthreapy.orderid}}</span></li>
                    <li class="mafl">患者姓名:<span>{{findthreapy.patienname}}</span></li>
                    <li class="mafl">性别:<span>{{findthreapy.patiensex==1?"男":"女"}}</span></li>
                    <li class="mafl">年龄:<span>{{findthreapy.patienage}}</span></li>
                    <li style="width:100%;">理疗项目:<span>{{findthreapy.phynames}}</span></li>
                    <li class="wdids">理疗周期:<span>{{findthreapy.cycle}}天</span></li>
                    <li class="wdids">理疗频率:<span>{{findthreapy.times}}/次/天</span></li>           
                </ul>
            </div>
            <div class="paystate">
                <p>订单金额:<span>{{findthreapy.consumption+"元"}}</span></p>
                <p>付款状态:<span>{{findthreapy.paystatus=="已支付"?findthreapy.paystatus:"未支付"}}</span></p>
                <p>付款方式:<span>{{findthreapy.paystatus=="已支付"?findthreapy.paymentmethod:"-"}}</span></p>
                <p>付款时间:<span>{{findthreapy.paystatus=="已支付"?findthreapy.createtime:"-"}}</span></p>
                <p style="width:100%;">交易单号:<span>{{findthreapy.paystatus=="已支付"?findthreapy.orderid:"-"}}</span></p>
                <p style="width:100%;">付费账号:<span>{{findthreapy.paystatus=="已支付"?findthreapy.accountid:"-"}}</span></p>
            </div>
             <div slot="footer" class="dialog-footer "> 
                <el-button @click="$emit('update:theradetail',false)" >关 闭</el-button>  
            </div> 
        </el-dialog> 
        </div>   
    </div>
</template>
<script>
export default {
    props:["theradetail","findthreapy"],
    data(){
        return {
        }
    }
}
</script>
<style lang="less">
    .headers{
        /deep/.el-button{
            width:98px;
        }
        /deep/.el-button{
            border-color: #07A591;
            color:#07A591;
        }
        padding:0;
        height:400px;
        width:100%;
        .el-dialog__header{
            i{
                border:1px solid black;
            }
        }
        .phys{
            width:100%;
            height:200px;
            border-bottom: 1px dashed #ccc;
            li{
                float:left;
                list-style: none;
                margin-bottom:12px;
            }
            .wdids{
                width:50%;
            }
            .mafl{
                width:33.33%;
            }
            .ma{
                width:100%;
            }
        }
        .paystate{
            width:100%;
            margin-top:20px;
            p{
                width:50%;
                float:left;
                margin-bottom:12px;

            }
            span{
                margin-left:10px;
                margin-right:5px;
            }
        }
    }
</style>