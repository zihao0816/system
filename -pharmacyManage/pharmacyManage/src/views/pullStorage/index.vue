<template>
    <div class="pullStorage">
        <div class="page">
            <div class="title">
                <span>当前位置：</span>
                <span>出库</span>
            </div>
            <div class="content">
                <div class="left-content clearfix">
                    <p class="clearfix"><span>待核销订单（处方）</span><span @click="queryhistoryverification()">历史核销明细</span></p>
                    <p><span class="order">剩余待核销订单：<span>{{parameters}}</span></span><el-button size="mini" type="primary" @click="querySearch()">刷新</el-button></p>
                    <div class="searchs">
                        <el-input placeholder="患者姓名，处方订单" v-model="hispatientname"></el-input>
                        <el-button type="primary" size="mini" @click="search()">搜索</el-button>
                    </div>
                    <el-table :data="orderList" border style="width:100%;" align="center" @row-click='goDetail' highlight-current-row v-loading="loading">
                        <el-table-column prop="hispatientname" label="患者姓名" width="120"></el-table-column>
                        <el-table-column prop="ordertype" label="订单类型" width="120"></el-table-column>
                        <el-table-column prop="ordersource" label="药方来源" width="120"></el-table-column>
                        <el-table-column prop="paytime" label="支付时间" width="200"></el-table-column>
                        <el-table-column prop="departmentname" label="科室" width="200"></el-table-column>
                        <el-table-column prop="hisdoctorname" label="医师" width="120"></el-table-column>
                        <el-table-column prop="orderid" label="处方单号" width="240"></el-table-column>
                    </el-table>
                    <el-pagination v-if="parameters>pageSize" layout="prev, pager, next" :total="parameters" :page-size="pageSize" @current-change="handleCurrentChange" @prev-click="prev" @next-click='next'></el-pagination>
                </div>
                <div class="right-content">
                    <p class="titles">订单详情</p>
                    <div class="orderdetail">
                        <div>
                            <p>
                                <span>患者姓名：</span>
                                <span>{{orderDetail.hispatientname}}</span>
                            </p>
                            <p>
                                <span>患者电话：</span>
                                <span>{{orderDetail.telephone}}</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>性别：</span>
                                <span>{{orderDetail.hissex == 1?'男':'女'}}</span>
                            </p>
                            <p>
                                <span>年龄：</span>
                                <span>{{orderDetail.hisage}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="orderdetail" style="margin-top:20px;">
                        <div>
                            <p>
                                <span>处方剂型：</span>
                                <span>{{orderDetail.prescriptionshape}}</span>
                            </p>
                            <p>
                                <span>订单来源：</span>
                                <span>{{orderDetail.ordersource}}</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>支付时间：</span>
                                <span>{{paytime}}</span>
                            </p>
                            <p>
                                <span>处方编号：</span>
                                <span>{{orderDetail.orderid}}</span>
                            </p>
                        </div>
                    </div>
                    <!-- <div class="orderdetail" style="margin-top:20px;">
                        <div>
                            <p>
                                <span>支付时间：</span>
                                <span>{{paytime}}</span>
                            </p>
                            <p>
                                <span>订单金额：</span>
                                <span>{{orderDetail.totalprice}}元</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>支付状态：</span>
                                <span>{{orderDetail.paystate == 1?'待支付':'已支付'}}</span>
                            </p>
                        </div>
                    </div> -->
                    <!-- <div class="orderdetail" style="margin-top:20px;">
                        <div>
                            <p>
                                <span>处方编号：</span>
                                <span>{{orderDetail.orderid}}</span>
                            </p>
                            <p>
                                <span>处方时间：</span>
                                <span>{{buytime}}</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>医师：</span>
                                <span>{{orderDetail.hisdoctorname}}</span>
                            </p>
                            <p>
                                <span>科室：</span>
                                <span>{{orderDetail.departmentname}}</span>
                            </p>
                        </div>
                        <div>
                            <p>
                                <span>药方来源：</span>
                                <span>{{orderDetail.ordersource}}</span>
                            </p>
                        </div>
                    </div> -->
                    
                    <div class="prescription">
                        <p class="titles">处方详情</p>
                        <p class="medicines">诊断：<span>{{orderDetail.arguedisease}};{{orderDetail.doctorconclusion}}</span></p>
                        <p class="medicines">处方药：</p>
                        <div class="medicines-name">
                            <span v-for="(item, i) in medicinalMaterials" :key="i">{{item.medicinename}}  {{item.dosage}}{{item.medicineunit}}</span>
                        </div>
                        <div class="last">
                            <p><span>是否代煎：</span>{{orderDetail.generationfry == 1?'否':'是'}}</p>
                            <p><span>频次：</span>一日{{taketime}}次</p>
                            <p><span>剂数：</span>{{totaldosage}}</p>
                        </div>
                        <p class="clearfix btn">
                            <el-button style="float:left" size="mini" type="primary" @click="goPath(orderDetail.orderid,1)">打印患者联</el-button>
                            <el-button style="float:left" size="mini" type="primary" @click="goPath(orderDetail.orderid,2)">打印医生联</el-button>
                           <el-button style="float:right" size="mini" type="primary" :disabled=isfayao @click='fytan'>发药</el-button>
                            <el-button style="float:right" size="mini" type="primary" @click='verification(orderDetail.id)'>核销</el-button>
                        </p>
                    </div>
                </div>
            </div>

            <!-- 历史记录 -->
            <el-dialog class="dialog-push" title="历史核销记录" :visible.sync="verificationDetail" width="60%" center @close="clear">
                <div class="search">
                    <div>
                        <label>核销日期：</label>
                        <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="searchDate()"></el-date-picker>
                    </div>
                    <div>
                        <label>处方编号：</label>
                        <el-input v-model="historySearch.orderid" placeholder="请输入内容"></el-input>
                    </div>
                    <div>
                        <label>患者姓名：</label>
                        <el-input v-model="historySearch.hispatientname" placeholder="请输入内容"></el-input>
                    </div>
                    <div>
                        <label>操作人：</label>
                        <el-input v-model="historySearch.verificationbay" placeholder="请输入内容"></el-input>
                    </div>
                    <div>
                        <label>订单类型：</label>
                        <el-select v-model="historySearch.ordertype" placeholder="请选择">
                            <el-option label="待支付" value="1"></el-option>
                            <el-option label="已支付" value="2"></el-option>
                            <el-option label="已取消" value="3"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <label>订单来源：</label>
                        <el-input v-model="historySearch.ordersource" placeholder="请输入内容"></el-input>
                    </div>
                    <div>
                        <el-button type="primary" @click="clear()">重置</el-button>
                        <el-button type="primary" @click="historyOrderSearch()">搜索</el-button>
                    </div>
                </div>
                <el-table border :data="historyList" style="width: 100%;">
                    <el-table-column prop="ordertype" label="订单类型" width="120"></el-table-column>
                    <el-table-column prop="ordersource" label="订单来源" width="120"></el-table-column>
                    <el-table-column prop="paytime" label="订单时间" width="200"></el-table-column>
                    <el-table-column prop="departmentname" label="科室" ></el-table-column>
                    <el-table-column prop="hisdoctorname" label="医师"></el-table-column>
                    <el-table-column prop="orderid" label="处方编号" width="240"></el-table-column>
                    <el-table-column prop="hispatientname" label="患者姓名" width="120"></el-table-column>
                    <el-table-column prop="verificationtime" label="核销时间" width="120"></el-table-column>
                    <el-table-column prop="verificationbay" label="操作人" width="120"></el-table-column>
                    <el-table-column prop="verificationresult" label="核销结果" width="120"></el-table-column>
                    <el-table-column prop="logisticscompany" label="物流公司" width="120"></el-table-column>
                    <el-table-column prop="trackingnumber" label="物流编号" width="200"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template slot-scope="scope">
                            <span style="color:#07A591;cursor: pointer;" @click="historyhandle(scope.row)">更新物流</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="historyTotal>historyPageSize" layout="prev, pager, next" :total="historyTotal" @current-change="handleCurrentChangehistory" @prev-click="prevhistory" @next-click='nexthistory'></el-pagination>
            </el-dialog>
            <!-- 历史记录 -->

            <!-- 提醒弹框 -->
            <el-dialog
                title="核销处方订单提醒"
                :visible.sync="verificationPop"
                width="30%"
                center>
                <div class="center">
                    <p>核销后库存对应扣除，是否确定核销当前查看的处方订单？</p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="verificationPop = false">取消</el-button>
                    <el-button type="primary" @click="goVerification">确定核销</el-button>
                </span>
            </el-dialog>
          <el-dialog
            title="发药处方订单提醒"
            :visible.sync="fyPop"
            width="30%"
            center>
            <div class="center">
              <p>是否确定发药当前查看的处方订单？</p>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="fyPop = false">取消</el-button>
                    <el-button type="primary" @click="fayao">确定发药</el-button>
                </span>
          </el-dialog>
            <!-- 提醒弹框 -->

            <!-- 核销（更新物流） -->
            <el-dialog :visible.sync="logisticsPop" title="订单物流信息更新提醒" append-to-body width="30%" center :before-close="logisticsPopClose">
                <div class="verificationCenter">
                    <p>如暂无订单物流信息录入，可在历史明细中补充录入</p>
                    <el-form class="form-inline" label-width="100px">
                        <el-form-item label="物流公司：">
                            <el-select placeholder="请选择" v-model="logistics">
                                <el-option v-for="(item, i) in logisticsList" :key="i" :label="item.logisticsname" :value="item.logisticsname"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="物流单号：">
                            <el-input v-model="logisticsCode"></el-input>
                            <span class="erorr">{{erorr}}</span>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="el-dialog__footer">
                    <el-button @click="logisticsPopClose">取消</el-button>
                    <el-button type="primary" @click="updatelogistics">保存</el-button>
                </div>
            </el-dialog>
            <!-- 核销（更新物流） -->
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
              isfayao:true,
                id: '',
                firstId: '',
                hospitaid: '',
                hispatientname: '',
                orderList: [],
                parameters: 0,
                pageSize: 30,
                pagination: 1,
                centerDialogVisible: false,
                verificationDetail: false,
                orderDetail: {},
                paytime: '',
                buytime: '',
                taketime: '',
                totaldosage: '',
                medicinalMaterials: [],
              verificationPop: false,//核销提醒窗口
              fyPop: false,//发药提醒窗口

                //历史核销参数
                //搜索区域开始
                date: [],
                startdate: '',
                enddate: '',
                historySearch: {
                    startDate: '',
                    endDate: '',
                    orderid: '',
                    hispatientname: '',
                    verificationbay: '',
                    ordertype: '',
                    ordersource: '',
                },
                //搜索区域结束
                historyverification: [],//历史核销列表
                historyList: [],
                historyPageSize: 10,
                historyPagination: 1,
                historyTotal: 0,
                //物流弹框
                logisticsPop: false,
                logisticscompany: [],
                logistics: '',
                logisticsList: [],
                logisticsCode: '',
                erorr: '',
                selectedRow:{},//更新物流时选择的行
                loading: true,
            }
        },
        //生命周期之挂载完成
        methods: {
            handleEdit(index,row){
                this.dialogPushDetail = true;
            },
            //分页
            handleCurrentChange(val){
                this.pagination = val;
                this.querySearch();
            },
            prev(val){
                this.pagination = val-1;
                this.querySearch();
            },
            next(val){
                this.pagination = val+1;
                this.querySearch();
            },
            //历史分页
            handleCurrentChangehistory(val){
                this.historyPagination = val;
                this.queryhistoryverification();
            },
            prevhistory(val){
                this.historyPagination = val-1;
                this.queryhistoryverification();
            },
            nexthistory(val){
                this.historyPagination = val+1;
                this.queryhistoryverification();
            },
            //获取待核销列表
            querySearch(){
                this.orderList = [];
                let params = {
                    pageLength: this.pageSize,
                    pagination: this.pagination,
                    condition: {
                        hospitaid: this.hospitaid,
                        hispatientname: this.hispatientname
                    }
                };
                this.$doRequest("api/orderprescriptioninfo/querySearch", params,res => {
                    if(res.result >= 0){
                        this.loading = false;
                        this.parameters = parseInt(res.parameters);
                        res.pageVal.forEach((item) => {
                            item.paytime = common.timestampToTime(item.paytime);
                            if(item.ordertype=='clinic'){
                              item.ordertype='门诊';
                            }
                        });
                        this.orderList = res.pageVal;
                        this.goDetail('',this.orderList[0].orderid);
                    }else{
                        this.$message.error(res.message);
                    }
                });
            },
            //搜索
            search(){
                this.querySearch();
            },
            //获取代核销详情
            goDetail(row,id){
                let paramsId = '';
                if(row == ''){
                    paramsId = id;
                }else{
                    paramsId = row.orderid;
                }
                let params = {
                    parameters: paramsId
                }
                this.$doRequest("api/orderprescriptioninfo/getorderprescriptioninfokf", params,res => {
                  this.isfayao=res.prescriptionshapeid=="yt1001"?false:true;
                    this.orderDetail = res;
                    this.medicinalMaterials = res.medicinalMaterials;
                    this.taketime = parseInt(res.taketime);
                    this.totaldosage = parseInt(res.totaldosage);
                    this.paytime = common.timestampToTime(res.paytime);
                    this.buytime = common.timestampToTime(res.buytime);
                });
            },
            //核销
            verification(id){
                if(id){
                    this.id = id;
                    this.verificationPop = true;
                }else{
                    this.$message.error('请选择要核销的处方订单');
                }
            },
          fytan(){
              this.fyPop = true;
          },
            goVerification(){
              var user = JSON.parse(sessionStorage.getItem('userInfo')).username;
                let params = {
                    parameters: this.id,
                    parametersone:user
                }
                this.$doRequest("api/orderprescriptioninfo/updateVerification", params,res => {
                    if(res.result >= 0){
                        this.$message({
                            message: '核销成功！',
                            type: 'success'
                        });
                        this.verificationPop = false;
                        this.logisticsPop = true;
                        this.getlogisticscompany();
                    }
                });
            },
            //获取物流信息
            getlogisticscompany(){
                this.$doRequest("api/logisticscompany/getlogisticscompany", {},res => {
                    this.logisticsList = res.logistics;
                });
            },
            historyhandle(row){
              this.id = row.id;
              this.logisticsPop = true;
              this.selectedRow = row;
              this.logistics = row.logisticscompany;
              this.logisticsCode = row.trackingnumber;
              this.getlogisticscompany();
            },
            //提交物流信息
            updatelogistics(){
                if(this.logistics == '' || this.logisticsCode == ''){
                    this.erorr = '请输入正确的物流信息';
                }else{
                    this.erorr = '';
                    let params = {
                        trackingnumber: this.logisticsCode,
                        logisticscompany: this.logistics,
                        orderid: this.id,
                    };
                    this.$doRequest("api/orderprescriptioninfo/updatelogistics", params,res => {
                        if(res.result >= 0){
                            this.logisticsPop = false;
                            this.$message({
                                message: '物流更新成功！',
                                type: 'success'
                            });
                            this.querySearch();
                            
                        }else{
                            this.$message({
                                message: res.message,
                                type: 'erorr'
                            });
                        };
                        //更新物流信息后，刷新历史核销列表
                      this.queryhistoryverification();
                    });
                }

            },
            //获取历史核销订单
            queryhistoryverification(){
                this.verificationDetail = true;
                let params = {
                    pageLength: this.historyPageSize,
                    pagination: this.historyPagination,
                    condition: {
                        hospitaid: this.hospitaid,
                        orderid: this.historySearch.orderid,
                        hispatientname: this.historySearch.hispatientname,
                        verificationbay: this.historySearch.verificationbay,
                        ordertype: this.historySearch.ordertype,
                        ordersource: this.historySearch.ordersource,
                        startDate: this.historySearch.startdate,
                        endDate: this.historySearch.enddate,
                    }
                };
                this.$doRequest("api/orderprescriptioninfo/queryhistoryverification", params,res => {
                    if(res.result >= 0){
                        this.historyTotal = parseInt(res.valCount);
                        res.pageVal.forEach((item) => {
                            item.paytime = common.timestampToTime(item.paytime);
                            item.verificationtime = common.timestampToTime(item.verificationtime);
                            if(item.ordertype=='clinic'){
                              item.ordertype='门诊';
                            }
                        });
                        this.historyList = res.pageVal;
                    }else{
                        this.$message.error('res.message');
                    }
                });
            },
            //历史订单搜索
            historyOrderSearch(){
                this.queryhistoryverification();
            },
            clear(){
                this.date = [];
                this.historySearch.orderid = '';
                this.historySearch.hispatientname = '';
                this.historySearch.verificationbay = '';
                this.historySearch.ordertype = '';
                this.historySearch.ordersource = '';
                this.historySearch.startdate = '';
                this.historySearch.enddate = '';
            },
            searchDate(){
                this.historySearch.startdate = this.date[0];
                this.historySearch.enddate = this.date[1];
            },
          fayao(){
            this.$doRequest("api/orderprescriptioninfo/getfyurl", null,res => {
              this.$doRequest("api/fy/fayao",  this.orderDetail ,res => {
                this.$message({
                  message: '发药成功！',
                  type: 'success'
                });
                this.fyPop=false;
              },null,null,null,null,null,{
                baseURL:res.parameters
              });
            });

          },
            goPath(id,type){
                if(id){
                    let routeUrl = this.$router.resolve({
                        path: "printing",
                        query: {id: id,type: type}
                    });
                    window.open(routeUrl.href, '_blank');
                }else{
                    this.$message.error('请选择要打印的订单');
                }
            },
            //关闭物流并刷新列表
            logisticsPopClose(){
                this.logisticsPop = false;
                this.querySearch();
                this.getlogisticscompany();
            }
        },
        //生命周期之创建完成
        created: function(){
            let session = JSON.parse(sessionStorage.getItem('userInfo'));
            this.hospitaid = session.cnameid;
            this.querySearch(this.searchData);
        },
    }
</script>

