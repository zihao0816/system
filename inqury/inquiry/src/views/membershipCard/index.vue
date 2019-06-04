<template>
<div> 
    <!--搜索框 -->
    <div class="search">
        <p><span>会员姓名：</span><input type="text" placeholder="请输入姓名" v-model="paName" /></p>
        <p><span class="phone">会员手机号：</span><input type="text" placeholder="请输入手机号" v-model="paPhone" /></p>
        <p><span>选择时间</span>
            <el-date-picker
            v-model="paTime"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
            </el-date-picker>
        </p>    
        <a class="btn" @click="resetpre">重置</a>  
        <a class="btn"  @click="searchinfo">搜索</a> 
    </div>
    <!-- 历史理疗处方 -->
    <el-table :data="tableData" style="width:100%;" border >
        <el-table-column   label="序号"  align="center">
            <template slot-scope="scope">
                <span> {{scope.$index+(pageIndex-1) * 10 + 1}}</span>
            </template>
        </el-table-column>
        <el-table-column label="会员姓名" prop="name"  align="center"></el-table-column>      
        <el-table-column label="性别" prop="sex"  align="center"></el-table-column>  
        <el-table-column label="年龄" prop="age"  align="center"></el-table-column>  
        <el-table-column label="会员号" prop="phone"  align="center"></el-table-column>  
        <el-table-column label="登记日期" prop="createtime"  align="center"></el-table-column>  
        <el-table-column label="累积充值额" prop="recharge"  align="center"></el-table-column>   
        <el-table-column label="累积消费额" prop="consumption"  align="center"></el-table-column>  
        <el-table-column label="当前余额" prop="balance"  align="center"></el-table-column>     
        <el-table-column label="操作" align="center" >
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">充值</el-button>
                <el-button type="text" size="small" @click="refunds(scope.row)">退款</el-button> 
                <el-button type="text" size="small" @click="getdetail(scope.row.patientid)">明细</el-button>       
            </template>
        </el-table-column>
    </el-table>
    <div class="addsname">
        <div class="addName" @click="dialogaddmenber=true">
            <el-button style="background:#FFF;margin-bottom:21px;color:#07A591;border:1px solid #07A591" >添加会员</el-button>
        </div>
    </div>
  <!-- 分页 -->
    <div class="block" style="float:right;font-size：16px;">
       <el-pagination
        background
        @current-change="getpage"
        :current-page.sync="pageIndex"
        layout="total, prev, pager, next, jumper"
        :page-count="pageSum">
        </el-pagination>
    </div>
    <!-- 添加会员 -->
     <div class="addMemberCard" v-if="dialogaddmenber">
        <el-dialog @close="dialogClose('ruleForm')"  title="添加会员" center :visible.sync="dialogaddmenber"  width="40%" >
            <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm" @submit.native.prevent>
                <el-form-item label="患者手机号:" class="phone" prop="phone"><el-input :disabled="typePhone" v-model="ruleForm.phone" width="100%" maxlength="11"  style="margin-left:0;"></el-input></el-form-item> 
                <p class="verification" @click="searchPhone('ruleForm')">验 证</p>
                <div class="memNnregiste" v-if="registerType">
                    <p>该手机号已注册患者信息，可直接创建会员.</p> 
                    <ul>
                        <li>姓名:&nbsp;{{patientcardInfo.patientname}}</li>
                        <li>生日:&nbsp;{{$timestampToTime(patientcardInfo.birthday,2)}}</li>
                        <li>性别:&nbsp;{{patientcardInfo.sex==1?"男":"女"}}</li>
                        <li>身份证号:&nbsp;{{patientcardInfo.idnumber}}</li>
                    </ul>
                </div>
                <div class="unregistedCard" v-if="registeredType">
                    <p>该手机号尚未注册患者信息，请完善资料。</p> 
                    <el-form-item label="姓名:" class="information" prop="name">
                        <el-input width="100%"  style="margin-left:0;" v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="生日:" class="information" prop="birthday">
                         <el-date-picker
                            v-model="ruleForm.birthday"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                   
                    <el-form-item label="性别:" class="information" prop="sex">
                       <el-select v-model="ruleForm.sex">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="身份证号:" class="information" prop="IdCard">
                        <el-input width="100%"  style="margin-left:0;" v-model="ruleForm.IdCard"></el-input>
                    </el-form-item>
                </div>
                <div class="finshAdd" v-if="registeredType||registerType" >
                    <p @click="addFinsh('ruleForm')">完成添加</p>
                </div>
            </el-form>
        </el-dialog>
    </div>
    <!-- 添加会员成功弹窗 -->
    <div class="addSuccess">
        <el-dialog title="提示" center :visible.sync="dialogaddSuccess"  width="25%"> 
            <p class="successInfo">{{addtypes?"该手机号已注册会员！":"添加新会员成功！"}}</p>
             <div class="finshAdd" >
                    <p @click="addSucess">前往充值</p>
                    <p @click="dialogaddSuccess=false">关闭</p>
            </div>
        </el-dialog>   
    </div>
         <!-- 添加会员弹出框 -->
    <div>
        <addCard :getpage="getpage" :dialogaddcard.sync="dialogaddcard" v-if="dialogaddcard"></addCard>  
        <detail :detailId="detailId" :getpage="getpage" :dialogmemdetail.sync="dialogmemdetail" v-if="dialogmemdetail"></detail>
        <addMoney :getpage="getpage" :addmoneylist="addmoneylist" :dialogaddMoney.sync="dialogaddMoney" v-if="dialogaddMoney"> </addMoney>
        <refund :getpage="getpage" :refundlist="refundlist" :dialogrefund.sync="dialogrefund" v-if="dialogrefund"> </refund>
    </div>
