<template>
    <div class="orgDoctorDetails">
        <div class="orgInfo">
            <img :src="photourl">
            <p :class="isShow?'show':''">{{remark}}</p>
            <div class="side" @click="show()">
                <i></i>
                <span>{{slid}}</span>
            </div>
        </div>
        
        <div class="doctorInfo">
            <div class="h3">
                <span></span>
                <span>{{type == 1?'本院医生':'特邀专家'}}</span>
                <span></span>
            </div>
            <div>
                <img v-if="headphoto" :src="headphoto">
                <img v-else src="../../assets/yhmrftx.png">
                <div>
                    <h3>{{doctorname}}</h3>
                    <span>{{duties}} / {{hospitaname}}</span>
                </div>
            </div>
            <div class="seekInfo">
                <h3><i></i>在线复诊</h3>
                <span>包含自由图文交流、开方调药</span>
                <span>¥{{thagainprice}}/次</span>
                <span @click="gotoinfo()">点此复诊</span>
            </div>
        </div>
        <div class="doctorList">
            <h3>本院其他在线医生</h3>
            <div v-for="(item,i) in doctorList" :key="i" @click="goPath(item)">
                <div>
                    <img v-if="item.headphoto" :src="item.headphoto">
                    <img v-else src="../../assets/yhmrftx.png">
                </div>
                <div>
                    <h3>{{item.doctorname}} {{item.duties}}</h3>
                    <span>{{item.hospitaname}}</span>
                    <div class="lebal">
                        <span v-for="(kill,i) in item.doctorskill" :key="i">{{kill}}</span>
                    </div>
                    <div>
                        <span>¥ {{item.thagainprice}}/次</span>
                        <span v-if="Number(item.medicinecount)>0">已购药{{item.medicinecount}}次</span>
                        <span v-if="Number(item.diagnosecount)>0">已复诊{{item.diagnosecount}}次</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import common from "../../api/common";
export default {
    data() {
        return {
            doctorid: this.$route.query.doctorId,
            hospitaid: this.$route.query.hospitaid,
            patientid: '',
            // doctorid: '2019053011085018055ad96b46f5b',
            // hospitaid: '20190530111809555fcbeebe3441d',
            photourl: '',//医院图片
            photourl: '',//医院图片
            intro: '',//介绍
            type: '',//医生专家
            headphoto: '',
            doctorname: '',//医生姓名
            duties: '',//医生职称
            hospitaname: '',//医院名称
            thagainprice: '',//咨询价格
            diagnosecount: '',//问诊订单数
            medicinecount: '',//复诊订单数
            remark: '',
            doctorList: [],
            isShow: false,
            slid: '展开',
        }
    },
    methods: {
        getDoctorInfo(){
            let params = {
                doctorid: this.doctorid,
                hospitaid: this.hospitaid,
            };
            this.$doRequest("/api/org/h5doctorinfo", params, res=>{
                this.photourl = res.photourl;
                this.intro = res.intro;
                this.type = res.type;
                this.headphoto = res.headphoto;
                this.doctorname = res.doctorname;
                this.duties = res.duties;
                this.hospitaname = res.hospitaname;
                this.thagainprice = res.thagainprice;
                this.diagnosecount = res.diagnosecount;
                this.medicinecount = res.medicinecount;
                this.remark = res.remark;
                this.$store.state.sun.price = this.thagainprice;
            });
        },
        getDoctorList(){
            let params = {
                pageLength: '1000',
                pagination: '1',
                condition: {
                    doctorid: this.doctorid,
                    hospitaid: this.hospitaid,
                    patientid: this.patientid
                }
            };
            this.$doRequest("/api/org/h5doctorlist", params, res=>{
                res.parameters.rows.forEach(item => {
                    if(item.doctorskill && item.doctorskill != undefined && item.doctorskill != null && item.doctorskill != ''){
                        item.doctorskill = item.doctorskill.split(',');
                    }
                });
                this.doctorList = res.parameters.rows;
            });
        },
        show(){
            if(this.isShow){
                this.slid = '展开';
                this.isShow = false;
            }else{
                this.slid = '收起';
                this.isShow = true;
            }
        },
        gotoinfo(){
            this.$router.push({ path: "/buyServiceDetails" });
        },
        goPath(row){
            this.$store.state.AllOfValue.doctorId = row.id;
            this.$router.push({ path: "/doctorDetails", query: { state: 'g8t7r3'} });
        },
        query(){
            this.patientid = this.$store.state.userInfo.id;
            this.getDoctorInfo();
            this.getDoctorList();
        }
    },
    //生命周期之创建完成
    created: function() {
        this.$store.state.AllOfValue.doctorId = this.$route.query.doctorId;
        this.$isLogin(window.location.search.substr(1), this.query);
    },
};
</script>
<style lang="less">
@import "index.less";
</style>

