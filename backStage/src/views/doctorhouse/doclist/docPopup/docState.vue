<template>
    <div class="docstate">
        <el-dialog title="显示状态" center  :visible="docstatedialog"  @update:visible="v=>$emit('update:docstatedialog',v)" width="60%">
            <el-form :model="formdata">
                <div class="bottoms">请设置医生：{{docstate.doctorname}}  的显示状态。</div>
                <div class="bottoms">
                    <el-form-item >
                            <el-checkbox-group v-model="formdata.displays1">
                            <el-checkbox label="官网显示" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="显示顺序:">
                            <el-input v-model="formdata.order1"></el-input>
                        </el-form-item> 
                        <span class="edior">默认为当前队列最后一位，可修改。</span> 
                </div>
                <div class="bottoms">
                    <el-form-item >
                            <el-checkbox-group v-model="formdata.displays2">
                            <el-checkbox label="公众号显示" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="显示顺序:">
                            <el-input v-model="formdata.order2"></el-input>
                        </el-form-item> 
                        <span class="edior">默认为当前队列最后一位，可修改。</span>
                </div>
                <div class="bottoms">
                    保存设置时，如顺序序号与当前队列冲突，则替换冲突对象，队列依次刷新。例如：张医生当前队列序号20，李医生插入设置为20，则张医生序号变为21，依次类推。
                </div>
                <div class="buttons">
                    <el-button @click="$emit('update:docstatedialog',false)">取 消</el-button>
                    <el-button type="primary" @click="addClick">保 存</el-button>
                </div>
            </el-form>  
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:["docstatedialog","docstate","getpage"],
    data(){
        return {
            formdata:{
                displays1:[],
                order1:'',
                displays2:[],
                order2:'',
            }
        }
    },
    methods:{
        addClick(){
            console.log(11111,this.formdata.displays1);
            let _this=this;
            console.log();
            let obj={
                "id":this.docstate.id, //医生id
                "websitestate":this.formdata.displays1==true?"1":"2",   //官网显示状态   1显示2不现实
                "websiteranking":this.formdata.order1,  // 官网顺序
                "docstate":this.formdata.displays2==true?"1":"2",      //小程序显示状态1显示2不现实
                "ordernum":this.formdata.order2
            }
            this.$doRequest("api/doctorinfo1.5.1/UpShowset",obj,res=>{
                     _this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    _this.getpage();
                    _this.$emit('update:docstatedialog',false);
            })
        }
    },
    mounted(){
        this.formdata.displays1=this.docstate.websitestate==1?true:false;
        this.formdata.displays2=this.docstate.docstate==1?true:false;
        this.formdata.order1=this.docstate.websiteranking?this.docstate.websiteranking:"";
        this.formdata.order2=this.docstate.ordernum?this.docstate.ordernum:"";
    }
    
}
</script>
<style lang="less">
  .docstate{
      .el-dialog--center .el-dialog__body{
          padding-top:0;
      }
      .el-dialog__header{
          background:#ccc;
      }
      .bottoms{
            width:100%;
            height:40px;
            line-height: 40px;
            float:left;
            margin-bottom:10px;
            font-size: 14px;
          .edior{
              margin-left:26px;
              font-size: 14px;
          }
      }
      .bottoms:nth-of-type(4){
          height:30px;
          line-height: 30px;
          margin-bottom:40px;
          color:red;
      }
      .el-form-item{
          float:left;
          margin-left:18px;
          .el-form-item__content{
              float:left;
              width:60%;
              line-height: 40px;
              width:106px;
              .el-checkbox{
                  width:94px;
              }
              .el-input__inner{
                  height:30px;
                  width:100%;
              }
          }
      }
      .el-button:nth-of-type(1){
         margin-left:30%;  
         margin-right:5%;
            
           
           
      }
      .buttons{
          margin-top:30px;
         
      }

  }
</style>