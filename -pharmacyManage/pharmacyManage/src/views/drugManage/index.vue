<template>
    <div class="drugManage">
        <p class="title">当前位置：<span>药品管理</span></p>
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
        <div class="main">
            <h3>最近30天入库药品<span @click="goPath('drugStorage')">查看库房</span><span @click="goPath('addDrug')">新增入库</span></h3>
            <el-table :data="drugList" style="width: 100%" border v-loading="loading">
                <el-table-column prop="medicinename" label="药品名称"></el-table-column>
                <el-table-column prop="suppliername" label="供应商"></el-table-column>
                <el-table-column prop="prescriptionshapename" label="药品剂型"></el-table-column>
                <el-table-column prop="specification" label="药品规格"></el-table-column>
                <el-table-column prop="medicineunit" label="包装单位"></el-table-column>
                <el-table-column prop="offretailprice" label="采购单价"></el-table-column>
            </el-table>
            <h3>当前预警药品<span @click="goPath('drugCaution')">查看全部</span></h3>
            <el-table :data="cautionList" style="width: 100%" border v-loading="loading">
                <el-table-column prop="medicinename" label="药品名称"></el-table-column>
                <el-table-column prop="suppliername" label="供应商"></el-table-column>
                <el-table-column prop="prescriptionshapename" label="药品剂型"></el-table-column>
                <el-table-column prop="warningtime" label="预警发起时间" width="170"></el-table-column>
                <el-table-column prop="drugtype" label="预警类型"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="checkDrugDetails(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 查看预警药品弹框 -->
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
                    <el-table-column prop="prescriptionshapename" label="药品剂型" width="80"></el-table-column>
                    <el-table-column prop="lastwarehousetime" label="最后入库时间" width="200"></el-table-column>
                    <el-table-column prop="drugstate" label="状态" width="80"></el-table-column>
                    <el-table-column prop="warningtime" label="预警时间" width="180"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkDrugDetailsPop = false">取消</el-button>
                <el-button type="primary" @click="soldOut()">下架</el-button>
            </span>
        </el-dialog>
        <!-- 查看预警药品弹框 -->
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
            hospitaid: '',
            drugid: '',//药材id，下架的时候用
            checkDrugDetailsPop: false,
            drugList:[],
            cautionList:[],
            drugDetails1:[],
            drugDetails2:[],
            updateby: '',
            drugstate: '',
            loading: true,
        }
    },
    //生命周期之挂载完成
    methods: {
        goPath(val){
            this.$router.push({path: val});
        },
        //最近30天入库药品
        queryRecentlyDrug(){
            let params = {
                pageLength: 5,
                pagination: 1,
                hospitaid: this.hospitaid
            };
            this.$doRequest("api/medicinetostoragedetails/queryPageByCondition", params,res => {
                if(res.result >= 0){
                    this.loading = false;
                    this.drugList = res.parameters.rows;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        //预警药品
        queryWarningDrug(){
            let params = {
                pageLength: 5,
                pagination: 1,
                hospitaid: this.hospitaid
            };
            this.$doRequest("api/PhMedicine/queryWarningDrug", params,res => {
                if(res.result >= 0){
                    this.loading = false;
                    res.parameters.rows.forEach(item => {
                        if(item.warningtime){
                            item.warningtime = common.timestampToTime(item.warningtime);
                        }
                        if(item.lastwarehousetime){
                            item.lastwarehousetime = common.timestampToTime(item.lastwarehousetime);
                        }
                        if(item.drugtype == 1){
                            item.drugtype = '正常';
                        }else if(item.drugtype == 2){
                            item.drugtype = '系统预警';
                        }else{
                            item.drugtype = '人工预警';
                        }
                        if(item.drugstate == 1){
                            item.drugstate = '正常';
                        }else if(item.drugstate == 2){
                            item.drugstate = '下架';
                        }else{
                            item.drugstate = '删除';
                        }
                    });
                    this.cautionList = res.parameters.rows;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        //查看预警药品
        checkDrugDetails(row){
            this.drugDetails1 = [];
            this.drugDetails2 = [];
            this.checkDrugDetailsPop = true;
            this.drugid = row.id;
            this.drugstate = row.drugstate;
            this.drugDetails1.push(row);
            this.drugDetails2.push(row);
        },
        //下架
        soldOut(){
            if(this.drugstate == '下架'){
                this.$message.error('此药品已下架');
            }else{
                let params = {
                    drugid: this.drugid,
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
                        this.queryWarningDrug();
                    }else{
                        this.$message.error(res.message);
                    }
                });
            }
        }
    },
    //生命周期之创建完成
    created: function(){
        let session = JSON.parse(sessionStorage.getItem('userInfo'));
        this.updateby = session.id;
        this.hospitaid = session.cnameid;
        this.queryRecentlyDrug();
        this.queryWarningDrug();
    },
}
</script>

