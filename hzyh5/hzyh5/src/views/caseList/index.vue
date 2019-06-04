<template>
    <div class="caseList" :class="{'istrue':istrue}">
        <div class="embed" v-if="fromType"></div>
        <scroller :on-refresh='refresh' :on-infinite='infinite' ref="my_scroller" :noDataText="noDataText" :style="istrue ? istop : ''">
            <div class='caseitem' v-for="(item,index) in caseList" :key="index">
                <div class="header">
                    <img :src="item.doctorheadphoto">
                    <div>
                        <span>{{item.doctorname}}</span>
                        <span>{{item.dutiesname}}·{{item.hospitaname}}</span>
                    </div>
                </div>
                <div class="center">
                    <div>
                        <span>问诊时间</span>
                        <span>{{item.updatetime}}</span>
                    </div>
                    <div>
                        <span>问诊方式</span>
                        <span>{{item.serviceid == '2' ? '在线复诊' : ''}}</span>
                    </div>
                    <!-- <div>
                        <span>医生辨证</span>
                        <span>{{item.doctorconclusion}}</span>
                    </div> -->
                </div>
                <div class="fotter">
                    <span @click="goDiseasInfo(item.id)"> 查看问诊资料</span>
                    <span @click="goOrderDetails(item.id)">查看病历详情</span>
                    <span></span>
                </div>
            </div>
        </scroller>
        <empty :message="message" v-if="caseList.length == 0"></empty>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from "../../api/common";
import empty from '@/components/empty/index.vue'
    export default {
        components: {
            empty
        },
        data() {
            return {
                doctorId: this.$store.state.AllOfValue.ImDoctorInfo,
                fromType: this.$route.query.type,
                caseList: [],
                istrue:0,
                message: '暂无病历',
                istop: {
                    top: '40px'
                },
                noDataText: '',
                pagination: 1,
                pageCount: 0
            }
        },
        methods: {
            init(){
                this.refresh();
            },
            //获取病历列表
            getCaseList(done){
                var id = this.$store.state.userInfo.id;
                var data = {
                    parameters: id,
                    pagination: this.pagination,
                }
                this.$doRequest("/api/PlacingOrder/casesPatients", data,res=>{
                    if(this.pagination == 1){
                        this.caseList = res.pageVal;
                    }else{
                        for(var i=0;i<res.pageVal.length;i++){
                            this.caseList.push(res.pageVal[i]);
                        }
                    }
                    this.pageCount = res.pageCount;
                    if(typeof(done) == 'function'){
                        done();
                    }
                })
            },
            //详情页跳转
            goDiseasInfo(id){
                this.$router.push({path: '/myDiseaseInfo',query: {id: id}});
            },
            goOrderDetails(id){
                this.$router.push({path: '/cases',query: {id: id}});
            },
            refresh(done){
                setTimeout(()=>{
                    this.pagination = 1;
                    this.getCaseList(done);
                },500)
            },
            infinite(done){
                this.pagination++;
                setTimeout(()=>{
                    this.$refs.my_scroller.finishInfinite(true);
                    if(this.pagination > this.pageCount){
                        this.noDataText = '没有更多病例信息了';
                    }else{
                       this.getCaseList(done);
                    }
                },500)
            }
        },
        created:function(){
            if(!this.$route.query.pd == 1){
                this.doctorId = this.$store.state.AllOfValue.doctorId;
                this.istrue = 1;
            }
            this.$isLogin(window.location.search.substr(1), this.init);
            document.title = '我的病历';
        }
    }
</script>

