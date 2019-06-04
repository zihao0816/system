<template>
    <div class="examine">
        <div class="page">
            <div> 
                <navigation></navigation>
            </div>
            <div class="content">
                <div class="add">
                    <el-button type="primary" @click="goSaveClinic(1)">新建门诊</el-button>
                </div>
                <div class="search">
                    <el-form :inline="true" label-width="120px"> 
                        <el-form-item label="门诊名称：" >
                            <el-input v-model="outpatientnamel" placeholder="请输入门诊名称"></el-input>
                        </el-form-item>
                        <el-form-item label="门诊所在地：">
                            <el-cascader :options="searchOptions" v-model="searchSelectedOptions" @change='searchHandleChange'></el-cascader>
                        </el-form-item>
                        <el-form-item label="门诊状态：">
                            <el-select v-model="state">
                                <el-option value="1" label="正常" key="1"></el-option>
                                <el-option value="2" label="关闭" key="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="管理员账号：" >
                            <el-input v-model="adminname" placeholder="请输入管理员账号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="clear()">重置</el-button>
                            <el-button type="primary" @click="queryOutpatient()">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="tables">
                    <el-table border :data="storageData" style="width: 100%;" highlight-current-row>
                        <el-table-column prop="serialnumber" label="门诊编号" align="center" width="300"></el-table-column>
                        <el-table-column prop="outpatientname" label="门诊名称" align="center" width="180"></el-table-column>
                        <el-table-column prop="province" label="所在省份" align="center"></el-table-column>
                        <el-table-column prop="city" label="所在城市" align="center"></el-table-column>
                        <el-table-column prop="contry" label="所在区域" align="center"></el-table-column>
                        <el-table-column prop="createtime" label="创建时间" align="center" width="200"></el-table-column>
                        <el-table-column prop="state" label="当前状态" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.state == 1?'正常':'禁用'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountname" label="管理员" align="center" width="120"></el-table-column>
                        <el-table-column label="子账号数" align="center">
                            <template slot-scope="scope">
                                <span style="color:#07A591;cursor: pointer;" @click="getAccount(scope.row)">{{scope.row.counval}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="坐诊医生数" align="center" width="100">
                            <template slot-scope="scope">
                                <span style="color:#07A591;cursor: pointer;" @click="getDoctor(scope.row)">{{scope.row.docval?scope.row.docval:0}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="310" align="center" class="operation">>
                            <template slot-scope="scope" class="operation">
                                <el-button type="text" size="small" @click="upSaveClinic(scope.row)">修改资料</el-button>
                                <el-button type="text" size="small" @click="goPhysiotherapy(scope.row)">理疗项目</el-button>
                                <el-button type="text" size="small" @click="upSubmit(scope.row)">修改密码</el-button>
                                <el-button type="text" size="small" @click="remove('prohibit1',scope.row)">{{scope.row.state == '1'?'禁用':'启用'}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="padding:10px 0; text-align:right">
                    <el-pagination v-if="records>pageLength" layout="prev, pager, next" :total="records" :page-size="pageLength" @current-change="handleCurrentChange" @prev-click="prev" @next-click='next'></el-pagination>
                </div>
            </div>
        </div>


        <!-- 新建门诊 -->
        <el-dialog
        title='新建门诊'
        :visible.sync="saveClinicPop"
        width="60%"
        center>
        <div class="addDetail">
            <el-form :model="saveform" :rules="rules" ref="saveform" label-width="130px" class="demo-ruleForm">
                <el-form-item label="门诊基础信息"></el-form-item>
                <el-form-item label="门诊名称：" prop="name">
                    <el-input v-model="saveform.name" placeholder="请输入5-10位汉字的门诊名称"></el-input>
                </el-form-item>
                <el-form-item label="关联库房：" prop="storeroomid">
                    <el-select v-model="saveform.storeroomid">
                        <el-option v-for="(item,i) in warehouse" :key="i" :label="item.hospitaname" :value="item.id" style="width:200px"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门诊所在地：" prop="selectedOptions">
                    <el-cascader :options="options" v-model="saveform.selectedOptions" @change='handleChange'></el-cascader>
                    <el-input v-model="saveform.address" placeholder="详细地址"></el-input>
                </el-form-item>
                <div v-if="isbuild">
                <el-form-item label="门诊管理员信息"></el-form-item>
                <el-form-item label="账号：" prop="account">
                    <el-input v-model="saveform.account" placeholder="请输入6-12位门诊账号"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="saveform.password" placeholder="请输入字母开头包含字母，数字6-12位的密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="reppassword">
                    <el-input v-model="saveform.reppassword" placeholder="请输入确认密码"></el-input>
                </el-form-item>
                </div>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="saveClinicPop = false">取 消</el-button>
            <el-button type="primary" @click="saveClinic('saveform')">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 编辑门诊 -->
        <el-dialog
        title='编辑门诊'
        :visible.sync="upSaveClinicPop"
        width="60%"
        center>
        <div class="addDetail">
            <el-form :model="upSaveform" :rules="uprules" ref="upSaveform" label-width="130px" class="demo-ruleForm">
                <el-form-item label="门诊基础信息"></el-form-item>
                <el-form-item label="门诊名称：" prop="name">
                    <el-input v-model="upSaveform.name" placeholder="请输入5-10位汉字的门诊名称"></el-input>
                </el-form-item>
                <el-form-item label="关联库房：" prop="storeroomid">
                    <el-select v-model="upSaveform.storeroomid">
                        <el-option v-for="(item,i) in warehouse" :key="i" :label="item.hospitaname" :value="item.id" style="width:200px"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门诊所在地：" prop="selectedOptions">
                    <el-cascader :options="options" v-model="upSaveform.selectedOptions" @change='handleChange'></el-cascader>
                    <el-input v-model="upSaveform.address" placeholder="详细地址"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="upSaveClinicPop = false">取 消</el-button>
            <el-button type="primary" @click="upOutpatient('upSaveform')">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 门诊理疗项目详情 -->
        <el-dialog
        title="门诊理疗项目详情"
        :visible.sync="physiotherapyPop"
        width="60%"
        center>
            <div class="doctorList">
                <div>
                    <span>门诊名称：{{outpatientName}}</span>
                    <span>理疗项目：{{objectLen}}</span>
                </div>
                <el-table :data="physiotherapy" style="width: 100%">
                    <el-table-column prop="name" label="理疗项目"></el-table-column>
                    <el-table-column prop="collectfees" label="收费金额(元/次)"></el-table-column>
                    <el-table-column prop="createtime" label="添加时间"></el-table-column>
                    <el-table-column prop="createname" label="操作人"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="remove('physiotherapy',scope.row)">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="physiotherapyPop = false">取 消</el-button>
                <el-button type="primary" @click="physiotherapyPop = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 组织结构详情 -->
        <el-dialog
        title="组织结构详情"
        :visible.sync="accountListPop"
        width="60%"
        center>
            <div class="doctorList">
                <div>
                    <span>门诊名称：{{outpatientName}}</span>
                    <span>管理员账号：{{accountname}}</span>
                    <span>子账号数：{{accountLen}}</span>
                </div>
                <el-table :data="accountList" style="width: 100%">
                    <el-table-column prop="accountname" label="子账户用户名"></el-table-column>
                    <el-table-column prop="createtime" label="创建日期"></el-table-column>
                    <el-table-column prop="logintime" label="最近登陆日期"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="upSubmit(scope.row)">修改密码</el-button>
                            <el-button type="text" size="small" @click="remove('prohibit2',scope.row)">{{scope.row.state == '1'?'禁用':'启用'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="accountListPop = false">取 消</el-button>
                <el-button type="primary" @click="accountListPop = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 坐诊医生列表 -->
        <el-dialog
        title="坐诊医生列表"
        :visible.sync="doctorListPop"
        width="60%"
        center>
            <div class="doctorList">
                <div>
                    <span>门诊名称：{{outpatientName}}</span>
                    <span>坐诊医生数：{{doctorLen}}</span>
                </div>
                <el-table :data="doctorList" style="width: 100%">
                    <el-table-column prop="doctorname" label="医生姓名"></el-table-column>
                    <el-table-column prop="telephone" label="医生手机号"></el-table-column>
                    <el-table-column prop="createtime" label="添加时间"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getQRcode(scope.row)">二维码</el-button>
                            <el-button type="text" size="small" @click="remove('doctor',scope.row)">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="doctorListPop = false">取 消</el-button>
                <el-button type="primary" @click="doctorListPop = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改密码 -->
        <el-dialog
        title="修改密码"
        :visible.sync="upSubmitPop"
        width="500px"
        center>
            <div class="upSubmit">
                <el-form :model="upform" :rules="uprule" ref="upform" label-width="170px" class="demo-ruleForm">
                    <el-form-item label="管理员账号：">
                        <span>{{accountname}}</span>
                    </el-form-item>
                    <el-form-item label="新密码：" prop="password">
                        <el-input v-model="upform.password" placeholder="新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="reppassword">
                        <el-input v-model="upform.reppassword" placeholder="确认密码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="upSubmitPop = false">取 消</el-button>
                <el-button type="primary" @click="upPassword('upform')">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改密码 -->
        <el-dialog
        title="医生问诊二维码"
        :visible.sync="QRcodePop"
        width="500px"
        center>
            <div class="QRcode">
                <span>医生姓名：{{doctorname}}</span>
                <img :src="doctorQRcode" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="QRcodePop = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 提示弹框 -->
        <el-dialog
        :title="commTile"
        :visible.sync="commDialogVisible"
        width="30%"
        center>
        <div class="commDialog">
            <span>{{commCenter}}</span>
            <span>{{commName}}</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="commDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="removeGet(commType)">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>
<script>
import navigation from '../../components/common/navigation'
import common from '../../api/common';
import { regionData, CodeToText, TextToCode} from 'element-china-area-data'
export default {
    components: {
        navigation,
    },
    data(){
        return {
            // common.timestampToTime(item.warningtime);
            //搜索区域
            searchOptions: regionData,
            searchSelectedOptions: [],
            outpatientnamel: '',//门诊名称
            province: '',//所在地省
            city: '',//所在地市
            contry: '',//所在地区
            state: '',//状态
            adminname: '',//管理员账号
            pageLength: 10,//条数
            pagination: 1,//页数
            records: 0,
            storageData: [],

            //新建区域
            saveClinicPop: false,//
            options: regionData,
            warehouse: [],//库房arr
            isbuild: true,
            saveform: {
                name: '',//门诊名称
                storeroomid: '',//库房id
                selectedOptions: [],
                province: '',//省
                city: '',//市
                contry:'',//区
                address: '',//详细地址
                account: '',//账户
                password: '',//密码
                reppassword: '',
            },
            rules:{
                name:[{
                    required: true,
                    message: '门诊名称不能为空',
                },{ 
                    min: 5, 
                    max: 10, 
                    message: '门诊名称长度在5-10个字符之间', 
                    trigger: 'blur'
                }],
                storeroomid:[{
                    required: true,
                    message: '库房不能为空'
                }],
                selectedOptions:[{
                    required: true,
                    message: '门诊所在地不能为空'
                }],
                address:[{
                    required: true,
                    message: '门诊项目地址不能为空'
                }],
                account:[{
                    required: true,
                    message: '账号不能为空'
                },{ 
                    min: 6, 
                    max: 12, 
                    message: '账号名称长度6-12位数字、字母', 
                    trigger: 'blur'
                }],
                password:[{
                    required: true,
                    message: '密码不能为空'
                },{ 
                    min: 6, 
                    max: 12, 
                    message: '密码长度6-12位数字、字母', 
                    trigger: 'blur'
                }],
                reppassword:[{
                    required: true,
                    message: '确认密码不能为空'
                }],
            },

            //编辑区域
            upSaveClinicPop: false,
            upSaveform: {
                name: '',//门诊名称
                storeroomid: '',//库房id
                selectedOptions: [],
                province: '',//省
                city: '',//市
                contry:'',//区
                address: '',//详细地址
            },
            uprules:{
                name:[{
                    required: true,
                    message: '门诊名称不能为空',
                },{ 
                    min: 5, 
                    max: 10, 
                    message: '门诊名称长度在5-10个字符之间', 
                    trigger: 'blur'
                }],
                storeroomid:[{
                    required: true,
                    message: '库房不能为空'
                }],
                selectedOptions:[{
                    required: true,
                    message: '门诊所在地不能为空'
                }],
                address:[{
                    required: true,
                    message: '门诊项目地址不能为空'
                }],
            },


            //理疗项目区域
            physiotherapyPop: false,
            physiotherapy: [],
            outpatientName: '',
            objectLen: '',

            //子账户数
            accountListPop: false,
            accountList: [],
            accountLen: '',

            //坐诊医生列表
            doctorListPop: false,
            doctorList: [],
            doctorLen: '',

            //修改密码
            upSubmitPop: false,
            accountname: '',
            upform: {
                password: '',
                reppassword: '',
            },
            uprule:{
                password:[{
                    required: true,
                    message: '密码不能为空'
                },{ 
                    min: 6, 
                    max: 12, 
                    message: '密码长度6-12位数字、字母', 
                    trigger: 'blur'
                }],
                reppassword:[{
                    required: true,
                    message: '确认密码不能为空'
                }],
            },
            //二维码弹框
            QRcodePop: false,
            doctorname: '',
            doctorQRcode: '',


            //提示弹框
            commDialogVisible: false,
            commTile: '',
            commCenter: '',
            commName: '',
            commType: '',
            commId: '',
            commRow: '',
            commBack: '',

            outpatientId: '',//获取医生二维码时用
            
        }
    },
    methods:{
        //翻页
        handleCurrentChange(val){
            this.pagination = val;
            this.queryOutpatient();
        },
        prev(val){
            this.pagination = val-1;
            this.queryOutpatient();
        },
        next(val){
            this.pagination = val+1;
            this.queryOutpatient();
        },
        //清空操作
        clear(){
            this.outpatientnamel = '';
            this.searchSelectedOptions = [];
            this.state = '';
            this.adminname = '';
            this.province = '';
            this.city = '';
            this.contry = '';
        },
        
        //清空form表单
        clearForm(){
            this.$refs.saveform.resetFields();
            this.$refs.upform.resetFields();
        },

        //搜索城市
        searchHandleChange(v){
            this.province = CodeToText[v[0]];
            this.city = CodeToText[v[1]];
            this.contry = CodeToText[v[2]];
        },
        //新建门诊城市
        handleChange(v){
            this.saveform.province = CodeToText[v[0]];
            this.saveform.city = CodeToText[v[1]];
            this.saveform.contry = CodeToText[v[2]];
        },
        // 获取门诊列表
        queryOutpatient(){
            let params = {
                pageLength: this.pageLength,
                pagination: this.pagination,
                condition:{ 
                    adminname: '',
                    outpatientnamel: this.outpatientnamel,
                    province: this.province,
                    city: this.city,
                    contry: this.contry,
                    state: this.state,
                    adminname: this.adminname,
                }
            }; 
            let _this = this;
            this.$doRequest('/api/BackOutpatientControl/queryOutpatient', params,function(res){
                res.parameters.rows.forEach(item => {
                    item.createtime = common.timestampToTime(item.createtime);
                });
                _this.storageData = res.parameters.rows;
                _this.records = res.parameters.records;
            });
        },
        //获取门诊
        queryWarehouse(){
            let _this = this;
            this.$doRequest('api/backWarehouseControl/queryWarehouse', {},function(res){
                _this.warehouse = res.parameters.rows;
            });
        },
        //新建/编辑门诊
        goSaveClinic(type,row){
            this.saveClinicPop = true;
        },
        //创建门诊请求
        saveClinic(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    //校验账号
                    //校验两次密码是否一致
                    if(this.saveform.password != this.saveform.reppassword){
                        this.$message({
                            showClose: true,
                            message: '确认密码与密码不一致',
                            type: 'error'
                        });
                    }
                    let params = {
                        name: this.saveform.name,
                        storeroomid: this.saveform.storeroomid,
                        province: this.saveform.province,
                        city: this.saveform.city,
                        contry: this.saveform.contry,
                        address: this.saveform.address,
                        account: this.saveform.account,
                        password: this.saveform.password,
                    } 
                    let _this = this;
                    this.$doRequest('/api/BackOutpatientControl/saveClinic', params,function(res){
                        _this.$message({
                            message: '门诊创建成功',
                            type: 'success'
                        });
                        _this.saveClinicPop = false;
                        _this.clearForm();
                        _this.queryOutpatient();
                    });
                }
            });
        },

        //编辑门诊
        upSaveClinic(row){
            this.upSaveform.id = row.id
            this.upSaveform.name = row.outpatientname;
            this.upSaveform.storeroomid = row.hospitainfo;
            this.upSaveform.address = row.address;
            let province=TextToCode[row.province];
            let city=TextToCode[row.province][row.city];
            let contry=TextToCode[row.province][row.city][row.contry];
            this.upSaveform.selectedOptions.push(province.code);
            this.upSaveform.selectedOptions.push(city.code);
            this.upSaveform.selectedOptions.push(contry.code);
            this.upSaveClinicPop = true;
        },

        //编辑门诊请求
        upOutpatient(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    let reg = /^[\u4e00-\u9fa5]+$/;
                    if(!reg.test(this.upSaveform.name)){
                        this.$message({
                            message: '门诊名称只能为汉字',
                            type: 'warning'
                        });
                        return;
                    }
                    let province = CodeToText[this.upSaveform.selectedOptions[0]];
                    let city = CodeToText[this.upSaveform.selectedOptions[1]];
                    let contry = CodeToText[this.upSaveform.selectedOptions[2]];

                    let params = {
                        id: this.upSaveform.id,
                        outpatientname: this.upSaveform.name,
                        storeroomid: this.upSaveform.storeroomid,
                        province: province,
                        city: city,
                        contry: contry,
                        address: this.upSaveform.address,
                        hospitainfo: this.upSaveform.storeroomid
                    } 
                    let _this = this;
                    this.$doRequest('api/BackOutpatientControl/upOutpatient', params,function(res){
                        _this.$message({
                            message: '修改资料成功',
                            type: 'success'
                        });
                        _this.upSaveClinicPop = false;
                        _this.clearForm();
                        _this.queryOutpatient();
                    });
                }
            });
        },

        //获取理疗项目列表
        goPhysiotherapy(row){
            this.physiotherapy = [];
            this.physiotherapyPop = true;
            this.outpatientName = row.outpatientname;
            this.commBack = row;
            let _this = this;
            this.$doRequest('/api/BackOutpatientControl/getphysiotherapylist?hostid='+row.id, {},function(res){
                _this.physiotherapy = res.parameters;
                _this.objectLen = res.parameters.length;
            });
        },
        //移除理疗项目 
        remove(type,row){//physiotherapy   doctor prohibit1(门诊) prohibit2(子账户)
            if(type == 'physiotherapy'){
                this.commTile = '移除理疗项目确认';
                this.commCenter = '移除该理疗项目后，该诊所将无法提供该项目的开方服务。';
                this.commName = '确认移除理疗项目：'+ row.name +' ？';
                this.commType = type;
            }else if(type == 'doctor'){
                this.commTile = '移除医生确认';
                this.commCenter = '移除该医生，其将不能登录当前诊所。';
                this.commName = '确认移除医生'+ row.doctorname +' ？';
                this.commType = type;
            }else if(type == 'prohibit1'){
                if(row.state == '1'){
                    this.commTile = '禁用门诊';
                    this.commCenter = '即将关闭门诊：'+ row.outpatientname +'！门诊关闭后，子账号及关联医生（不影响医生其他从属关系的问诊和结算服务）将无法登陆当前门诊系统。';
                }else{
                    this.commTile = '启用门诊';
                    this.commCenter = '即将启用门诊：'+ row.outpatientname +'！门诊启用后，需要重新添加坐诊医生、配置管理员账号。确认启用';
                }
                this.commName = '';
                this.commType = type;
            }else{
                if(row.state == '1'){
                    this.commTile = '禁用账号';
                    this.commCenter = '禁用生效后，该账号将无法登陆门诊系统。';
                    this.commName = '是否禁用账号：'+row.accountname;
                }else{
                    this.commTile = '启用账号';
                    this.commCenter = '启用该账号，将恢复账号登录权限';
                    this.commName = '是否启用账号：'+row.accountname;
                }
                this.commType = type;
            }
            this.commId = row.id;
            this.commRow = row;
            this.commDialogVisible = true;
        },
        //公共弹框请求
        removeGet(type){
            if(type == 'physiotherapy'){
                this.removephysiotherapylist();
            }else if(type == 'doctor'){
                this.removeDoctor();
            }else if(type == 'prohibit1'){
                this.prohibitmz();
            }else{
                this.prohibit();
            }
        },
        //移除理疗项目
        removephysiotherapylist(){
            let _this = this;
            this.$doRequest('/api/BackOutpatientControl/removephysiotherapylist?id='+this.commId, {},function(res){
                 _this.$message({
                    message: '理疗项目移除成功',
                    type: 'success'
                });
                _this.goPhysiotherapy(_this.commBack);
                _this.commDialogVisible = false;
            });
        },
        //子账号数列表
        getAccount(row){
            this.accountList = [];
            this.accountListPop = true;
            this.outpatientName = row.outpatientname;
            this.accountname = row.accountname;
            this.commBack = row;
            let _this = this;
            this.$doRequest('/api/backgrounduser/getListByKey', {cnameid: row.id},function(res){
                res.forEach(item => {
                    item.createtime = common.timestampToTime(item.createtime);
                    item.logintime = common.timestampToTime(item.logintime);
                    item.state = item.status;

                });
                _this.accountList = res;
                _this.accountLen = res.length;
            });
        },
        //坐诊医生列表
        getDoctor(row){
            this.outpatientId = row.id;
            this.doctorList = [];
            this.doctorListPop = true;
            this.outpatientName = row.outpatientname;
            this.commBack = row;
            let _this = this;
            this.$doRequest('/api/BackOutpatientControl/getDoctor?hostid='+row.id,{},function(res){
                res.parameters.forEach(item => {
                    item.createtime = common.timestampToTime(item.createtime);
                });
                _this.doctorList = res.parameters;
                _this.doctorLen = res.parameters.length;
            });
        },
        //获取医生坐诊二维码
        getQRcode(row){
            this.doctorname = row.doctorname;
            if(row.qrcode){
                this.doctorQRcode = row.qrcode;
            }else{
                let params = {
                    id: row.id,
                    clinicid: this.outpatientId
                };
                this.$doRequest('/api/diagnosisdoctor/qrcode', params,function(res){
                    _this.doctorQRcode = res.parameters;
                });
            }
            this.QRcodePop = true;
        },
        //移除坐诊医生
        removeDoctor(){
            let _this = this;
            this.$doRequest('/api/BackOutpatientControl/removeDoctor?id='+this.commId, {},function(res){
                 _this.$message({
                    message: '坐诊医生移除成功',
                    type: 'success'
                });
                _this.getDoctor(_this.commBack);
                _this.commDialogVisible = false;
                _this.queryOutpatient();
            });
        },
        //修改门诊密码
        upSubmit(row){
            this.upSubmitPop = true;
            this.accountname = row.accountname;
        },
        //修改门诊密码请求
        upPassword(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    if(this.upform.password != this.upform.reppassword){
                        this.$message({
                            showClose: true,
                            message: '确认密码与密码不一致',
                            type: 'error'
                        });
                        return false;
                    }
                    let _this = this;
                    let params = {
                        accountname: this.accountname,
                        password: this.upform.password
                    };
                    this.$doRequest('/api/backWarehouseControl/updaminPass', params,function(res){
                        _this.$message({
                            message: '门诊密码修改成功',
                            type: 'success'
                        });
                        _this.upSubmitPop = false;
                        _this.clearForm();
                    });
                }
            });
        },
        //禁用门诊
        prohibitmz(){
            let _this = this;
            let state = '';
            if(this.commRow.state == '1'){
                state = '2';
            }else{
                state = '1';
            }
            let params = {
                id: this.commRow.id,
                state: state
            };
            this.$doRequest('/api/outpatient/updateByPrimaryKeySelective', params,function(res){
                _this.$message({
                    message: _this.commTile+'成功',
                    type: 'success'
                });
                _this.commDialogVisible = false;
                _this.queryOutpatient();
            });
        },
        //禁用子账户请求
        prohibit(){
            let _this = this;
            let status = '';
            if(this.commRow.state == '1'){
                status = '2';
            }else{
                status = '1';
            }
            let params = {
                id: this.commRow.id,
                status: status
            };
            this.$doRequest('/api/backgrounduser/updateByPrimaryKeySelective', params,function(res){
                _this.$message({
                    message: '禁用门诊成功',
                    type: 'success'
                });
                //判断是否是子账户
                _this.commDialogVisible = false;
                _this.getAccount(_this.commBack);
            });
        }
    },
    created(){
        this.queryOutpatient();
        this.queryWarehouse();
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
