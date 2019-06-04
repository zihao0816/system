<template>
    <div class="drugCaution">
        <p class="title">当前位置：<span>预警药品</span></p>
        <div class="main">
            <!-- 卡片区域 -->
            <!--
            <div class="card">
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                    <span></span>
                </div>
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                    <span></span>
                </div>
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                    <span></span>
                </div>
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                </div>
            </div>
            -->
            <!-- 卡片区域 -->
            <!-- 搜索区域 -->
            <div class="search">
                <div>
                    <label>药品名称：</label>
                    <el-select v-model="medicineId" clearable filterable remote reserve-keyword placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                            v-for="item in options4"
                            :key="item.value"
                            :label="item.label+'-'+item.type"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>供应商：</label>
                    <el-select v-model="supplierid" placeholder="请选择">
                        <el-option v-for="(item,i) in supplier" :key="i" :label="item.suppliername" :value="item.id"></el-option>
                    </el-select>
                </div>
                <div>
                    <label>预警时间：</label>
                    <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="searchDate()">
                    </el-date-picker>
                </div>
                <div>
                    <label>状态：</label>
                    <el-select v-model="drugstate" placeholder="请选择">
                        <el-option label="正常" value="1"></el-option>
                        <el-option label="下架" value="2"></el-option>
                        <el-option label="删除" value="3"></el-option>
                    </el-select>
                </div>
                <el-button type="primary" @click="search(1)">重置</el-button>
                <el-button type="primary" @click="search(2)">搜索</el-button>
            </div>
            <!-- 搜索区域 -->
            <!-- 药品库 -->
            <el-table :data="recentlyDrug" border style="width: 100%" highlight-current-row  v-loading="loading">
                <el-table-column prop="drugcode" label="序号" width="280"></el-table-column>
                <el-table-column prop="medicinename" label="药品名称" width="120"></el-table-column>
                <el-table-column prop="phoneticode" label="快捷码"></el-table-column>
                <el-table-column prop="packspecification" label="包装规格" width="120"></el-table-column>
                <el-table-column prop="packunit" label="包装单位" width="120"></el-table-column>
                <el-table-column prop="totalstock" label="库存数量" width="120"></el-table-column>
                <el-table-column prop="highstock" label="库存上限" width="120"></el-table-column>
                <el-table-column prop="lowstock" label="库存下限" width="120"></el-table-column>
                <el-table-column prop="suppliername" label="供应商"></el-table-column>
                <el-table-column prop="hospitaname" label="归属库房" width="200"></el-table-column>
                <el-table-column prop="prescriptionshapename" label="药品剂型" width="120"></el-table-column>
                <el-table-column prop="lastwarehousetime" label="最近入库时间" width="170"></el-table-column>
                <el-table-column prop="warningtime" label="预警时间" width="170"></el-table-column>
                <el-table-column prop="drugstate" label="状态"></el-table-column>
                <el-table-column prop="date" label="操作" fixed="right" width="120">
                    <template slot-scope="scope">
                       <!-- <el-button type="text" size="small" @click="checkDetail(scope.row,1)">补仓</el-button>-->
                        <el-button type="text" size="small" @click="checkDetail(scope.row,2)">关闭</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-if="records>10" layout="prev, pager, next" :total="records" :page-size="pageLength" @current-change="handleCurrentChange" @prev-click="prev" @next-click='next'></el-pagination>
            <!-- 药品库 -->

            <!-- 补仓弹窗 -->
            <el-dialog
                title="存量预警提醒"
                :visible.sync="checkDrugDetailsPop"
                width="60%"
                center>
                <div class="check">
                    <el-table :data="drugDetails1" style="width: 100%" border>
                        <el-table-column prop="medicinename" label="药品名称"></el-table-column>
                        <el-table-column prop="phoneticode" label="快捷码"></el-table-column>
                        <el-table-column prop="specification" label="药品规格"></el-table-column>
                        <el-table-column prop="packunit" label="包装单位"></el-table-column>
                        <el-table-column prop="packagequantity" label="库存数量"></el-table-column>
                        <el-table-column prop="highstock" label="库存上限"></el-table-column>
                        <el-table-column prop="lowstock" label="库存下限"></el-table-column>
                    </el-table>
                    <el-table :data="drugDetails2" style="width: 100%" border>
                        <el-table-column prop="suppliername" label="供应商"></el-table-column>
                        <el-table-column prop="gskf" label="归属库房"></el-table-column>
                        <el-table-column prop="prescriptionshapename" label="药品剂型"></el-table-column>
                        <el-table-column prop="lastwarehousetime" label="最后入库时间"></el-table-column>
                        <el-table-column prop="drugstate" label="状态"></el-table-column>
                        <el-table-column prop="warningtime" label="预警时间" width="180"></el-table-column>
                    </el-table>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="checkDrugDetailsPop = false">取消</el-button>
                    <el-button type="primary" @click="warningAlert = true">下架</el-button>
                </span>
            </el-dialog>
            <!-- 补仓弹窗 -->
            <!-- 下架提醒 -->
            <el-dialog
                title="下架提醒"
                :visible.sync="warningAlert"
                width="30%"
                center>
                <div class="check">
                    <p>即将下架药品{{medicineName}}，医生将无法开具该药品。但系统中依然药品信息，且不会影响已支付订单/药房的药品领取过程</p>
                    <p>确认下架？</p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="warningAlert = false">取消</el-button>
                    <el-button type="primary" @click="soldOut()">确定</el-button>
                </span>
            </el-dialog>
            <!-- 下架提醒 -->
            <!-- 关闭提醒 -->
            <el-dialog
                title="预警关闭提醒"
                :visible.sync="closeAlert"
                width="30%"
                center>
                <div class="check">
                    <p>即将关闭药品{{medicineName}}的预警提醒，关闭后该药品库存等于0则自动下架</p>
                    <p>确认关闭？</p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeAlert = false">取消</el-button>
                    <el-button type="primary" @click="closedrug()">确定</el-button>
                </span>
            </el-dialog>
            <!-- 关闭提醒 -->
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from '../../api/common'
export default {
    data() {
        return {
            updateby: '',
            hospitaid: '',//'s6d5g6fd4hg6df51gdf65g4ds5f61g6d',
            medicineId: '',
            medicinenameList: [],
            options4: [],
            list: [],
            loading: false,
            supplierid: '',
            supplier: [],
            date: [],
            startdate: '',
            enddate: '',
            drugstate: '',
            pageLength: 30,
            pagination: 1,
            records: 0,
            recentlyDrug: [],
            medicineName: '',
            //关闭和下架所需参数
            drugId: '',
            drugState: '',
            drugDetails1: [],
            drugDetails2: [],
            checkDrugDetailsPop: false,
            warningAlert: false,
            closeAlert: false,
            loading: true,
        }
    },
    //生命周期之挂载完成
    methods: {
        //分页
        handleCurrentChange(val){
            this.pagination = val;
            this.queryDrug();
        },
        prev(val){
            this.pagination = val-1;
            this.queryDrug();
        },
        next(val){
            this.pagination = val+1;
            this.queryDrug();
        },
        //监听搜索药品名称
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
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
            };
            this.$doRequest("api/pharmacymedicines/getpmedicineLists", params,res => {
                this.medicinenameList = res.parameters;
                this.list = this.medicinenameList.map(item => {
                    return { value: item.id, label: item.medicinename, code: item.phoneticode, type: item.prescriptionshapename};
                });
            });
        },
        //获取供应商列表
        getSupplierList(){
            this.$doRequest("api/supplier/getSupplierList",{},res => {
                this.supplier = res.parameters;
            });
        },
        //重置/搜索
        search(type){
            if(type == 1){
                this.medicineId = '';
                this.date = [];
                this.startdate = '';
                this.enddate = '';
                this.drugstate = '';
                this.supplierid = '';
            }
            this.queryDrug();
        },
        //获取预警药品
        queryDrug(){
            let params = {
                pageLength: this.pageLength,
                pagination: this.pagination,
                condition: {
                    hospitaid: this.hospitaid,
                    id: this.medicineId,
                    startdate: this.startdate,
                    enddate: this.enddate,
                    drugstate: this.drugstate,
                    supplierid: this.supplierid
                }
            };
            this.$doRequest("api/PhMedicine/queryWarningDrug", params,res => {
                if(res.result >= 0){
                    this.loading = false;
                    this.records = res.parameters.records;
                    res.parameters.rows.forEach(item => {
                        item.lastwarehousetime = common.timestampToTime(item.lastwarehousetime);
                        item.warningtime = common.timestampToTime(item.warningtime);
                        if(item.drugstate == 1){
                            item.drugstate = '正常';
                        }else if(item.drugstate == 2){
                            item.drugstate = '下架';
                        }else{
                            item.drugstate = '删除';
                        }
                    });
                    this.recentlyDrug = res.parameters.rows;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        checkDetail(row,type){
            this.drugId = row.id;
            this.medicineName = row.medicinename;
            this.drugState = row.drugstate;
            if(type == 1){
                this.checkDrugDetailsPop = true;
                this.drugDetails1.push(row);
                this.drugDetails2.push(row);
            }else{
                this.closeAlert = true;
            }
        },
        soldOut(){
            if(this.drugState == '下架'){
                this.$message.error('此药品已下架');
            }else{
                let params = {
                    drugid: this.drugId,
                    drugstate: 2,
                    updateby: this.updateby
                };
                this.$doRequest("api/PhMedicine/unShelveMedicineinfo", params,res => {
                    if(res.result >= 0){
                        this.$message({
                            message: '下架成功！',
                            type: 'success'
                        });
                        this.checkDrugDetailsPop = false;
                        this.queryDrug();
                    }else{
                        this.$message.error(res.message);
                    }
                });
            }
        },
        closedrug(){
            let params = {
                drugid: this.drugId,
                drugtype: 1,
                updateby: this.updateby
            };
            this.$doRequest("api/PhMedicine/closeWarning", params,res => {
                if(res.result >= 0){
                    this.$message({
                        message: '关闭预警成功！',
                        type: 'success'
                    });
                    this.closeAlert = false;
                    this.queryDrug();
                }else{
                    this.$message.error(res.message);
                }
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
        this.updateby = session.id;
        this.hospitaid = session.cnameid;
        this.getMedicines();
        this.getSupplierList();
        this.queryDrug();
    },
}
</script>

