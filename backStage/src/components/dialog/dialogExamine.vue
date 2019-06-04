<template>
    <div class="dialogExamine">
        <!-- 新建/修改门诊 -->
        <el-dialog
        title="新建门诊"
        :visible.sync="saveClinicPop"
        width="60%"
        center>
        <div class="addDetail">
            <el-form :model="saveform" :rules="rules" ref="form" label-width="130px" class="demo-ruleForm">
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
                <!-- <div v-if="isBuild"> -->
                <el-form-item label="门诊管理员信息"></el-form-item>
                <el-form-item label="账号：" prop="account">
                    <el-input v-model="saveform.account" placeholder="请输入6-12位门诊账号"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input v-model="saveform.password" placeholder="密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="reppassword">
                    <el-input v-model="saveform.reppassword" placeholder="确认密码"></el-input>
                </el-form-item>
                <!-- </div> -->
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveClinic('form')">确 定{{isBuild}}</el-button>
        </span>
        </el-dialog>

        <!-- 组织结构详情 -->
        <el-dialog
        title="组织结构详情"
        :visible.sync="getphysiotherapylistPop"
        width="60%"
        center>
            <div class="structureDetails">
                <div>
                    <span>门诊名称：好中医顺义诊所</span>
                    <span>管理员账号：admin</span>
                    <span>子账号数：3333</span>
                </div>
                <el-table :data="structure" style="width: 100%">
                    <el-table-column prop="name" label="子账户用户名"></el-table-column>
                    <el-table-column prop="date" label="创建日期"></el-table-column>
                    <el-table-column prop="date" label="最近登陆日期"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small">修改资料</el-button>
                            <el-button type="text" size="small">禁用</el-button>
                            <el-button type="text" size="small">查看操作日志</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>

        <!-- 坐诊医生列表 -->
        <el-dialog
        title="坐诊医生列表"
        :visible.sync="doctorList"
        width="60%"
        center>
            <div class="doctorList">
                <div>
                    <span>门诊名称：好中医顺义诊所</span>
                    <span>坐诊医生数：33</span>
                </div>
                <el-table :data="structure" style="width: 100%">
                    <el-table-column prop="name" label="医生姓名"></el-table-column>
                    <el-table-column prop="date" label="医生手机号"></el-table-column>
                    <el-table-column prop="date" label="添加时间"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small">二维码</el-button>
                            <el-button type="text" size="small">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>

        <!-- 门诊理疗项目详情 -->
        <!-- <el-dialog
        title="门诊理疗项目详情"
        :visible.sync="doctorList"
        width="60%"
        center>
            <div class="doctorList">
                <div>
                    <span>门诊名称：好中医顺义诊所</span>
                    <span>理疗项目：33</span>
                </div>
                <el-table :data="project" style="width: 100%">
                    <el-table-column prop="name" label="理疗项目"></el-table-column>
                    <el-table-column prop="date" label="收费金额(元/次)"></el-table-column>
                    <el-table-column prop="date" label="添加时间"></el-table-column>
                    <el-table-column prop="czr" label="操作人"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="300" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog> -->

        <!-- 修改密码 -->
        <el-dialog
        title="修改密码"
        :visible.sync="upSubmit"
        width="500px"
        center>
            <div class="upSubmit">
                <el-form :model="saveform" :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm">
                    <el-form-item label="管理员账号：">
                        <span>admin</span>
                    </el-form-item>
                    <el-form-item label="新密码：">
                        <el-input v-model="saveform.name" placeholder="新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码：">
                        <el-input v-model="saveform.name" placeholder="确认密码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { regionData, CodeToText } from 'element-china-area-data'
export default {
    props: ['saveClinicPop','isBuild','clinicInfo','getphysiotherapylistPop'],
    data(){
        return {
            options: regionData,
            warehouse: [],//库房arr
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
                province:[{
                    required: true,
                    message: '门诊所在地不能为空'
                }],
                city:[{
                    required: true,
                }],
                address:[{
                    required: true,
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
            structureDetails: false,
            structure: [{
                id: '',
                name: 'admin',
                date: '2019-01-09',
                login: '2019-03-30',
            }],
            doctorList: false,
            project: [{
                id: '',
                name: 'admin',
                date: '2019-01-09',
                login: '2019-03-30',
                czr: '单士钱',
            }],
            upSubmit: false,
        }
    },
    methods:{
        handleChange(v){
            this.saveform.province = CodeToText[v[0]];
            this.saveform.city = CodeToText[v[1]];
            this.saveform.contry = CodeToText[v[2]];
        },
        //获取库房
        queryWarehouse(){
            let _this = this;
            this.$doRequest('api/backWarehouseControl/queryWarehouse', {},function(res){
                _this.warehouse = res.parameters.rows;
            });
        },
        // 创建门诊
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
                    this.$emit('saveClinic','提交成功');
                    this.$doRequest('/api/BackOutpatientControl/saveClinic', params,function(res){
                        console.log('请求结果');
                        _this.$message({
                            message: '门诊创建成功',
                            type: 'success'
                        });
                        _this.$emit('saveClinic',true);
                    });
                }
            });
        }
    },
    created(){
        this.queryWarehouse();
        // if(isBuild){
        //     this.queryWarehouse();
        // }else{
        //     this.saveform = this.clinicInfo;
        // }
    }
}
</script>
<style lang="less" scoped>
  @import 'index.less';
</style>