<template>
  <div class="inquiringPrescriptions">

    <!-- 诊断 -->
    <div class="diagnosis">
      <div class="diatit">诊断</div>
      <div class="diabody">
        <div class="diaone">
          <span class="spans">姓名：<input class="inputs" type="text" :value="prescription?prescription.patientname:''"></span>
          <span class="spans">性别：
                <el-select v-model="prescription.patientsex" width="100px" size="small">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                </el-select>
          </span>
          <span class="spans">年龄：<input class="inputs" type="text" v-model="prescription.patientage"></span>
          <span class="lisia" @click="showlists()"><a href="#">已匹配该患者 {{patientHistoryCount}} 条就诊记录</a></span>
        </div>
        <div class="diatwo">
          <span class="spans">辨病：<input class="inputs" v-model="prescription.bianBing" type="text"></span>
          <span class="spans">辨证：<input class="inputs" v-model="prescription.bianZheng" type="text"></span>
        </div>
      </div>
    </div>
    <!-- 诊断 -->
    <!-- 开方 -->
    <div class="Prescribe">
      <div class="pctit">开方</div>
      <div class="pcbody">
        <Row>
          <Col span="2"> <span>药&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;房：</span></Col>
          <Col span="22">
            <Select v-model="prescription.yaofang" style="width:206px" @on-change="changePrescription()">
              <Option v-for="item in selectedPharmacylist" :value="item.id" :key="item.id">{{ item.hospitaname }}</Option>
            </Select>
          </Col>
        </Row>
        <Row class="one" style="margin-top:5px;">
          <Col span="2"><span>剂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</span></Col>
          <Col span="22">
            <RadioGroup v-model="prescription.jixing" @on-change="dosageChange">
              <Radio v-for="item in loadedBrands"  :key="item.itemcode" :label="item.itemcode">{{ item.itemname }}</Radio>
            </RadioGroup>
            <span class="tip">（颗粒剂型请按饮片药量开出，药费将自动换算）</span>
          </Col>
        </Row>
        <Row class="one" style="margin-top:5px;">
          <Col span="2"><span>品 牌 商：</span></Col>
          <Col span="22">
          <Select v-model="prescription.pinpai" style="width:206px" @on-change="brandChange">
            <Option v-for="item in selectedDosageBrands" :value="item.itemcode" :key="item.itemcode">{{ item.itemname }}</Option>
          </Select>
          </Col>
        </Row>
        <Row style="clear: both;">
          <Col span="2"><span>编辑药材：</span></Col>
          <!-- 药方list -->
          <Col span="22">
              <div v-if="!isShow">设定药房、剂型和品牌商后，可开具药方。</div>
              <div class="prescription" v-else v-for="(item,i) in prescriptionList" :key="i">
                  <div class="remove" @click="remove(i)">删除此药方</div>
                  <div>
                      <span class="templatetit" @click="opentemplate(i)"><i>+</i>选择药方模板</span>
                  </div>
                  <div class="secrecy" v-if="item.isagreementparty == '1'">
                      <span>{{item.orderprescriptionname}}</span>
                      <span>{{item.number}}味</span>
                  </div>
                  <div v-else>
                      <div class="yone" v-for="(doctorDrug,index) in item.yaoCaiLieBao" :key="doctorDrug.index">
                          <el-select
                            filterable
                            remote
                            ref="panel"
                            class="selectInput"
                            reserve-keyword
                            v-model="doctorDrug.id"
                            width="140px"
                            size="small"
                            placeholder="选择药品"
                            value-key="doctorDrug.medicine.id"
                            :remote-method="filteredMedicines"
                            :loading="loading1">
                            <el-option
                              v-for="(medicine) in currentMedicinesList"
                              :key="medicine.id"
                              :label="medicine.medicinename"
                              :value="medicine.id">
                              <span style="float: left">{{ medicine.medicinename }}</span>
                              <span>{{ medicine.specification }}</span>
                              <span class="stock">
                                <span>库存</span>
                                <span v-if="medicine.totalstock < medicine.lowstock" style="color: #bd2c00">:{{medicine.totalstock}}</span>
                                <span v-else>充足</span>
                              </span>
                            </el-option>
                          </el-select>
                         <input class="cursorPosition" v-model="doctorDrug.medicineNum" style="width: 60px" @keyup.enter.native="submit" /> 
                          <span class="ginfo">{{doctorDrug.medicineUnit}}</span>
                          <el-button type="success" size="mini" icon="el-icon-remove-outline" @click="removeDoctorMedicine(i,index)"></el-button>
                          <el-button type="warning" size="mini" icon="el-icon-circle-plus-outline" @click="addDoctorMedicineSelector(i,doctorDrug.index)"></el-button>
                          <br>
                          <Select
                            filterable
                            v-model="doctorDrug.decoctionid"
                            style="width:150px"
                            placeholder="请选择煎法"
                            :loading="loading1"
                            v-if="prescription.jixing == 'yt1002' ">
                            <Option value="">无</Option>
                            <Option v-for="(jianfa, index) in jianfaList" :value="jianfa.itemcode" :key="index">{{jianfa.itemname}}</Option>
                          </Select>
                      </div>
                  </div>
                  
                  <div class="dw">
                      <Checkbox v-model="item.shiFouDaiJian" true-value="2" false-value="1">是否代煎</Checkbox>
                      <span>共<input type="number" v-model="item.gongJiShu" placeholder="剂" />剂，每日<input type="number" v-model="item.riJi" placeholder="剂" />剂，一剂分<input type="number" v-model="item.jiChiShu" placeholder="次" />次服用</span>
                  </div>
              </div> 
              <div class="addPrescription" v-if="isShow" @click="addNewPrescription()">
                  <span>添加新药方</span>
              </div>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 开方 -->
    <!-- 选填内容 -->
    <div class="selective">
      <div class="diatit">选填内容</div>
      <div class="selebody">
        <Row>
          <Col span="2"> <span>查看药方：</span></Col>
          <Col span="22">
            <span>购药前 </span>
            <span>
              <RadioGroup v-model="prescription.chaKanYaoFang">
                  <Radio label="2">不可看</Radio>
                  <Radio label="1">可看</Radio>
                  <Radio label="3">秘方.完全保密</Radio>
              </RadioGroup>
            </span>
          </Col>
        </Row>
        <Row style="margin-top:12px;">
          <Col span="2"> <span>用药禁忌：</span></Col>
          <Col span="22">
            <span>
               <Select
                 v-model="prescription.yyjj"
                 filterable
                 style="width:550px"
                 remote
                 multiple
                 placeholder="请选择用药期间禁忌"
                 >
                    <Option v-for="(yyjj, index) in yyjjList" :value="yyjj.itemname" :key="index">{{yyjj.itemname}}</Option>
                </Select>
            </span>
          </Col>
        </Row>
        <Row style="margin-top:8px;">
          <Col span="2"> <span>医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;嘱：</span></Col>
          <Col span="22">
              <span>
                <input class="inputs" v-model="prescription.yiZhu" type="text">
              </span>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 选填内容 -->
    <!-- 确认按钮 -->
    <div class="fd">
      <Button class="fr" type="success" style="background:#07A591" @click="submitPrescription">签字并发送给患者</Button>
      <span></span>
      <span class="fr settlement">费用总计：<span style="color:#D74326; font-size:22px;">￥{{prescription.money}}</span></span>
      <!-- <Button class="fl close" type="success" @click="closePrescription">关闭挂号</Button> -->
    </div>
    <!-- 确认按钮 -->


    <!-- 历史就诊记录 -->
    <Modal class="showlist" v-model="showlist" width="85%">
      <p slot="header" style="color:#f60;text-align:center">
          患者历史就诊记录
      </p>
      <div>
        <treated :doctorid="doctorid" :patientid="patientid"></treated>
      </div>
      <div slot="footer" v-if="!showlist">
      </div>
    </Modal>
    <!-- 历史就诊记录 -->

    <!-- 引用药方模版 -->
    <bill :doctorid="doctorid" :exampleshow="exampleshow" :prescriptionshapeid="prescription.jixing" @echoexample="eventFromChild"></bill>
    <!-- 引用药方模版 -->

    <!-- 关闭挂号 -->
    <Modal class="showlist" v-model="closePop" width="30%">
        <p slot="header" style="color:#f60;text-align:center">
           关闭挂号单确认
        </p>
        <div>关闭此患者挂号单，将跳过该患者，患者将列入“已就诊”队列。确认关闭患者{{currentPatient?currentPatient.patientname:""}}的{{currentPatient?currentPatient.numberorder:""}}号挂号单？</div>
    </Modal>
    <!-- 关闭挂号 -->

    <!-- 金额计算 -->
    <el-dialog title="操作提醒" :visible.sync="sumshow" width="30%" class="showlist" center :before-close="callback">
        <div>
          <h3>即将提交本处方至患者，请确认处方信息。</h3>
          <p>患者姓名：{{prescription.patientname}}</p>
          <p>患者性别：{{prescription.patientsex == 1?'男':'女'}}</p>
          <p>患者年龄：{{prescription.patientage}}</p>
          <p>药方数：{{prescription.prescriptionList.length}}</p>
          <p>处方金额：{{prescription.money}}元</p>
        </div>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="callback()">取 消</el-button> -->
            <el-button type="primary" @click="submit()">确 认</el-button>
          </span>
    </el-dialog>
    <!-- 金额计算 -->
 </div>



