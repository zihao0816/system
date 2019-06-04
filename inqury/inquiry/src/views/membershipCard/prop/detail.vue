<template>
    <div>
        <div class="heades"> 
            <el-dialog title="会员金额变动明细" center  :visible="dialogmemdetail"  @update:visible="v=>$emit('update:dialogmemdetail',v)" width="70%">
                <el-table border  :data="tableData">
                    <el-table-column  label="会员姓名" align="center" prop="name"></el-table-column>
                     <el-table-column  label="充值单号" align="center" prop="transactionno"></el-table-column>
                    <el-table-column  label="会员手机号"  align="center" prop="phone"></el-table-column>
                    <el-table-column  label="日期" align="center" prop="createtime"></el-table-column>
                    <el-table-column  label="类型" align="center" prop="businesstype"></el-table-column>
                    <el-table-column  label="内容" align="center" prop="remarks"></el-table-column>
                    <el-table-column  label="操作人" align="center" prop="createname"></el-table-column>
                    <el-table-column  label="变更前金额" align="center" prop="sourcemoney"></el-table-column>
                    <el-table-column  label="变更金额" align="center" prop="thismoney"></el-table-column>
                    <el-table-column  label="变更后余额" align="center" prop="aftermoney"></el-table-column>
                </el-table> 
                <p class="buton" @click="$emit('update:dialogmemdetail',false)" >返回</p>
                 <!-- 分页 -->
                <div class="block" style="float:right;font-size：16px;float：right;margin-bottom:20px">
                    <el-pagination
                    background
                    @current-change="getdetails"
                    :current-page.sync="pageIndex"
                    layout="total, prev, pager, next, jumper"
                    :page-count="pageSum">
                    </el-pagination>    
                </div>
            </el-dialog> 
        </div>     
    </div>
</template>
<script>
export default {
    props:["dialogmemdetail","detailId"],
     data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        }
        return {
            labelPosition:'right',
            tableData:[],
            pageIndex:1,
            pageSum:1,
            ruleForm2:{
                name:"",
                phone:""
            },
            rules2:{
               name:[
                   {required:true,message:"必填",trigger: 'blur'},
                   {validator:validatePass, trigger: 'blur'}
               ],
               phone:[
                   {required:true,message:"必填",trigger: 'blur'},
                    {validator:validatePass, trigger: 'blur'}
               ]
            }
        }
     },
     methods:{
         getdetails(){
            let _this=this;
            this.$doRequest("/api/membershipcard/details",{"pageLength":3,"pagination":this.pageIndex,"condition":{"patientid":this.detailId}},res=>{
                _this.tableData=res.rows;
                _this.pageSum=res.total;
            })

         }
     },
     mounted(){
         this.getdetails();
     }    
}
</script>
 
<style lang="less">
.heades{
    height:500px;
    .el-dialog--center .el-dialog__body {
        height:430px;
    }
    .el-dialog__header{
        padding: 0;
        width:100%;
        line-height:62px;
        background-color: rgba(241, 240, 245, 1);
        .el-dialog__headerbtn{
            top:0px;
        }
    }
    .el-form-item__label{
        display: block;
        width:86px;
        text-align: right;
    }
    .el-input{
        width:100%;
    }
    .el-form-item{
        display: flex;
        width:50%;
        float:left;
    }
    .el-form-item:nth-of-type(5){
        width:100%;
        .el-form-item__content{
            width:80%;
            .el-input{
                width:90%;
            }
        }
    }
}
.city{
    .el-form-item{
            display: flex;
            height:40px;
            width:180px;
            .el-form-item__label{
                width:50px;
                margin-right:1px;
                text-align: left;
                padding:0;
                text-indent: 3px;
            }
            .el-form-item__content{
                width:130px;
            }
        }
    .el-form-item:nth-of-type(1){
        margin-left:35px;
        .el-form-item__label{
            text-indent:8px;  
        }
    }
    .area{
        float:left;
        line-height: 40px;
        margin-left:3px;
    }
}
    .el-pagination{
        position:absolute ;
        bottom:30px;
        right:72px;
    }
    .buton{
        border:1px solid #ccc;
        width:70px;
        line-height:40px;
        text-align:center;
        border-radius: 5px;
        position:absolute ;
        bottom:30px;
        left:30px;

    }
.inpt{
    .el-input{
        width:78%;
        margin-left:84px;
    }
}
</style>