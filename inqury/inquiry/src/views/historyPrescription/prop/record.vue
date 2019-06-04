<template>
<div class="record">
 <el-dialog title="就诊记录" center  :visible="dialogrecord"  @update:visible="v=>$emit('update:dialogrecord',v)" width="80%"> 
    <div class="alreadyTreated">
        <Row>
            <Col span="5">
               <div class="titles">就诊记录</div>
               <div class="scrollsss">
               <Card v-for="(item,index) in tablerecord" :key="index" style="width:100%;margin-bottom: 20px;padding:0" >
                    <div @click="getindex(index)">
                        <div>{{item.orderid}}</div>
                        <div>日期：{{$timestampToTime(item.createtime,1)}} </div>
                        <div class="textov">诊断：{{item.arguedisease}}{{item.arguedisease?'；':''}}{{item.doctorconclusion}}</div>
                    </div>
                </Card>
                </div> 
            </Col>
            <Col span="18" offset="1" >
               <div class="titles bor">处方单</div>
               <div class="tit">
                    <div class="line">
                        <span class="fontw">处方编号:</span>
                        <span>{{tablerecord[dex].id}}</span>
                    </div>
                    <div class="line">
                        <Row>
                            <Col span="8">
                                <span class="fontw">日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期:</span>
                                <span>{{$timestampToTime(tablerecord[dex].createtime,1)}}</span>
                            </Col>
                            <Col span="6" offset="1" >
                                <span class="fontw">科室:</span>
                                <span>{{tablerecord[dex].departmentname}}</span>
                            </Col>
                            <Col span="6" offset="1" >
                                <span class="fontw">医生:</span>
                                <span>{{tablerecord[dex].hisdoctorname}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div class="line">
                        <Row>
                            <Col span="8">
                                <span class="fontw">患者姓名:</span>
                                <span>{{tablerecord[dex].hispatientname}}</span>
                            </Col>
                            <Col span="6" offset="1" >
                                <span class="fontw">性别:</span>
                                <span>{{tablerecord[dex].hissex}}</span>
                            </Col>
                            <Col span="6" offset="1" >
                                <span class="fontw">年龄:</span>
                                <span>{{tablerecord[dex].hisage}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div class="line">
                        <Row>
                            <Col span="2">
                                <span class="fontw">诊&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;断:</span>
                            </Col>
                            <Col span="22">
                                <span style="margin-left:7px;">{{tablerecord[dex].doctorconclusion}}{{tablerecord[dex].doctorconclusion==""?"":";"}}{{tablerecord[dex].arguedisease}}</span>
                            </Col>
                        </Row>
                    </div>
                    <div class="line">
                        <span class="fontw">剂&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型:</span>
                        <span>{{tablerecord[dex].prescriptionshape}}</span>                                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{{tablerecord[dex].generationfry == 2?'代煎':''}}</span>
                    </div>
                    <div class="line">
                        <span class="fontw">医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;嘱:</span>
                        <span>{{tablerecord[dex].specialadvice}}</span>
                    </div>
               </div>
               <div style="font-size: 22px;font-weight: 600;">R：</div>
               <div>
                   <el-table :data="tablerecord[dex].recordRpVos" style="width:100%;" border >
                    <el-table-column type="index"  label="序号" width="60" align="center"></el-table-column>
                    <el-table-column label="药品/规格"  align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.medicinename+scope.row.dosage}}g</span>
                        </template>
                    </el-table-column>      
                    <el-table-column label="单价(元)" prop="price"  align="center"></el-table-column>  
                    <el-table-column label="金额(元)" prop="totalprice"  align="center"></el-table-column>  
                    <el-table-column label="备注" prop=""  align="center"></el-table-column>  
                </el-table>
               </div>
               <div  class="line">
                    <span class="fr">合计：{{tablerecord[dex].totalprice}}元</span>
                    <span class="fr">共{{tablerecord[dex].totaldosage}}剂</span>
               </div>
               <div>
                   <el-button @click="$emit('update:dialogrecord',false)">关 闭</el-button>
               </div>
            </Col>           
        </Row>
    </div>
    </el-dialog>
    </div>
</template>

<script>
    export default {
        props:["dialogrecord","historyrecord"], 
        data() {
            return {
                tablerecord:[],
                dex:0
            }
        },
        //生命周期之挂载完成
        methods: {
            getrecord(){
                let _this=this;
                var doctorids=this.historyrecord.doctorid;
                var patientids=this.historyrecord.patientid;
                var hospitaids=this.historyrecord.hospitaid;
                this.$doRequest("/api/DiagnosisPlan/record?doctorid="+doctorids+"&patientid="+patientids+"&clinicid="+hospitaids,null,res=>{
                    _this.tablerecord=res;
                })
            },
            getindex(index){
               this.dex= index;
            }
        },
        //生命周期之创建完成
        created: function(){
        },
        mounted(){
            this.getrecord();
        }
    }
</script>
<style lang="less">

    .record{
        .el-dialog{
            margin-left:16vw;
            @import "../../inquiringPrescriptions/index.less";
        }
    }
    .scrollsss{
       height:500px;
       overflow-x:hidden; 
    }
    .scrollsss{
        box-sizing: border-box;

        &::-webkit-scrollbar {width: 6px;background-color: #E7EAF0;}

        &::-webkit-scrollbar-thumb {border-radius: 3px;background-color: #e1e1e2;}

        &::-webkit-scrollbar-track {background-color: #fff;}

        &::-webkit-scrollbar-button {background-color: red;display: none;}
    }
    /deep/.ivu-card-bordered .ivu-card-body {
        padding:0;
    }
    .el-dialog{
        border-radius: 6px;
        .el-dialog__header{
             border-radius: 6px;
        }
    }
</style>