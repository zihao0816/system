<template>
    <div class="myDoctor">
        <!-- <tab  active-color="#D74326">
            <tab-item :selected="selecte === '复诊医生'" @click="selected = '复诊医生'">复诊医生</tab-item>
            <tab-item :selected="selecte === '咨询医生'" @click="selected = '咨询医生'">咨询医生</tab-item>
        </tab> -->
        <div class="doctorList">
            <div v-for="(item,index) in doctorList" :key="index">
                <div class="photo">
                    <img :src="item.headphoto">
                </div>
                <div class="info">
                    <h3>{{item.doctorname}}·{{item.title}}</h3>
                    <span>{{item.hospitaname}}</span>
                    <span>{{item.skillname}}</span>
                </div>
                <div class="operation">
                    <span>图文复诊：¥{{item.imgSum?'item.imgSum':'0'}}/次</span>
                    <span>电话复诊：¥{{item.phonePrice}}/次</span>
                    <span></span>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    export default {
        data() {
            return {
                selected: '复诊医生',
                doctorList: []
            }
        },
        //生命周期之挂载完成
        methods: {
            getOrderList(){
                let params = {
                        patientid: this.$store.state.userInfo.id,
                        addtype: '',//不传返回绑定的医生，3全部医生
                };
                this.$doRequest("/api/Inquiry/GetDoctorsTwo", params).then(res => {
                    this.doctorList = res.pageVal;
                })
            }
        },
        //生命周期之创建完成
        created: function(){
            this.$isLogin(window.location.search.substr(1), this.getOrderList);
            document.title = '我的医生';
        },
    }
</script>

