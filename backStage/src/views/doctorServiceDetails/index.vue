<template>
    <div class="doctorServiceDetails">
        <div class="page">
            <div class="nav">
                <navigation></navigation>
                <span @click="goBack">返回</span>
            </div>
            <div class="content">
                <div class="preview">
                    <h3>处方照片预览</h3>
                    <!-- <a :href="pictureurl" target="_Blank">下载处方</a> -->
                    <el-button type="text" @click="downPicture()">下载处方</el-button>
                    <!-- 手写版
                    <div>
                        <img :class="angle" src="../../assets/img/u384.png" @click="previewdialog = true" />
                        <img :class="angle" :src="pictureurl" @click="previewdialog = true" />
                    </div>
                    -->
                    <viewer :images="images">
	                    <img v-for="src in images" :src="src" :key="src" width="300">
	                </viewer>

                </div>
                <div class="details">
                    <h3>处方编辑</h3>
                    <!-- 就诊信息 -->
                    <el-form class="formSubmit" ref="form" :model="form" :rules="rules" label-width="140px">
                        <p class="title">就诊信息</p>
                        <div class="tit">
                            <i></i>
                            <span>患者信息与辨病、辨证均为必填项，如医生所提供处方样张内缺少，请务必联系医生进行确认，并补录。</span>
                        </div>
                        <el-form-item label="患者姓名：" prop="hispatientname">
                            <el-input v-model="form.hispatientname"></el-input>
                        </el-form-item>
                        <el-form-item label="患者性别：" prop="hissex">
                            <el-radio-group v-model="form.hissex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="患者年龄：" prop="hisage">
                            <el-select v-model="form.hisage" placeholder="请选择">
                                <el-option v-for="(item,i) in hisageArr" :key="i" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="患者电话：" prop="telephone">
                            <el-input v-model="form.telephone"></el-input>
                        </el-form-item>
                        <el-form-item label="辨病：" prop="arguedisease">
                            <el-input v-model="form.arguedisease"></el-input>
                        </el-form-item>
                        <el-form-item label="辨证：" prop="doctorconclusion">
                            <el-input v-model="form.doctorconclusion"></el-input>
                        </el-form-item>
                        <el-form-item label="诊后服务费：" prop="proportions">
                            <el-select v-model="form.proportions" placeholder="请选择">
                                <el-option v-for="(item,i) in proportionsArr" :key="i" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="药方是否可见：" prop="isprescription">
                            <el-radio-group v-model="form.isprescription">
                                <el-radio :label="1">完全可见</el-radio>
                                <el-radio :label="2">购前不可看</el-radio>
                                <el-radio :label="3">秘方 完全保密</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <p class="title">处方信息</p>
                        <div class="tit">
                            <i></i>
                            <span>如遇到药品名称与常规药品名称或库存药品名称有差异，请务必与医生或药房工作人员联系，确保用药准确性。</span>
                        </div>
                        <el-form-item label="药品剂型：" prop="prescriptionshapeid">
                            <el-radio-group v-model="form.prescriptionshapeid" disabled>
                                <el-radio v-for="(item,i) in prescriptionshapeArr" :key="i" :label="item.itemcode" @change="getBrand(i,item.itemcode)">{{item.itemname}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="药房：">
                            <span>{{hospitaname}}</span>
                        </el-form-item>
                        <el-form-item label="品牌商：">
                            <span>{{brand}}</span>
                        </el-form-item>
                        <el-form-item label="药品明细：" prop="photopremedicine">
                            <div class="photopremedicine" v-for="(item,i) in form.photopremedicine" :key="i">
                                <div>
                                    <el-select v-model="item.drugid" clearable filterable remote reserve-keyword
                                        :remote-method="remoteMethod"
                                        :loading="selectload"
                                        >
                                        <el-option v-for="i in drugsList" :key="i.label" :label="i.label" :value="i.value">
                                            <span>{{i.label}}</span>
                                            <span class="stock" v-if="i.stock>0">库存：{{i.stock}}</span>
                                            <span class="stock" v-else>库存：<span>{{i.stock}}</span></span>
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="item.dosage" style="width:60px" placeholder="克"></el-input>
                                    <span @click="removeMedicine(i)">-</span>
                                    <span @click="addMedicine()">+</span>
                                </div>
                                <div v-if="isDecoction">
                                    <el-select v-model="item.decoctionid">
                                        <el-option
                                            v-for="item in decoctionArr"
                                            :key="item.itemcode"
                                            :label="item.itemname"
                                            :value="item.itemcode">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="是否代煎：" prop="generationfry">
                            <el-radio-group v-model="form.generationfry">
                                <el-radio :label="1">不代煎</el-radio>
                                <el-radio :label="2">代煎</el-radio>
                                <el-radio :label="3">患者选择</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="剂量及服用说明：" prop="totaldosage">
                            <div class="totaldosage">
                                <el-input v-model="form.totaldosage"></el-input>剂<el-input v-model="form.daydosage"></el-input>日<el-input v-model="form.taketime"></el-input>次
                            </div>
                        </el-form-item>
                        <p class="title">处方信息</p>
                        <div class="tit">
                            <i></i>
                            <span>如遇到药品名称与常规药品名称或库存药品名称有差异，请务必与医生或药房工作人员联系，确保用药准确性。</span>
                        </div>
                        <el-form-item label="用药禁忌：">
                            <el-checkbox-group v-model="form.taboo">
                                <el-checkbox v-for="item in tabooArr" :label="item.itemname" :key="item.itemname">{{item.itemname}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="用药时间：">
                            <el-input v-model="form.medicationtime"></el-input>
                        </el-form-item>
                        <el-form-item label="医嘱（补充说明）：">
                            <el-input v-model="form.specialadvice"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="submit">
                    <el-button type="primary" :class="orderstate == 2?'pushBtn':'pushBtn Invalid'" @click="pushDoctor()">完成并推送给医生</el-button>
                    <el-checkbox v-model="form.isnote">同时短信推送提醒医生</el-checkbox>
                    <el-button type="primary" :class="orderstate == 2?'submitBtn':'submitBtn Invalid'" @click="updatephoto('form')">保存更新</el-button>
                    <span class="checkInfo" @click="getLog()">查看工单处理日志</span>
                </div>
            </div>
        </div>
        <!-- 处方放大区域 -->
        <el-dialog title="处方预览" :visible.sync="previewdialog" width="80%" center>
            <div class="previewdialog">
                <img :src="pictureurl" />
            </div>
        </el-dialog>
        <!-- 工单处理日志窗口 -->
        <el-dialog title="工单操作日志" :visible.sync="logdialog" width="44%" center>
            <div class="logdialog">
                <p v-for="item in logRecord" :key="item">
                    <span>{{item.createtime}}</span>
                    <span>{{item.username}}</span>
                    <span>{{item.message}}</span>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doctorWarned()">提醒医生查看</el-button>
                <el-button @click="logdialog = false">关闭</el-button>
            </span>
        </el-dialog>
        <!-- 提交前的确认 -->
        <el-dialog title="推送方式" :visible.sync="confirmdialog" width="30%" center>
            <div class="logdialog">
                <p>即将向医生：{{hisdoctorname}} 推送拍照开方工单抄方结果</p>
                <p>推送方式：医生APP推送（默认）{{form.isnote?'，短信推送':''}}</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmdialog = false">取消</el-button>
                <el-button type="primary" @click="updatephoto('form')">确认推送</el-button>
            </span>
        </el-dialog>
        <!-- 短信提醒医生 -->
        <el-dialog title="提醒医生查看抄方结果" :visible.sync="warneddialog" width="30%" center>
            <div class="logdialog">
                <p>即将向医生：{{hisdoctorname}} 查看已推送的抄方结果</p>
                <p>推送方式：短信推送</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="warneddialog = false">取消</el-button>
                <el-button type="primary" @click="doctorWarned()">确认推送</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import navigation from '../../components/common/navigation'
import common from '../../api/common';
export default {
    components: {
        navigation,
    },
    data(){
        return {
            pictureurl: '',//处方路径
            previewdialog: false,//处方弹窗
            angle: '',//旋转
            proportionsArr: [],//服务费区间 
            form: {
                id: this.$route.query.id,
                hispatientname: '',//患者姓名
                hissex: 1,//患者性别
                hisage: '',//患者年纪
                doctorid: '',//医生id（更新时用）
                telephone: '',//患者手机号
                arguedisease: '',//辨病
                doctorconclusion: '',//辨证
                proportions: '',//诊后服务费
                isprescription: 0,//药方是否可见
                prescriptionshapeid: '',//剂型
                hospitaid: '',//药房id
                brandid: '',//品牌id
                generationfry: '',//是否代煎
                totaldosage: '',//总剂量
                daydosage: '',//每日剂量
                taketime: '',//服用次数
                taboo: [],
                photopremedicine: [{
                    medicineid: '',
                    drugid: '',
                    dosage: '',
                    decoctionid: '',
                    medicinename: '',
                }],
                medicationtime: '',//用药时间
                specialadvice: '',//医嘱
                pushstate: 1,//1保存2推送
                isnote: false,//1发送短信2不发短信
            },
            rules: {
                hispatientname: [{
                    required: true, 
                    message: '请输入患者姓名', 
                    trigger: 'blur' 
                },{
                    max: 30,
                    message: '患者名称过长',
                    trigger: 'blur'
                }],
                hissex: [{
                    required: true, 
                    message: '请选择患者性别',
                    trigger: 'blur'
                }],
                hisage: [{
                    required: true, 
                    message: '请选择患者年龄', 
                    trigger: 'blur' 
                }],
                telephone: [{
                    required: true, 
                    message: '请输入患者联系方式',
                    trigger: 'blur'
                },{
                    max: 11,
                    message: '请输入正确格式的患者联系方式',
                    trigger: 'blur' 
                }],
                arguedisease: [{
                    required: true, 
                    message: '请输入辨病', 
                    trigger: 'blur' 
                },{
                    max: 100,
                    message: '辨病字符过长',
                    trigger: 'blur'
                }],
                doctorconclusion: [{
                    required: true, 
                    message: '请输入辨症',
                    trigger: 'blur'
                },{
                    max: 100,
                    message: '辨症字符过长',
                    trigger: 'blur' 
                }],
                proportions: [{
                    required: true, 
                    message: '请选择医生服务费', 
                    trigger: 'blur' 
                }],
                isprescription: [{
                    required: true, 
                    message: '请选择药方是否可见', 
                    trigger: 'blur' 
                }],
                prescriptionshapeid: [{
                    required: true, 
                    message: '请选择剂型', 
                    trigger: 'blur' 
                }],
                photopremedicine: [{
                    required: true, 
                    message: '请选择药品', 
                    trigger: 'blur' 
                }],
                generationfry: [{
                    required: true, 
                    message: '请选择是否代煎', 
                    trigger: 'blur' 
                }],
                totaldosage: [{
                    required: true, 
                    message: '请输入剂量及服用说明', 
                    trigger: 'blur' 
                }]
            },
            hospitaname: '',//药房名称
            prescriptionshapeArr: [],//剂型字典
            brandidArr: [],//品牌字典
            brand: '',//品牌
            decoctionArr: [],//煎法字典
            hisdoctorname: '',//医生姓名
            hisdoctortelephone: '',//医生手机号
            checkAll: false,
            hisageArr: [],//年龄arr
            tabooArr: [],
            isIndeterminate: true,
            brandArr: [],
            value: '',
            //药品搜索
            selectload: false,
            drugsList: [],
            list: [],
            //查看工单列表
            logdialog: false,
            logRecord: [],
            //提交前的确认
            confirmdialog: false,
            warneddialog: false,
            //是否可旋转煎法说明
            isDecoction: false,
            orderstate: '',// 1已关闭 2未关闭
            images: [],
            isSubmit: false,
            medicinalMaterials: []
        }
    },
    methods:{
        //公共接口-剂型
        getPrescriptionshape(){
            this.$doRequest('/api/Inquiry/getbrand', {}, res=>{
                this.prescriptionshapeArr = res.parameters;
                this.prescriptionshapeArr.forEach((item)=>{
                    if(item.prescriptionshapebrands){
                        item.prescriptionshapebrands.forEach(brand=>{
                            this.brandArr.push(brand);
                        });
                    }
                });
            })
        },
        //公共接口-禁忌
        getDrugUsing(){
            this.$doRequest('/api/Prescription/getContraindicationDrugUsing', {}, res=>{
                this.tabooArr = res.parameters;
            });
        },
        //公共接口-煎法
        getListByKey(){
            this.$doRequest('/api/datadictionarydetail/getListByKey', {sortcode: 'jianfa'}, res=>{
                this.decoctionArr = res;
            });
        },
        //获取品牌
        getBrand(i,code){
            this.brandArr = [];
            this.brandArr = this.prescriptionshapeArr[i].prescriptionshapebrands;
            this.form.prescriptionshapeid = code;
            if(code == 'yt1002'){
                this.isDecoction = true;
            }else{
                this.isDecoction = false;
            }
            this.getDrugs();
        },
        //获取药材
        getDrugs(){
            this.$doRequest('/api/DiagnosisPlan/drugs?hospitalId='+ this.form.hospitaid +'&formulationId='+ this.form.prescriptionshapeid +'&brandId='+ this.form.brandid,null, res=>{
                this.list = res.map(item => {
                    return { value: item.id, label: item.medicinename, code: item.phoneticode,stock: item.totalstock};
                });
                
            });
        },
        //监听搜索药品名称
        remoteMethod(query) {
            if (query !== '') {
                this.selectload = true;
                this.drugsList = [];
                setTimeout(() => {
                    this.selectload = false;
                    this.drugsList = this.list.filter(item => {
                        if(item.label && item.code){
                            if(item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.code.toLowerCase().indexOf(query.toLowerCase()) > -1){
                                return item.label;
                            }
                        }
                    });
                }, 200);
            } else {
                this.drugsList = [];
            }
        },
        //获取详情
        getPhotoDetail(){
            this.$doRequest('/api/PhotoBackstage/getphoto', {parameters: this.form.id}, res=>{
                this.images.push(res[0].pictureurl);//处方图片
                this.pictureurl = res[0].pictureurl;//下载处方
                this.form.hispatientname = res[0].hispatientname;//患者姓名
                this.form.hissex = res[0].hissex;//患者性别
                this.form.hisage = res[0].hisage;//患者年龄
                this.form.patientTelephone = res[0].patientTelephone;//患者手机号
                this.form.arguedisease = res[0].arguedisease;//辨病
                this.form.doctorconclusion = res[0].doctorconclusion;//辨证
                this.form.isprescription = Number(res[0].isprescription);//服务费
                this.form.proportions = res[0].proportions+'%';
                this.form.prescriptionshapeid = res[0].prescriptionshapeid;//剂型
                this.form.generationfry = Number(res[0].generationfry);//是否代煎
                this.form.totaldosage = res[0].totaldosage;//总剂量
                this.form.daydosage = res[0].daydosage;//每日剂量
                this.form.taketime = res[0].taketime;//服用次数
                this.form.medicationtime = res[0].medicationtime;
                this.form.specialadvice = res[0].specialadvice;
                //煎法说明处理
                if(this.form.prescriptionshapeid == 'yt1002'){
                    this.isDecoction = true;
                }else{
                    this.isDecoction = false;
                }
                this.form.brandid = res[0].brandid;
                this.form.hospitaid = res[0].hospitaid;//药房id
                this.hospitaname = res[0].hospitaname;//药房名称
                this.form.doctorid = res[0].doctorid;
                this.hisdoctorname = res[0].hisdoctorname;
                this.hisdoctortelephone = res[0].hisdoctortelephone;
                this.orderstate = res[0].orderstate;
                this.brandArr.forEach(item=>{
                    if(item.itemcode == this.form.brandid){
                        this.brand = item.itemname;
                    }
                });
                //禁忌处理
                if(res[0].taboo){
                    this.form.taboo = res[0].taboo.split(',');
                }

                //服务费区间处理
                let eq = res[0].aftermedicalfee.indexOf('-');
                let start = res[0].aftermedicalfee.substring(0,eq);
                let end = res[0].aftermedicalfee.substring(eq+1,res[0].aftermedicalfee.length);
                for(var i=start; i<=end;i++){
                    this.proportionsArr.push(i+'%');
                }
                //已选药材处理
                // res[0].medicinalMaterials.forEach(item=>{
                //     this.form.photopremedicine.push({
                //         medicineid: item.medicinename,
                //         drugid: item.medicinename,
                //         dosage: item.dosage,
                //         decoctionid: item.decoctionid,
                //     });
                // });


                //药材处理
                if(res[0].medicinalMaterials.length > 0){
                    this.form.photopremedicine = [];
                    res[0].medicinalMaterials.forEach(item => {
                        this.form.photopremedicine.push({
                            medicineid: item.medicineid,
                            drugid: item.medicinename,
                            dosage: item.dosage,
                            decoctionid: item.decoctionid,
                            medicinename: item.drugid,
                        });
                    });
                }
                this.getDrugs();
            })
        },
        //新增药品
        addMedicine(){
            console.log('初始前',this.form.photopremedicine);
            this.form.photopremedicine.push({
                medicineid: '',
                drugid: '',
                dosage: '',
                decoctionid: '',
            });
        },
        //删除药品
        removeMedicine(i){
            if(i >= 1){
                this.form.photopremedicine.splice(i,1);
            }
        },
        //更新抄方
        updatephoto(form){
            if(this.orderstate == 1){
                this.$message({
                    message: '订单已关闭状态下不能再对处方进行编辑',
                    type: 'error'
                });
                return false;
            }
            this.$refs[form].validate((valid) => {
                if (valid) {
                        //药品明细
                        let idarr = [];
                        let numarr = [];
                        this.medicinalMaterials = [];
                        this.form.photopremedicine.forEach(item => {
                            if(item.dosage){
                                numarr.push(item.dosage);
                            }
                            if(item.drugid){
                                if(escape(item.drugid).indexOf( "%u" )<0){
                                    this.medicinalMaterials.push({
                                        medicineid: item.medicineid,
                                        drugid: item.drugid,
                                        dosage: item.dosage,
                                        decoctionid: item.decoctionid,
                                        medicinename: item.medicinename,
                                    });
                                    idarr.push(item.drugid);
                                }else{
                                    this.medicinalMaterials.push({
                                        medicineid: item.medicineid,
                                        drugid: item.medicinename,
                                        dosage: item.dosage,
                                        decoctionid: item.decoctionid,
                                        medicinename: item.drugid,
                                    });
                                    idarr.push(item.medicinename);
                                }
                            }
                        });
                        this.form.photopremedicine = this.medicinalMaterials;
                        if((this.form.photopremedicine.length != idarr.length) || (this.form.photopremedicine.length != numarr.length)){
                            this.$message({
                                message: '药品名称和数量不能为空',
                                type: 'error'
                            });
                        }else{
                            //服务费去除%
                            let eq = this.form.proportions.indexOf('%');
                            this.form.proportions = this.form.proportions.substring(0,eq);
                            //禁忌处理
                            if(this.form.taboo){
                                this.form.taboo = this.form.taboo.join(',');
                            }

                            //是否发送给医生
                            if(this.form.isnote == true){
                                this.form.isnote = 1;
                            }else{
                                this.form.isnote = 2;
                            }
                            let params = this.form;
                            this.$doRequest('api/PhotoBackstage/updatephoto', params, res=>{
                                this.confirmdialog = false;
                                this.$message({
                                    message: '处方更新成功！',
                                    type: 'success'
                                });
                                this.$router.go(-1);
                            });
                        }
                }else{
                    this.$message({
                        message: '* 为必填项',
                        type: 'error'
                    });
                }
            });
            
        },
        pushDoctor(){
            if(this.orderstate == 1){
                this.$message({
                    message: '订单已关闭状态下不能再对处方进行编辑',
                    type: 'error'
                });
                return false;
            }
            this.form.pushstate = 2;
            this.confirmdialog = true;
        },
        //短信提醒医生
        doctorWarned(){
            this.$doRequest('api/PhotoBackstage/doctorWarned', {parameters: this.hisdoctortelephone}, res=>{
                this.$message({
                    message: '提醒医生查看抄方成功',
                    type: 'success'
                });
            });
        },
        //获取工单记录
        getLog(){
            this.logdialog = true;
            this.$doRequest('/api/PhotoBackstage/getLog', {parameters: this.form.id}, res=>{
                res.forEach(item => {
                    item.createtime = common.timestampToTime(item.createtime,1);
                });
                this.logRecord = res;
            });
        },
        //下载图片
        downPicture(){
            window.location.href = '/api/FastDfs/downdfile?fileUrl='+this.pictureurl;
            // this.$router.push({path:'/api/FastDfs/downdfile?fileUrl='+this.pictureurl});
            // let params = {
            //     parameters: this.pictureurl
            // }
            // this.$doRequest('/api/FastDfs/downd', params, res=>{
            //     this.$message({
            //         type: 'success',
            //         message: '处方下载成功！'
            //     });
            // });
        },
        //年龄生成
        hisage(){
            for(let i = 1;i <=12; i++){
                this.hisageArr.push(i+'个月');
            }
            for(let i = 1;i <=100; i++){
                this.hisageArr.push(i+'岁');
            }
        },
        //返回
        goBack(){
           this.$router.go(-1);
        }
    },
    created(){
        this.hisage();
        this.getPrescriptionshape();
        this.getDrugUsing();
        this.getPhotoDetail();
        this.getListByKey();
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
