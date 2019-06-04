<template>
    <div class="bill">
        <el-dialog :visible.sync="exampleshow" title="药方模板" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <p slot="header" style="color:#f60;text-align:center">药方模板</p>
            <div class="billTemplate">
                <div class="left">
                    <div>
                        <span>药品剂型：</span>
                        <Select v-model="prescriptionshapeid" style="width:200px" @on-change="screen()">
                            <Option v-for="item in prescriptionshape" :value="item.itemcode" :key="item.itemcode">{{ item.itemname }}</Option>
                        </Select>
                    </div>
                    <div class="list">
                        <h3>模板列表</h3>
                        <ul class="templateList">
                            <li v-for="(item,index) in templateList" :key="index" @click="cheekTemplate(index)" :class="active == index?'active':''">
                                <span>模板名称：{{item.prescriptionname}}</span>
                                <span>创建日期：{{item.updatetime}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="right">
                    <h3>药方模板详情</h3>
                    <div>
                        <span>模板名称：{{prescriptionname}}</span>
                        <span>创建日期：{{updatetime}}</span>
                    </div>
                    <Table :columns="columns1" :data="billDetails"></Table>
                    <div>
                        <Input v-model="totaldosage" style="width: 60px" />
                        <span>剂，每日</span>
                        <Input v-model="daydosage" style="width: 60px" />
                        <span>剂，分</span>
                        <Input v-model="taketime" style="width: 60px" />
                        <span>次服用</span>
                    </div>
                    <p><Icon type="ios-alert-outline" />您可登录“好中医APP”，前往“首页-药方模板”进行模板新增、修改操作。</p>
                </div>
            </div>
            <div slot="footer">
                <Button type="primary" size="large" @click="echoexample(1)">取消</Button>
                <Button type="primary" size="large" @click="echoexample(2)">引用此药方</Button>
            </div>
        </el-dialog>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import { mapState, mapActions ,mapGetters, mapMutations } from 'vuex'
import common from '@/api/common';
export default {
    props: ['doctorid','exampleshow','prescriptionshapeid'],
    components: {

    },
    data() {
        return {
            prescriptionshape:  [],//剂型集合
            templateList: [],//模板列表
            columns1: [{
                type: 'index',
                width: 80,
                align: 'center'
            },{
                title: '药品名称',
                key: 'medicinename'
            },{
                title: '销售单位',
                key: 'medicineunit'
            },{
                title: '数量',
                key: 'dosage'
            }],
            billDetails: [],//药方详情
            prescriptionname: '',//模板名称
            updatetime: '',//模板创建时间
            totaldosage: '',//总剂数
            daydosage: '',//每日剂数
            taketime: '',//服用次数
            i: '',//模板id，回传时需要
            subPrescriptionshapeid: this.prescriptionshapeid,//剂型，提交时校验
            active: 0,
        }
    },
    computed: {

    },
    //生命周期之挂载完成
    methods: {
        //获取药方剂型
        getbrand(){
            this.$doRequest("/api/Inquiry/getbrand", {}, res=>{
                this.prescriptionshape = res.parameters;
            });
        },
        //获取医生药方模板
        getTemplate(){
            this.active = 0;
            let params = {
                condition: {
                    doctorid: this.doctorid,
                    prescriptionshapeid: this.prescriptionshapeid
                }
            }
            this.templateList = [];
            this.$doRequest("/api/Prescription/template", params, res=>{
                this.templateList = res.parameters;
                if(this.templateList && this.templateList.length>0){
                    this.billDetails = this.templateList[0].medicinalMaterials;
                    this.totaldosage =  this.templateList[0].totaldosage;
                    this.daydosage = this.templateList[0].daydosage;
                    this.taketime = this.templateList[0].taketime;
                    this.updatetime = this.templateList[0].updatetime;
                    this.prescriptionname = this.templateList[0].prescriptionname;
                    this.i = 0;
                }else{
                    this.billDetails = [];
                    this.totaldosage =  '';
                    this.daydosage = '';
                    this.taketime = '';
                    this.updatetime = '';
                    this.prescriptionname = '';
                    this.i = '';
                }

            });
        },
        //按剂型筛选
        screen(){
            this.getTemplate();
        },
        //提交操作
        echoexample(type){
            if(type == 1){
                this.$emit('echoexample',false);
            }else{
                //剂型校验
                if(this.subPrescriptionshapeid == this.templateList[this.i].prescriptionshapeid){
                    let val = {
                        list: this.templateList[this.i],
                        totaldosage: this.totaldosage,
                        daydosage: this.daydosage,
                        taketime: this.taketime
                    };
                    this.$emit('echoexample',val);
                }else{
                    this.$emit('echoexample',false);
                    this.$Modal.confirm({
                        title: '提示',
                        content: '与问诊时所选药品剂型冲突，无法引用此模板',
                        okText: '确定',
                        cancelText: '取消'
                    });
                }
            }
        },
        //查看药方详情
        cheekTemplate(index){
            this.billDetails = this.templateList[index].medicinalMaterials;
            this.totaldosage =  this.templateList[index].totaldosage;
            this.daydosage = this.templateList[index].daydosage;
            this.taketime = this.templateList[index].taketime;
            this.updatetime = this.templateList[index].updatetime;
            this.prescriptionname = this.templateList[index].prescriptionname;
            this.i = index;
            this.active = index;
        }
    },
    watch: {
        doctorid:{ //深度监听，可监听到对象、数组的变化
            handler (newV, oldV) {
                if(newV!=oldV){
                    this.getTemplate();
                }
            },
            deep:true
        },
        exampleshow:{
            handler (newV, oldV) {
                if(newV == true){
                    this.subPrescriptionshapeid = this.prescriptionshapeid;
                }
                if(newV!=oldV){
                    this.getTemplate();

                }
            },
            deep:true
        },
    },
    //生命周期之创建完成
    created: function(){
        this.getbrand();
    },
}
</script>

