<template>
    <div class="therapy">
      <div class="gotoreg" @click="gotodat()">
           <i class='el-icon-back'></i> 返回大厅
        </div>
<!-- 用户信息 -->
        <div class="diagnosis">
            <div class="diabody">
                <div class="diaone">
                    <span class="spans">姓名：<input class="inputs" placeholder="请输入患者姓名" v-model="name" type="text"></span>
                    <span class="spans">性别：
                        <RadioGroup v-model="sex" size="large">
                            <Radio label="1">男</Radio>
                            <Radio label="2">女</Radio>
                        </RadioGroup>
                    </span>
                    <span class="spans">生日：
                        <el-date-picker
                            v-model="age"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                            </el-date-picker>
                    </span>
                    <span class="spans">手机号：<input class="inputs" placeholder="请输入患者手机号" maxlength="11" v-model='phone' type="number"></span>
                </div>
            </div>
        </div>  
<!-- 用户信息 -->



<!-- 项目选择 -->
        <div class="Prescribe">
            <div class="pcbody">
                <div>
                    <CheckboxGroup v-model="physio">
                        <Checkbox v-for="index in physiothera" :key="index.id" :label="index.id" class="infocheck">
                            <span>{{index.name}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </div>
                <div class="dw">
                    <span>理疗周期<input maxlength="3" class="inputs" v-model='cycle' type="number">天，理疗次数<input class="inputs" v-model='once' type="number">次，
                        理疗师：
                        <Select v-model="thera" style="width:100px">
                            <Option v-for="item in therapist" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </span>
                </div>
            </div>
        </div>  
<!-- 项目选择 -->



<!-- 确认按钮 -->
    <div class="fd">
        <Button class="fr" @click='getsheet()' type="success" style="background:#07A591">确认生成订单</Button>
        <span></span>
        <span class="fr"  style="line-height:35px;">费用总计：<span style="color:#D74326; font-size:22px;">￥{{total}}</span></span>
    </div>
<!-- 确认按钮 -->


<!-- 支付弹窗 -->
    <Modal v-model="pays" width="500" height='700'>
        <p slot="header" style="text-align:center">
            <span>开单成功</span>
        </p>
        <div>
            {{message}}
        </div>
        <div slot="footer">
            <div style="margin: 10px 0;display:flex;justify-content: space-around;">
                <Button  @click="gotother()">前去支付</Button>
                <Button @click="gotopay()">继续开单</Button>
            </div>
        </div>
    </Modal>

<!-- 支付弹窗 -->

    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    export default {
       components: {
            
        },
        data() {
            return {
                sex:'1',
                name:'',
                cycle:7,
                age:'',
                phone:'',
                once:1,
                thera:'',
                therapist:[],
                physio:[],
                physiothera:[],
                clinicid:'',
                list:[],
                total:0,
                price:0,
                ids:'',
                username:'',
                pays:false,
                message:'开方成功，请选择是否留在当前页面？'
            }
        },
        //生命周期之挂载完成
        methods: {
            getsheet(){
                var _this = this;
                if(this.name==''){
                    _this.$message.warning("请输入姓名")
                }else if(this.age == ''){
                    _this.$message.warning("请选择生日")
                }else if(this.phone  == ''){
                    _this.$message.warning("请输入手机号")
                }else if(this.total  == 0){
                    _this.$message.warning("请设置理疗项目和理疗次数")
                }else if(!(/^1[34578]\d{9}$/.test(this.phone))){
                    _this.$message.warning("请输入正确手机号")
                }else if(this.thera ==''){
                    _this.$message.warning("请选择理疗师")                    
                }else{
                this.$doRequest("/api/physiotherapysheet/save",{
                    "patienid":null, //
                    "accountid":this.ids,
                    "accountname":this.username,
                    "patienname":this.name,
                    "patiensex":this.sex,
                    "birthday":this.age,
                    "patientel":this.phone,
                    "cycle":this.cycle,
                    "times":this.once,
                    "physiotherapistid":this.thera,
                    "physiotherapistname": this.createname,
                    "consumption":this.total,
                    "phyidList":this.physio
                },function(res){
                    _this.pays = true;
                    })
                }
            },
            creating(){
                var _this = this;
                 this.$doRequest("/api/physiotherapist/list?clinicid="+this.clinicid,null,function(res){
                        _this.therapist = res;
                    })
                this.$doRequest("/api/physiotherapylist/list?clinicid="+this.clinicid,null,function(res){
                        _this.physiothera = res;
                    })
            },
            gotodat(){
                this.$router.push({ path:'/registrationHall' })
            },
            gotother(){
                this.$router.push({path:'/therapyPrescription'});
            },
            gotopay(){
                this.pay = false;
                this.sex='1';
                this.name='';
                this.cycle=7;
                this.age='';
                this.phone='';
                this.once=1;
                this.thera='';
                this.physio=[];
                this.list=[];
                this.total=0;
                this.price=0;
                this.pays=false;
            }
        },
        //生命周期之创建完成
        created: function(){
            var logindetail = JSON.parse(sessionStorage.getItem('loginDetail'))
            this.clinicid = logindetail.parameters.cnameid;
            this.ids = logindetail.parameters.id;
            this.username = logindetail.parameters.username;
            this.creating()
        },
        watch:{
            physio(news){
                var items = this.physiothera;
                var total = 0;
                for(var i in news){
                    var data= items.filter(function(item){
                        return item.id == news[i]; 
                    })
                    total += parseInt(data[0].collectfees);
                }
                this.price = total;
                
            },
            thera(news){
                var items = this.therapist;
                var data= items.filter(function(item){
                        return item.id == news; 
                    })
                    this.createname = data[0].name;
            },
            price(){
                this.total = this.price*this.once;
            },
            once(){
                this.total = this.price*this.once;
            },
        }
    }
</script>
<style lang="less" scoped>

/*在谷歌下移除input[number]的上下箭头*/
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0;
}
/*在firefox下移除input[number]的上下箭头*/
input[type="number"]{-moz-appearance:textfield;}

</style>

