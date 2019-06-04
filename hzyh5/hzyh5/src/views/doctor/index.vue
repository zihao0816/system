<template>
    <div class="doctorLists">
        <div class="doctor-search">
            <div>
                <img src="../../assets/buy/Search@3x.png" alt="">
                <form action="javascript:return true;">
                    <input type="search" ref="inputs" @keyup.13="queryDoctor" v-model="doctorname" @focus="displayshow=true" placeholder="搜索不适、医生">
                </form>
            </div>
        </div>
        <div class="doctor" v-if="displayshow == false">
            <scroller :on-refresh='refresh' :on-infinite='infinite' ref="my_scroller" :noDataText="noDataText" >
                <p class="recommend" v-if="datalist != ''">已为您智能推荐</p>
                <div class="all-doctor clearfix" v-for="(item,index) in datalist" :key="index" @click="itemClick(item.id)">
                    <div class="doctor-head" :style="item.style"></div>
                    <div class="doctor-item">
                        <p><span>{{item.doctorname}}</span><span>{{item.duties}}</span></p>
                        <p>{{item.hospitaname}}</p>
                        <p><span v-for="(item,index) in item.skillname" :key="index" v-if="index<3">{{item}}</span></p>
                        <p class="clearfix"><span>￥{{item.phonePrice}}/次</span><span v-show="item.appointmentnumber != null && item.appointmentnumber != ''">已复诊{{item.appointmentnumber}}次</span><span v-show="item.medicinenumber != null && item.medicinenumber != ''">已购药{{item.medicinenumber}}次</span></p>
                    </div>
                </div>
            </scroller>
        </div>
        <div class="search-doctor" v-if="displayshow">
            <div v-for="(item,index) in skillData" :key="index">
                <div>
                    <p></p>
                    <p>{{item.name}}</p>
                </div>
                <ul>
                    <li v-for="(items,indexs) in item[item.name]" :key="indexs" @click="queryItem(items)">{{items}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import commNav from '@/components/nav/index.vue'
import empty from '@/components/empty/index.vue'
import { setTimeout } from 'timers';
    export default {
        components: {
            commNav,
            empty
        },
        data() {
            return {
                page:1,             //页码
                datalist:[],        //详情卡数据
                pagination:1,//请求数据
                heightof:"-90",
                message: '暂无医生',
                displayshow: false,
                skillData: [],
                noDataText: '',
                total: 0,
                skillname: '',
                doctorname: '',
                type: '',
                img: {
                    'background-image': ''
                }
            }
        },
        methods:{
            refresh(done){
                setTimeout(()=>{
                    this.skillname = '';
                    this.doctorname = '';
                    this.pagination = 1;
                    this.type = 'first';
                    this.getDoctors(done);
                },50)
            },
            infinite(done){
                this.pagination++;
                setTimeout(()=>{
                    this.$refs.my_scroller.finishInfinite(true);
                    if(this.pagination > this.total){
                        this.noDataText = '暂无更多结果';
                    }else{
                        this.type = '';
                        this.getDoctors(done);
                    }
                },50)
            },
            itemClick(id){
                this.$store.state.AllOfValue.doctorId = id;
                var heights = this.$refs.my_scroller.getPosition().top;
                this.$store.state.scrollerTop = heights;
                this.$store.state.doctorList = this.datalist;
                this.$store.state.pagination = this.pagination;
                this.$store.state.total = this.total;
                this.$router.push({ path: "/doctorDetails", query: { state: 'g8t7r3'} });
            },
            query(){
                if(this.$store.state.doctorList != ''){
                    this.datalist = this.$store.state.doctorList;
                    this.$nextTick(function(){
                        this.pagination = this.$store.state.pagination;
                        this.total = this.$store.state.total;
                        setTimeout(()=>{
                            this.$refs.my_scroller.scrollTo(0,this.$store.state.scrollerTop,false);
                        },10);
                        this.$store.state.doctorList = [];
                    });
                }else{
                    this.refresh();
                }
                this.querySkill();
            },
            getDoctors(done){
                var data = {
                    pagination: this.pagination,
                    condition: {
                        patientid: this.$store.state.userInfo.id,
                        skillname: this.skillname,
                        doctornamel: this.doctorname
                    }
                }
                this.$doRequest("/api/Inquiry/lookingFamousDoctor",data,res => {
                    if(this.type == 'first'){
                        for(var i=0;i<res.parameters.rows.length;i++){
                            if(res.parameters.rows[i].skillname != null){
                                res.parameters.rows[i].skillname = res.parameters.rows[i].skillname.split(',');
                                res.parameters.rows[i].style = {
                                    'background-image': 'url('+res.parameters.rows[i].headphoto+')'
                                }
                            }
                        }
                        this.datalist = res.parameters.rows;
                    }else{
                        for(var i=0;i<res.parameters.rows.length;i++){
                            if(res.parameters.rows[i].skillname != null){
                                res.parameters.rows[i].skillname = res.parameters.rows[i].skillname.split(',');
                                res.parameters.rows[i].style = {
                                    'background-image': 'url('+res.parameters.rows[i].headphoto+')'
                                }
                            }
                            this.datalist.push(res.parameters.rows[i]);
                        }
                        console.log(333333333,this.datalist);
                    }
                    this.total = res.parameters.total;
                    if(typeof(done) == 'function'){
                        done();
                    }
                });
            },
            querySkill(){
                this.$doRequest('/api/doctorConfirmRest/goodAtList?type=2',null,res=>{
                    this.skillData = res.parameters;
                })
            },
            queryItem(name){
                this.skillname = name;
                this.pagination = 1;
                this.type = 'first';
                this.displayshow = false;
                this.getDoctors();
            },
            queryDoctor(){
                this.skillname =null;
                this.pagination = 1;
                this.type = 'first';
                this.displayshow = false;
                this.$refs.inputs.blur();
                this.getDoctors();
            }
        },
        //生命周期之挂载完成
        mounted: function() {
            
        },
        //生命周期之创建完成
        created: function() {
            var that = this;
            document.title = '找名医';
            if(this.$route.query&&this.$route.query.befrom!=""){
                this.isroute = !!(this.$route.query.befrom == 'myOrderList');
            }
            this.$isLogin(window.location.search.substr(1), this.query);
        },
        //生命周期之更新
        updated: function () {
            
        },
        //生命周期之销毁
        destroyed: function () {

        }
    }
</script>

