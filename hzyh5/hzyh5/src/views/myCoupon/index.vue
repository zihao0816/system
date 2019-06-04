<template>
    <div class="mycoupon">
        <div class="header" v-if="valid">
            <span></span>
            <span>可使用优惠券（{{total}}张）</span>
        </div>
        <!-- 有效券 -->
        <div v-if="valid" class="center" v-for="(item,index) in couponList" :key="index">
            <div @click="gotobuy(item.price,item.id)">
                <span class="left"></span>
                <span class="right"></span>
                <span class="line"></span>
                <span class="state">可使用</span>
                <div class="centerLeft">
                    <span>¥<span>{{item.price}}</span></span>
                </div>
                <div class="centerRight">
                    <h3>{{item.couponname}}</h3>
                    <span></span>
                    <span>有效期：{{item.startime}}～{{item.overtime}}</span>
                </div>
            </div>
        </div>
        <!-- 无效券 -->
        <div v-if="!valid" class="center past" v-for="item in invalid" :key="item">
            <div>
                <span class="left"></span>
                <span class="right"></span>
                <span class="line"></span>
                <span class="state" v-if="item.state == 1">未领取</span>
                <span class="state" v-if="item.state == 2">已领取</span>
                <span class="state" v-if="item.state == 3">已使用</span>
                <span class="state" v-if="item.state == 4">已作废</span>
                <div class="centerLeft">
                    <span>¥<span>{{item.price}}</span></span>
                </div>
                <div class="centerRight">
                    <h3>{{item.couponname}}</h3>
                    <span>有效期：{{item.startime}}～{{item.overtime}}</span>
                </div>
            </div>
        </div>
        <div class="handle" v-if="valid">
            <span>没有更多有效券了</span>
            <span @click="checkPast()">查看无效券<i class="el-icon-d-arrow-right"></i></span>
        </div>
        <p class="clearcoupon" @click="clearcoupon" v-if="fromType">不使用优惠券</p>
        <empty :message='message' v-if="couponList.length == 0 || invalid.length == 0"></empty>
        <!-- <div class="empty" v-if="couponList.length == 0 || invalid.length == 0">
            <img src="../../assets/wnr@3x.png">
            <span>{{message}}</span>
        </div> -->
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import empty from '@/components/empty/index.vue'
    export default {
        components: {
            empty
        },
        data() {
            return {
                valid: true,
                total: 0,
                couponList:[],
                invalid: [],
                orderId: this.$route.query.orderId,//从药房订单结账页过来
                fromType: this.$route.query.fromType,//
                type: this.$route.query.type,
                message: '暂无优惠券'
            }
        },
        //生命周期之挂载完成
        methods: {
            checkPast(){
                this.valid = false;
            },
            //获取优惠券列表
            getMyCoupon(){
                let id = this.$store.state.userInfo.id;
                let list = [];
                let invalid = [];
                this.$doRequest("/api/PlacingOrder/getMypreferentialPrice", { parameters: id }).then(res => {
                    if(res.result == 0){
                        res.parameters.forEach(function (item) {
                            if(item.state == 2 && item.invalidity == 1){
                                list.push(item);
                            }else{
                                invalid.push(item);
                            }
                        });
                        this.couponList = list;
                        this.invalid = invalid;
                        this.total = this.couponList.length;
                    }
                })
            },
            //去使用优惠券
            gotobuy(val,id){
                if(this.$store.state.sun.pd == 1){
                    this.$store.state.sun.pd = 0;
                    if(this.fromType == 'myOrderDetailsYF'){
                        this.$router.push({path: '/myOrderDetailsYF',query: {id: this.orderId,couponId: id,couponSum: val,befrom: this.type,isSelect: true,}});
                    }else{
                        this.$router.push({path: '/buyServiceDetails',query: {id: this.orderId,kfcId: id,kfcSum: val}});
                    }
                    
                }else{
                    return
                }
            },
            //不使用优惠券
            clearcoupon(){
                if(this.$store.state.sun.pd == 1){
                    this.$store.state.sun.pd = 0;
                    this.$store.state.sun.kfc = undefined;
                    if(this.fromType == 'myOrderDetailsYF'){
                        this.$router.push({path: '/myOrderDetailsYF',query: {id: this.orderId,couponId: '',couponSum: '',befrom: this.type,isSelect: true,}});
                    }else{
                        this.$router.push({path: '/buyServiceDetails'});
                    }
                }else{
                    return
                }
            }
        },
        //生命周期之创建完成
        created: function(){
            this.$isLogin(window.location.search.substr(1), this.getMyCoupon);
            document.title = '我的优惠券';
        },
    }
</script>