</div>
</template>
<script>
import addCard from "./prop/addCard";//添加会员弹窗弹窗
import detail from "./prop/detail";//明细弹窗
import addMoney from "./prop/addMoney";//会员充值弹框
import refund from "./prop/refund";//会员退款弹窗
export default {
    name:"historyPrescription",
    data(){
        var checkphone = (rule, value, callback) => {
            var pat=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
            if(value.match(pat)){
                callback();
            }else{
                 callback(new Error('输入正确手机号'));
            }
        }
        var checkIdCard=(rule, value, callback) => {
            let patId=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if(value.match(patId)){
                callback();
            }else{
                 callback(new Error('输入正确身份证号'));
            }
        }
        return {
            ruleForm:{
                phone:"",
                name:"",
                birthday:"",
                sex:"",
                IdCard:""
            },
            patinetInfo:{},
            type:"",
            paName:"",
            paPhone:"",
            paId:"",
            tableData:[],
            dialogaddcard:false,
            dialogmemdetail:false,
            dialogaddMoney:false,
            dialogrefund:false,
            dialogaddmenber:false,
            dialogaddSuccess:false,
            pageSum:1,
            pageIndex:1,
            addmoneylist:{},
            refundlist:{},
            patientcardInfo:{},
            paTime:null,
            detailId:"",
            addtypes:false,//false已存在添加true不存在添加会员
            registerType:false,//该手机号已注册患者信息
            registeredType:false,//该手机号未注册患者信息
            rules:{
                phone:[ { required: true, message: '请输入手机号', trigger: 'blur' }, { validator: checkphone, trigger: 'blur' }],
                name:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
                sex:[{ required: true, message: '请输入性别', trigger: 'blur' }],
                birthday:[{ required: true, message: '请输入生日', trigger: 'blur' }],
                IdCard:[{validator: checkIdCard, trigger: 'blur' }]
            },
            typePhone:false
        }
    },
    methods:{
        dialogClose(formRule){
            this.$refs[formRule].resetFields();
            this.registeredType=false;
            this.registerType=false;
            this.typePhone=false;
        },
        searchPhone(ruleForm){
            let _this=this;
            let id=JSON.parse(sessionStorage.getItem('loginDetail')).parameters.cnameid;
             this.$refs[ruleForm].validate((valid) => {
                 if(valid){
                    this.$doRequest("/api/membershipcard/getMember",{"phone":this.ruleForm.phone,"clinicid":id},res=>{                
                        switch(res.action){
                            case "1" :
                                _this.dialogaddmenber=false;
                                _this.dialogaddSuccess=true;
                                _this.addmoneylist=res.parameters[0];
                                _this.ruleForm.phone="";
                                _this.addtypes=true;
                                break;
                            case "2" :
                                _this.registeredType=true;
                                _this.typePhone=true;
                                break;
                            default: 
                                _this.patientcardInfo=res.parameters[0];
                                _this.registerType=true;
                                _this.typePhone=true;
                        }
                    }) 
                }
            })  
        },
        addFinsh(ruleForm){
            let _this=this;
            let obj={
                "clinicid":JSON.parse(sessionStorage.getItem('loginDetail')).parameters.cnameid,
                "name":this.ruleForm.name,
                "phone":this.ruleForm.phone,
                "sex":this.ruleForm.sex,
                "idcard":this.ruleForm.IdCard,
                "birthday":this.ruleForm.birthday
            }
            if(this.registerType){
                obj.name=this.patientcardInfo.patientname;
                obj.sex=this.patientcardInfo.sex;
                obj.idcard=this.patientcardInfo.idnumber;
                obj.birthday=this.$timestampToTime(this.patientcardInfo.birthday,2);
            }

           let  patId=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
           this.$refs[ruleForm].validate((valid) => {
                if(_this.ruleForm.IdCard===""||_this.ruleForm.IdCard.match(patId)) {
                    if((_this.ruleForm.sex&&_this.ruleForm.phone&&_this.ruleForm.name)||this.registerType){
                        if(!valid||valid){
                            this.$doRequest("/api/membershipcard/saveMember",obj,res=>{
                                _this.$refs[ruleForm].resetFields();
                                _this.ruleForm.IdCard="";
                                _this.getpage();
                                _this.type=1;
                                _this.dialogaddmenber=false;
                                _this.dialogaddSuccess=true;
                                _this.addtypes=true;
                                _this.registeredType=false;
                                _this.registerType=false;
                                _this.typePhone=false;
                                _this.addtypes=false;
                            })
                        } 
                    }
                }
           })
        },
        addSucess(){
            this.dialogaddMoney=true;
            this.dialogaddSuccess=false;
            this.ruleForm.phone="";
            if(this.type==1){
                this.addmoneylist=this.tableData[0];
            }
            
        },
        handleClick(list){
            this.dialogaddMoney=true;
            this.addmoneylist=list;
        },
        refunds(list){
            this.dialogrefund=true;
            this.refundlist=list;
        },
        getpage(){
            let _this=this;
            this.$doRequest("/api/membershipcard/pagelist",{pageLength:10,pagination:this.pageIndex},res=>{
               _this.tableData=res.rows;
               _this.pageSum=res.total;
            })
        },
        searchinfo(){
            let _this=this;
            var stime;
            var etime;
            if(this.paTime!=null){
                stime = this.paTime[0];
                etime = this.paTime[1];
            }
            this.$doRequest("/api/membershipcard/pagelist",{
               "condition":{ 
                name:this.paName,
                phone:this.paPhone,
                starttime:stime,
                endtime:etime}
            },function(res){
                _this.tableData = res.rows;
            })
        },
        getdetail(id){
           this.dialogmemdetail=true;
           this.detailId= id;
        },
        resetpre(){
            this.paName="";
            this.paPhone="";
            this.paId="";
            this.paTime=null;
        } 
    },
    created(){
        
    },
    components:{
        addCard,
        detail,
        addMoney,
        refund
    },
    mounted(){
        this.getpage();
    }
   
}
</script>
<style lang="less" scoped>
.fl{
    float:left;
}
.fr{
    float:right;
}
.el-table--border{
    margin-bottom: 8px;
}
  .search{
      width:100%;
       p{
           float:left;
           margin:0 20px 21px 0;
           span{
                float:left;
                width: 70px;
                line-height: 40px;
                color: rgba(20, 20, 20, 1);
                font-size: 14px;
                text-align: left;
                font-family: PingFang-SC-Medium;
                font-weight:800;
           }
           input{
               text-indent: 10px;
                float:left;
                width: 160px;
                height: 40px;
                border-radius: 5px;
                border: 1px solid #dcdfe6;
                outline: none;
           }                        
        }
        p:nth-of-type(2) span{
            width:84px;
        }
        .btn{
            width:96px;
            line-height:40px;
            background:#07A591;
            text-align:center; 
            font-size:14px;
            color:#FFF;
            float:right;
            margin-left:10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
    }
    .addsname{
        width:100%;
        line-height:40px;
        clear: both;
        .addName{
            float:left;
            a{
                display:block;
                width:96px;
                line-height:40px;
                background:#07A591;
                text-align:center; 
                font-size:14px;
                color:black;
                margin-bottom:21px;
            }
        }
    } 
    .el-pagination{
        margin-bottom:40px;
         position:static!important;
        // position: fixed;
        // bottom:30px;
        // right:16px;
    }
    .el-button--text{
        color:#07A591;
    }
    /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #07A591;    
    }
    .addMemberCard{
        overflow: hidden;
        .el-dialog__header{
            background-color:#f1f0f5;
        }
       
        .el-form{
            overflow: hidden;
            margin-bottom:0;
            margin-right:20px;
            clear:both!important;
            float: none !important;
            /deep/.phone{
                    width:300px;
                    float:left;
                /deep/.el-form-item__label{
                    height:30px;
                    line-height: 30px;
                }
                /deep/.el-form-item__content{
                    width:170px;
                    line-height:30px;
                    height: 30px;
                    .el-input__inner{
                        line-height: 30px;
                        height: 30px;
                    }
                }
            }  
        }
        .verification{
            cursor: pointer;
            width:60px;
            line-height: 30px;
            background:#07A591; 
            text-align: center;
            float:left;
            border-radius: 4px;
            color:#fff;
        }
        .finshAdd{
            clear:both;
            width:100%;
            height:30px;
            text-align: center;
            cursor: pointer;
            p{
                display: inline-block;
                width:80px;
                background:#07A591; 
                font-size:14px;
                line-height: 30px;
                color:#fff;

            }
        }
        .memNnregiste{
            width: 100%;
            clear:both;
            overflow: hidden;
            border-top:1px dashed #07A591;
            box-sizing: border-box;
            padding-top:20px;
            padding-left:20px;
            p{
                margin-bottom: 20px;
            }
            ul{
                box-sizing: border-box;
                padding-left: 20px;
                width:100%;
                li{
                    float:left;
                    list-style: none;
                    width:50%;
                    margin-bottom:30px;
                }
                li:nth-of-type(2){
                    box-sizing: border-box;
                    padding-left:28px;
                }
            }
        }
        .unregistedCard{
            width:100%;
            min-height: 160px;
            overflow: hidden;
                /deep/.el-input__icon{
                    line-height: 30px!important;
                }
                p:nth-of-type(1){
                    margin-bottom:30px;
                }
                /deep/.information{
                    float:left;
                    width:220px;
                    float:left;
                    margin-bottom:25px;
                     /deep/.el-textarea__inner:focus {
                         border-color: #07A591!important; 
                        }
                /deep/.el-form-item__label{
                    height:30px;
                    line-height: 30px;
                    width:60px!important;
                }
                /deep/.el-form-item__content{
                    margin-left:60px!important;
                    width:150px;
                    line-height:30px;
                    height: 30px;
                    .el-input__inner{
                        line-height: 30px;
                        height: 30px;
                    }
                }
            }
            /deep/.information:nth-of-type(4){
                width:235px;
                display: flex;
                .el-form-item__label{
                    float:left;
                    width:80px!important;
                    
                }
                .el-form-item__content{
                    float:left;
                    margin-left:0px!important;
                    input{
                        padding:0 5px;
                    }
                }
            }
            /deep/.information:nth-of-type(2){
                margin-left: 18px;
                // /deep/.el-form-item.is-success .el-textarea__inner:focus {
                //     border-color:red!important;
                // }
                input{
                    width:150px;
                }
                i{
                    line-height: 30px!important;
                }
            }
        }
    }
    .addSuccess{
        width:100%;
        overflow: hidden;
         .el-dialog__header{
            background-color:#f1f0f5;
        }
        .successInfo{
            margin-bottom:20px;
            width:100%;
            text-align: center;
        }
        .finshAdd{
            clear:both;
            width:100%;
            height:30px;
            text-align: center;
            cursor: pointer;
            p{
                display: inline-block;
                width:80px;
                background:#07A591; 
                font-size:14px;
                line-height: 30px;
                color:#fff;
                margin-left:20px;
            }
        }
    }
    /deep/.el-dialog__header{
            background-color:#f1f0f5!important;
        }
    /deep/ .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
         border-color:#07A591!important;
     }
     /deep/.el-input__inner{
         border-color:#07A591!important;
     }
</style>


