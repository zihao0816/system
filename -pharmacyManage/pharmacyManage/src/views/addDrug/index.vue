<template>
    <div class="addDrug">
        <p class="title">当前位置：<span>新增药品</span></p>
        <div class="main">
            <p class="clearfix message"><span>新增药品信息</span></p>
            <el-form :model="form" :inline="true" :rules="rules" ref="form" class="form-inline" label-width="110px">
                <el-form-item label="归属库房：" prop="hospitaid">
                    <el-select placeholder="请选择" v-model="form.hospitaid">
                        <el-option v-for="(item,i) in form.hospita" :key="i" :label="item.hospitaname" :value="item.id"></el-option>
                    </el-select>
                    <p>*请选择归属库房</p>
                </el-form-item>
                <el-form-item label="药剂类型：" prop="prescriptionshapeid">
                    <el-select placeholder="请选择" v-model="form.prescriptionshapename" @change="getbindbrand()">
                        <el-option v-for="(item,i) in form.prescriptionshape" :key="i" :label="item.itemname" :value="i"></el-option>
                    </el-select>
                    <p>*必选</p>
                </el-form-item>
                <el-form-item label="供应商：" prop="supplierid">
                    <el-select placeholder="请选择"  v-model="form.supplierid">
                        <el-option v-for="(item,i) in form.supplier" :key="i" :label="item.suppliername" :value="item.id"></el-option>
                    </el-select>
                    <p>*请选择供应商</p>
                </el-form-item>
                <el-form-item label="品牌商：" prop="brandid">
                    <el-select placeholder="请选择" v-model="form.brandid">
                        <el-option v-for="(item,i) in form.brand" :key="i" :label="item.itemname" :value="item.itemcode"></el-option>
                    </el-select>
                    <p>*请选择品牌商</p>
                </el-form-item>
                <el-form-item label="药材名称：" prop="medicineid">
                    <el-select v-model="form.medicineid" clearable filterable remote reserve-keyword placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                            v-for="item in form.medicine"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <p>*请输入药材名称</p>
                </el-form-item>
                <el-form-item label="药品名称：" prop="drugname">
                    <el-input v-model="form.drugname" placeholder="请输入内容" @blur="getDimName()"></el-input>
                    <p>*请输入药材名称</p>
                </el-form-item>
                <el-form-item label="药品快捷码：" prop="phoneticode">
                    <el-input v-model="form.phoneticode" placeholder="请输入内容"></el-input>
                    <p>*自动生成，可修改</p>
                </el-form-item>
                <el-form-item label="包装规格：" prop="packspecification">
                    <el-input v-model="form.packspecification" placeholder="请输入内容"></el-input>
                    <p>*必填</p>
                </el-form-item>
                <el-form-item label="包装单位：" prop="packunit">
                    <el-input type="number" v-model="form.packunit" placeholder="请输入内容"></el-input>
                    <p>*必填，仅支持数字格式</p>
                </el-form-item>
                <el-form-item label="计量单位：" prop="medicineunit">
                    <el-input v-model="form.medicineunit" placeholder="请输入内容"></el-input>
                    <p>*必填，支持字母/汉字</p>
                </el-form-item>
                <el-form-item label="当量值：" prop="equivalentvalue" v-if="form.isgrain">
                    <el-input type="number" v-model="form.equivalentvalue" placeholder="请输入内容"></el-input>
                    <p>*必填，仅支持数字格式</p>
                </el-form-item>
                <el-form-item label="销售规格：" prop="specification">
                    <el-input v-model="form.specification" placeholder="请输入内容"></el-input>
                    <p>*必填</p>
                </el-form-item>
                <el-form-item label="存量上限：" prop="highstock">
                    <el-input type="number" v-model="form.highstock" placeholder="请输入内容"></el-input>
                    <p>*必填，仅支持数字格式</p>
                </el-form-item>
                <el-form-item label="存量下限：" prop="lowstock">
                    <el-input type="number" v-model="form.lowstock" placeholder="请输入内容"></el-input>
                    <p>*必填，仅支持数字格式</p>
                </el-form-item>
                <el-form-item label="批发价格：" prop="tradeprice">
                    <el-input v-model="form.tradeprice" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="进货价格：" prop="buyingprice">
                    <el-input v-model="form.buyingprice" placeholder="请输入内容"></el-input>
                    <p>*必填</p>
                </el-form-item>
                <el-form-item label="线上零售价：" prop="medicineprice">
                    <el-input v-model="form.medicineprice" placeholder="请输入内容"></el-input>
                    <p>*必填</p>
                </el-form-item>
                <el-form-item label="线下零售价：" prop="offretailprice">
                    <el-input v-model="form.offretailprice" placeholder="请输入内容"></el-input>
                    <p>*必填</p>
                </el-form-item>
                <el-form-item label="">
                </el-form-item>
                <el-form-item class="submit">
                    <el-button type="primary">重置</el-button>
                    <el-button type="primary" @click="drugSubmit('form')">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import { getHLists, } from '@/api/select';
    export default {
        data() {
            return {
                loading: false,
                createby: '',//登录id
                medicinenameList: [],//药品列表暂存
                form: {
                    hospitaid: '',//归属库房
                    hospita: [],//库房arr
                    prescriptionshapeid: '',//纯做提交
                    prescriptionshapename: '',//药剂类型(获取的索引，提交做遍历获取)
                    prescriptionshape: [],//药剂arr
                    supplierid: '',//供应商
                    supplier: [],//供应商arr
                    brandid: '',//品牌商
                    brand: '',//品牌商arr
                    medicineid: '',//药材名称
                    medicine: [],//药材arr
                    list: [],
                    drugname: '',//药品名称
                    phoneticode: '',//快捷码
                    packspecification: '',//包装规格
                    packunit: '',//包装单位
                    medicineunit: '',//计量单位
                    isgrain: false,//是否为颗粒
                    equivalentvalue: '',//当量值
                    specification: '',//销售规格
                    highstock: '',//存量上限
                    lowstock: '',//存量下限
                    tradeprice: '',//批发价格
                    buyingprice: '',//进货价格
                    medicineprice: '',//线上零售价
                    offretailprice: '',//线下零售价
                },
                rules:{
                    hospitaid:[{
                        required: true,
                    }],
                    prescriptionshapeid:[{
                        required: true,
                    }],
                    supplierid:[{
                        required: true,
                    }],
                    brandid:[{
                        required: true,
                        trigger: 'click'
                    }],
                    medicineid:[{
                        required: true,
                        trigger: 'blur'
                    }],
                    phoneticode:[{
                        required: true,
                    }],
                    packspecification:[{
                        required: true,
                    }],
                    packunit:[{
                        required: true,
                    }],
                    medicineunit:[{
                        required: true,
                    }],
                    specification:[{
                        required: true,
                    }],
                    highstock:[{
                        required: true,
                    }],
                    lowstock:[{
                        required: true,
                    }],
                    buyingprice:[{
                        required: true,
                    }],
                    medicineprice:[{
                        required: true,
                    }],
                    offretailprice:[{
                        required: true,
                    }]
                }
            }
        },
        //生命周期之挂载完成
        methods: {
            //获取库房下拉
            getHLists(){
                this.$doRequest("api/hospitainfo/getHLists",{},res => {
                    this.form.hospita = res.parameters;
                });
            },
            //获取剂型下拉
            getbrand(){
                this.$doRequest("api/Inquiry/getbrand",{},res => {
                    this.form.prescriptionshape = res.parameters;
                });
            },
            //触发剂型获取品牌
            getbindbrand(){
                let i = this.form.prescriptionshapename;
                if(this.form.prescriptionshape[i].itemname == '颗粒'){
                    this.form.isgrain = true;
                }else{
                    this.form.isgrain = false;
                }
                this.form.brand = this.form.prescriptionshape[i].prescriptionshapebrands;
                this.form.prescriptionshapename = this.form.prescriptionshape[i].itemname;
                this.form.prescriptionshapeid = this.form.prescriptionshape[i].itemcode;
                this.form.brandid = '';
            },
            //获取供应商下拉
            getSupplierList(){
                this.$doRequest("api/supplier/getSupplierList",{},res => {
                    this.form.supplier = res.parameters;
                });
            },
            //获取药材下拉
            getMedicines(){
                this.$doRequest("api/medicineinfo/getMedicines",{},res => {
                    this.medicinenameList = res.parameters;
                    this.form.list = this.medicinenameList.map(item => {
                        return { value: item.id, label: item.medicinename, code: item.phoneticode };
                    });
                });
            },
            //监听搜索名称
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.form.medicine = this.form.list.filter(item => {
                            if(item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.code.toLowerCase().indexOf(query.toLowerCase()) > -1){
                                return item.label;
                            }
                        });
                    }, 200);
                } else {
                    this.form.medicine = [];
                }
            },
            //快捷码生成
            getDimName(){
                let params = {
                    medicinename: this.form.drugname
                };
                this.$doRequest("api/PhMedicine/getDimName", params,res => {
                    this.form.phoneticode = res.parameters;
                });
            },
            //提交
            drugSubmit(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        //剂型处理
                        let params = {
                            hospitaid: this.form.hospitaid,
                            prescriptionshapeid: this.form.prescriptionshapeid,
                            supplierid: this.form.supplierid,
                            brandid: this.form.brandid,
                            medicineid: this.form.medicineid,
                            phoneticode: this.form.phoneticode,
                            packspecification: this.form.packspecification,
                            packunit: this.form.packunit,
                            medicineunit: this.form.medicineunit,
                            specification: this.form.specification,
                            highstock: this.form.highstock,
                            lowstock: this.form.lowstock,
                            buyingprice: this.form.buyingprice,
                            medicineprice: this.form.medicineprice,
                            offretailprice: this.form.offretailprice,
                            tradeprice: this.form.tradeprice,
                            medicinename: this.form.drugname,//药品名称
                            equivalentvalue: this.form.equivalentvalue,//当量值
                            createby: this.createby//登录人id
                        };
                        this.$doRequest("api/pharmacymedicines/insertPharmacymedicines", params,res => {
                            if(res.result >= 1){
                                this.$message({
                                    message: '新增药品成功！',
                                    type: 'success'
                                });
                                this.$router.push({path: '/drugStorage'});
                            }else{
                                this.$message({
                                    message: res.message,
                                    type: 'error'
                                });
                            }
                        });
                    }
                });
            },
            reset(){
                this.form.drugname = '';
                this.form.prescriptionshapeid = '';
                this.form.supplierid = '';
                this.form.brandid = '';
                this.form.medicineid = '';
                this.form.phoneticode = '';
                this.form.packspecification = '';
                this.form.packunit = '';
                this.form.medicineunit = '';
                this.form.specification = '';
                this.form.highstock = '';
                this.form.lowstock = '';
                this.form.buyingprice = '';
                this.form.buyingprice = '';
                this.form.medicineprice = '';
                this.form.offretailprice = '';
            }
        },
        //生命周期之创建完成
        created: function(){
            let session = JSON.parse(sessionStorage.getItem('userInfo'));
            this.createby = session.id;
            this.hospitaid = session.cnameid;
            this.getHLists();
            this.getbrand();
            this.getSupplierList();
            this.getMedicines();
        },
    }
</script>

