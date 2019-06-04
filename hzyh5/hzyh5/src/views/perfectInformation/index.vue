<template>
    <div class="perfectinformation">
        <div class="page">
            <div class="title">根据国家相关规定，就诊需实名制，请如实填写信息（带*号的为必填项），以便医生辨认（仅医生可见）</div>
            <div class="content">
                <div class="headphoto">
                    <img :src="headPhoto" alt="">
                </div>
                <div class="patient">
                    <div class="samestyle">
                        <span class="samecolor">*</span>
                        <span>患者姓名</span>
                        <div class="samediv">
                            <input type="text" v-model="patientname" placeholder="请输入患者真实姓名" @blur="updateTop">
                        </div>
                    </div>
                    <div class="samestyle">
                        <span class="samecolor">*</span>
                        <span>患者性别</span>
                        <div class="samediv">
                            <el-radio-group v-model="sex">
                                <el-radio :label="'1'">男</el-radio>
                                <el-radio :label="'2'">女</el-radio>
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="samestyle">
                        <span class="samecolor">*</span>
                        <span>患者年龄</span>
                        <div class="select samediv">
                            <wv-cell is-link :value="age" @click.native="ageShow = true" />
                            <wv-picker :visible.sync="ageShow" :columns="ageList" value-key="name" @confirm="confirmRelation"/>
                        </div>
                    </div>
                    <div class="samestyle">
                        <span class="samecolor" style="opacity:0;">*</span>
                        <span style="margin-right:10px;">身份证号码</span>
                        <div class="samediv">
                            <input type="text" v-model="idnumber" oninput="if(value.length>18)value=value.slice(0,18)" placeholder="请输入真实的身份证号码" @blur="updateTop">
                        </div>
                    </div>
                </div>
                <div class="btn">
                    <button @click="saveInformation">提交</button>
                    <!-- <button>提交并支付挂号费20元</button> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            radioSex: '',
            ageList: [
                {
                    values: [
                        {
                            name: '1个月',
                            id: 1
                        },
                        {
                            name: '2个月',
                            id: 2
                        },
                        {
                            name: '3个月',
                            id: 3
                        },
                        {
                            name: '4个月',
                            id: 4
                        },
                        {
                            name: '5个月',
                            id: 5
                        },
                        {
                            name: '6个月',
                            id: 6
                        },
                        {
                            name: '7个月',
                            id: 7
                        },
                        {
                            name: '8个月',
                            id: 8
                        },
                        {
                            name: '9个月',
                            id: 9
                        },
                        {
                            name: '10个月',
                            id: 10
                        },
                        {
                            name: '11个月',
                            id: 11
                        }
                    ]
                }
            ],
            age: '',
            ageShow: false,
            headPhoto: '',
            userId: '',
            idnumber: '',
            patientname: '',
            sex: '',
            form: this.$route.query.form
        }
    },
    created(){
        var that = this;
        for(var i=1;i<101;i++){
            that.ageList[0].values.push({name: i+'岁',id:i+12});
        }
        this.headPhoto = this.$store.state.userInfo.headphoto;
        this.userId = this.$store.state.userInfo.id;
        this.age = this.$route.query.userInfo.age != null &&  this.$route.query.userInfo.age != '' ? this.$route.query.userInfo.age : '请选择年龄';
        this.idnumber = this.$route.query.userInfo.idnumber != null && this.$route.query.userInfo.idnumber != '' ? this.$route.query.userInfo.idnumber : '';
        this.patientname = this.$route.query.userInfo.patientname != null && this.$route.query.userInfo.patientname != '' ? this.$route.query.userInfo.patientname : '';
        this.sex = this.$route.query.userInfo.sex != null && this.$route.query.userInfo.sex != '' ? this.$route.query.userInfo.sex : '';
        document.title = '完善信息';
    },
    methods: {
        confirmRelation(picker, value) {
            var _this = this;
            this.$nextTick(() => {
                var relation = picker.getValues();
                _this.age = relation[0].name;
            });
        },
        saveInformation(){
            if(this.patientname == null || this.patientname == ''){
                this.$toastMsg('请输入患者昵称');
                return;
            }
            if(this.sex == null || this.sex == ''){
                this.$toastMsg('请选择性别');
                return;
            }
            if(this.age == null || this.age == '请选择年龄'){
                this.$toastMsg('请选择年龄');
                return;
            }
            var data = {
                oldid: this.$route.query.userInfo.id,
                id: this.userId,
                patientname: this.patientname,
                sex: this.sex,
                age: this.age,
                idnumber: this.idnumber,
                telephone: this.$route.query.phoneNum
            }
            this.$doRequest('/api/Personal/improvePersonalInformation15',data,res=>{
                if(data.oldid != null && data.oldid != '' && data.oldid != data.id){
                    this.$store.state.userInfo = res.parameters;
                    if(this.form == 'myManage'){
                        this.$router.push({path: '/myManage'});
                    }else if(this.form == 'myOrderDetailsYF'){
                        this.$router.go(-2)
                    }else{
                        this.$router.go(-2)
                    }
                }else{
                    this.$doRequest("/api/Personal/getMyDetial",{ parameters: data.id },res => {
                        res.sessionId = this.$store.state.userInfo.sessionId;
                        this.$store.state.userInfo = res;
                        if(this.form == 'myManage'){
                            this.$router.push({path: '/myManage'});
                        }else if(this.form == 'myOrderDetailsYF'){
                            this.$router.go(-2)
                        }else{
                            this.$router.go(-2)
                        }
                    });
                }
            })
        },
        updateTop(){
            window.scroll(0,0);
        }
    }
}
</script>

<style lang="less" scoped>
@import 'index.less';
</style>

