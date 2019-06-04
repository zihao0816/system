<template>
    <div class="docpublic">
        <el-dialog :title="types==3?'资料详情':types==2?'资料详情':'添加医生'" center  :visible="publicdialog"  @update:visible="v=>$emit('update:publicdialog',v)" width="1200px">
            <el-form :inline="true" ref="formInline" :rules="rules" :model="formInline"  class="demo-form-inline">
                <div class="headerss">医生基础信息</div>
                <div class="docTop">
                    <div class="doctop_left" >
                        <img :src="formInline.headphoto.length>0?formInline.headphoto:require('../../assets/img/zwt_paifang@3x.png')" alt="">
                        <img class="clickxx" src="../../assets/img/icon_delet@3x.png" alt="" v-if="formInline.headphoto.length>0" @click="deleteimg">
                        <el-upload
                            class="upload-demo"
                            action="/api/FastDfs/uploadLocal"
                            :headers="getheader"
                            :on-change="docaddpic"
                            :on-success="topsuccess"
                            list-type="picture"
                            >
                             <el-button size="small" type="primary" ><span class="docAdd">+</span> 上传医生头像</el-button>
                        </el-upload>
                    </div>
                    <div class="doctop_right">
                        <div class="inputs">
                            <el-form-item label="姓名:" prop="doctorname" >
                                <el-input v-model="formInline.doctorname"></el-input>
                            </el-form-item>
                            <el-form-item label="性别:" prop="sex" >
                                <span class="formSex" :class="formInline.sex==1?'clickColor':''"  @click="formInline.sex=1">男</span>
                                <span class="formSex" :class="formInline.sex==2?'clickColor':''" @click="formInline.sex=2">女</span>
                            </el-form-item>
                            <el-form-item label="年龄:" >
                                <el-date-picker
                                    v-model="formInline.birthday"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="手机号:"  prop="telephone" v-if="types==1||types==3">
                                <el-input v-model.number="formInline.telephone" ></el-input>
                            </el-form-item>
                           <el-form-item label="手机号:"  v-show="types==2">
                                 <el-input v-model.number="formInline.telephone" :disabled="true"></el-input>
                            </el-form-item> 
                            <el-form-item label="地区:" >
                                 <el-cascader
                                    :options="options"
                                    v-model="formInline.selectedOptions"
                                    >
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="所属医院:" prop="hospitaname" >
                                <el-select v-model="formInline.hospitaname" >
                                    <el-option :label="item.hospitaname"  :value="item.id" v-for="(item,index) in hospitalList" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所属科室:" prop="departmentname" >
                                <el-select v-model="formInline.departmentname">
                                    <el-option :label="item.itemname" :value="item.itemcode" v-for="(item,index) in dutyslist" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="职称:" prop="dutiesname" >
                                <el-select v-model="formInline.dutiesname" placeholder="">
                                    <el-option :label="item.itemname" :value="item.itemcode" v-for="(item,index) in detartmentslist" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="注册时间:">
                                <el-input  :value="types==1?createtime.timestampToTime(new Date(),1):formInline.createtime"></el-input>
                            </el-form-item>
                            </div>
                            <p class="skillDoc"><span><i>*</i> 擅长技能:</span></p>
                            <div class="docskills" v-if="types!=3">
                                <el-form-item prop="sum" v-for="(item,index) in sum" :key="index">
                                    <el-input v-model="item.skillname" placeholder="请输入内容" ></el-input>
                                    <img class="removeSkill" src="../../assets/img/icon_delet@3x.png"  @click="docskillclick(2,index)" :style="(sum.length-1)==index?'right:32px':''"  alt="">
                                    <img v-if="(sum.length-1)==index" class="addskill" src="../../assets/img/icon_tianjia @3x.png" @click="docskillclick(1,index)" alt="">
                                </el-form-item>
                            </div>
                            <div class="docdetailss" v-if="types==3">
                                <ul >
                                   <li v-for="(item,index) in formInline.doctorskillList" :key="index">{{item.skillname}}</li> 
                                </ul>
                            </div>
                            <div class="introduction">
                                <span class="fl"><i>*</i> 个人简介</span><span class="fr">{{formInline.intro.length}}/1000</span>
                                <el-form-item prop="intro">
                                    <el-input type="textarea" v-model="formInline.intro" maxlength="1000"  placeholder="此处省略100字。最大可填1000字。"></el-input>
                                </el-form-item>
                            </div>
                    </div>
                </div>
                <div class="docCenter">
                    <div class="headerss">出诊机构信息</div>
                    <div style="overflow:hidden,min-height:80px;">
                        <!-- <el-form> -->
                            <el-form-item style="margin-left:200px;" v-if="types!=3">
                                <el-select @change="editorInstitutional" v-model="institutionalName" filterable placeholder="请选择机构名称">
                                    <el-option
                                    v-for="item in institutionalList"
                                    :key="item.id"
                                    :label="item.hospitaname"
                                    :value="item.id+'&'+item.hospitaname+'&'+item.type">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  v-if="types!=3">
                                <el-select v-model="doctortype"  placeholder="机构医生">
                                    <el-option label="机构医生" value="1"></el-option>
                                    <el-option label="特邀专家" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="types!=3">
                                <el-button type="primary" @click="getInstitutionalName(1)" >添加</el-button>
                            </el-form-item>
                            <div class="docdetailss" v-if="types==3">
                                <ul>
                                   <li v-for="(item,index) in institutionalInfo" :key="index">{{item.hospitaname}}</li> 
                                </ul>
                            </div>
                            <div class="docskills" v-if="institutionalInfo.length>0&&types!=3">
                                <el-form-item prop="sum" v-for="(item,index) in institutionalInfo" :key="index">
                                    <el-input :value="item.hospitaname+'-'+(item.type==2?'特邀专家':'机构医生')" placeholder="请输入内容" ></el-input>
                                    <img v-if="types==1" class="removeSkill" src="../../assets/img/icon_delet@3x.png"  @click='getInstitutionalName(2,index)'>
                                </el-form-item>
                            </div>
                    </div>
                </div>
                <div class="docFooter">
                    <div class="headerss">医生资质信息</div>
                    <div class="footer_top">
                        <div class="asides_left">
                            <p>
                                <i><b>*</b> 执业证</i>
                                <span>1.至少上传1张</span>
                                <span>2.支持jpg、png格式</span>
                                <span>3.图片大小不超过1M/张</span>
                                <span>4.图片单边自填充</span>
                            </p>
                             <el-form-item>
                                 <el-upload
                                    class="upload-demo"
                                    action="/api/FastDfs/uploadLocal"
                                    :headers="getheader"
                                    :limit="3"
                                    :on-success="onsuccess1"
                                    list-type="picture">
                                   <el-button size="small" type="primary" ><span class="docAdd">+</span> 选择文件</el-button>
                                    </el-upload>
                             </el-form-item>
                        </div>
                        <div class="asides_right">
                            <span v-for="(item,index) in 2" :key=index>
                                <img class="picLogol" :src="filelist1[index]?require('../../assets/img/icon_delet@3x.png'):''" @click="removeImg1(index)" alt="">
                                <img class="picTu" :src="filelist1[index]?filelist1[index].url:require('../../assets/img/zwt_paifang@3x.png')" alt="">
                            </span>
                        </div>
                    </div>
                     <div class="footer_top">
                        <div class="asides_left">
                            <p>
                                <i><b>*</b> 资格证</i>
                                <span>1.至少上传1张</span>
                                <span>2.支持jpg、png格式</span>
                                <span>3.图片大小不超过1M/张</span>
                                <span>4.图片单边自填充</span>
                            </p>
                             <el-form-item >
                                 <el-upload
                                    class="upload-demo"
                                    action="/api/FastDfs/uploadLocal"
                                    :headers="getheader"
                                    :limit="3"
                                    :on-success="onsuccess2"
                                    list-type="picture">
                                    <el-button size="small" type="primary" ><span class="docAdd">+</span> 选择文件</el-button>
                                    </el-upload>
                             </el-form-item>
                        </div>
                        <div class="asides_right" >
                            <span v-for="(item,index) in 2" :key=index>
                                <img class="picLogol" :src="filelist2[index]?require('../../assets/img/icon_delet@3x.png'):''" @click="removeImg2(index)" alt="">
                            <img class="picTu" :src="filelist2[index]?filelist2[index].url:require('../../assets/img/zwt_paifang@3x.png')" alt="">
                            </span>
                        </div>
                    </div>
                     <div class="footer_top">
                        <div class="asides_left">
                            <p>
                                <i><b>*</b> 其他证件</i>
                                <span>1.至少上传1张</span>
                                <span>2.支持jpg、png格式</span>
                                <span>3.图片大小不超过1M/张</span>
                                <span>4.图片单边自填充</span>
                            </p>
                             <el-form-item>
                                 <el-upload
                                    class="upload-demo"
                                    action="/api/FastDfs/uploadLocal"
                                    :headers="getheader"
                                    :limit="3"
                                    :on-success="onsuccess3"
                                    list-type="picture">
                                   <el-button size="small" type="primary" ><span class="docAdd">+</span> 选择文件</el-button>
                                    </el-upload>
                             </el-form-item>
                        </div>
                        <div class="asides_right">
                            <span v-for="(item,index) in 2" :key=index>
                                <img class="picLogol" :src="filelist3[index]?require('../../assets/img/icon_delet@3x.png'):''" @click="removeImg3(index)" alt="">
                                <img class="picTu" :src="filelist3[index]?filelist3[index].url:require('../../assets/img/zwt_paifang@3x.png')" alt="">
                            </span>
                        </div>
                    </div>
                </div>
            </el-form>  
                <div class="buttons" v-if="types/1!==3" style="text-align: center;margin-top:20px;">
                    <el-button @click="$emit('update:publicdialog',false)">取 消</el-button>
                    <el-button type="primary" @click="addclick('formInline')" >保 存</el-button>
                </div> 
                 <div class="buttons" v-if="types/1==3" style="text-align: center;margin-top:20px;">
                    <el-button @click="$emit('update:publicdialog',false)">关闭</el-button>
                    <el-button type="primary" @click="reject('formInline')">拒绝</el-button>
                     <el-button type="primary" @click="adddoc('formInline')">通过</el-button>
                </div> 
        </el-dialog>
    </div>
