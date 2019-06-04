<template>
    <div class="institution">
        <div class="page">
            <div> 
                <navigation></navigation>
            </div>
            <div class="content">
                <div class="add">
                    <el-button type="primary" @click="upSaveOrganization(null,1)">新建机构</el-button>
                </div>
                <!-- 搜索区域 -->
                <div class="search">
                    <div>
                        <span style="width:100px;">机构名称：</span>
                        <el-input v-model="hospitaname" placeholder="请输入门诊名称"></el-input>
                    </div>
                    <div>
                        <span>机构所在地：</span>
                        <el-cascader :options="searchOptions" v-model="searchSelectedOptions" @change='searchHandleChange'></el-cascader>
                    </div>
                    <el-button type="primary" @click="clear()">重置</el-button>
                    <el-button type="primary" @click="queryOutpatient()">搜索</el-button>
                </div>
                <!-- 列表区域 -->
                <div class="tables">
                    <el-table border :data="institutionData" style="width: 100%;" highlight-current-row>
                        <el-table-column prop="hospitacode" label="机构编号" align="center" width="300"></el-table-column>
                        <el-table-column prop="hospitaname" label="机构名称" align="center" width="180"></el-table-column>
                        <el-table-column prop="province" label="所在省份" align="center"></el-table-column>
                        <el-table-column prop="city" label="所在城市" align="center"></el-table-column>
                        <el-table-column prop="contry" label="所在区域" align="center"></el-table-column>
                        <el-table-column prop="createtime" label="创建时间" align="center" width="200"></el-table-column>
                        <el-table-column prop="account" label="管理员" align="center" width="120"></el-table-column>
                        <el-table-column prop="doctornum" label="医生数" align="center"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="310" align="center" class="operation">>
                            <template slot-scope="scope" class="operation">
                                <el-button type="text" size="small" @click="upSaveOrganization(scope.row,2)">修改资料</el-button>
                                <el-button type="text" size="small" @click="upSubmit(scope.row)">修改密码</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="padding:10px 0; text-align:right">
                    <el-pagination v-if="records>pageLength" layout="prev, pager, next" :total="records" :page-size="pageLength" @current-change="handleCurrentChange" @prev-click="prev" @next-click='next'></el-pagination>
                </div>
            </div>
        </div>
        <!-- 创建机构 -->
        <el-dialog
        title='新建机构'
        :visible.sync="saveInstitutionPop"
        width="50%"
        center>
        <div class="addDetail">
            <h3>机构基础信息</h3>
            <el-form :model="form" :rules="rules" ref="form" label-width="160px" class="demo-ruleForm">
                <el-form-item label="机构ID：" v-if="!isEdit">
                    <span>{{form.id}}</span>
                </el-form-item>
                <el-form-item label="机构类型：" prop="organizationtype">
                    <el-select v-model="form.organizationtype" placeholder="请选择机构">
                        <el-option v-for="(item,i) in organizationtypearr" :key="i" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构名称：" prop="hospitaname">
                    <el-input v-model="form.hospitaname" placeholder="请输入机构名称"></el-input>
                </el-form-item>
                <el-form-item label="机构所在地：" prop="searchSelectedOptions">
                    <el-cascader :options="searchOptions" v-model="form.searchSelectedOptions" @change='searchEditHandleChange'></el-cascader>
                    <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
                </el-form-item>
                <el-form-item label="机构简介：">
                    <el-input type="textarea" :rows="2" placeholder="请输入机构简介" v-model="form.remark"></el-input>
                </el-form-item>
                <el-form-item label="机构LOGO：" prop="logo">
                    <el-upload
                        class="avatar-uploader"
                        :action="actionUrl"
                        :headers="headers"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUploadLogo">
                        <img v-if="logo" :src="logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span class="upExplain">请上传一张尺寸为200*200，图片大小不超过1M，支持jpg，png格式</span>
                </el-form-item>
                <el-form-item label="机构图片：" prop="images">
                    <el-upload
                        class="avatar-uploader"
                        :action="actionUrl"
                        :headers="headers"
                        :show-file-list="false"
                        :on-success="handleHospitaAvatarSuccess"
                        :before-upload="beforeAvatarUploadBack">
                        <img v-if="images" :src="images" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <span class="upExplain">请上传一张尺寸为1125*420，图片大小不超过2M，支持jpg，png格式</span>
                </el-form-item>
                <el-form-item label="关联库房：" prop="serialnumber">
                    <el-select v-model="form.serialnumber" placeholder="请选择库房">
                        <el-option v-for="(item,i) in hospitaarr" :key="i" :label="item.hospitaname" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="isEdit">
                    <h3 v-if="isEdit">机构管理员信息</h3>
                    <el-form-item label="账号：" prop="account">
                        <el-input v-model="form.account" placeholder="请输入6-12位机构账号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="form.password" placeholder="请输入字母或数字6-12位的密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="reppassword">
                        <el-input v-model="form.reppassword" placeholder="请输入确认密码"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="saveInstitutionPop = false">取 消</el-button>
            <el-button type="primary" @click="upOutpatient('form')">保 存</el-button>
        </span>
        </el-dialog>

        <!-- 修改密码 -->
        <el-dialog
        title='修改密码'
        :visible.sync="saveSubmitPop"
        width="20%"
        center>
        <div class="submitDetail">
            <div>
                <span>管理员账号：</span>
                <span>{{account}}</span>
            </div>
            <div>
                <span>新密码：</span>
                <el-input v-model="password" placeholder="请输入新密码"></el-input>
            </div>
            <div>
                <span>确认密码：</span>
                <el-input v-model="passwords" placeholder="请输入确认密码"></el-input>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="saveSubmitPop = false">取 消</el-button>
            <el-button type="primary" @click="savaSubmit()">保 存</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import md5 from 'js-md5'
