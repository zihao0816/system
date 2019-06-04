<template>
    <div class="inquiry">
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
                    <Button type="primary" @click="showov(scope.row)">挂号</Button>
                  </template>
                </el-table-column>
              </el-table>
            </Col>
    <!-- 就诊列表 -->
        </Row>
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
          <Button  size="large" long  @click="pay(istanchuang)">选择付费方式</Button>
        </div>
      </Modal>

      <!-- 挂号弹窗 -->
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
  import { mapState, mapActions ,mapGetters, mapMutations } from 'vuex'
    export default {
       components: {

        },
        data() {
            return {
              sex:'男',
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
              membershipIsOpen:'',
              patientid:'',
              src:'',
              istab:1,
            }
        },
      computed: {
        ...mapGetters(['getDoctorList']),
        ...mapState({
          doctorList:(state)=> state.registered.doctorList,
        })
      },
        //生命周期之挂载完成
        methods: {
          ...mapActions([
            'findDoctorList'
          ]),
          iscreat(){
            var _this = this;
            this.$doRequest("/api/doctorinterrogation/list",null,function(res){
              _this.docData = res;
            })
          },
          showov(item){
            this.gh = true;
            this.userphone = '';
            this.doctorid = item.doctorid;
            this.diagnosticcost = item.diagnosticcost;
            this.name = item.name;
          },
        },
        //生命周期之创建完成
        created: function(){
           // this.findDoctorList(11);
          this.iscreat();
        }
    }
</script>

