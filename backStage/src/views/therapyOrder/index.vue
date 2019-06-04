<template>
    <div class="consultOrder">
        <div class="page">
            <div>
                <navigation></navigation>
            </div>
            <div class="content">
                <!-- 搜索区域 -->
                <div class="search">
                    <el-form :inline="true" label-width="120px">
                        <el-form-item label="创建日期：" >
                            <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="订单来源：">
                            <el-select v-model="origin" placeholder="全部来源">
                                <el-option v-for="item in originArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="value" placeholder="搜索问诊单号、问诊医生、问诊患者" style="width:300px"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="clear()">重置</el-button>
                            <el-button type="primary" @click="search()">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 主要内容区域 -->
                <div class="head">
                    <span>理疗师</span>
                    <span>问诊患者</span>
                    <span>应付款</span>
                    <span>支付方式</span>
                    <span>实付款</span>
                    <span>操作</span>
                </div>
                <div class="list">
                    <table v-for="(item,i) in orderList" :key="i">
                        <tr>
                            <td colspan="6">
                                <span>{{item.origin}}</span>
                                <span>{{item.orderTime}}</span>
                                <span>理疗单号：{{item.orderNumber}}</span>
                                <span></span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                    <img v-if="item.doctor.headimgurl" :src="item.doctor.headimgurl" />
                                    <img v-else src="../../assets/img/wxtx_tx@3x.png" />
                                </div>
                                <h3>{{item.doctor.name}}<span>{{item.doctor.grade}}</span></h3>
                                <span>理疗项目：{{item.doctor.grade}}</span>
                            </td>
                            <td>
                                <div>
                                    <img v-if="item.patient.headimgurl" :src="item.patient.headimgurl" />
                                    <img v-else src="../../assets/img/wxtx_tx@3x.png" />
                                </div>
                                <h3>{{item.patient.name}}<span>{{item.patient.sex}}</span><span>{{item.patient.age}}</span></h3>
                                <span>{{item.patient.telephone}}</span>
                            </td>
                            <td><span>¥ {{Number(item.payable).toFixed(2)}}</span></td>
                            <td>
                                <span v-if="item.paymentStatus == '已支付'">{{item.paymentMethod}}</span>
                                <span v-else style="color:#D74326;">{{item.paymentStatus}}</span>
                            </td>
                            <td>
                                <span v-if="item.paymentStatus == '已支付'">¥ {{Number(item.actualPayment).toFixed(2)}}</span>
                                <span v-else style="color:#D74326;">{{item.paymentStatus}}</span>
                            </td>
                            <td><el-button type="text" size="small" @click="goDetails(item.id)">查看详情</el-button></td>
                        </tr>
                    </table>
                    <div class="empty" v-if="records == 0">
                        <span>暂无理疗订单</span>
                    </div>
                    <div class="pagination" v-if="records>pageLength">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageLength"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="records">
                        </el-pagination>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
import navigation from '../../components/common/navigation'
import common from '../../api/common';
export default {
    components: {
        navigation,
    },
    data(){
        return {
            date: '',
            statTime: '',
            endTime: '',
            value: '',
            origin: '',
            originArr: [],
            orderList: [],
            records: 0,
            pageLength: 10,
            pagination: 1,
            records: 0,
        }
    },
    methods:{
        //翻页
        handleSizeChange(val) {
            this.pageLength = val;
            this.getTherapyOrder();
        },
        handleCurrentChange(val){
            this.pagination = val;
            this.getTherapyOrder();
        },
        prev(val){
            this.pagination = val-1;
            this.getTherapyOrder();
        },
        next(val){
            this.pagination = val+1;
            this.getTherapyOrder();
        },
        //重置
        clear(){
            this.statTime = '';
            this.endTime = '';
            this.value = '';
            this.origin = ''
            this.date = [];
            this.getTherapyOrder();
        },
        //搜索
        search(){
            this.statTime = this.date[0];
            this.endTime = this.date[1];
            this.getTherapyOrder();
        },
        //获取订单来源
        getOrigin(){
            let _this = this;
            this.$doRequest('api/order/physiotherapy/origin', null,function(res){
                _this.originArr = res.parameters;
            });
        },
        //获取理疗订单
        getTherapyOrder(){
            let _this = this;
            let params = {
                statTime: this.statTime,//开始时间
                endTime: this.endTime,//结束时间
                value: this.value,//关键字
                origin: this.origin,
                pageLength: this.pageLength,
                pagination: this.pagination
            };
            this.$doRequest('/api/order/physiotherapy/search', params,function(res){
                _this.orderList = res.parameters.rows;
                _this.records = res.parameters.records
            });
        },
        //查看详情
        goDetails(id){
            this.$router.push({path: '/therapyDetails',query:{id: id}});
        }
    },
    created(){
        this.getOrigin();
        this.getTherapyOrder();
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