import navigation from '../../components/common/navigation'
import common from '../../api/common';
// import { isPassword } from '../../api/validate';
import { regionData, CodeToText, TextToCode} from 'element-china-area-data'
export default {
    components: {
        navigation,
    },
    data(){
        return {
            hospitaname: '',//机构名称
            searchOptions: regionData,
            searchSelectedOptions: [],
            province: '',//所在地
            pageLength: 10,
            pagination: 1,
            records: 0,
            institutionData: [],
            saveInstitutionPop: false,
            name: '',
            organizationtypearr: [],//机构类型列表
            hospitaarr:[],//库房列表
            actionUrl: '/api/FastDfs/uploadLocal',//上传图片地址
            headers: {sessionID: 'haozhongyi'},
            logo: '',
            images: '',
            form: {
                id: '',
                organizationtype: '',//机构类型
                hospitaname: '',//机构名称
                searchSelectedOptions: [],//机构所在地
                province: '',//省
                city: '',//市
                contry: '',//区
                address: '',//详细地址
                remark: '',//机构简介
                logo: '',//机构logo
                images: [],//机构图片
                serialnumber: '',//关联库房
                account: '',//账号
                password: '',//密码
                reppassword: '',//确认密码
            },
            
            rules: {
                organizationtype: [{
                    required: true,
                    message: '机构类型为必选项',
                    trigger: 'blur'
                }],
                hospitaname: [{
                    required: true,
                    message: '机构名称不能为空',
                    trigger: 'blur'
                }],
                searchSelectedOptions: [{
                    required: true,
                    message: '机构所在地不能为空',
                    trigger: 'blur'
                }],
                serialnumber: [{
                    required: true,
                    message: '请选择关联库房',
                    trigger: 'blur'
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
                    // validator: isPassword,
                    trigger: 'blur'
                }],
                reppassword:[{
                    required: true,
                    message: '确认密码不能为空'
                }],
            },
            isEdit: false,
            saveSubmitPop: false,
            accountid: '',
            account: '',
            password: '',
            passwords: '',
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
        //搜索城市
        searchHandleChange(v){
            this.province = CodeToText[v[0]];
            this.city = CodeToText[v[1]];
            this.contry = CodeToText[v[2]];
        },
        //创建时搜索城市
        searchEditHandleChange(v){
            this.form.province = CodeToText[v[0]];
            this.form.city = CodeToText[v[1]];
            this.form.contry = CodeToText[v[2]];
        },
        //搜索
        queryOutpatient(){
            this.getInstitutionList();
        },
        //清空操作
        clear(){
            this.hospitaname = '';
            this.searchSelectedOptions = [];
            this.province = '';
        },
        //清空form表单
        clearForm(){
            // this.$refs.form.resetFields();
            // this.$nextTick(() => {
                this.$refs['form'].resetFields();
                this.form.searchSelectedOptions = [];
                this.form.address = '';
                this.form.remark = '';
                this.form.password = '';
                this.form.reppassword = '';
                this.logo = '';
                this.images = '';
            // });
        },
        //上传机构logo
        handleAvatarSuccess(res, file) {
            this.form.logo = res[0].fileUrl;
            this.logo = URL.createObjectURL(file.raw);
        },
        //上传机构图片
        handleHospitaAvatarSuccess(res, file){
            this.form.images = [];
            this.form.images.push(res[0].fileUrl);
            this.images = URL.createObjectURL(file.raw);
        },
        beforeAvatarUploadLogo(file) {
            const isJPG = file.type === 'image/png' || 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isJPG) {
                this.$message.error('上传机构logo只能是JPG/PNG格式');
            }
            if (!isLt2M) {
                this.$message.error('上传机构logo大小不能超过1MB');
            }
            return isJPG && isLt2M;
        },
        beforeAvatarUploadBack(file) {
            const isJPG = file.type === 'image/png' || 'image/jpg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传机构图片只能是JPG/PNG格式');
            }
            if (!isLt2M) {
                this.$message.error('上传机构图片大小不能超过2MB');
            }
            return isJPG && isLt2M;
        },
        //获取机构列表
        getInstitutionList(){
            let _this = this;
            let params = {
                hospitaname: this.hospitaname,
                province: this.province,
                pageLength: this.pageLength,
                pagination: this.pagination
            };
            this.$doRequest('/api/organization/search', params,function(res){
                _this.institutionData = res.parameters.rows;
                _this.records = res.parameters.records;
            });
        },
        //获取机构类型
        getTypes(){
            let _this = this;
            this.$doRequest('/api/organization/types', null,function(res){
                _this.organizationtypearr = res.parameters;
            });
        },
        //获取库房列表
        getHLists(){
            let _this = this;
            this.$doRequest('/api/hospitainfo/getHLists', null,function(res){
                _this.hospitaarr = res.parameters;
            });
        },
        //保存机构
        upOutpatient(form){
            this.$refs[form].validate((valid) => {
                if (valid) {
                    if(this.isEdit){
                        if(this.form.password != this.form.reppassword){
                            this.$message({
                                showClose: true,
                                message: '确认密码与密码不一致',
                                type: 'error'
                            });
                            return false;
                        }
                        let subForm = {
                            id: this.form.id,
                            organizationtype: this.form.organizationtype,
                            hospitaname: this.form.hospitaname,
                            searchSelectedOptions: this.form.searchSelectedOptions,
                            province: this.form.province,
                            city: this.form.city,
                            contry: this.form.contry,
                            address: this.form.address,
                            remark: this.form.remark,
                            logo: this.form.logo,
                            images: this.form.images,
                            serialnumber: this.form.serialnumber,
                            account: this.form.account,
                            password: md5(this.form.password)
                        };
                        let _this = this;
                        this.$doRequest('api/organization/save', subForm,function(res){
                            _this.$message({
                                message: '机构添加成功',
                                type: 'success'
                            });
                            _this.saveInstitutionPop = false;
                            _this.getInstitutionList();
                        });
                    }else{
                        let _this = this;
                        this.$doRequest('api/organization/update', this.form,function(res){
                            _this.$message({
                                message: '机构编辑成功',
                                type: 'success'
                            });
                            _this.saveInstitutionPop = false;
                            _this.getInstitutionList();
                        });
                    }
                }else{
                    this.$message.error('*为必填项');
                }
            });
        },
        //新建/修改机构
        upSaveOrganization(row,type){
            this.saveInstitutionPop = true;
            if(type == 1){
                if (this.$refs['form'] !== undefined) {
                    this.clearForm();
                }
                this.isEdit = true;
            }else{
                this.isEdit = false;
                let _this = this;
                this.$doRequest('api/organization/find', {parameter: row.id},function(res){
                    let row = res.parameters;
                    _this.form.id = row.id;
                    _this.form.organizationtype = Number(row.organizationtype);
                    _this.form.hospitaname = row.hospitaname;
                    _this.form.address = row.address;
                    _this.form.remark = row.remark;
                    _this.logo = row.logo;
                    _this.images = row.images[0];
                    _this.form.logo = row.logo;
                    _this.form.images = row.images;
                    _this.form.serialnumber = row.serialnumber;
                    _this.form.account = row.account;
                    _this.form.password = row.password;
                    _this.form.province = row.province;
                    _this.form.contry = row.contry;
                    _this.form.city = row.city;
                    let province=TextToCode[row.province];
                    let city=TextToCode[row.province][row.city];
                    let contry=TextToCode[row.province][row.city][row.contry];
                    _this.form.searchSelectedOptions.push(province.code);
                    _this.form.searchSelectedOptions.push(city.code);
                    _this.form.searchSelectedOptions.push(contry.code);
                });
            }
        },
        //修改密码
        upSubmit(row){
            this.password = '';
            this.passwords = '';
            this.saveSubmitPop = true;
            this.accountid = row.id;
            this.account = row.account;
        },
        //更改密码
        savaSubmit(){
            if(this.password != '' && this.passwords != ''){
                if(this.password != this.passwords){
                    this.$message({
                        showClose: true,
                        message: '确认密码与密码不一致',
                        type: 'error'
                    });
                    return false;
                }
                let _this = this;
                let params = {
                    accountid: this.accountid,
                    account: this.account,
                    password: md5(this.password)
                };
                this.$doRequest('api/organization/restpwd', params,function(res){
                    _this.$message({
                        message: '密码更改成功',
                        type: 'success'
                    });
                    _this.saveSubmitPop = false;
                });
            }else{
                this.$message({
                    showClose: true,
                    message: '密码与确认密码为必填项',
                    type: 'error'
                });
            }
            
        }

    },
    created(){
        this.getInstitutionList();
        this.getTypes();
        this.getHLists();
    },
    watch:{
        password:function(){
            this.password=this.password.replace(/[\W]/g,'');//英文，数字
        },
    }, 
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>