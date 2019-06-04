<template>
    <div class="registerOrder">
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
                            <el-select v-model="outpatientname" placeholder="全部来源">
                                <el-option v-for="item in outpatientArr" :key="item.outpatientname" :label="item.outpatientname" :value="item.outpatientname"></el-option>
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
                    <span>问诊医生</span>
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
                                <span>{{item.outpatientname}}</span>
                                <span>{{item.createtime}}</span>
                                <span>问诊单号：{{item.orderid}}</span>
                                <span></span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>
                                <img v-if="item.headphoto" :src="item.headphoto" />
                                <img v-else src="../../assets/img/wxtx_tx@3x.png" />
                                </div>
                                <h3>{{item.doctorname}}<span>{{item.dutiesname}}</span></h3>
                                <span>{{item.departmentname}}</span>
                                <span>{{item.hospitaname}}</span>
                            </td>
                            <td>
                                <div>
                                <img v-if="item.pheadphoto" :src="item.pheadphoto" />
                                <img v-else src="../../assets/img/wxtx_tx@3x.png" />
                                </div>
                                <h3>{{item.patientname}}<span>{{item.patientsex == 1?'男':'女'}}</span><span>{{item.patientage}}</span></h3>
                                <span>{{item.patientphone}}</span>
                            </td>
                            <td><span>¥ {{Number(item.consumption).toFixed(2)}}</span></td>
                            <td><span><img v-if="item.paymentmethod == 1" src="../../assets/img/wechat@3x.png" />{{item.paymentmethod == 1?'微信':'会员'}}</span></td>
                            <td><span style="color:#D74326;">¥ {{Number(item.consumption).toFixed(2)}}</span></td>
                            <td><el-button type="text" size="small" @click="goDetails(item.id)">查看详情</el-button></td>
                        </tr>
                        <tr>
                            <td colspan="6">
                                <span>平台收益：¥0.00</span>
                                <span>医生收益：¥{{Number(item.consumption).toFixed(2)}}</span>
                                <span>患者付款：¥{{Number(item.consumption).toFixed(2)}}</span>
                            </td>
                        </tr>
                    </table>
                    <div class="empty" v-if="records == 0">
                        <span>暂无问诊订单</span>
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
            groupid: sessionStorage.id,
            date: '',
            paymenttimesta: '',
            paymenttimeend: '',
            value: '',
            outpatientname: '',
            outpatientArr: [],
            orderList: [],
            pageLength: 10,
            pagination: 1,
            records: 0,
        }
    },
    methods:{
        //翻页
        handleSizeChange(val) {
            this.pageLength = val;
            this.getRegisterOrder();
        },
        handleCurrentChange(val){
            this.pagination = val;
            this.getRegisterOrder();
        },
        prev(val){
            this.pagination = val-1;
            this.getRegisterOrder();
        },
        next(val){
            this.pagination = val+1;
            this.getRegisterOrder();
        },
        //重置
        clear(){
            this.paymenttimesta = '';
            this.paymenttimeend = '';
            this.value = '';
            this.outpatientname = ''
            this.date = [];
            this.getRegisterOrder();
        },
        //搜索
        search(){
            this.paymenttimesta = this.date[0];
            this.paymenttimeend = this.date[1];
            this.getRegisterOrder();
        },
        //获取来源
        getOutpatient(){
            let params = {
                groupid: this.groupid
            };
            let _this = this;
            this.$doRequest('api/outpatient/getListByKey', params,function(res){
                _this.outpatientArr = res;
            });
        },
        //获取线上问诊订单
        getRegisterOrder(){
            let _this = this;
            let params = {
                condition: {
                    paymenttimesta: this.paymenttimesta,//开始时间
                    paymenttimeend: this.paymenttimeend,//结束时间
                    value: this.value,//关键字
                    outpatientname: this.outpatientname,//来源
                },
                pageLength: this.pageLength,
                pagination: this.pagination
            };
            this.$doRequest('api/diagnosisqueue/queryOffline', params,function(res){
                res.pageVal.forEach(item => {
                    item.createtime = common.timestampToTime(item.createtime);
                });
                _this.orderList = res.pageVal;
                _this.records = Number(res.valCount);
            });
        },
        //查看详情
        goDetails(id){
            this.$router.push({path: '/registerDetails',query:{id: id}});
        }
    },
    created(){
        this.getOutpatient();
        this.getRegisterOrder();
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
