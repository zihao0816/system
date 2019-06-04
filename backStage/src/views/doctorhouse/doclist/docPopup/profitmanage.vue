<template>
    <div class="docProfit">
        <el-dialog title="收益管理" center  :visible="docProfitdialog"  @update:visible="v=>$emit('update:docProfitdialog',v)" width="60%">
            <div class="bottoms">请设置医生：{{profitlist.doctorname}}  的收益条件。</div>
            <el-form :inline="true" ref="formlist" :model="formlist" :rules="rules" class="demo-form-inline" >
            <div class="bottoms" style="height:40px;width:100%">
                    <span class="moneys">挂号费/问诊费</span>
                    <el-form-item label="设定费用区间" class="popmoney">
                        <el-select placeholder="活动区域" v-model="formlist.region">
                            <el-option label="初级" value="初级"></el-option>
                            <el-option label="中级" value="中级"></el-option>
                            <el-option label="高级" value="高级"></el-option>
                            <el-option label="特级" value="特级"></el-option>
                    </el-select>
                    </el-form-item>
                    <span class="middle">*</span>
                    <el-form-item prop="money">
                        <el-select  v-model="formlist.money">
                            <el-option label="20" value="20"></el-option>
                            <el-option label="30" value="30"></el-option>
                            <el-option label="60" value="60"></el-option>
                            <el-option label="80" value="80"></el-option>
                            <el-option label="100" value="100"></el-option>
                            <el-option label="200" value="200"></el-option>
                        </el-select>
                    </el-form-item>
                    <span class="color">*默认初级</span>
            </div>
            <div class="bottoms" style="height:40px;margin-bottom:20px;">
                    <span class="moneys">诊后服务费</span>
                    <el-form-item label="设定比例区间" prop="section">
                         <el-input v-model="formlist.section"></el-input>
                    </el-form-item>
                    <span>%</span>
                    <span style="margin:0 10px; ">至</span>
                    <el-form-item  prop="sectionall">
                        <el-input v-model="formlist.sectionall"></el-input>
                    </el-form-item>
                    <span>%</span>
                    <span class="color">*最大100%</span>
             
            </div>
            
            </el-form>
            <el-button @click="$emit('update:docProfitdialog',false)">取 消</el-button>
            <el-button type="primary" @click="preservation('formlist')">保 存</el-button>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:["docProfitdialog","profitlist","getpage","profit"],
    data(){
         var checkAge = (rule, value, callback) => {
            if (value/1>100) {
                return callback(new Error('最大100%'));
            }else if(value/1<this.formlist.section){
                callback(new Error('请注意填写区间'));
            }else if(typeof (value/1)!="number"){
                 callback(new Error('请填写数字'));
            }else{
                callback(); 
            }
        }
        var check= (rule, value, callback) => {
             if (value/1>100) {
                return callback(new Error('最大100%'));
            }else if(typeof (value/1)!="number"){
                 callback(new Error('请填写数字'));
            }else{
                callback(); 
            }
        }
        return {
            formlist:{
                money:'',
                region:'初级',
                section:'',
                sectionall:''
            },
            rules:{
                money:[{ required: true, message: '请输入金额', trigger: 'blur' }],
                section:[{ required: true, message: '请输入数字', trigger: 'blur' },{ validator: check, trigger: 'blur' }],
               sectionall:[{ required: true, message: '请输入数字', trigger: 'blur' },{ validator: checkAge, trigger: 'blur' }]
            }
        }  
    },
    methods:{
        preservation(formlist){
            let obj={
                "rank":this.formlist.region,     //等级
                "section":this.formlist.money,  //问诊费
                "sproportion":(this.formlist.section+""),   //最小区间
                "mproportion":(this.formlist.sectionall+""),  //最大区间
                "id": this.profitlist.id //医生id
            }
            let _this=this;
             this.$refs[formlist].validate((valid) => {
                 if (valid) {
                    this.$doRequest("/api/doctorinfo1.5.1/DoctorEarningsManage",obj,res=>{
                        _this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        _this.getpage();
                        _this.$emit('update:docProfitdialog',false);
                    })
                 }else{
                    _this.$message({
                        message: '请填写完整信息',
                        type: 'success'
                    }); 
                 }
                })
        }
    },
    created(){
        this.formlist.section=this.profit[0]/1||"";
        this.formlist.sectionall=this.profit[1]/1||"";
        this.formlist.money=this.profitlist.setprice?this.profitlist.setprice:"";
    }
   
    
}
</script>
<style lang="less">
  .docProfit{
      .el-dialog__header{
          background:#ccc;
      }
      .popmoney{
          .el-form-item__label:nth-of-type(1){
              text-indent: 4px;
          }
      }
      .el-form{
           .el-form-item__label{
              width:110px;
              text-align: left;
          }
            .middle{
                margin-left:16px;
                margin-right:16px;
                line-height: 40px;
            }
            .el-form-item{
                margin-right:0;
            }
            .moneys{
                display: inline-block;
                line-height: 40px;
                margin-right:20px;
                width:90px;
            }
            .color{
                color:red;
                margin-left:6px;
            }
            .el-form-item__label{
                line-height: 40px;
                height:40px;
            }
            .el-form-item__content{
                width:130px;
                .el-input__inner{
                    line-height:32px;
                    height:32px;
                }
            }
        }
        .el-button:nth-of-type(1){
            margin-left:30%;
        }
        .el-button:nth-of-type(2){
            margin-left:10%;
        }
        .bottoms{
            margin-bottom:10px;
            font-size: 14px;
        }
        .bottoms:nth-of-type(3){
            margin-bottom:30px;
        }

  }
</style>
  
