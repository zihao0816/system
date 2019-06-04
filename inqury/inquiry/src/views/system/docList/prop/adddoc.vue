<template>
    <div class="docheaders">
        <el-dialog title="添加医生" center :visible="dialogtable" @update:visible="v=>$emit('update:dialogtable',v)" width="40%">
            <el-form label-width="100px" style="float:left;" :model="ruleform" ref="ruleform" :rules="rules">
             <el-form-item label="医生手机号:" prop="phone"><el-input width="100%" v-model.number="ruleform.phone" style="margin-left:0;"></el-input></el-form-item> 
            </el-form>
            <el-button style="width:80px;float:left;background:#07A591;margin-bottom:21px;color:#fff;" @click="searchs">搜索</el-button> 
            <div class="destory" v-if="sechIndex?false:true">  
                <p>未搜索到结果！</p>
                <p>请确认所输入手机号已注册“好中医APP”，</p>
                <p>并完成个人资料/资质审核。</p>
            </div>
            <div v-if="sechIndex">
                <el-table border  :span-method="arraySpanMethod" :data="datalist">
                    <el-table-column  label="姓名" align="center">
                          <template slot-scope="scope">
                            {{scope.row.doctorname}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="telephone" label="手机号" align="center"></el-table-column>
                    <el-table-column prop="hospital" label="所属机构" align="center"></el-table-column>
                    <el-table-column prop="department" label="科室" align="center"></el-table-column>
                    <el-table-column prop="confirmstate" label="审核状态" align="center"></el-table-column>
                    <div></div>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer"> 
                <el-button @click="$emit('update:dialogtable',false)" style="margin-right:60px;">取 消</el-button>
                <el-button type="primary" @click="addDoclist()">确认添加</el-button>
            </div> 
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:["dialogtable","getPage"],
    data(){
        return {
            datalist:[{
                doctorname: " ",
            }],
            seccinner:"模拟搜索失败",
            sechIndex:true,
            doctorList:{},
            ruleform:{phone:""},
            rules:{
               phone:[{ required: true, message: "需输入医生本人登录'好中医APP'的注册手机号", trigger: 'blur' }]
            }
        }
    },
    methods:{
         arraySpanMethod({ row, column, rowIndex, columnIndex }) {
             if(rowIndex===1||rowIndex===2 ){                 
                      return [1,5];   
             }
         },
         searchs(){
            let _this=this;
             this.$doRequest("/api/diagnosisdoctor/findbyphone?phone="+this.ruleform.phone,null,function(res){
               if(res.doctorname){
                    _this.datalist.splice(0,1,res);
                    _this.sechIndex=true; 
               }else{
                    _this.sechIndex=false;
               }
            })
         },
         addDoclist(){
             let _this=this;
           var  params={
               hospitaidcode:this.datalist[0].hospitaidcode,
               departmentcode:this.datalist[0].departmentcode,
               dutiescode:this.datalist[0].dutiescode,
               doctorid:this.datalist[0].doctorid,
               doctorname:this.datalist[0].doctorname,
               telephone:this.datalist[0].telephone,
               hospital:this.datalist[0].hospital,
               sex:this.datalist[0].sex,
               headphoto:this.datalist[0].headphoto
           };
             this.$doRequest("/api/diagnosisdoctor/save",params,res=>{
                        _this.$emit('update:dialogtable',false)
                        _this.getPage();
             })
         }
    }
}
</script>

<style lang="less">
.docheaders{
     /deep/.el-button--primary{
        border-color: #07A591;
        background-color: #07A591;
    }
    /deep/.el-button{
        width:98px;
    }
    /deep/.el-button{
        border-color: #07A591;
        color:#07A591;
    }
    /deep/.el-button:nth-of-type(2){
        color:#fff;
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
    .el-form{
        margin-bottom:20px;
    }
    .el-form-item{
        width:400px;
        .el-form-item__content{
            margin-left:0!important;
            width:250px;
            float:left;
        }
        .el-form-item__label{
            float:left;
            margin-left:12px;
            width:100px;
        }
    }
    .el-input{
        width:100%;
    }
    .sech{
        float:left;
        text-decoration:underline;
        line-height:40px;
    }
    .destory{
        clear:both;
        height:100px;
        text-align:center;
        p{
            margin-bottom:10px;
        }
    }

}
</style>

