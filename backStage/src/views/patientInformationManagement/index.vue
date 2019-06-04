<template>
    <div class="examine">
        <div class="page">
            <div>
                <navigation></navigation>
            </div>
            <div class="content">
                <!-- 顶部搜索表单 -->
                <div class="search">
                    <el-form :inline="true" label-width="120px">
                        <el-form-item label="患者姓名：">
                            <el-input v-model="patientname" placeholder="请输入患者姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="患者手机号：">
                            <el-input v-model="telephone" placeholder="请输入患者手机号"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="患者年龄段：">
                            <el-select v-model="patientage">
                                <el-option
                                    v-for="(item,index) in lavalList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="性别：">
                            <el-select v-model="sex">
                                <el-option value="1" label="男" key="1"></el-option>
                                <el-option value="2" label="女" key="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="所属机构：">
                            <el-select v-model="affiliate">
                                <el-option value="1" label="中日友好医院" key="1"></el-option>
                                <el-option value="2" label="三溪堂中医门诊" key="2"></el-option>
                            </el-select>

                            <el-select v-model="affiliate" placeholder="全部来源">
                                <el-option v-for="item in outpatientArr" :key="item.affiliate" :label="item.affiliate" :value="item.affiliate"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item label="地区：">
                            <el-cascader
                                :options="searchOptions"
                                v-model="searchSelectedOptions"
                                @change="searchHandleChange"
                            ></el-cascader>
                        </el-form-item> -->
                        <el-form-item>
                            <el-button type="primary" @click="clear()">重置</el-button>
                            <el-button type="primary" @click="searchData(1)">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 列表表格 -->
                <div class="tables">
                    <el-table border :data="storageData" style="width: 100%;" highlight-current-row>
                        <el-table-column prop="patientnickname" label="微信昵称" align="center"></el-table-column>
                        <el-table-column prop="patientname" label="患者姓名" align="center" ></el-table-column>
                        <el-table-column label="性别" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.sex == 1?'男':'女'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="telephone" label="患者手机号" align="center" width="150px"></el-table-column>
                        <!-- <el-table-column prop="province" label="所在城市" align="center"></el-table-column>
                        <el-table-column prop="city" label="所在区域" align="center"></el-table-column> -->
                        <el-table-column prop="registertime" label="注册时间" align="center" ></el-table-column>
                        <el-table-column prop="diagnosisCount" label="累积问诊次数" align="center" ></el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div class="block" style="float:right; margin-top:30px;">
                <el-pagination
                  @current-change="getpage"
                  :current-page.sync="pagination"
                  layout="total, prev, pager, next"
                  :page-count="pageLength">
                </el-pagination>
                </div>
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
            //顶部表单所需数据
            patientname: "", //患者姓名
            telephone: "", //患者手机号
            // patientage: "", //患者年龄段
            // lavalList: [
            //     {
            //         value: "0-5",
            //         label: "0-5"
            //     },
            //     {
            //         value: "6-10",
            //         label: "6-10"
            //     },
            //     {
            //         value: "11-15",
            //         label: "11-15"
            //     },
            //     {
            //         value: "16-20",
            //         label: "16-20"
            //     },
            //     {
            //         value: "21-25",
            //         label: "21-25"
            //     },
            //     {
            //         value: "26-30",
            //         label: "26-30"
            //     },
            //     {
            //         value: "31-35",
            //         label: "31-35"
            //     },
            //     {
            //         value: "36-40",
            //         label: "36-40"
            //     },
            //     {
            //         value: "41-45",
            //         label: "41-45"
            //     },
            //     {
            //         value: "46-50",
            //         label: "46-50"
            //     },
            //     {
            //         value: "51-55",
            //         label: "51-55"
            //     },
            //     {
            //         value: "56-60",
            //         label: "56-60"
            //     },
            //     {
            //         value: "61-65",
            //         label: "61-65"
            //     },
            //     {
            //         value: "66-70",
            //         label: "66-70"
            //     },
            //     {
            //         value: "71-75",
            //         label: "71-75"
            //     },
            //     {
            //         value: "76-80",
            //         label: "76-80"
            //     },
            //     {
            //         value: "81以上",
            //         label: "81以上"
            //     }
            // ],
            sex: "", //性别
            affiliate: "", //所属机构
            outpatientArr: [],
            searchOptions: regionData,
            searchSelectedOptions: [], //地区
            province: "", //所在地省
            city: "", //所在地市
            contry: "", //所在地区

            patientnickname: "", //微信昵称
            startage: "", //开始年龄
            stopage: "",  //结束年龄


            // 列表表格所需数据
            storageData: [],

            // 分页所需数据
            total: 0,
            pagination: 1, //页数
            pageLength: 1 //条数
        };
    },
    methods: {
        // 搜索操作
        searchData() {
            this.queryOutpatient(1);
            this.getOutpatient();
        },
        // 获取数据操作
        queryOutpatient(pageNo) {
            let params = {
                "pageLength": "10", //条数
                "pagination": pageNo, //页数
                "condition": {
                    "patientname":  this.patientname, //患者姓名
                    "telephone": this.telephone, //患者手机号
                    "sex": this.sex,  //性别
                    // "province": this.province,  //省
                    // "city": this.city,   //市
                    "hospitaid": "",  //医院ID号
                    // "startage": "",   //开始年龄
                    // "stopage": ""  //结束年龄
                }
            };
            let _this = this;
            this.$doRequest("/api/patient/list",params,res=>{
                console.log(res);
                _this.storageData = res.parameters.rows;
                _this.pageLength = res.parameters.records/1;
            })            
        },

        //获取来源
        getOutpatient(){
            let params = {
                "type": "4",
                "hospitastate": "1"
            };
            let _this = this;
            this.$doRequest('/api/hospitainfo/getListByKey', params,function(res){
                console.log(res);
                
                _this.outpatientArr = res;
            });
        },

        //清空操作
        clear() {
            this.patientname = ""; //患者姓名
            this.telephone = ""; //患者手机号
            this.patientage = ""; //患者年龄段
            this.sex = ""; //性别
            // this.affiliate = ""; //所属机构
            // this.searchSelectedOptions = []; //地区
            // this.province = ""; //所在地省
            // this.city = ""; //所在地市
            // this.contry = ""; //所在地区

            this.queryOutpatient(1);
            this.pagination = 1
        },

        //翻页
        getpage(val) {
            //console.log(val);
            this.queryOutpatient(val);
        },

        //搜索城市
        searchHandleChange(v) {
            this.province = CodeToText[v[0]];
            this.city = CodeToText[v[1]];
            this.contry = CodeToText[v[2]];
        }
    },
    created() {
        this.queryOutpatient(1);
        this.getOutpatient();
    },
    mounted() {
        this.queryOutpatient(1);
        this.getOutpatient();
    }
};
</script>
<style lang="less" scoped>
@import "index.less";
</style>