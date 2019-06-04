<template>
    <div class="doctorDetails">
        <header>
            <div><img :src="headphoto"></div>
            <h3>{{doctorname}}</h3>
            <p>{{duties}}</p>
        </header>
        <div class="explain">
            <i></i>
            <p>·  {{hospita}}</p>
        </div>
        <div class="sum">
            <div>
                <p>{{auditmoney}}</p>
                <p>审核后下月到账</p>
            </div>
            <div>
                <p>{{accountbalance}}</p>
                <p>当前可提现（税后）</p>
            </div>
            <span></span>
            <button :class="isDeposit?'submit':'submit nosubmit'" @click='goCash'>去提现</button>
        </div>
        <div class="path">
            <div @click="goRule">
                <span>收入及缴税详情</span>
                <i></i>
            </div>
            <div>
                <span>提现记录</span>
                <span>累计提现  {{money}}</span>
            </div>
        </div>
        <div class="reminder">
            <h3>·  温馨提示  ·</h3>
            <p>· 每月补贴部分将在下月初进行审核，本月可提现上月审核通过的补贴</p>
            <p>· 每次提现上限4990.00元</p>
            <p>· 每天最多可提现10次</p>
            <p>· 每月1号至5号暂停提现服务</p>
            <p>· 该页仅显示账户余额，具体明细请登录北京好中医APP进行查看</p>
            <p>· 提现成功后，将以红包的形式进行发放，请及时领取。红包提现未领取，微信会在24小时后将红包返还到您的账户</p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            telePhone: this.$route.query.telePhone || '',
            openid: this.$route.query.openid || '',
            filefdfspath: 'https://service.51bjhzy.com/',
            doctorid: '',
            headphoto: '',
            doctorname: '',
            duties: '',
            hospita: '',
            department: '',
            auditmoney: '',
            accountbalance: '',
            money: '',
            isDeposit: false
        }
    },
    //挂载完成
    methods: {
        //去提现
        goCash(){
            if(this.accountbalance > 0){
                this.$router.push({path: '/cash',query:{doctorid: this.doctorid,openid: this.openid,telePhone: this.telePhone}});
            }
        },
        //缴税详情
        goRule(){
            this.$router.push({path: '/Rule',query:{doctorid: this.doctorid}});
        },
        getDoctor(){
             let params = {
                telePhone: this.telePhone,
                openid: this.openid,
            }
            this.$doRequest("api/AppHomePage/gainDoctor", params,res => {
                this.doctorid = res.doctorid;
                this.headphoto = this.filefdfspath+res.headphoto;
                if(!this.headphoto){
                    this.headphoto = '../../assets/yhmrftx.png';
                }
                this.doctorname = res.doctorname;
                this.duties = res.duties;
                this.hospita = res.hospita;
                this.department = res.department;
                this.auditmoney = res.auditmoney;

                this.accountbalance = res.accountbalance;
                if(this.accountbalance > 0){
                    this.isDeposit = true;
                }
                this.money = res.money;
            });
        }
    },
    //生命周期之创建完成
    created: function() {
        this.getDoctor();
        document.title = '提现';
    }
}
</script>
<style lang="less">
.doctorDetails{
    width: 100%;
    height: 100vh;
    header{
        width: 100%;
        padding: 22px 0 26px;
        background: url(../../assets/disekuai@2x.png);
        background-size: 100% auto;
        div{
            width: 56px;
            height: 56px;
            overflow: hidden;
            border-radius: 28px;
            margin: 0 auto;
            img{
                width: 56px;
                height: auto;
            }
        }
        h3{
            font-size: 18px;
            font-weight: 400;
            color: #fff;
            width: 100%;
            text-align: center;
            line-height: 40px;
        }
        p{
            font-size: 14px;
            width: 100%;
            text-align: center;
            color: #fff;
        }
    }
    .explain{
        width: 100%;
        padding: 10px 16px;
        background: #FFFFE7;
        position: relative;
        i{
            width: 14px;
            height: 12px;

        }
        p{
            line-height: 24px;
            font-size: 12px;
            color: #4a4a4a;
            padding-left: 24px;
        }
    }
    .sum{
        width: 100%;
        background: #fff;
        padding-bottom: 16px;
        overflow: hidden;
        position: relative;
        div{
            width: 50%;
            height: 80px;
            padding: 20px 0;
            float: left;
            p{
                width: 100%;
                text-align: center;
                line-height: 20px;
            }
            p:nth-child(1){
                color: #D74326
            }
        }
        span{
            width: 1px;
            height: 40px;
            background: #BFC0BF;
            position: absolute;
            left: 50%;
            top: 20px;
        }
        .submit{
            width: 92%;
            height: 42px;
            background: #D74326;
            color: #fff;
        }
        .nosubmit{
            background: #dcdcdc;
        }
    }
    .path{
        width: 100%;
        margin: 6px 0;
        div{
            width: 100%;
            height: 52px;
            line-height: 52px;
            background: #fff;
            padding: 0 16px;
            margin-bottom: 2px;
            span:nth-child(1){
                height: 14px;
                line-height: 14px;
                padding-left: 8px;
                display: inline-block;
                border-left: 4px solid #D74326;
            }
            span:nth-child(2){
                float: right;
                color: #818181;
                font-size: 12px;
            }
            i{
                width: 4px;
                height: 11px;
                background: url(../../assets/xyj_y@3x.png);
                background-size: 100% 100%;
                display: block;
                float: right;
                margin: 20px 0;
            }
        }
    }
    .reminder{
        background: #fff;
        padding-bottom: 20px;
        h3{
            width: 100%;
            height: 52px;
            line-height: 52px;
            color: #4A4A4A;
            text-align: center;
            font-weight: 400;
            font-size: 16px;
            border-bottom: 1px solid #F1F0F5;
            margin-bottom: 16px;
        }
        p{
            padding: 0 16px;
            color: #666;
            line-height: 24px;
            font-size: 14px;
        }//
    }
}
</style>
  

