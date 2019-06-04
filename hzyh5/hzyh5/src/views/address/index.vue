<template>
    <div class="address">
        <div class="borders">
            <span>收货人</span>
            <el-input type="text" v-model="receiver" placeholder="请输入您的姓名" maxlength="10" @change="verify()"></el-input>
        </div>
        <div class="borders">
            <span>联系方式</span>
            <el-input type="number" v-model="telephone"  placeholder="请输入您的联系方式" maxlength=“11” oninput="if(value.length>11)value=value.slice(0,11)"></el-input>
        </div>
        <div class="borders">
            <span>收货地址</span>
            <group>
                <x-address 
                    :title="title"
                    v-model="value" 
                    :list="addressData" 
                    placeholder="请选择地址"
                    @on-shadow-change="onShadowChange"
                    :show.sync="showAddress">
                </x-address>
            </group>
        </div>
         <b class="whitee"></b>
        <div class="detailAddress">
             <el-input
                maxlength="120"
                type="textarea"
                :row="3"
                clearable
                placeholder="详细信息:如道路、门牌号、小区、楼栋号、单元等"
                style="overflow:hidden"
                v-model="address">
            </el-input>
        </div>
        <i class="white"></i>
        <div class="addressTitle">
            <wv-switch title="设为默认地址"  v-model="switchValue1"></wv-switch>
            <i ></i>
        </div>
        <div class="deleteAddress" @click="deleteAddress" v-if="$route.query.id">删除收货地址</div>
        <button class="submit" @click="addAddress">保存</button>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    import { Group, XAddress, ChinaAddressV4Data, XButton, Cell, Value2nameFilter as value2name } from 'vux'
    export default {
        components: {
            Group,
            XAddress,
            XButton,
            Cell
        },
        data() {
            return {
                    defaultAddress:false,
                    showAddress:'',
                    id: this.$route.query.id,//地址id
                    patientid: this.$store.state.userInfo.id,//患者ID
                    receiver: this.$store.state.userInfo.patientname != null && this.$store.state.userInfo.patientname != '' ? this.$store.state.userInfo.patientname : '',//收件人姓名 
                    telephone: this.$store.state.userInfo.telephone != null && this.$store.state.userInfo.telephone != '' ? this.$store.state.userInfo.telephone : '',//联系电话 
                    country: '中国',//国家 
                    province: '',//省/直辖市 
                    city: '',//市 
                    county: '',//区/县 
                    address: '',//详细地址 
                    title: '',
                    value: [],
                    addressData: ChinaAddressV4Data,
                    showAddress: false,
                    istrue: false,
                    switchValue1:false
            }
        },
        //生命周期之挂载完成
        methods: {
            //删除地址
            deleteAddress(){
                let _this=this;
                this.$doRequest("/api/patientaddressinfo/delete", [this.$route.query.id.id]).then(res => {
                   if(res.result == 0){
                        _this.$router.back(-1);
                    }
                }) 
            },
            doShowAddress () {
                this.showAddress = true
                setTimeout(() => {
                    this.showAddress = false
                }, 2000)
            },
            onShadowChange (val,names) {
                this.province = names[0];
                this.city = names[1];
                this.county = names[2];
            },
            verify(){
                var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
                    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                if(regEn.test(this.receiver) || regCn.test(this.receiver)){
                    this.$toastMsg('请输入正确格式的收件人');
                }
            },
            addAddress(){
                if(this.$store.state.userInfo.telephone != ""&&this.telephone==""){
                    this.telephone = this.$store.state.userInfo.telephone;
                    }
                if(this.receiver == ''){
                    this.$toastMsg('收件人不能为空');
                    return;
                }
                if(this.telephone == ''){
                    this.$toastMsg('联系方式不能为空');
                    return;
                }
                if(this.value == ''){
                    this.$toastMsg('收货地址不能为空');
                    return;
                }
                if(this.address == ''){
                    this.$toastMsg('详细地址不能为空');
                    return;
                }
                var reg = /^1[3456789]\d{9}$/
                    this.istrue = reg.test(this.telephone);
                    if(!this.istrue){
                        this.$toastMsg('请输入正确格式的手机号');
                        return;
                    }
                let params = {
                    patientid: this.$store.state.userInfo.id,//患者ID
                    receiver: this.receiver,//收件人姓名 
                    telephone: this.telephone,//联系电话 
                    country: this.country,//国家 
                    province: this.province,//省/直辖市 
                    city: this.city,//市 
                    county: this.county,//区/县 
                    address: this.address,//详细地址 
                    isdefault:this.switchValue1?"1":"2"
                }
                let _this=this;
                if(this.$route.query.id){
                    params.id= this.$route.query.id.id;
                   this.$doRequest("/api/patientaddressinfo/updatedizhi", params).then(res => {
                        _this.$router.push("/addressedit");
                    }) 
                }else{
                    this.$doRequest("/api/patientaddressinfo/saveizhi", params).then(res => {
                        if(res.result == 1){
                            _this.$router.push("/addressedit");
                        }
                    })
                }
                
            }
        },
        //生命周期之创建完成
        created: function(){
            document.title =this.$route.query.id?'编辑收货地址': '新增收货地址';
            this.$isLogin(window.location.search.substr(1));
            
        },
        mounted(){
            if(this.$route.query.id){
                this.receiver=this.$route.query.id.receiver;
                this.telephone=this.$route.query.id.telephone;
                this.address=this.$route.query.id.address;
                this.switchValue1=this.$route.query.id.isdefault==1?true:false;
                this.value=[this.$route.query.id.province,this.$route.query.id.city,this.$route.query.id.county];
            }
        }
    }
</script>

