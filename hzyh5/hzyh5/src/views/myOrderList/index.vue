<template>
    <div class="myOrderList">
        <tab :line-width="2" custom-bar-width="100px" v-if="commTab">
            <tab-item selected @on-item-click="onItemClick">待支付</tab-item>
            <tab-item @on-item-click="onItemClick">全部</tab-item>
        </tab>
        <scroller :on-refresh='refresh' :on-infinite='infinite' ref="my_scroller" :noDataText="noDataText" :style='scrollerTop'>
            <!-- 待支付 -->
            <div class="list" v-if="isPay" v-for="(item,index) in orderlist" :key="index" @click="goPay(item.id,item.serviceid)">
                <div class="header">
                    <span>订单号：{{item.ordercode}}</span>
                    <span class="state">待支付</span>
                </div>
                <div class="center">
                    <div>
                        <span>问诊医生</span>
                        <span>{{item.doctorname}}</span>
                    </div>
                    <div>
                        <span v-if="item.serviceid == 5">药方</span>
                        <span v-if="item.serviceid != 5">在线问诊</span>
                        <span>¥{{item.totalprice}}</span>
                    </div>
                    <div>
                        <span>下单时间</span>
                        <span>{{item.buytime}}</span>
                    </div>
                </div>
                <div class="footer" v-if="item.serviceid == 2 && item.paystate == 4">
                    <x-button type="primary">取消订单</x-button>
                    <span></span>
                    <x-button type="warn" @click.native="goPay(item.id,item,serviceid)">去支付</x-button>
                </div>
            </div>

            <!-- 全部 -->
            <div :class="item.paystate == 3 ? 'list past' : 'list' " v-if="!isPay" v-for="(item,index) in allOrederList" :key="index"  @click="goPay(item.id,item.serviceid)">
                <div class="header">
                    <span>订单号：{{item.ordercode}}</span>
                    <span v-if="item.paystate == 1 && item.orderstate != 4" class="state">待支付</span>
                    <span v-if="item.paystate == 2">已支付</span>
                    <span v-if="item.paystate == 3">已取消</span>
                    <span v-if="item.paystate == 1 && item.orderstate == 4">已结束</span>
                </div>
                <div class="center">
                    <div>
                        <span>问诊医生</span>
                        <span>{{item.doctorname}}</span>
                    </div>
                    <div>
                        <span v-if="item.serviceid == 5">药方</span>
                        <span v-if="item.serviceid != 5">在线复诊</span>
                        <span>¥{{item.totalprice}}</span>
                    </div>
                    <div>
                        <span>下单时间</span>
                        <span>{{item.buytime}}</span>
                    </div>
                </div>
                <div class="footer" v-if="item.serviceid == 2 && item.paystate == 4">
                    <x-button type="primary">取消订单</x-button>
                    <span></span>
                    <x-button type="warn" @click.native="goPay(item.id,item,serviceid)">去支付</x-button>
                </div>
            </div>
        </scroller>
        <empty :message="message" v-if="isPay && orderlist.length == 0 || !isPay && allOrederList.length == 0"></empty>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    import commNav from '@/components/nav/index.vue'
    import empty from '@/components/empty/index.vue'
    export default {
        components: {
            commNav,
            empty
        },
        data() {
            return {
                isPay: true,
                orderlist: [],//待支付
                allOrederList: [],//全部
                commNav: true,
                commTab: true,
                isempty: false,
                message: '暂无订单',
                pagination: 1,
                pageCount: 0,
                paginations: 1,
                pageCounts: 0,
                noDataText: '',
                scrollerTop: {
                    top: '42px'
                }
            }
        },
        // 生命周期之挂载完成
        methods: {
            init(){
                this.refresh();
            },
            onItemClick (index) {
                // this.$router.push("/paymentSteps");
                if(index == 1){
                    this.isPay = false;
                }else{
                    this.isPay = true;
                }
                this.refresh();
            },
            goPay(id,type){
                if(type == 5){
                    this.$router.push({path: '/myOrderDetailsYF',query: {id: id,befrom: 'orderList',paidTypes:8}});
                    this.$store.state.addressId=id;
                }else{
                    this.$router.push({path: '/myOrderDetailsWZ',query: {id: id}});
                }
                
            },
            //待支付
            getOrderList(done){
                let id = this.$store.state.userInfo.id;
                let params = {
                    pagination : this.pagination,
                    patientid: id,
                    paystate: '1'
                };
                this.$doRequest("/api/PlacingOrder/queryMyOrders", params,res=>{
                    if(this.pagination == 1){
                        this.orderlist = [];
                    }
                    for(var i=0;i<res.pageVal.length;i++){
                        if(res.pageVal[i].paystate == '1' && res.pageVal[i].orderstate != '4'){
                            this.orderlist.push(res.pageVal[i])
                        }
                    }
                    if(this.orderlist == '' || this.orderlist.length == 0){
                        this.isempty = true;
                    }else{
                        this.isempty = false;
                    }
                    this.pageCount = res.pageCount;
                    if(typeof(done) == 'function'){
                        done();
                    }
                })
            },

            //全部
            getAllOrderList(done){
                let id = this.$store.state.userInfo.id;
                let params = {
                    pagination : this.paginations,
                    patientid: id
                };
                this.$doRequest("/api/PlacingOrder/queryMyOrders", params,res=>{
                    if(this.paginations == 1){
                        this.allOrederList = res.pageVal;
                    }else{
                        for(var i=0;i<res.pageVal.length;i++){
                            this.allOrederList.push(res.pageVal[i]);
                        }
                    }
                    if(this.allOrederList == '' || this.allOrederList.length == 0){
                        this.isempty = true;
                    }else{
                        this.isempty = false;
                    }
                    this.pageCounts = res.pageCount;
                    if(typeof(done) == 'function'){
                        done();
                    }
                })
            },
            refresh(done){
                if(this.isPay){
                    setTimeout(()=>{
                        this.pagination = 1;
                        this.getOrderList(done);
                    },500)
                }else{
                    setTimeout(()=>{
                        this.paginations = 1;
                        this.getAllOrderList(done);
                    },500)
                } 
            },
            infinite(done){
                if(this.isPay){
                    this.pagination++;
                    setTimeout(()=>{
                        this.$refs.my_scroller.finishInfinite(true);
                        if(this.pagination > this.pageCount){
                            this.noDataText = '没有更多订单信息了';
                        }else{
                            this.getOrderList(done);
                        }
                    },500)
                }else{
                    this.paginations++;
                    setTimeout(()=>{
                        this.$refs.my_scroller.finishInfinite(true);
                        if(this.paginations > this.pageCounts){
                            this.noDataText = '没有更多订单信息了';
                        }else{
                            this.getAllOrderList(done);
                        }
                    },500)
                }
            }
        },
        //生命周期之创建完成
        created: function(){
            if (this.$route.query.source == 'commNav') {
                this.commNav = true;//从导航跳转（有nav没有tab）
                this.commTab = false;
            } else if(this.$route.query.source == 'qy'){
                this.commNav = false;
                this.commTab = false;//从取药（没有tab并且没有nav）
                this.scrollerTop = {
                    top: '0px'
                }
            } else {
                this.commTab = true;
                this.commNav = false;//从我的（有tab没有nav）
            }
            this.$isLogin(window.location.search.substr(1), this.init);
            document.title = '我的订单';
        },
    }
</script>

