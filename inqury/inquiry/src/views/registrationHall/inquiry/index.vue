<template>
    <div class="inquiry">
        <div class="gotoreg" @click="gotodat()">
            <i class='el-icon-back'></i>  返回大厅
        </div>
    <!-- 就诊列表 -->
        <Row style="margin-top:1vh;">
            <Col span="11">
               <el-table :data="docData" style="width:100%;font-size:14px;" border >
                    <el-table-column label="医生姓名" prop="name"  align="center"></el-table-column>
                    <el-table-column label="坐诊费(元/次)" prop="diagnosticcost"  align="center"></el-table-column>
                    <el-table-column label="当前待诊(人)" align="center">
                         <template slot-scope="scope">
                            <el-button type="text" size="small" @click="showtable(1,scope.row)">{{scope.row.wait}}  </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="今日已就诊(人)" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="showtable(2,scope.row)" size="small">{{scope.row.already}}  </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <Button class="buttons" @click="showov(scope.row)">挂号</Button>
                        </template>
                    </el-table-column>
                </el-table>
            </Col>
    <!-- 就诊列表 -->
    <!-- 就诊详情 -->

            <Col span="12" offset="1"  v-if="istable==1||istable==2">
            <div class="old">{{istable==1?'当前待诊患者':'今日已就诊'}}</div>
               <el-table :data="tableData" style="width:100%;font-size:14px;" border >
                    <el-table-column label="姓名" prop="patientname"  align="center"></el-table-column>
                    <el-table-column label="性别"  align="center">
                         <template slot-scope="scope">
                            <span>{{scope.row.patientsex == 1?'男':"女"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="电话" prop="patientphone"  align="center"></el-table-column>
                    <el-table-column label="号码顺序" prop="numberorder"  align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" style="color:#999;">打印</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </Col>
        </Row>
    <!-- 就诊详情 -->



<!-- 挂号弹窗 -->

 <Modal v-model="gh" width="500">
    <p slot="header" style="text-align:center">
        <span>待挂号</span>
    </p>
    <div>
        <p style="margin:15px 0;">
            <span style="font-weight: 600;">医生:</span>
            <span style="margin-right:145px;">{{name}}</span>
            <span style="font-weight: 600;">挂号费:</span>
            <span>{{diagnosticcost}}元</span>
        </p>
        <p style="margin:15px 0;">
            <span style="font-weight: 600;vertical-align: middle;">患者电话：</span>
            <span style="display: inline-block;vertical-align: middle;"><Input search enter-button="点击验证" :maxlength='11' v-model="userphone" @on-search='searchlist()' placeholder="请输入患者电话" /></span>
        </p>
        <div v-if="searchinfo != null">
            <p style="margin:15px 0;">
                <span style="font-weight: 600;vertical-align: middle;">姓名:</span>
                <span style="display: inline-block;vertical-align: middle;"><Input v-model="searchinfo.patientname" :disabled='istanchuang' style="vertical-align: middle;"/></span>
                <span style="font-weight: 600;vertical-align: middle;">患者生日:</span>
                <span style="display: inline-block;vertical-align: middle;">
                     <el-date-picker
                        v-model="searchinfo.birthday"
                        type="date"
                        :disabled='istanchuang'
                        size='small '
                        style="width:200px;z-index:9999"
                        value-format='yyyy-MM-dd'
                        placeholder="选择日期">
                    </el-date-picker>
                </span>
            </p>
            <p style="margin:15px 0;">
                <span style="font-weight: 600;vertical-align: middle;">患者性别：</span>
                <span style="display: inline-block;vertical-align: middle;">
                    <RadioGroup v-model="searchinfo.sex" >
                        <Radio :disabled='istanchuang' label='1'>
                            <span>男</span>
                        </Radio>
                        <Radio :disabled='istanchuang' label='2'>
                            <span>女</span>
                        </Radio>
                    </RadioGroup>
                </span>
            </p>
            <p style="margin:15px 0;">
                <span style="font-weight: 600;vertical-align: middle;">患者身份证：</span>
                <span style="display: inline-block;vertical-: middle;"><Input v-model="searchinfo.idnumber"  :maxlength='18' :disabled='istanchuang' style="vertical-align: middle;"/></span>
            </p>
        </div>
    </div>
    <div slot="footer">
        <Button  size="large" class="buttons" long :disabled='searchinfo==null' @click="pay(istanchuang)">选择付费方式</Button>
    </div>
 </Modal>

<!-- 挂号弹窗 -->

<!-- 验证码弹窗 -->

    <Modal
        v-model="codes"
        title="手机验证码"
        :mask-closable="false"
        @on-ok="提交">
        <Input v-model="codeinfo" :maxlength='6' placeholder="请输入验证码"  />
        <div slot="footer">
            <Button  size="large" class="buttons" long  @click="iscode()">确定</Button>
        </div>
    </Modal>
<!-- 验证码弹窗 -->


<!-- 支付弹窗 -->
    <Modal v-model="pays" width="500" height='700'>
        <p slot="header" style="text-align:center;background:#f1f0f5">
            <span>待挂号</span>
        </p>
        <Tabs :value="payMethod" @on-click="payMethodSelect">
            <TabPane label="会员支付" name="memberCardMethod">
                <Row>
                    <Col span="8" offset="3">
                        <div style="line-height:30px;">手机号：{{userphone}}</div>
                        <div style="line-height:30px;" >会员卡余额：<span :class="{colorred:memberstate==2}">{{accountbalance}}元</span></div>
                    </Col>
                    <Col span="8" offset="3">
                        <div style="line-height:30px;" >会员状态：<span :class="{colorred:memberstate==2}">{{memberstate==2?'未开通':'已开通'}}</span></div>
                        <div style="line-height:30px;">待支付费用：{{diagnosticcost}} 元</div>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="二维码支付" name="weixinPayMethod">
                <Row>
                    <Col span="5" offset="3">
                        <img :src="src" alt="" style="width:100px;height:100px">
                    </Col>
                    <Col span="11" offset="3" style="margin-top:7%;">
                        <div>请患者微信扫码付款。<br>
                            付款成功后，可收到挂号信息。</div>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
        <div slot="footer" v-if="payMethod == 'memberCardMethod'">
            <div v-if="memberstate==1" style="margin: 10px 0;display:flex;justify-content: space-around;">
                <Button  @click="pays=false">取消</Button>
                <Button class="buttons" @click="gotopay()">确定支付</Button>
            </div>
            <div v-if="memberstate==2" style="margin: 10px 0;display:flex;justify-content: space-around;">
                <Button @click="pays=false">取消</Button>
            </div>
        </div>
        <div slot="footer" v-if="payMethod == 'weixinPayMethod'">
            <div style="margin: 10px 0;display:flex;justify-content: space-around;">
                <Button @click="pays=false">返回</Button>
            </div>
        </div>
    </Modal>

<!-- 支付弹窗 -->

<!-- 快速挂号 -->
        <div style="margin-top: 400px;" >
            <el-button type="primary" plain @click="regist">快速挂号</el-button>        
        </div>
        <Dialog  ref="dialogs"></Dialog>
<!-- 快速挂号-->
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import Dialog from "./com/dialog.vue"
    export default {
       components: {
            Dialog
        },
        data() {
            return {
                payMethod:'memberCardMethod',
                sex:'1',
                gh:false,
                docData:[],
                tableData:[],
                searchinfo:{},
                name:'',
                userphone:'15311410291',
                istable:0,
                doctorid:'',
                diagnosticcost:'',
                isllll:false,
                time:"1980-04-28",
                istanchuang:true,
                codes:false,
                codeinfo:'',
                pays:false,
                accountbalance:'',
                memberstate:'',
                patientid:'',
                src:'',
                istab:1,
                type: 1,
            }
        },
        //生命周期之挂载完成
        methods: {
            // 快速挂号按钮方法
            regist(){ 
                this.$refs.dialogs.show()
            },            
            iscreat(){
                var _this = this;
                this.$doRequest("/api/doctorinterrogation/list",null,function(res){
                    _this.docData = res;
                })
            },
            showtable(num,item){
                var _this = this;
                this.istable = num;
                if(num == 1){
                    _this.$doRequest("/api/diagnosisqueue/wait?doctorid="+item.doctorid,null,function(res){
                       _this.tableData = res;
                    })
                }else if(num == 2){
                    _this.$doRequest("/api/diagnosisqueue/already?doctorid="+item.doctorid,null,function(res){
                       _this.tableData = res;
                    })
                }
            },
            showov(item){
                this.gh = true;
                this.userphone = '';
                this.doctorid = item.doctorid;
                this.diagnosticcost = item.diagnosticcost;
                this.name = item.name;
            },
            searchlist(){
                if(!(/^1[3456789]\d{9}$/.test(this.userphone))){
                    this.$message.error("手机号格式错误")
                }else{
                    var _this = this;
                    this.$doRequest("/api/diagnosisqueue/getPatientByTel",{'telephone':this.userphone},function(res){
                        if(res.patientname != null){
                            _this.searchinfo = res;
                            _this.searchinfo.sex = res.sex+'';
                            _this.patientid = res.id;
                            _this.accountbalance = res.accountbalance;
                            _this.memberstate = res.memberstate;
                            _this.istanchuang = true;
                        }else{
                            _this.searchinfo = res;
                            _this.$doRequest("/api/diagnosisqueue/sendVerificationCode",{'telephone':_this.userphone},function(res){
                                _this.$message.info(res.message);
                                _this.codes = true;
                            })
                        }
                    })
                }
            },
            pay(istrue){
                var _this = this;
                if(!istrue){
                    this.$doRequest("/api/diagnosisqueue/registeredPatient",{
                        "idnumber":this.searchinfo.idnumber,
                        "telephone":this.userphone,
                        "patientname":this.searchinfo.patientname,
                        "sex":this.searchinfo.sex=='男'?1:2,
                        "birthday":this.searchinfo.birthday
                        },function(res){
                            if(res.result>=0){
                                _this.pays = true;
                                _this.gh = false;
                                _this.patientid = res.message;
//                                  _this.$doRequest("/api/diagnosisqueue/paymentPrescriptions",{
//                                    "patientid":_this.patientid,
//                                    "patientphone":_this.userphone,
//                                    "doctorid":_this.doctorid,
//                                    "consumption":_this.diagnosticcost
//                                    },function(res){
//                                        _this.src = 'http://service.51bjhzy.com/api/StaticFile/orderqr/' + res.message;
//                                        // _this.src = 'http://service.51bjhzy.com/api/StaticFile/orderqr/201901161925522558032d4c928f7.png'
//                                })
                              _this.memberstate = 2;

                            }
                            _this.accountbalance = 0;

                    })
                }else{
                    _this.pays = true;
                    _this.gh = false;
//                      _this.$doRequest("/api/diagnosisqueue/paymentPrescriptions",{
//                                    "patientid":_this.patientid,
//                                    "patientphone":_this.userphone,
//                                    "doctorid":_this.doctorid,
//                                    "consumption":_this.diagnosticcost
//                                    },function(res){
//                                        _this.src = 'http://service.51bjhzy.com/api/StaticFile/orderqr/' + res.message;
//                                        // _this.src = 'http://service.51bjhzy.com/api/StaticFile/orderqr/201901161925522558032d4c928f7.png'
//                                })
                }

            },
            gotopay(){
                //在这里需要判断，如果是会员支付，直接去支付，如果是微信支付，需要与微信交互后支付。
              var _this = this;
                _this.pays = false;
              if (this.payMethod === 'memberCardMethod') {
                this.$doRequest("/api/diagnosisqueue/memberPayment",{
                  "patientid":this.patientid,
                  "patientphone":this.userphone,
                  "doctorid":this.doctorid,
                  "consumption":this.diagnosticcost,
                },function(res){
                  if(res.result>=0){
                    _this.$doRequest("/api/doctorinterrogation/list",null,function(res){
                      _this.docData = res;
                    })
                    _this.$message.success(res.message);
                  }else{
                    _this.$message.error(res.message);
                  }
                })
              } else {//微信支付，查询支付状态
                _this.pays = false;
                _this.gh = false;

              }

            },
            gotodat(){
                 this.$router.push({ path:'/registrationHall' })
            },
            iscode(){
                var _this = this;
                if(!!this.codeinfo){
                    this.$doRequest("api/diagnosisqueue/verificationcode",{
                        "parametersone":this.userphone,
                        "parameters":this.codeinfo
                        },function(res){
                             if(res.result>=0){
                                _this.codes = false;
                                _this.istanchuang = false;
                                _this.$message.success(res.message);
                            }else{
                                _this.$message.error(res.message);
                            }
                    })
                }else{
                    _this.$message.warning('请输入验证码');
                }
            },
            payMethodSelect(name) {
              this.payMethod = name;
              //如果是微信支付，先生成二维码
              if (name === 'weixinPayMethod' && this.src === '') {
                  let _this = this;
                  _this.$doRequest("/api/diagnosisqueue/paymentPrescriptions",{
                    "patientid":_this.patientid,
                    "patientphone":_this.userphone,
                    "doctorid":_this.doctorid,
                    "consumption":_this.diagnosticcost,
                  },function(res){
                    _this.src = 'https://service.51bjhzy.com/api/StaticFile/orderqr/' + res.message;
                    // _this.src = 'http://service.51bjhzy.com/api/StaticFile/orderqr/201901161925522558032d4c928f7.png'
                  })
              }
            }
        },
        //生命周期之创建完成
        created: function(){
            this.iscreat()
        },
        watch:{
            codes(news){
                this.codeinfo = '';
            },
            gh(news){
                this.searchinfo = null;
            },
            istab(news){
            }

        }
    }
    
</script>

