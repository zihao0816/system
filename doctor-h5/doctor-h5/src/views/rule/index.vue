<template>
    <div class="incomeManage">
        <div class="header">
            <span>您在北京好中医的收入属于劳务收入，按照国家规定报酬缴纳个人所得税，平台推广期间，您的个人所得税由北京好中医为您承担，感谢您的支持！</span>
        </div>
        <div class="explain">
            <span>800元以下 0</span>
            <span>800-4000元 （收入-800）*20%</span>
            <span>4000-25000元 收入*（1-20%）*20%</span>
            <span>25000-62500元 收入*（1-20%）*30%-2000</span>
            <span>62500元以上 收入*（1-20%）*40-7000</span>
            <a class="check" @click="check">查看税法规定</a> 
            <span>活动推广期间，您的个人所得税由北京好中医平台承担</span>
        </div>
        <div class="center" v-for="(item,index) in inquireIncome" :key="index">
            <h3><i></i>{{item.ctime}}</h3>
            <div>
                <div>
                    <span>{{item.money}}</span>
                    <span>医生收入</span>
                </div>
                <div>
                    <span>0.00</span>
                    <span>医生缴税</span>
                </div>
            </div>
        </div>

        <div class="dialog" v-if="isCheck">
            <div class="lucency" @click="check"></div>
            <div class="main">
                <h3>按照国家规定劳务报酬需缴纳个人所得税，税法规定缴税比例如下</h3>
                <span>800元以下 0</span>
                <span>800-4000元 （收入-800）*20%</span>
                <span>4000-25000元 收入*（1-20%）*20%</span>
                <span>25000-62500元 收入*（1-20%）*30%-2000</span>
                <span>62500元以上 收入*（1-20%）*40-7000</span>
                <span>活动推广期间，您的个人所得税由北京好中医平台承担</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            doctorid: this.$route.query.doctorid,
            inquireIncome: [],
            isCheck: false
        }
    },
    //挂载完成
    methods: {
        getCashList(){
            let params = {
                parameters: this.doctorid
            }
            this.$doRequest("api/AppHomePage/inquireIncomeList", params,res => {
                for(let i=0; i<res.inquireIncome.length; i++){
                    let year = res.inquireIncome[i].ctime.substring(0,4);
                    let month = res.inquireIncome[i].ctime.substring(res.inquireIncome[i].ctime.length-2);
                    this.inquireIncome.push({
                        ctime: year+'年'+month+'月',
                        money: res.inquireIncome[i].money
                    })
                }
            });
        },
        //查看税法规定
        check(){
            if(this.isCheck){
                this.isCheck = false;
            }else{
                this.isCheck = true;
            }
        }
    },
    //生命周期之创建完成
    created: function() {
        this.getCashList();
        document.title = '收入及缴税详情';
    }
}
</script>
<style lang="less">
.incomeManage{
    width: 100%;
    height: 100vh;
    background: #F1F0F5;
    .header{
        padding: 18px 16px;
        background: #6062FC;
        color: #fff;
        line-height: 20px;
        span{
            font-size: 14px;
        }
    }
    .explain{
        padding: 16px;
        background: #fff;
        position: relative;
        font-size: 14px;
        span{
            color: #32303B;
            line-height: 20px;
            display: block;
        }
        span:last-child{
            color: #CB5E44;
            margin-top: 26px;
            font-size: 14px;
        }
        .check{
            font-size: 12px;
            color: #4A90E2;
            position: absolute;
            right: 10px;
            top: 10px;
            padding-left: 14px;
            display: block;
            background-image: url(../../assets/wenhao@3x.png);
            background-position: 0px;
            background-size: 12px;
            background-repeat: no-repeat;
        }
    }
    .center{
        margin-top: 6px;
        padding: 8px 0;
        background: #fff;
        h3{
            font-size: 16px;
            color: #141414;
            padding: 0 16px;
            font-weight: 200;
            i{
                width: 2px;
                height: 12px;
                background: #D74326;
                display: inline-block;
                margin-right: 4px;
            }
        }
        >div{
            margin: 8px 10px;
            background: #F8F8F8;
            border-radius: 4px;
            overflow: hidden;
            padding: 20px 0;
            div{
                width: 50%;
                height: 40px;
                float: left;
                border-right: 1px solid #E7E6EB;
                font-weight: 100;
                span{
                    display: block;
                    text-align: center;
                    line-height: 20px;
                    height: 20px;
                }
                span:nth-child(1){
                    color: #32303B;
                }
                span:nth-child(2){
                    color: #818181;
                    font-size: 12px;
                }
            }
            div:nth-child(3),div:nth-child(2){
                border: none;
            }
        }
    }
    
}


</style>