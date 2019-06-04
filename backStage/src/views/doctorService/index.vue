<template>
  <div class="examine">
    <div class="page">
      <div>
        <navigation></navigation>
      </div>
      <div class="content">
        <!-- <div class="add">
          <el-button type="primary" @click="goSaveClinic(1)">拍照处方工单</el-button>
        </div> -->
        <!-- 顶部表单 --> 
        <div class="search">
          <el-form :inline="true" label-width="100px">
            <el-form-item label="上传时间：">
               <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>            
            </el-form-item>
            <el-form-item label="患者姓名：">
              <el-input v-model="hispatientname" placeholder="请输入患者姓名"></el-input>
            </el-form-item>
            <el-form-item label="患者电话：">
              <el-input v-model="telephone" placeholder="请输入患者电话"></el-input>
            </el-form-item>
            <el-form-item label="工单号：">
              <el-input v-model="ordernumber" placeholder="请输入工单号"></el-input>
            </el-form-item>
            <el-form-item label="医生姓名：" style="margin-left: 12px;">
              <el-input v-model="hisdoctorname" placeholder="请输入医生姓名"></el-input>
            </el-form-item>
            <el-form-item label="医生电话：">
              <el-input v-model="hisdoctortelephone" placeholder="请输入医生电话"></el-input>
            </el-form-item>
            <el-form-item label="处理状态：">
              <el-select v-model="processstate">
                <el-option value="1" label="已处理" key="1"></el-option>
                <el-option value="2" label="未处理" key="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="协助状态：" style="margin-left: 12px;">
              <el-select v-model="orderstate">
                <el-option value="1" label="已结束" key="1"></el-option>
                <el-option value="2" label="未结束" key="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="等待时长：">
              <el-input v-model="startwaittime" placeholder="请输入开始时间" style="width:150px"></el-input>
              至
              <el-input v-model="endwaittime" placeholder="请输入结束时间" style="width:150px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="clear()">重置</el-button>
              <el-button type="primary" @click="queryOutpatient()">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 中部表格 -->
        <div class="tables">
          <el-table border :data="storageData" style="width: 100%;" highlight-current-row>
            <el-table-column prop="ordernumber" label="工单号" align="center" width="180"></el-table-column>
            <el-table-column  label="上传时间" align="center" width="180">
               <template slot-scope="scope">
                   <span>{{$common.timestampToTime(scope.row.uploadtime,1)}}</span>
                </template>    
            </el-table-column>
            <el-table-column prop="hispatientname" label="患者姓名" align="center"></el-table-column>
            <el-table-column prop="telephone" label="患者电话" align="center" width="110"></el-table-column>
            <el-table-column prop="hisdoctorname" label="医生姓名" align="center"></el-table-column>
            <el-table-column prop="hisdoctortelephone" label="医生电话" align="center" width="110"></el-table-column>
            <el-table-column prop="totaldosage" label="购药剂量" align="center"></el-table-column>
            <el-table-column prop="waittime" label="累积等待时长(分钟)" align="center" width="150"></el-table-column>
            <el-table-column label="处理状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.processstate == 1?'已处理':'未处理'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="工单状态" align="center" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.orderstate == 1?'已关闭':'未关闭'}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200" align="center" class="operation">
              <template slot-scope="scope" class="operation">
                <el-button type="text" size="small" @click="check(scope.row)">查看</el-button>
                <el-button type="text" size="small" @click="close(scope.row)">关闭</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="block" style="float:right; margin-top:15px">
          <el-pagination
            @current-change="getpage"
            :current-page.sync="pagination"
            layout="total, prev, pager, next"
            :page-count="pageLength"
          ></el-pagination> 
        </div>
        <!-- 关闭按钮弹窗 -->
        <el-dialog title="关闭工单" center :visible.sync="dialogVisible" width="30%">
          <span>即将关闭医生：{{doctorName}} 的拍照开方工单。关闭后，工单的“结束状态”变更为“已结束”。</span>
          <p style="margin-top:20px">确认关闭该此工单？</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1">取 消</el-button>
            <el-button type="primary" @click="dialogVisible2">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import navigation from "../../components/common/navigation";
