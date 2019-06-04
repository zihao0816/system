<template>
  <div class="alreadyTreated">
    <Row>
      <Col span="5">
      <div class="titles">就诊记录</div>
        <div style="height: 80vh;overflow-x: auto;">
          <Card v-for="(item,index) in alreadyPatientList" :key="item.id" style="width:100%;margin-bottom: 20px;" :class="item.orderid == orderId?'check':''">
            <div @click="orderClick(index)">
              <div>NO.{{item.orderid}}</div>
              <div>日期：{{toTime(item.buytime,1)}} </div>
              <div class="textov">诊断：{{item.arguedisease}}{{item.arguedisease?'；':''}}{{item.doctorconclusion}}</div>
            </div>
          </Card>
        </div>

      </Col>
      <Col span="18" offset="1" >
      <div class="titles bor">处方单</div>
      <div class="tit">
        <div class="line">
          <span class="fontw">处方编号:</span>
          <span>{{order.orderid}}</span>
        </div>
        <div class="line">
          <Row>
            <Col span="8">
            <span class="fontw">日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期:</span>
            <span>{{toTime(order.buytime,1)}}</span>
            </Col>
            <Col span="6" offset="1" >
            <span class="fontw">科室:</span>
            <span>{{order.departmentname}}</span>
            </Col>
            <Col span="6" offset="1" >
            <span class="fontw">医生:</span>
            <span>{{order.hisdoctorname}}</span>
            </Col>
          </Row>
        </div>
        <div class="line">
          <Row>
            <Col span="8">
            <span class="fontw">患者姓名:</span>
            <span>{{order.hispatientname}}</span>
            </Col>
            <Col span="6" offset="1" >
            <span class="fontw">性别:</span>
            <span v-if="order.hissex == 1">男</span>
            <span v-if="order.hissex == 2">女</span>
            </Col>
            <Col span="6" offset="1" >
            <span class="fontw">年龄:</span>
            <span>{{order.hisage}}</span>
            </Col>
          </Row>
        </div>
        <div class="line">
          <Row>
            <Col span="2">
            <span class="fontw">诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;断:</span>
            </Col>
            <Col span="22">
            <span>{{order.arguedisease}}{{order.arguedisease?'；':''}}{{order.doctorconclusion}}</span>
            </Col>
          </Row>
        </div>
        <div class="line">
          <span class="fontw">剂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型:</span>
          <span>{{order.prescriptionshape}}</span>                                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{{order.generationfry == 2?'代煎':''}}</span>
        </div>
      </div>
      <div style="font-size: 22px;font-weight: 600;">R：</div>
      <div>
        <el-table :data="order.medicinalMaterials" style="width:100%;" border >
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column label="药品/规格" prop="medicinename"  align="center"></el-table-column>
          <el-table-column label="单价(元)" prop="price"  align="center"></el-table-column>
          <el-table-column label="金额(元)" prop="totalprice"  align="center"></el-table-column>
        </el-table>
      </div>
      <div  class="line">
        <span class="fontw">用药说明：</span>
        <span v-if="orderId">共{{parseInt(order.totaldosage)}}剂，每日{{parseInt(order.daydosage)}}剂，每剂分{{parseInt(order.taketime)}}次服用</span>
        <span class="fr">合计：{{order.totalprice}}元</span>
      </div>
      <div class="line">
        <span class="fontw">医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;嘱：</span>
        <span>{{order.specialadvice}}</span>
      </div>
      </Col>
    </Row>
  </div>
</template>
<style lang="less">
  @import "index.less";
</style>
<script>
  import { mapState, mapActions ,mapGetters, mapMutations } from 'vuex'
  import common from '@/api/common';
  export default {
    props: ['doctorid','patientid'],
    components: {

    },
    data() {
      return {
        orderId: '',
        patientOrder:{},
        order:{}
      }
    },
    computed: {
      ...mapGetters([]),
      ...mapState({
        alreadyPatientList:(state)=>state.outpatient.alreadyPatientList

      })
    },
    watch:{
      patientid: function(newVal) {
          this.findPatientList();
      }
    },
    //生命周期之挂载完成
    methods: {
      ...mapActions([
        'findAlreadyPatientList'
      ]),
      toTime(time,type) {
        return this.$timestampToTime(time, type);
      },
      findPatientList() {
        this.findAlreadyPatientList({doctorid:this.doctorid,patientid:this.patientid})
      },
      orderClick(index) {
        this.patientOrder = this.alreadyPatientList[index];
        this.orderId = this.patientOrder.orderid;
        this.getOrderInfo(this.orderId);
      },
      getOrderInfo(orderId) {
        let _this=this;
        this.$doRequest("/api/orderprescriptioninfo/getorderprescriptioninfokf",{"parameters": orderId},res=>{
          _this.order = res;
        });
      },
    },
    //生命周期之创建完成
    created: function(){
      
    },
  }
</script>