</template>
<script>
import { regionData,CodeToText,TextToCode} from 'element-china-area-data'
import common from "../../api/common"
import adopt from "./pending/popup/adopt"
import reject from "./pending/popup/reject"
export default {
    props:["docadd","publicdialog","types","docsid","doclistId","getpagedoc","getpagedetail"],
    data(){
        var checkAge = (rule, value, callback) => {
            let value1=value+'';
            if (value1.length==11) {
                return callback();
            }else{
                callback(new Error('请输入11位手机号'));
            }
        }
        return {
            loadings:false,
            dataInstitutionalInfo:[],
            doctortype:'',
            institutionalList:[],
            institutionalInfo:[],
            institutionalName:'',
            createtime:common,
            allImg:[],
            options:regionData,
            docImg:"",
            list:["filelist1","filelist2","filelist3"],
             formInline: {
                doctorname: '',
                telephone: '',
                sex: 1,
                hospitaname: '',
                departmentname:'',
                dutiesname:'',
                birthday:'',
                sum:"123",
                headphoto:"",
                doctorskillList:[],
                intro:"",
                confirmtime:"2019",
                selectedOptions:[]
            },
            organizationList:'',
            picimg:[],
            wo:[1,2],
            filelist1: [],
            filelist2: [],
            filelist3: [],
            filelist5:[],
            index:'',
            isLt2M:"",
            hospitalList:[],
            sum:[{
                skillname: ''
            }],
            numbs:1,
            rules:{
                doctorname:[{ required: true, message: '请输入医生姓名', trigger: 'blur' },],
                telephone:[ {type: 'number', message: '手机号为数字',trigger: 'blur'},{ required: true, message: '请输入手机号', trigger: 'blur' },{ validator: checkAge, trigger: 'blur' }],    
                sex:[{ required: true, message: '请输入性别', trigger: 'change' },],
                hospitaname:[{ required: true, message: '请输入医院', trigger: 'change' },],
                departmentname:[{ required: true, message: '请输入科室', trigger: 'change' },],
                dutiesname:[{ required: true, message: '请输入职称', trigger: 'change' },],
                intro:[{ required: true, message: '请输入简介', trigger: 'change' },],
            },
            sss:"",
            number:"",
            imgAdd:[],
            imgdelete:[],
            detartmentslist:[],
            dutyslist:[],
            filelist1img:[],
            dialogprobit:false,
            docdialogtype:false,
            arrLength:'',
            editorInstitutionalName:[],
            headImg:'',
        }
    },
    computed: {
        
        getheader(){
            return {sessionId:sessionStorage.getItem("sessionId")} 
        },
    },
    methods:{
        editorInstitutional(val){
            this.editorInstitutionalName=val.split('&');  
        },
        getInstitutionalName(index,list){
            if(index==1&&this.editorInstitutionalName.length>1){
                let joinSum=[];
                if(this.institutionalInfo.length>=1){
                    for(let j=0;j<this.institutionalInfo.length;j++){
                        joinSum.push(this.institutionalInfo[j].hospitaname);

                    }
                }
                if((joinSum.indexOf(this.editorInstitutionalName[1])==-1&&this.institutionalInfo.length>=1)||this.institutionalInfo.length<=0){
                    if(!this.doctortype){
                        this.$message({
                            message: '请添加医生类别',
                            type: 'error'
                        });
                        return ;
                    }
                    this.institutionalInfo.push({hospitaname:this.editorInstitutionalName[1],hospitaid:this.editorInstitutionalName[0],type:this.doctortype}); 
                }else{
                    return;
                }
            }else{
                this.institutionalInfo.splice(list/1,1);
            }
        },
        deleteimg(){
            this.formInline.headphoto="";
        },
        adddoc(){
            let _this=this;
            let obj={
                id:this.docsid,
                confirmstate:1,
            }
            this.$doRequest("/api/doctorinfo/doctorCertified",obj,res=>{
                _this.getpagedetail();
                _this.$emit('update:publicdialog',false);
                 _this.$message({
                    message: '通过成功',
                    type: 'success'
                }); 
            })
        },
        reject(){
            let _this=this;
            let obj={
                id:this.docsid,
                confirmstate:3,
                remark:""
            }
            this.$doRequest("/api/doctorinfo/doctorCertified",obj,res=>{
                    _this.$emit('update:publicdialog',false);
                    _this.getpagedetail();
                    _this.$message({
                        message: '拒绝成功',
                        type: 'success'
                    });
                })
        },
        getdepartment(){
            let _this=this;
            this.$doRequest("/api/datadictionarydetail/selectBySortcodes?&sortcodes=keshi",{},res=>{
                _this.dutyslist=res;
            })
             this.$doRequest("/api/datadictionarydetail/selectBySortcodes?&sortcodes=zhicheng",{},res=>{
                _this.detartmentslist=res;
            })
        },
        topsuccess(res, file, fileList){
            //http://www.51bjhzy.com/
            //this.formInline.headphoto="https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/"+res[0].fileUrl;
            this.formInline.headphoto="https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/"+res[0].fileUrl;
            this.headImg=res[0].fileUrl;
        },
        onsuccess1(res, file, fileList){
            let imgName="zhiyezheng@#@"+res[0].fileUrl;
            let picName='https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/'+res[0].fileUrl;
            if(this.filelist1.length<2){
                this.filelist1.push({url:picName,img:imgName});
            }else{
                this.$message({
                    message: '最多两张图片',
                    type: 'success'
                });
            }
        },
        onsuccess2(res, file, fileList){

            let imgName="zigezheng@#@"+res[0].fileUrl;
            let picName='https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/'+res[0].fileUrl;
           if(this.filelist2.length<2){
                this.filelist2.push({url:picName,img:imgName});
            }else{
                this.$message({
                    message: '最多两张图片',
                    type: 'success'
                });
            }
        },
        onsuccess3(res, file, fileList){
            let imgName="jishuzheng@#@"+res[0].fileUrl;
            let picName='https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/'+res[0].fileUrl;
            if(this.filelist3.length<2){
                this.filelist3.push({url:picName,img:imgName});
            }else{
                this.$message({
                    message: '最多两张图片',
                    type: 'success'
                });
            }
        },
        removeImg1(index){
            this.filelist1.splice(index,1);
        },
        removeImg2(index){
            this.filelist2.splice(index,1);
        },
        removeImg3(index){
            this.filelist3.splice(index,1);
        },
        gethospital(){
            let _this=this;
            this.$doRequest("/api/hospitainfo/getListByKey",{},res=>{
                 _this.hospitalList=res; 
            })
        },
        getpage(){
            let _this=this;
            let doctorId=this.types/1===3?this.docsid:this.doclistId;
            this.$doRequest("/api/doctorinfo1.5.1/getDoctorDetails/"+doctorId,null,res=>{
                _this.formInline= res;
                _this.institutionalInfo=res.organization;
                _this.organizationList=res.organization.length;
                for(let i=0;i<res.doctorqualificationList.length;i++){
                        if(res.doctorqualificationList[i].qftype=="zhiyezheng"){
                            _this.filelist1.push({url:"http://www.51bjhzy.com/"+res.doctorqualificationList[i].paperfile,name:"zhiyezheng",img:"zhiyezheng@#@"+res.doctorqualificationList[i].paperfile});
                             let imgName="zhiyezheng@#@"+res.doctorqualificationList[i].paperfile;
                             _this.imgAdd.push(imgName); 
                        }
                        if(res.doctorqualificationList[i].qftype=="zigezheng"){
                            _this.filelist2.push({url:"http://www.51bjhzy.com/"+res.doctorqualificationList[i].paperfile,name:"zigezheng",img:"zigezheng@#@"+res.doctorqualificationList[i].paperfile});
                             let imgName="zigezheng@#@"+res.doctorqualificationList[i].paperfile;
                             _this.imgAdd.push(imgName);
                        }
                         if(res.doctorqualificationList[i].qftype=="jishuzheng"){
                            _this.filelist3.push({url:"http://www.51bjhzy.com/"+res.doctorqualificationList[i].paperfile,name:"jishuzheng",img:"jishuzheng@#@"+res.doctorqualificationList[i].paperfile});
                             let imgName="jishuzheng@#@"+res.doctorqualificationList[i].paperfile;
                             _this.imgAdd.push(imgName); 
                        }
                 }  
                  _this.sum=res.doctorskillList.length>0?res.doctorskillList:[{ skillname: ''  }];
                _this.formInline.departmentname=res.department;
                 _this.formInline.hospitaname=res.hospitaid?res.hospitaid:"";
                _this.formInline.doctorname=res.doctorname?res.doctorname:"";
                _this.formInline.telephone=res.telephone?res.telephone:"";
                _this.formInline.sex=res.sex?res.sex:"";
                _this.formInline.dutiesname=res.duties?res.duties:"";
                _this.formInline.birthday=res.birthday?res.birthday:"";
                _this.formInline.headphoto=res.headphoto?'http://www.51bjhzy.com/'+res.headphoto:"";
                _this.formInline.intro=res.intro?res.intro:"";
                _this.formInline.selectedOptions=[];
                if(res.city=="北京市"||res.city=="天津市"||res.city=="上海市"||res.city=="重庆市"){
                    res.city="市辖区";
                }
                let pro=res.province?res.province:"";
                let cit=res.city?res.city:"";
                let cour=res.contry?res.contry:"";
                    if(res.province&&res.city&&res.contry){
                       let province=TextToCode[pro];
                        let city=TextToCode[pro][cit];
                        let contry=TextToCode[pro][cit][res.cour];
                        _this.formInline.selectedOptions.push(province.code);
                        _this.formInline.selectedOptions.push(city.code);
                        _this.formInline.selectedOptions.push(contry.code);
                    }
            })
        },
        addclick(formInline){
            let _this=this;
            let joinSum=[];
            for(let j=0;j<this.sum.length;j++){
                joinSum.push(this.sum[j].skillname);
            }
            let picarr=this.filelist1.concat(this.filelist1,this.filelist3);
            let arr=[];
            for(let k=0;k<picarr.length;k++){
                arr.push(picarr[k].url);
            }
            if((this.formInline.birthday+"").length>13){
                  let  d=new Date(this.formInline.birthday);
                 this.formInline.birthday=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ; 
            }
            let addImg=[]
            this.filelist1.forEach(item => {
                addImg.push(item.img);
            });

            
            this.filelist2.forEach(item => {
                addImg.push(item.img);
            });
             this.filelist3.forEach(item => {
                addImg.push(item.img);
            });
            let obj={
                    "doctorname":this.formInline.doctorname,
                    "birthday":this.formInline.birthday==null?"":this.formInline.birthday,
                    "duties": this.formInline.dutiesname,
                    "department": this.formInline.departmentname,
                    "telephone": this.formInline.telephone,
                    "contry": CodeToText[this.formInline.selectedOptions[2]],
                    "city": CodeToText[this.formInline.selectedOptions[1]],
                    "province":CodeToText[this.formInline.selectedOptions[0]],
                    "sex": this.formInline.sex,
                    "intro": this.formInline.intro,
                    "ordernum":"",
                    "confirmstate":this.types==2?(this.docadd.confirmstate==1?1:this.docadd.confirmstate==2?2:3):2,
                    "dskills": joinSum.join(","),
                    "dcertificate":addImg.join(","),
                    "headphoto":this.formInline.headphoto.split('https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/')[1]?this.formInline.headphoto.split('https://service.51bjhzy.com/api/StaticFile/fastdfsLocalURL/')[1]:this.formInline.headphoto.split('http://www.51bjhzy.com/')[1],
                    "hospitaid":this.formInline.hospitaname,
                    "organization":this.institutionalInfo,
                    'doctortype':this.doctortype
            };
            this.$refs[formInline].validate((valid) => {
                 if (valid) {
                     if(this.formInline.headphoto&&this.filelist2.length>=1&&this.filelist1.length>=1){
                         obj.confirmstate=this.docadd.confirmstate==3?2:obj.confirmstate;
                         if(this.formInline.selectedOptions.length>0){
                            if(this.types==2){
                                obj.id=this.doclistId;
                                obj.organization.splice(0,_this.organizationList);
                            }
                            this.loadings=true;
                            _this.$doRequest("/api/doctorinfo1.5.1/UpdateDoctorInfo",obj,res=>{
                                _this.$emit('update:publicdialog',false);
                                _this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                _this.getpagedoc();
                                _this.$emit('update:publicdialog',false);
                                _this.loadings=false;
                            })
                         }else{
                            _this.$message({
                                message: '请输入地区',
                                type: 'success'
                            });
                            _this.loadings=false;
                         }
                        
                     }else{
                        _this.$message({
                            message: '请补齐资料',
                            type: 'success'
                        });
                     }
                 }else{
                      _this.$message({
                        message: '请填写完整资料',
                        type: 'success'
                    });
                 }
            })
        },
        docskillclick(index,list){
            if(index==1&&(this.sum[list].skillname)){
                let joinSum=[];
                for(let j=0;j<this.sum.length;j++){
                    joinSum.push(this.sum[j].skillname);
                }
                let temp=[];
                for(var i = 0; i < joinSum.length; i++){
                    if(temp.indexOf(joinSum[i])==-1){
                        temp.push(joinSum[i]);
                    }else{
                        return;
                    }
                }
                this.sum.push({value:""});
            }
            if(index==2){
                if(this.sum.length<=1){
                    return;
                }
                let temporaryArr=JSON.parse(JSON.stringify(this.sum));
                let arr =temporaryArr.splice(list/1,1);
                if(this.types/1==2){
                     this.sum=temporaryArr; 
                }else{
                     this.sum=temporaryArr;
                }
               
            }
        },
        docaddpic(file){
            
        },
        uponchange1(file,filse){
            let obj={};
            obj.url=file.url;
        },
        beforeAvatarUpload(file,index){
            this.isLt2M = file.size / 1024 / 1024 < 1;
            return this.isLt2M;
        },
        onexceed(){
            this.$message.error('最多上传2张图片');
        },
        getInstitution(){
            let _this=this;
            this.$doRequest("/api/hospitainfo/geOrganization",{},res=>{
                _this.institutionalList=res;
            })
        }

    },
    mounted(){
        this.getdepartment();
        this.getInstitution();
        if(this.types/1===3||this.types/1===2){
            this. getpage();
        }
        this.gethospital();
      
        
    },
    components:{
        adopt,
        reject
    }
}
</script>
<style lang="less">
@import "pbulicpopup.less";

</style>
