<template>
    <div class="mymanage">
        <div>
            <div class="header" @click="boundPhone">
                <img :src="photoUrl">
                <span>{{name}}</span>
                <span>{{phone}}</span>
            </div>
            <div class="centerlist">
                <div @click="goPath('/myOrderList')">
                    <i></i>
                    <span>我的订单</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div @click="goPath('/myRegistered')">
                    <i></i>
                    <span>门诊挂号</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div @click="goPath('/physicianVisits')">
                    <i></i>
                    <span>我的医生</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div @click="goPath('/caseList')">
                    <i></i>
                    <span>我的病历</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div @click="goPath('/myCoupon')">
                    <i></i>
                    <span>我的优惠券</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div style="width:100%;height:6px;background:#F1F0F5;"></div>
                <div @click="goPath('/aboutUs')">
                    <i></i>
                    <span>关于我们</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div>
                    <a href="tel:400-666-0101">
                    <i></i>
                    <span>联系客服</span>
                    <i class="el-icon-arrow-right"></i>
                    </a>
                </div>
                <div @click="goPath('/tickling')">
                    <i></i>
                    <span>问题反馈</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    import commNav from '@/components/nav/index.vue'
    import { Dialog } from 'we-vue'
    export default {
        components: {
            commNav
        },
        data() {
            return {
                photoUrl: this.$store.state.userInfo.headphoto,
                name: this.$store.state.userInfo.patientname,
                phone: this.$store.state.userInfo.telephone,
            }
        },
        // 生命周期之挂载完成
        methods: {
            goPath(target){
                if(target == '/caseList'){
                    this.$router.push({path: target,query: {pd: 1}});
                }else if(target == '/doctorList'){
                    this.$router.push({path: target,query: {befrom: 'myOrderList'}});
                }else{
                    this.$router.push({path: target});
                }
            },
            boundPhone(){
                if(!this.phone){
                    this.$router.push({path: '/boundPhone',query:{form:'myManage'}});
                }
            },
            inits(){
                document.title = '我的管理';
                this.photoUrl = this.$store.state.userInfo.headphoto;
                this.name = this.$store.state.userInfo.patientname;
                this.phone = this.$store.state.userInfo.telephone;
            }
        },
        created: function(){
            this.$isLogin(window.location.search.substr(1),this.inits);
           
        },
    }
</script>