</template>

<style lang="less">
  @import "index.less";
</style>
<script>
  import { mapState, mapActions ,mapGetters, mapMutations } from 'vuex'
  import treated from "@/views/alreadyTreated/treated"//添加医生弹窗
  import bill from "@/views/alreadyTreated/bill"//药方模板弹窗
  export default {
    components: {
      treated,
      bill
    },
    data() {
      return {
        focusStatus:"",
        name:'',
        age:'',
        sex:'',
        currentMedicinesList:[],//当前的药材列表
        loading1:false,
        showlist:false,
        docpaidlist:{},
        doctorid:'',
        patientid:'',
        closePop: false,
        exampleshow: false,
        echo: {},
        istemplate: false,
        isShow: false,
        prescriptionEq: 0,//药方索引
        sumshow: false,
        formData: '',
      }
    },
    computed: {
      ...mapGetters(['selectedPharmacylist','loadedBrands','selectedDrugs']),
      ...mapState({
        selectedDosageBrands:(state)=> state.prescriptions.selectedDosageBrands,
        brandDrugList:(state)=>state.prescriptions.brandDrugList,//药房、品牌、剂型相关的所有的药材
        yyjjList:(state)=>state.prescriptions.yyjjList,//用药禁忌
        jianfaList:(state)=>state.prescriptions.jianfaList,//煎法
        prescription:(state)=>state.prescriptions.prescription,//当前的处方
        currentPatient:(state)=>state.outpatient.currentPatient,//当前的患者
        patientHistoryCount:(state)=>state.prescriptions.patientHistoryCount,//患者历史的就诊数量
        errors:(state)=>state.prescriptions.errors,//错误信息
        prescriptionList:(state)=>state.prescriptions.prescription.prescriptionList,
        doctorDruglist:(state)=> [],
      })
    },
    methods: {
        ...mapActions([
          'loadPharmacylist','loadBrands','selectedDosage','appendEmptyDrug', 'loadAllDrug','findMedicine','loadDicts',
          'calculateAmount','getLoginDetail','doSumbitPrescription','getPatientHistoryCount','validatePrescription',
          'getLoginId','fetchOutpatientList','selectedDefaultPatient','removeDrug','initPrescription',
          'addDrugList','clearDrugList','addPrescription','addDrugSecrecyList','removePrescription',
          'getbatchverificationjg','sumOfMoney','clearPrescriptionList','setCurrentPatient'
        ]),
        ...mapMutations(['emptyPrescription', 'getLoginId','fetchOutpatientList','alreadyOutpatientList','findAlreadyPatientList']),
        reversedSex(sexId){
          return sexId == 1 ? '男' : '女';
        },
        // //刷线当前页
        // refresh(){
        //   this.reload();
        // },
        //选择剂型时
        dosageChange(evt) {
          this.selectedDosage(this.prescription.jixing);
          this.changePrescription();
        },
        //添加医生选择药材的下拉框
        addDoctorMedicineSelector(i,index) {
            this.currentMedicinesList =[];
            let params = {
              i: i,
              index: index
            };
            this.appendEmptyDrug(params);
        },
        removeDoctorMedicine(i,index) {
          let params = {
            i: i,
            index: index
          };
          this.removeDrug(params);
        },
        //用户药材品牌发生的变化
        brandChange(bid) {
            this.loadAllDrug({
                pharmacy:this.prescription.yaofang,
                dosage:this.prescription.jixing,
                brandId: bid
            });
            this.changePrescription();
        },
        //药房，剂型，品牌商切换时初始化
        changePrescription(){
            if(this.prescription.yaofang && this.prescription.jixing && this.prescription.pinpai){
                this.clearPrescriptionList();
                this.isShow = true;
                this.addPrescription(0);
                //选择剂型和药方后显示药材
                let params = {
                    i: 0,
                    index: 0
                };
                this.appendEmptyDrug(params);
                if(this.istemplate){
                    this.clearDrugList();
                }
            }else{
              this.isShow = false;
            }
        },
        //清空处方
        async clearPrescription() {
          let loginId = await this.getLoginId();
          this.fetchOutpatientList(loginId);
          this.selectedDefaultPatient();
          this.emptyPrescription();
        },
        //模板回显
        eventFromChild(val){
          this.clearDrugList(this.prescriptionEq);
          let i = this.prescriptionEq;
          if(val){
            this.istemplate = true;
            //是否为协定方1是2不是
            let isagreementparty = val.list.isagreementparty;
            let orderprescriptionname = val.list.prescriptionname;
            let number = val.list.medicinalMaterials.length;
            let arr = [];
            val.list.medicinalMaterials.forEach((item,index)=>{
                arr.push({
                    decoctionid: item.decoctionid,
                    decoctionname: item.decoctionname,
                    id: item.medicinename,//item.drugid,
                    index: index,
                    medicineNum: item.dosage,
                    medicineUnit: item.medicineunit,
                    medicinename: item.medicinename,
                    medicineprice: item.offretailprice,
                    drugid: item.drugid
                });
            });
            if(isagreementparty == '1'){
                //协定方
                let params = {
                  i: this.prescriptionEq,
                  isagreementparty: isagreementparty,
                  orderprescriptionname: orderprescriptionname,
                  number: number,
                  arr: arr,//药材列表
                };
                this.addDrugSecrecyList(params);
            }else{
                //非协定方
                let params = {
                    i: this.prescriptionEq,//药方索引
                    arr: arr,//药材列表
                    isagreementparty: isagreementparty,//是否为协议方
                    orderprescriptionname: orderprescriptionname,//协议方名称
                };
                this.addDrugList(params);
            }
            this.prescription.prescriptionList[i].gongJiShu = val.totaldosage;
            this.prescription.prescriptionList[i].riJi = val.daydosage;
            this.prescription.prescriptionList[i].jiChiShu = val.taketime;
          }else{
            //药方模板取消操作
            let params = {
                i: this.prescriptionEq,//药方索引
                arr: [],//药材列表
                isagreementparty: '',//是否为协议方
                orderprescriptionname: '',//协议方名称
            };
            this.addDrugList(params);
          }
          this.exampleshow = false;
        },
        //提交处方前获取
        async submitPrescription() {
          this.validatePrescription();
          if (this.errors.length > 0){
            let errorTitle = '诊单错误';
            let errorContent = '';
            this.errors.forEach((msg)=>{
              errorContent = errorContent + '<p>'+ msg + '</p>';
            })
            this.$Notice.error({
              title: errorTitle,
              desc:  errorContent
            });
            return;
          }
          //如果是模板提交前需做id和name对调
          let id = '';
          let index = 0;
          this.prescriptionList.forEach((item,pindex)=>{
              if(item.isagreementparty != undefined){
                  let arr = [];
                  item.yaoCaiLieBao.forEach((drug,i)=>{
                      if(drug.drugid){
                          id = drug.drugid;
                          index = i;
                      }else{
                          id = drug.id;
                      }
                      arr.push({
                          decoctionid: drug.decoctionid,
                          decoctionname: drug.decoctionname,
                          id: id,
                          index: index,
                          medicineNum: drug.medicineNum,
                          medicineUnit: drug.medicineUnit,
                          medicinename: drug.medicinename,
                          medicineprice: drug.medicineprice,
                          drugid: id//特殊参数（如果是模板并且取消提交回显时需）
                      });
                  });
                  let params = {
                      i: pindex,
                      arr: arr,
                      isagreementparty: item.isagreementparty,
                      orderprescriptionname: item.orderprescriptionname
                  };
                  this.addDrugList(params);
              }
          });
          
          let prescription = this.prescription;
          let login = await this.getLoginDetail();
          let doctorId = login.id;
          this.formData = Object.assign({},prescription);
          if(this.formData.yyjj){
            this.formData.yyjj = this.formData.yyjj.join(',');
          }else{
            this.formData.yyjj = '';
          }
          this.formData.clinicid = login.cnameid;
          this.formData.hospitaid = this.formData.yaofang
          this.formData.doctorid = this.currentPatient.doctorid;
          this.formData.doctorname = this.currentPatient.doctorname;//login.name
          this.formData.brandid = this.formData.pinpai
          this.formData.prescriptionshapeid = this.formData.jixing
          this.formData.prescriptionsid = this.formData.chaKanYaoFang
          this.formData.patientid = this.currentPatient.patientid
          this.formData.numberorder = this.currentPatient.numberorder
          this.formData.guahaoId = this.currentPatient.id
          this.formData.diagnosisqueueid = this.currentPatient.id
          this.formData.repeat = this.prescriptionList;
          let brand = this.selectedDosageBrands.find(m=>m.itemcode == this.formData.pinpai);
          this.formData.brandname = brand.itemname;
          //提交前获取总金额
          this.sumOfMoney(this.formData);
          this.sumshow = true;
        },
        //最终提交
        submit(){
          this.sumshow = false;
          this.doSumbitPrescription(this.formData);
          let title = '开方成功';
          let content = '您已经诊断成功，即将服务下一位患者！';
          let that = this;
          this.$Modal.success({
              title: title,
              content: content,
              onOk:function() {
                  that.clearPrescription();
                  that.clearPrescriptionList();
                  that.isShow = false;
                  that.$router.go(0);
              }
          });
        },
        //取消操作（如果是模板需做处理）
        callback(){
            //如果是模板提交前需做id和name对调
            let arr = [];
            let index = 0;
            this.prescriptionList.forEach((item,pindex)=>{
              if(item.isagreementparty != ''){
                  item.yaoCaiLieBao.forEach((drug,i)=>{
                      arr.push({
                          decoctionid: drug.decoctionid,
                          decoctionname: drug.decoctionname,
                          id: drug.medicinename,
                          index: i,
                          medicineNum: drug.medicineNum,
                          medicineUnit: drug.medicineUnit,
                          medicinename: drug.medicinename,
                          medicineprice: drug.medicineprice,
                          drugid: drug.id
                      });
                  });
                  let params = {
                      i: pindex,
                      arr: arr
                  };
                  this.addDrugList(params);
              }
          });
          this.sumshow = false;
        },
        //添加药方
        addNewPrescription(){
            this.prescriptionEq ++;
            this.addPrescription(this.prescriptionEq);
            let params = {
              i: this.prescriptionEq,
              index: 0
            };
            this.appendEmptyDrug(params);
        },
        //删除此药方
        remove(i){
            this.prescriptionEq --;
            this.removePrescription(i);
        },

        //关闭挂号
        closePrescription(){
          this.closePop = true;
        },
        //过滤药材
        filteredMedicines(query) {
          if (query !== '') {
            this.loading1 = true;
            let code = query.toLowerCase();
            let drugs = this.brandDrugList;
            this.loading1 = false;
            let that =this;
            const list = drugs.map(item=>{
              return {
                id:item.id,
                medicinename:item.medicinename,
                medicineprice:item.offretailprice,
                medicineunit:item.medicineunit,
                specification:item.specification,
                phoneticode:item.phoneticode,
                lowstock:item.lowstock,
                totalstock:item.totalstock,
                takestock:item.takestock,
                codes:item.codes
              }
            });
            // console.log('药材列表',that.doctorDruglist);
            this.currentMedicinesList = list.filter(item=>{ 
                //如果药品已经选择，这里会过滤掉，将不会再选择。
              let itemId = item.id;
              let foundIndex = that.doctorDruglist.findIndex(drug=>{
                  if (drug.id == itemId){
                      return true;
                  }
                  return false;
              });
              //如果医生已经选择，则返回 false ，不需要再选择了。
              if (foundIndex > -1){
                  return false;
              }
              //按快捷码进行过滤
              let codes = item.codes;
              for (let i=0;i<codes.length;i++){
                let spell = codes[i];
                if (spell.indexOf(code) > -1) {
                  return true;
                }
              }
              if (item.medicinename.indexOf(code) > -1) {
                  return true;
              }
              return false;
            });
          } else {
            this.currentMedicinesList =[]
          }
        },
        //显示弹窗
        showlists(){
          this.showlist = true;
            sessionStorage.doctorid = this.currentPatient.doctorid;
        },
        opentemplate(i){
          this.doctorid = this.currentPatient.doctorid;
          this.exampleshow = true;
          this.prescriptionEq = i;
        },
    },
    watch: {
      doctorDruglist: {
        handler:async function(newValue,oldValue){
          for (var index in newValue) {
            let medicine = newValue[index];
            if (medicine.medicineUnit === '' && medicine.id !== '') {
              //原始的药材数据
              let medicineData = await this.findMedicine(medicine.id)
              medicine.medicineprice = parseFloat(medicineData.offretailprice)
              medicine.medicinename = medicineData.medicinename
              medicine.medicineUnit = medicineData.medicineunit;
            }
            if (medicine.decoctionid !== '' && medicine.decoctionname === '') {
              let jianfa = this.jianfaList.find(m=>m.itemcode == medicine.decoctionid);
              medicine.decoctionname = jianfa.itemname
            }
          }
        },
        deep:true,
      },
      //计算费用（统一计算）
      // prescription: {
      //   handler:function(newValue,oldVaue) {
      //     this.calculateAmount();
      //   },
      //   deep:true
      // },
      currentPatient:function (p1){
        this.getPatientHistoryCount(p1);
        this.doctorid = p1.doctorid;
        this.patientid = p1.patientid;
        this.initPrescription(p1);
      }
    },
    //生命周期之创建完成
    created: function(){
      this.loadPharmacylist();
      this.loadBrands();
      this.loadDicts();
      let self = this;
      setTimeout(()=>{
        self.selectedDosage(self.prescription.jixing);
        // self.appendEmptyDrug(0);
      },1000);
    },
  }
</script>

