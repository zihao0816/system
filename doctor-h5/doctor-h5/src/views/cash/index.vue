<template>
    <div class="cash">
        <div class="center">
            <p>提现金额</p>
            <div>
                <span>¥</span>
                <input type="number" placeholder="输入提现金额" v-model="cashSum" oninput="if(value.length>4)value=value.slice(0,4)">
            </div>
            <p>· 最多可提现{{accountbalance}}元</p>
            <p>· 单次最多可提现{{maximumCashWithdrawable}}元</p>
        </div>
        <button :class="isSubmit?'submit':'submit nosubmit'" @click="cashSubmit">{{isButton}}</button>
        <!-- 弹框 -->
        <toast v-model="showPositionValue" type="text" :time="800" is-show-mask :text="toastText" width="auto"></toast>
        <!-- 提现成功弹框 -->
        <div class="dialog" v-if="isCheck">
            <div class="lucency" @click="check"></div>
            <div class="main">
                <p>已成功提现，请点击左上角关闭（或X）返回，北京好中医服务平台公众号领取提现红包</p>
                <button class="submit" @click="check">我知道了</button>
            </div>
        </div>
    </div>
</template>
<script>
import { Toast, Confirm} from 'vux'
export default {
    components: {
        Toast,
        Confirm
    },
    data() {
        return {
            doctorid: this.$route.query.doctorid,
            openid: this.$route.query.openid,
            phone: this.$route.query.telePhone,
            cashSum: '',
            accountbalance: 0,//可提现金额
            maximumCashWithdrawable: 0,//最多可提现金额
            isSubmit: true,
            isButton: '提现',
            toastText: '',
            showPositionValue: false,
            isCheck: false
        }
    },
    //挂载完成
    methods: {
        //查看税法规定
        check(){
            if(this.isCheck){
                this.isCheck = false;
            }else{
                this.isCheck = true;
            }
        },
        //获取可提现金额
        getCash(){
            this.$doRequest("/api/accountdetail/getDoctorCashWithdrawal?doctorid="+this.doctorid,null,res => {
                this.accountbalance = res.accountbalance;
                if(this.accountbalance && this.accountbalance > 0){
                    this.isSubmit = true;
                }else{
                    this.isButton = '余额不足';
                }
                this.maximumCashWithdrawable = res.maximumCashWithdrawable;
            });
        },
        //提现提交
        cashSubmit(){
            if(this.cashSum){
                this.cashSum = Number(this.cashSum);
            }
            //提现金额校验
            if(this.cashSum == ''){
                this.toastText = '请输入提现金额';
                this.showPositionValue = true;
                return;
            }else if(this.cashSum < 0){
                this.toastText = '请输入正确的金额';
                this.showPositionValue = true;
                return;
            }else if(this.cashSum > this.maximumCashWithdrawable){
                this.toastText = '超出可提现金额最大限制';
                this.showPositionValue = true;
                return;
            }else if(this.cashSum > this.accountbalance){
                this.toastText = '超出可提现金额';
                this.showPositionValue = true;
                return;
            }
            if(this.isSubmit){
                this.isSubmit = false;
                let params = {
                    userid: this.doctorid,
                    phone: this.phone,
                    openid: this.openid,
                    money: this.cashSum
                };
                this.$doRequest('api/doctorwithdraw/redEnvelopeCashWithdrawal',params ,res => {
                    if(res.result > 0){
                        this.isCheck = true;
                        this.isSubmit = true;
                        this.cashSum = '';
                        this.getCash();
                    }else{
                        this.isSubmit = true;
                        this.toastText = res.message;
                        this.showPositionValue = true;
                    }
                });
            }
        }
    },
    //生命周期之创建完成
    created: function() {
        this.getCash();
    }
}
</script>
<style lang="less">
.cash{
    width: 100%;
    height: 100vh;
    color: #141414;
    .center{
        padding: 16px;
        background: #fff;
        p{
            color: #141414;
            line-height: 26px;
        }
        div{
            border-bottom: 1px dashed #C1C1C1;
            overflow: hidden;
            padding: 20px 0;
            margin-bottom: 20px;
            span{
                font-size: 24px;
                float: left;
                height: 40px;
                line-height: 40px;
            }
            input{
                font-size: 24px;
                padding-left: 10px;
                font-weight: 200;
                height: 40px;
                line-height: 40px;
            }
        }
    }
    .submit{
        width: 96%;
    }
    .nosubmit{
        background: #dcdcdc;
    }
}
</style>
  

