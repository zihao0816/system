<template>
    <div class="storageManage">
        <div class="page">
            <div class="top">
                <el-form :inline="true" ref="storages" :model="storages" label-width="100px">
                    <el-form-item label="库房名称：" prop="storageid">
                        <el-select v-model="storages.storageid" placeholder="请选择">
                            <el-option v-for="(item,index) in storageList" :key="index" :label="item.hospitaname" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="clear('storages')">重置</el-button>
                        <el-button type="primary" @click="query">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="content">
                <ul>
                    <li v-for="(item,index) in storage" :key="index">
                        <p class="titles">{{item.hospitaname}}</p>
                        <div>
                            <p>
                                <span>区域：</span>
                                <span>{{item.province}}-{{item.city}}-{{item.contry}}</span>
                            </p>
                            <p @click="dialogWarn(item)">
                                <span>预警：</span>
                                <span>{{item.warnnum}}</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>药材种类：</span>
                                <span>{{item.totaldrug}}</span>
                            </p>
                            <p>
                                <span>存量总额：</span>
                                <span>{{item.totalmoney}}</span>
                            </p>
                        </div>
                        <div>
                            <p @click="dialogSale(item)">
                                <span>销售额：</span>
                                <span>{{item.salemoney}}</span>
                            </p>
                            <p>
                                <span>处方数：</span>
                                <span>{{item.ordernum}}</span>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <el-dialog class="dialog-warn" :title="title1" :visible.sync="dialogToWarning" width="60%" center>
                <el-form :inline="true" class="form-inline clearfix" label-width="90px">
                    <el-form-item label="药品名称：">
                        <el-select v-model="pmedicineid" clearable filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请输入药品名称">
                            <el-option v-for="(item,index) in pmedicineList" :key="index" :label="item.medicinename" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="预警类型：">
                        <el-select placeholder="请选择" v-model="type">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="系统预警" value="2"></el-option>
                            <el-option label="人工预警" value="3"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="状态：">
                        <el-select placeholder="请选择" v-model="state">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="下架" value="2"></el-option>
                            <el-option label="删除" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <div style="float:right">
                        <el-button type="primary" size="small" @click="resets">重置</el-button>
                        <el-button type="primary" size="small" @click="searchs">查询</el-button>
                    </div>
                </el-form>
                <el-table border style="width: 100%;" :data="warnData" highlight-current-row>
                    <el-table-column fixed prop="hospitaname" label="库房名称" width="170"></el-table-column>
                    <el-table-column prop="medicinename" label="药品名称" ></el-table-column>
                    <el-table-column prop="prescriptionshapename" label="药材剂型"></el-table-column>
                    <el-table-column prop="packspecification" label="包装规格" ></el-table-column>
                    <el-table-column prop="medicineunit" label="包装单位" ></el-table-column>
                    <el-table-column prop="packagequantity" label="包装数量"></el-table-column>
                    <el-table-column prop="totalstock" label="当前存量" ></el-table-column>
                    <el-table-column prop="highstock" label="上限" ></el-table-column>
                    <el-table-column prop="lowstock" label="下限"></el-table-column>
                    <el-table-column prop="drugtypes" label="预警类型" ></el-table-column>
                    <el-table-column prop="drugstates" label="状态" ></el-table-column>
                    <el-table-column fixed="right" prop="" label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="checkMarket(scope.row)">销售明细</el-button>
                            <!-- <el-button type="text" size="small" @click="upInfo(scope.row)">补仓</el-button> -->
                            <el-button type="text" size="small" @click="soldOut(scope.row)">下架</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer clearfix">
                    <el-pagination style="float:right;" layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="changePage"></el-pagination>
                </span>
            </el-dialog>
            <el-dialog class="dialog-sales" :title="title2" :visible.sync="dialogToSales" width="60%" center highlight-current-row>
                <el-form :inline="true" class="form-inline clearfix" label-width="100px">
                    <el-form-item label="支付时间：">
                        <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <div style="float:right">
                        <el-button type="primary" size="mini" @click="reset">重置</el-button>
                        <el-button type="primary" size="mini" @click="search">查询</el-button>
                    </div>
                </el-form>
                <!-- <div>
                    <label for="">累积销售额</label><span></span>
                    <label for="">累积处方数</label><span></span>
                </div> -->
                <el-table border style="width: 100%;" :data="saleData" highlight-current-row>
                    <el-table-column prop="drugname" fixed label="药品名称" ></el-table-column>
                    <el-table-column prop="prescriptionshapeid" label="药品剂型"></el-table-column>
                    <el-table-column prop="packagequantity" label="包装数量"></el-table-column>
                    <el-table-column prop="hospitaname" label="医院名称" width="170"></el-table-column>
                    <el-table-column prop="department" label="科室名称" ></el-table-column>
                    <el-table-column prop="doctorname" label="医师名称" ></el-table-column>
                    <el-table-column prop="dosage" label="成交销量" ></el-table-column>
                    <el-table-column prop="price" label="成交零售价" ></el-table-column>
                    <el-table-column prop="suppliername" label="供应商" ></el-table-column>
                    <el-table-column prop="orderid" label="处方订单号" width="220"></el-table-column>
                    <el-table-column prop="paytime" label="支付时间" width="170"></el-table-column>
                    <el-table-column prop="warehousename" fixed="right" label="库房" width="170"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer clearfix">
                    <el-pagination style="float:right;" layout="prev, pager, next" :total="totals" :page-size="pageSize" @current-change="changePages"></el-pagination>
                </span>
            </el-dialog>
            <el-dialog class="dialog-pushDel" title="下架提醒" :visible.sync="dialogshelves" width="18%" center>
                <p style="font-size:16px;">即将下架药品“{{medicinename}}”医生将无法开具该药品，但系统中依然保留药品信息，且不会影响已支付订单/药方的药品领取进程</p>
                <p style="margin:20px 0;font-size:16px;">确认下架？</p>
                <div style="text-align:center;">
                    <el-button type="primary" size="mini" @click="updateShelves">下架</el-button>
                    <el-button type="primary" size="mini" @click="dialogshelves = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from '../../api/common.js'
    export default {
        components: {

        },
        data() {
            return {
                dialogToWarning: false,
                dialogToSales: false,
                dialogshelves: false,
                storage: [],
                warnData: [],
                saleData: [],
                pagination: 1,
                pageSize: 10,
                total: 0,
                paginations: 1,
                totals: 0,
                storages:{
                    storageid: '',
                    storageList: [],
                },
                date: '',
                starttime: '',
                endtime: '',
                drugid: '',
                list:[],
                pmedicineid: '',
                pmedicineList: [],
                state: '',
                hospitaid: '',
                medicinename: '',
                data: {},
                title1: '',
                title2: ''
            }
        },
        //生命周期之挂载完成
        methods: {
            query(){
                var hospitaid = JSON.parse(sessionStorage.getItem('userInfo')).cnameid;
                if(this.storageid != ''){
                    hospitaid = this.storages.storageid;
                }
                this.$doRequest('/api/PhMedicine/getTotalWareHouse',{hospitaid: hospitaid}, res=>{
                    this.storage = res.parameters
                })
            },
            queryWarn(){
                var data = {
                    pagination : this.pagination,
                    condition : {
                        hospitaid: this.hospitaid,
                        id: this.pmedicineid,
                        drugstate: this.state
                    }
                }
                this.$doRequest('/api/PhMedicine/queryWarningDrug',data,res=>{
                    for(var i=0;i<res.parameters.rows.length;i++){
                        if(res.parameters.rows[i].drugstate == '1'){
                            res.parameters.rows[i].drugstates = '正常';
                        }else if(res.parameters.rows[i].drugstate == '2'){
                            res.parameters.rows[i].drugstates = '下架';
                        }else if(res.parameters.rows[i].drugstate == '3'){
                            res.parameters.rows[i].drugstates = '删除';
                        }
                        if(res.parameters.rows[i].drugtype == '1'){
                            res.parameters.rows[i].drugtypes = '正常';
                        }else if(res.parameters.rows[i].drugtype == '2'){
                            res.parameters.rows[i].drugtypes = '系统预警';
                        }else if(res.parameters.rows[i].drugtype == '3'){
                            res.parameters.rows[i].drugtypes = '人工预警';
                        }
                    }
                    this.warnData = res.parameters.rows;
                    this.total = res.parameters.records;
                })
            },
            querySale(){
                var data = {
                    pagination: this.paginations,
                    condition: {
                        hospitaid: this.hospitaid,
                        drugid: this.drugid,
                        starttime: this.starttime,
                        endtime: this.endtime
                    }
                }
                this.$doRequest('/api/PhMedicine/getSaleDetails', data, res=>{
                    for(var i=0;i<res.parameters.rows.length;i++){
                        res.parameters.rows[i].paytime = common.timestampToTime(res.parameters.rows[i].paytime);
                    }
                    this.saleData = res.parameters.rows;
                    this.totals = res.parameters.records;
                })
            },
            queryMedicine(){
                var hospitaid = JSON.parse(sessionStorage.getItem('userInfo')).cnameid;
                var data = {
                    hospitaid: hospitaid
                }
                this.$doRequest('/api/pharmacymedicines/getpmedicineLists',data,res=>{
                    this.list = res.parameters
                })
            },
            changePage(val){
                this.pagination = val;
                this.queryWarn();
            },
            changePages(val){
                this.paginations = val;
                this.querySale();
            },
            clear(formName){
                this.$refs[formName].resetFields();
            },
            search(){
                this.paginations = 1;
                this.starttime = this.date[0];
                this.endtime = this.date[1];
                this.querySale();
            },
            reset(){
                this.date = '';
                this.starttime = '';
                this.endtime = '';
            },
            searchs(){
                this.pagination = 1;
                this.queryWarn();
            },
            resets(){
                this.pmedicineid = '';
                this.state = '';
            },
            remoteMethod(query){
                if (query !== '') {
                    var code = query.toLowerCase();
                    this.loading = true;
                    var drugList = this.list;
                    this.loading = false;
                    var list = drugList.map(item =>{
                        return {
                            id: item.id,
                            medicineid: item.medicineid,
                            medicinename:item.medicinename,
                            medicineprice:item.medicineprice,
                            medicineunit:item.medicineunit,
                            packspecification:item.packspecification,
                            medname: item.medname,
                            equivalentvalue: item.equivalentvalue,
                            packunit: item.packunit,
                            phoneticode:item.phoneticode,
                            codeList: item.phoneticode != '' ? item.phoneticode.split(',') : item.phoneticode
                        }
                    })
                    this.pmedicineList = list.filter(item => {
                        var codes = item.codeList;
                        for(var i=0;i<codes.length;i++){
                            if(codes[i].indexOf(code) > -1){
                                return true;
                            }
                        }
                        if(item.medicinename.indexOf(code) > -1){
                            return true;
                        }
                        return false;
                    });
                } else {
                    this.pmedicineList = [];
                }
            },
            dialogWarn(item){
                this.dialogToWarning = true;
                this.hospitaid = item.hospitaid;
                this.title1 = '"'+item.hospitaname+'"预警信息列表';
                this.queryWarn();
            },
            dialogSale(item){
                this.dialogToSales = true;
                this.hospitaid = item.hospitaid;
                this.drugid = '';
                this.title2 = '"'+item.hospitaname+'"销售明细';
                this.querySale();
            },
            checkMarket(row){
                this.dialogToSales = true;
                this.drugid = row.id;
                this.hospitaid = row.hospitaid;
                this.querySale();
            },
            soldOut(row){
                this.dialogshelves = true;
                this.medicinename = row.medicinename;
                this.data = {
                    drugid: row.id,
                    drugstate: '2',
                    updateby: JSON.parse(sessionStorage.getItem('userInfo')).id
                }

            },
            updateShelves(){
                this.$doRequest('/api/PhMedicine/unShelveMedicineinfo',this.data,res=>{
                    this.$dialogMsg('下架成功','success');
                    this.queryWarn();
                    this.dialogshelves = false;
                })
            }
        },
        //生命周期之创建完成
        created: function(){
            this.query();
            this.queryMedicine()
            this.$doRequest('/api/hospitainfo/getHLists',null,res =>{
                this.storageList = res.parameters;
            });
        },
    }
</script>

