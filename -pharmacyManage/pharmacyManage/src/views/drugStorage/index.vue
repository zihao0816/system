<template>
    <div class="drugStorage">
        <p class="title">当前位置：<span>药品库</span></p>
        <div class="main">
            <!-- 搜索区域 -->
            <div class="search">
                <div>
                    <label>药品名称：</label>
                    <el-select v-model="medicineId" clearable filterable remote reserve-keyword placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="selectload">
                        <el-option
                            v-for="item in options4"
                            :key="item.value"
                            :label="item.label+'-'+item.type"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>药品剂型：</label>
                    <el-select v-model="prescriptionshapeid" placeholder="请选择">
                        <el-option v-for="(item,i) in prescriptionshape" :key="i" :label="item.itemname" :value="item.itemcode"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>状态：</label>
                    <el-select v-model="drugstate" placeholder="请选择">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="下架" value="2"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>供应商：</label>
                    <el-select v-model="supplierid" placeholder="请选择">
                        <el-option v-for="(item,i) in supplier" :key="i" :label="item.suppliername" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>总存量：</label>
                    <el-input type="number" v-model="statotalstock" placeholder="请输入内容"></el-input>
                    <span>-</span>
                    <el-input type="number" v-model="endtotalstock" placeholder="请输入内容"></el-input>
                </div>
                <el-button type="primary" @click="search(1)">重置</el-button>
                <el-button type="primary" @click="search(2)">搜索</el-button>
            </div>
            <!-- 搜索区域 -->
            <!-- 药品库 -->
            <el-table :data="storage" border style="width: 100%" align="center" highlight-current-row v-loading="loading">
                <el-table-column label="序号" width="100">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.drugcode" placement="top">
                            <span class="drugcode">{{scope.row.drugcode}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="medicinename" label="药品名称" width="200"></el-table-column>
              <el-table-column prop="medicineprice" label="线上零售价格" width="110"></el-table-column>
              <el-table-column prop="offretailprice" label="线下零售价格" width="110"></el-table-column>
                <el-table-column prop="totalstock" label="总存量" width="120"></el-table-column>
                <el-table-column prop="phoneticode" label="快捷码" width="140"></el-table-column>
                <el-table-column prop="specification" label="药品规格" width="120"></el-table-column>
                <el-table-column prop="prescriptionshapename" label="药品剂型" width="120"></el-table-column>
                <el-table-column prop="packunit" label="包装单位" width="120"></el-table-column>
                <el-table-column prop="suppliername" label="供应商"></el-table-column>
                <el-table-column prop="lastwarehousetime" label="最近入库时间" width="170"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.drugstate == 1?'正常':'下架'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="upInfo(scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="soldOut(scope.row)" :style="scope.row.drugstate == 1?'':'color: #ddd;'">下架</el-button>
                        <el-button type="text" size="small" @click="checkMarket(scope.row,1)">销售明细</el-button>
                        <el-button type="text" size="small" @click="checkMarket(scope.row,2)">入库明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="records" :page-size="pageSize" @current-change="handleCurrentChange" @prev-click="prev" @next-click='next'></el-pagination>
            <!-- 药品库 -->
            <!-- small弹框（操作提醒） -->
            <el-dialog
                title="下架提醒"
                :visible.sync="soldOutDrug"
                width="30%"
                center>
                <div class="center">
                    <p>即将下架药品{{soldOutMedicinename}}，医生将无法开具该药品，但系统中依然保留药品信息，且不会影响已支付订单/药房的药品领取过程</p>
                    <p>确认下架？</p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="soldOutDrug = false">取 消</el-button>
                    <el-button type="primary" @click="soldSubmit()">下架</el-button>
                </span>
            </el-dialog>
            <!-- small弹框 -->
            <!-- 编辑弹框 -->
            <el-dialog
                title="修改药品信息提醒"
                :visible.sync="upDrugInfo"
                width="60%"
                center>
                <div class="center">
                    <el-form :model="druginfo" :inline="true" class="form-inline" label-width="110px">
                        <el-form-item label="药品名称：" prop="medicinename">
                            <el-input v-model="druginfo.medicinename" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="药品快捷码：" prop="phoneticode">
                            <el-input v-model="druginfo.phoneticode" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="药品编号：" prop="drugcode">
                            <el-input v-model="druginfo.drugcode" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="药品剂型：" prop="prescriptionshapeid">
                            <el-input v-model="druginfo.prescriptionshapeid" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="包装规格：" prop="specification">
                            <el-input v-model="druginfo.specification" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="包装单位：" prop="packunit">
                            <el-input v-model="druginfo.packunit" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="计量单位：" prop="medicineunit">
                            <el-input v-model="druginfo.medicineunit" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="批发价：" prop="tradeprice">
                            <el-input v-model="druginfo.tradeprice" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="进货价：" prop="buyingprice">
                            <el-input v-model="druginfo.buyingprice" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="供应商：" prop="supplierid">
                            <el-input v-model="druginfo.suppliername" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="存量下限：" prop="lowstock">
                            <el-input v-model="druginfo.lowstock" placeholder="请输入内容"></el-input>
                            <p>*输入值大于1</p>
                        </el-form-item>
                        <el-form-item label="存量上限：" prop="highstock">
                            <el-input v-model="druginfo.highstock" placeholder="请输入内容"></el-input>
                            <p>*输入值大于1</p>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="upDrugInfo = false">取 消</el-button>
                    <el-button type="primary" @click="updateDrug('druginfo')">保存修改</el-button>
                </span>
            </el-dialog>
            <!-- 编辑弹框 -->
            <!-- 销售/入库明细 -->
            <el-dialog
                :title="detailTit"
                :visible.sync="checkDrugMarket"
                width="60%"
                :before-close="handleClose"
                 v-loading="loading"
                center>
                <div class="center">
                    <div class="search">
                        <div>
                            <label>{{searchTit}}：</label>
                            <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="searchDate()">
                            </el-date-picker>
                        </div>
                        <el-button type="primary" style="float:right" @click="detailSearch()">搜索</el-button>
                    </div>
                    <el-table :data="sellStorage" border style="width: 100%" v-if="pullType == 1" highlight-current-row>
                        <el-table-column prop="drugname" label="药品名称" width="120"></el-table-column>
                        <el-table-column prop="prescriptionshapeid" label="药品剂型" width="120"></el-table-column>
                        <el-table-column prop="packagequantity" label="包装数量" width="120"></el-table-column>
                        <el-table-column prop="hospitaname" label="医院名称" width="180"></el-table-column>
                        <el-table-column prop="department" label="科室名称" width="120"></el-table-column>
                        <el-table-column prop="doctorname" label="医师名称" width="120"></el-table-column>
                        <el-table-column prop="dosage" label="成交销量" width="120"></el-table-column>
                        <el-table-column prop="price" label="成交零售价" width="120"></el-table-column>
                        <el-table-column prop="totalprice" label="成交金额" width="120"></el-table-column>
                        <el-table-column prop="suppliername" label="供应商" width="120"></el-table-column>
                        <el-table-column prop="orderid" label="处方订单号" width="240"></el-table-column>
                        <el-table-column prop="paytime" label="支付时间" width="180"></el-table-column>
                        <el-table-column prop="warehousename" label="库房" width="200"></el-table-column>
                    </el-table>
                    <el-table :data="pullStorage" border style="width: 100%" v-if="pullType == 2" highlight-current-row>
                        <el-table-column prop="suppliername" label="供应商" width="120"></el-table-column>
                        <el-table-column prop="medicinename" label="药品名称" width="200"></el-table-column>
                        <el-table-column prop="prescriptionshapename" label="药品剂型" width="100"></el-table-column>
                        <el-table-column prop="phoneticode" label="快捷码" width="140"></el-table-column>
                        <el-table-column prop="packagequantity" label="包装数量" width="100"></el-table-column>
                        <el-table-column prop="tradeprice" label="批发价"></el-table-column>
                        <el-table-column prop="buyingprice" label="进货价" width="100"></el-table-column>
                        <el-table-column prop="medicineprice" label="线上零售价" width="140"></el-table-column>
                        <el-table-column prop="offretailprice" label="线下零售价" width="140"></el-table-column>
                        <el-table-column prop="batchcode" label="批次号" width="120"></el-table-column>
                        <el-table-column prop="warehousequantity" label="入库数量" width="100"></el-table-column>
                        <el-table-column prop="warehousetime" label="入库日期" width="180"></el-table-column>
                        <el-table-column prop="warehousecode" label="入库单号" width="300"></el-table-column>
                        <el-table-column prop="username" label="操作人" width="120"></el-table-column>
                    </el-table>
                    <el-pagination v-if="mxRecords>=10" layout="prev, pager, next" :total="mxRecords" :page-size="mxPageSize" @current-change="mxhandleCurrentChange" @prev-click="mxprev" @next-click='mxnext'></el-pagination>
                </div>
            </el-dialog>
            <!-- 销售/入库明细 -->
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from '../../api/common';
export default {
    data() {
        return {
            createby: '',//用户id
            hospitaid: '',//库id
            //搜索药品名时所需参数
            medicinename: '',
            options4: [],
            list: [],
            selectload: false,
            medicinenameList: [],
            medicineId: '',//搜索药名
            prescriptionshapeid: '',//搜索剂型
            prescriptionshape: [],//剂型下拉
            drugstate: '',//搜索状态
            supplierid: '',//搜索供应商
            supplier: [],
            storage: [],
            statotalstock: '',
            endtotalstock: '',
            //各种弹框
            soldOutDrug: false,
            upDrugInfo: false,
            checkDrugMarket: false,
            //编辑药品回显
            druginfo: {},
            //下架时
            soldOutId: '',
            soldOutMedicinename: '',
            //分页
            records: 0,
            pageSize: 30,
            pagination: 1,
            //明细弹框（1销售/2入库）
            checkid: '',
            detailTit: '',
            searchTit: '',
            date: [],//时间段（销售明细和入库明细搜索）
            startdate: '',//开始时间（销售明细和入库明细搜索）
            enddate: '',//结束时间（销售明细和入库明细搜索）
            pullType: '',
            pullDate: '',
            pullNum: '',
            supplier: '',
            pullTotal: '',
            pullStorage: [],
            sellStorage: [],
            //销售明细/入库明细的分页参数
            mxRecords: 0,//Records
            mxPageSize: 10,
            mxPagination: 1,
            loading: true
        }
    },
    //生命周期之挂载完成
    methods: {
        //分页
        handleCurrentChange(val){
            this.pagination = val;
            this.getListsByHid();
        },
        prev(val){
            this.pagination = val-1;
            this.getListsByHid();
        },
        next(val){
            this.pagination = val+1;
            this.getListsByHid();
        },
        //明细分页
        mxhandleCurrentChange(val){
            this.mxPagination = val;
            if(this.pullType == 1){
                this.getSaleDetails();
            }else{
                this.queryPageByCondition();
            }
        },
        mxprev(val){
            this.mxPagination = val-1;
            if(this.pullType == 1){
                this.getSaleDetails();
            }else{
                this.queryPageByCondition();
            }
        },
        mxnext(val){
            this.mxPagination = val+1;
            if(this.pullType == 1){
                this.getSaleDetails();
            }else{
                this.queryPageByCondition();
            }
        },
        //下架弹框
        soldOut(row){
            if(row.drugstate == 1){
                this.soldOutId = row.id;
                this.soldOutMedicinename = row.medicinename;
                this.soldOutDrug = true;
            }else{
                this.$message.error('此药品已下架');
            }
        },
        //确认下架
        soldSubmit(){
            let params = {
                drugid: this.soldOutId,
                drugstate: 2,
                updateby: this.createby
            }
            this.$doRequest("api/PhMedicine/unShelveMedicineinfo", params,res => {
                if(res.result == 1){
                    this.$message({
                        message: '下架成功',
                        type: 'success'
                    });
                    this.soldOutDrug = false;
                    this.getListsByHid();
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        //编辑药品回显
        upInfo(row){
            this.upDrugInfo = true;
            this.druginfo = row;
            if(!this.druginfo.lowstock){
                this.druginfo.lowstock = '';
            }
            if(!this.druginfo.highstock){
                this.druginfo.highstock = '';
            }
        },
        updateDrug(){
            if(!this.druginfo.lowstock){
                this.$message.error('存量下限不能为空');
                return;
            }else if(!this.druginfo.highstock){
                this.$message.error('存量上限不能为空');
                return;
            }else if(this.druginfo.lowstock > this.druginfo.highstock){
                this.$message.error('存量下限不能大于存量上限');
                return;
            }else{
                let params = {
                    id: this.druginfo.id,
                    medicinename: this.druginfo.medicinename,
                    phoneticode: this.druginfo.phoneticode,
                    tradeprice: this.druginfo.tradeprice,
                    prescriptionshapeid: this.druginfo.prescriptionshapeid,
                    medicineunit: this.druginfo.medicineunit,
                    specification: this.druginfo.specification,
                    phoneticode: this.druginfo.phoneticode,
                    supplierid: this.druginfo.supplierid,
                    buyingprice: this.druginfo.buyingprice,
                    highstock: this.druginfo.highstock,//存量上限
                    lowstock: this.druginfo.lowstock,//存量下限
                    packunit: this.druginfo.packunit,
                    packspecification: this.druginfo.packspecification,
                    updateby: this.createby,
                };
                this.$doRequest("api/PhMedicine/updateDrug", params,res => {
                    if(res.result >= 0){
                        this.$message({
                            message: '药品修改成功！',
                            type: 'success'
                        });
                        this.upDrugInfo = false;
                    }else{
                        this.$message({
                            message: res.message,
                            type: 'error'
                        });
                    }
                });
            }
        },
        //获取入库明细
        queryPageByCondition(){
            let params = {
                pageLength: this.mxPageSize,
                pagination: this.mxPagination,
                condition: {
                    hospitaid: this.hospitaid,
                    drugid: this.checkid,
                    starttime: this.startdate,
                    endtime: this.enddate
                }
            };
            this.$doRequest("api/medicinetostoragedetails/queryPageByCondition", params,res => {
                if(res.result >= 0){
                    this.loading = false;
                    res.parameters.rows.forEach(item => {
                        item.warehousetime = common.timestampToTime(item.warehousetime);
                    });
                    this.mxRecords = res.parameters.records;
                    this.pullStorage = res.parameters.rows;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        //获取销售明细
        getSaleDetails(){
            let params = {
                pageLength: this.mxPageSize,
                pagination: this.mxPagination,
                condition:{
                    drugid: this.checkid,
                    starttime: this.startdate,
                    endtime: this.enddate
                }
            };
            this.$doRequest("api/PhMedicine/getSaleDetails", params,res => {
                if(res.result >= 0){
                    this.loading = false;
                    res.parameters.rows.forEach(item => {
                        item.paytime = common.timestampToTime(item.paytime);
                    });
                    this.mxRecords = res.parameters.records;
                    this.sellStorage = res.parameters.rows;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        //查看销售明细/入库明细
        checkMarket(row,type){//1销售2入库
            this.loading = true;
            this.checkid = row.id;
            this.checkDrugMarket = true;
            if(type == 1){
                this.detailTit = '药品'+ row.medicinename +'销售明细';
                this.searchTit = '支付时间';
                this.pullType = 1;
                this.getSaleDetails();
            }else{

                this.detailTit = '药品'+ row.medicinename +'入库明细';
                this.searchTit = '入库时间';
                this.pullType = 2;
                this.queryPageByCondition();
            }
        },
        //入库明细和销售明细按时间段搜索
        detailSearch(){
            if(this.pullType == 1){
                this.getSaleDetails();
            }else{
                this.queryPageByCondition();
            }
        },
        //关闭销售明细/入库明细
        handleClose(){
            this.date = [];
            this.startdate = '';
            this.enddate = '';
            this.mxTotal = 0;
            this.mxPageSize = 10;
            this.mxPagination = 1;
            this.checkDrugMarket = false;
        },
        //监听搜索药品名称
        remoteMethod(query) {
            if (query !== '') {
                this.selectload = true;
                setTimeout(() => {
                    this.selectload = false;
                    this.options4 = this.list.filter(item => {
                        if(item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.code.toLowerCase().indexOf(query.toLowerCase()) > -1){
                            return item.label;
                        }
                    });
                }, 200);
            } else {
                this.options4 = [];
            }
        },
        //获取药品下拉列表
        getMedicines(){
            let params = {
                hospitaid: this.hospitaid
            }
            this.$doRequest("api/pharmacymedicines/getpmedicineLists", params,res => {
                this.medicinenameList = res.parameters;
                this.list = this.medicinenameList.map(item => {
                    return { value: item.id, label: item.medicinename, code: item.phoneticode, type: item.prescriptionshapename};
                });
            });
        },
        //获取剂型下啦
        getbrand(){
            this.$doRequest("api/Inquiry/getbrand",{},res => {
                this.prescriptionshape = res.parameters;
            });
        },
        //获取供应商列表
        getSupplierList(){
            this.$doRequest("api/supplier/getSupplierList",{},res => {
                this.supplier = res.parameters;
            });
        },
        //搜索
        search(type){
            if(type == 1){
                this.medicineId = '';
                this.prescriptionshapeid = '';
                this.drugstate = '';
                this.supplierid = '';
                this.statotalstock = '';
                this.endtotalstock = '';
            }
            this.getListsByHid();
        },
        //获取药品列表
        getListsByHid(){
            let id = '';
            if(this.medicineId){
                id = this.medicineId;
            }
            let params = {
                pageLength: this.pageSize,
                pagination: this.pagination,
                condition: {
                    hospitaid: this.hospitaid,
                    id: id,
                    prescriptionshapeid: this.prescriptionshapeid,
                    drugstate: this.drugstate,
                    supplierid: this.supplierid,
                    statotalstock: Number(this.statotalstock),
                    endtotalstock: Number(this.endtotalstock)
                }
            };
            this.$doRequest("api/pharmacymedicines/getListsByHid", params,res => {
                this.loading = false;
                res.parameters.rows.forEach(item => {
                    if(item.lastwarehousetime){
                        item.lastwarehousetime = common.timestampToTime(item.lastwarehousetime);
                    }
                });
                this.storage = res.parameters.rows;
                this.records = res.parameters.records;
            });
        },
        searchDate(){
            this.startdate = this.date[0];
            this.enddate = this.date[1];
        }
    },
    //生命周期之创建完成
    created: function(){
        let session = JSON.parse(sessionStorage.getItem('userInfo'));
        this.createby = session.id;
        this.hospitaid = session.cnameid;
        this.getMedicines();
        this.getbrand();
        this.getSupplierList();
        this.getListsByHid();
    },
}
</script>