import common from "../../api/common";
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
export default {
  components: {
    navigation
  },
  data() {
    return {
      // common.timestampToTime(item.warningtime);
      doctorName: "",  //关闭弹框回显医生姓名
      date: '',
      dialogVisible: false,  
        //上传时间
        uploadtime: "",
        //患者名称
        hispatientname: "",
        //患者手机号
        telephone: "",
        //工单编号
        ordernumber: "",
        //医生名称
        hisdoctorname: "",
        //医生手机号
        hisdoctortelephone: "",
        //处理状态
        processstate: "",
        //协助状态
        orderstate: "",
        //等待时长
        endwaittime: "",
        //等待时长
        startwaittime: "",
        
        //开始时间
        startDate: "",
        //结束时间
        endDate: "",
      
      storageData: [], //表格数据
      //   分页数据
      pagination: 1, //页数
      pageLength: 1, //条数
      getServerId: "" //工单id
    };
  },
  methods: {
    // 搜索操作
    queryOutpatient() {
      this.startDate = this.date[0];
      this.endDate = this.date[1];
      let params = {
        pageLength:10,
        pagination:this.pagination,
        condition: {
          //开始时间
          startDate: this.startDate,
          //结束时间
          endDate: this.endDate,
          //工单编号
          ordernumber: this.ordernumber,
          //患者名称
          hispatientname: this.hispatientname,
          //患者手机号
          telephone: this.telephone,
          //医生名称
          hisdoctorname: this.hisdoctorname,
          //医生手机号
          hisdoctortelephone: this.hisdoctortelephone,
          //等待时长
          startwaittime: this.startwaittime,
          //等待时长
          endwaittime: this.endwaittime,
          //处理状态
          processstate: this.processstate,
          //协助状态
          orderstate: this.orderstate
        }
      };  
      let _this = this;
      this.$doRequest(
        "/api/PhotoBackstage/queryPhoto",params,res => {
          // console.log(res);
          _this.storageData = res.pageVal;
          _this.pageLength = res.pageCount/1;
        }
      );
    },
    // 关闭按钮弹窗
    close(item) {
      this.dialogVisible = true;
      this.getServerId = item.id;
      // console.log(this.getServerId);
      this.doctorName = item.hisdoctorname;
    },
    // 取消按钮
    dialogVisible1() {
      this.dialogVisible = false;
    },
    // 确定按钮
    dialogVisible2() {
      let _this = this;
      this.$doRequest(
        "/api/PhotoBackstage/closeorder",
        { parameters: this.getServerId },
        res => {
          _this.queryOutpatient();
          _this.dialogVisible = false;
          _this.$message.warning('已关闭工单');
        }
      );  
    },
    //重置操作
    clear() {
        //上传时间
        this.date = []; 
        //患者名称
        this.hispatientname = "",
        //患者手机号
        this.telephone= "",
        //工单编号
        this.ordernumber= "",
        //医生名称
        this.hisdoctorname= "",
        //医生手机号
        this.hisdoctortelephone= "",
        //处理状态
        this.processstate= "",
        //协助状态
        this.orderstate= "",
        //等待时长
        this.endwaittime= "",
        this.startwaittime= "",

        this.queryOutpatient();

    },
        //翻页
    getpage(val) {
      this.pagination = 1;
      this.pagination = val;
      this.queryOutpatient();
    },
    prev(val) {
      this.pagination = val - 1;
      this.queryOutpatient();
    },
    next(val) {
      this.pagination = val + 1;
      this.queryOutpatient();
    },
    //去详情
    check(row){
        this.$router.push({path: '/doctorServiceDetails',query:{id: row.id}});
    }
  },
  creater() {
    this.queryOutpatient();
  },
  mounted() {
     this.queryOutpatient();
  }

};
</script>
<style lang="less" scoped>
@import "index.less";
</style>