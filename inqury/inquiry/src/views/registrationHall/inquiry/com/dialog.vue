<template>
  <div>
    <el-dialog :title="title" center :visible.sync="dialogVisible" width="30%">
      <div v-if="type === 1">
        <p>
          选择当前诊所已入驻医生，默认快速挂号时使用该医生账号完成挂号过程，用于药品零售等场景。如当前诊所无零售需求，可【取消】该步骤，则无法进行快速挂号。
        </p>
        <div class="flex-row">
          <span class="account">*内部医生账号</span>
          <el-select v-model="doctorid" placeholder="请选择" @change="select1">
            <el-option
              v-for="(item,i) in doctorData"
              :key="i"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div v-if="type === 2">
        <p>
          选择当前诊所已添加会员，默认快速挂号时使用该会员账号完成挂号过程，满足药品零售需要。如【取消】该步骤，则无法进行快速挂号。
        </p>
        <span class="account">*散客专用账号:</span>
        <el-select v-model="patientid" placeholder="请选择" @change="select2">
          <el-option
            v-for="(item,i) in memberData"
            :key="i"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>

      <div v-if="type === 3">
        <p class="account2">
          <span>挂号目标医生</span>:<span class="account1">
            {{ cDoctor }}
          </span>
        </p>
        <p class="account2">
          <span>默认挂号患者</span>:<span class="account1">
            {{ cPatient }}</span
          >
        </p>
        <p class="account2">
          <span>快速挂号费用</span>:<span class="account1">0 元</span>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="type === 1">
          <el-button @click="jump">取 消</el-button>
          <el-button type="primary" @click="onNext">下一步</el-button>
        </div>

        <div v-if="type === 2">
          <el-button @click="jump">取 消</el-button>
          <el-button type="primary" @click="onComplete">完成创建</el-button>
        </div>

        <div v-if="type === 3">
          <el-button @click="onRegist">确定挂号</el-button>
          <el-button type="primary" @click="cancel(3)">取消挂号</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 1,
        dialogVisible: false,
        doctorid: '',
        doctorData: [],
        patientid: '',
        memberData: [],
        parameter: JSON.parse(sessionStorage.getItem('loginDetail')).parameters.cnameid,
        value: '',
        //cDoctor: 1,
        //cPatient:  2,
        cPatient: '',
        cDoctor: ''
      };
    },
    computed: {
      title() {
        if (this.type === 1) {
          return '绑定内部医生账号';
        }
        if (this.type === 2) {
          return '绑定散客专用号';
        }
        if (this.type === 3) {
          return '快速挂号';
        }
      }
    },
    methods: {
      // 获取当前选择医生姓名
      select1(val) {
        // console.log('>>>>>>>>>>>>>>>>>>>',val.label,val.value);
        let obj = {};
        obj = this.doctorData.find(item => {
          return item.id === val;
        });
        this.cDoctor = obj.name;
        // console.log(obj.name);
      },
      // 获取当前选择患者姓名
      select2(val) {
        // console.log('>>>>>>>>>>>>>>>>>>>',val.label,val.value);
        let obj = {};
        obj = this.memberData.find(item => {
          return item.id === val;
        });
        this.cPatient = obj.name;
        // console.log(obj.name);
      },
      // 取消按钮
      jump() {
        this.dialogVisible = false;
        this.$message({
          showClose: true,
          message: '您取消了快速挂号！',
          type: 'error',
          center: true
        });
      },
      // 下一步按钮
      onNext(type) {
        if (this.doctorid !== '') {
          this.type = 2;
          this.getMemberList();
        } else {
          this.$message.warning('请选择医生');
        }
      },
      // 完成创建按钮
      onComplete(type) {
        if (this.patientid !== '') {
          this.type = 3;
        } else {
          this.$message.warning('请选择患者');
        }
      },
      // 取消挂号按钮
      cancel(type) {
        this.dialogVisible = false;
        this.$message({
          showClose: true,
          message: '您取消了快速挂号！',
          type: 'error',
          center: true,
          status: 0
        });
      },
      show() {
        this.patientid = '';
        this.doctorid = '';
        this.dialogVisible = true;
        this.getRegistInfo();
        this.getParament();
        this.getDoctorList();
        if (!sessionStorage.getItem('registInfo')) {
          this.type = 1;
        } else {
          this.type = 3;
          (this.cPatient = JSON.parse(sessionStorage.getItem('registInfo')).cPatient),
          (this.cDoctor = JSON.parse(sessionStorage.getItem('registInfo')).cDoctor);
        }
      },
      getParament() {
        let _this = this;
        this.$doRequest('/api/diagnosisqueue/kqueue',{ parameter: this.parameter },
          res => {
            // console.log(32323,res);
            if(!res.parameters.doctorid || !res.parameters.patientid) {
              _this.type = 1;
            } else {
              _this.doctorid = res.parameters.doctorid,
              _this.patientid =  res.parameters.patientid,
              _this.cDoctor = res.parameters.doctorname,
              _this.cPatient = res.parameters.patientname
              _this.type = 3;
            }
          }
          // ,data=>{
          //   console.log(2222,data);
          //   _this.type = 3;
          // }
        );
      },
      // 获取医生列表
      getDoctorList() {
        this.$doRequest('/api/diagnosisdoctor/list',{ parameter: this.parameter },
          res => {
            this.doctorData = res.parameters;
            console.log(this.doctorData);
          }
        );
      },
      // 获取挂号信息
      getRegistInfo() {
        this.$doRequest('/api/diagnosisqueue/names',{ parameter: this.parameter },
          res => {
            // console.log(res);
          }
        );
      },
      // 获取患者列表
      getMemberList() {
        this.$doRequest('/api/membershipcard/list',{
            parameter: this.parameter,
            twoParameter: '20190314142800594634ade4787d5'
            //  twoParameter: this.parameters.patientid
          },
          res => {
            // console.log(res)
            this.memberData = res.parameters;
          }
        );
      },
      // 确定挂号按钮
      onRegist(type) {
        let params = {};
        // if (!sessionStorage.getItem('registInfo')) {
          params = {
            hospitainid: this.parameter,
            doctorid: this.doctorid,
            patientid: this.patientid
          };
        // } else {
          // params = JSON.parse(sessionStorage.getItem('registInfo'));
        // }

        this.$doRequest('/api/diagnosisqueue/fast', params, res => {
          console.log(res)
          if (res.result === 0) {
            let registInfo = {
              doctorid: res.parameters.doctorid,
              patientid: res.parameters.patientid,
              hospitainid: this.parameter,
              cDoctor: res.parameters.doctorname,
              cPatient: res.parameters.patientname
            };
            this.cPatient = res.parameters.doctorname;
            this.cDoctor = res.parameters.patientname;
            sessionStorage.setItem('registInfo', JSON.stringify(registInfo));
            this.$message.success('挂号成功');
          } else {
            this.$message.error(res);
            if(res.result === -2) {
              this.type =1
            }
          }
        });
        this.dialogVisible = false;
      }
    }
  };
</script>
<style lang="less">
  .flex-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
  }
  .account {
    margin-right: 20px;
  }
  .account1 {
    margin-left: 20px;
  }
  .account2 {
    margin-top: 20px;
  }
</style>
