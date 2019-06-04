<template>
    <div id="tabs">
        <div class="tabs">
            <span @click="tabslist(1)" :class="{check:tabs==1}">待就诊({{diagnosisWaitCount}} 人)</span>
             <Divider type="vertical" />
            <span @click="tabslist(2)" :class="{check:tabs==2}">已就诊({{diagnosisCount}} 人)</span>
        </div>
        <div v-if="tabs==1">
            <ul class="ftable">
                <li>
                    <span class="one">排队序号</span>
                    <Divider type="vertical" />
                    <span style="text-align:center;  display: inline-block;margin: auto;width: 65%;">患者信息</span>
                </li>
                <div class="lists">
                    <li v-for="(item,index) in diagnosisWaitList" :key="item.id" @click="infocheck(index,item)" :class="{checkinfo:checkinfo == index}">
                        <span class="one">{{item.numberorder}}</span>
                        <Divider type="vertical" />
                        <span class="two">{{item.patientname}}|{{item.patientage}}|{{item.patientsex==1?'男':'女'}}</span>
                    </li>
                </div>
            </ul>
        </div>
        <div v-if="tabs==2">
           <ul class="ftable">
                <li>
                    <span class="one">排队序号</span>
                    <Divider type="vertical" />
                    <span class="two">患者信息</span>
                </li>
                <div class="lists">
                    <li v-for="(item,index) in diagnosisAlreadyList" :key="item.id" @click="alreadyCheck(index,item)" :class="{checkinfo:alreadyIndex == index}">
                        <span class="one">{{item.numberorder}}</span>
                        <Divider type="vertical" />
                        <span class="two">{{item.patientname}}|{{item.patientage}}|{{item.patientsex==1?'男':'女'}}</span>
                    </li>
                </div>
            </ul>
        </div>
    </div>
</template>
<script>
  import { mapState, mapActions ,mapGetters, mapMutations } from 'vuex'
    export default {
         data() {
            return {
                 tabs:1,
                intervalId: 0,
                 list1:[
                 ],
                 //checkinfo:0,
                alreadyIndex:0
            }
        },
      computed: {
        ...mapState({
          diagnosisWaitCount:(state)=> state.outpatient.diagnosisWaitCount,//待就诊人数
          diagnosisCount:(state)=> state.outpatient.diagnosisCount,//已经就诊人数
          diagnosisWaitList:(state)=> state.outpatient.diagnosisWaitList,//待就诊列表
          diagnosisAlreadyList:(state)=> state.outpatient.diagnosisAlreadyList,//已经就诊列表
          checkinfo:(state)=>state.outpatient.selectedPatientIndex
        }),
      },
        //生命周期之挂载完成
        methods: {
          ...mapActions([
            'getLoginId','fetchOutpatientList','alreadyOutpatientList','findAlreadyPatientList'
          ]),
          ...mapMutations(['setCurrentPatient','setAlreadyPatient']),
           tabslist(indexs){
            this.tabs = indexs;
            switch (indexs) {
                case 1:
                    this.$router.push({path:'/inquiringPrescriptions'});
                    break;
                case 2:
                    this.$router.push({path:'/alreadyTreated'});
                    break;
            }
           },
           infocheck(index,item){
                //this.checkinfo = index;
                // sessionStorage.patientid =  item.patientid;
                // sessionStorage.doctorid = item.doctorid;
                this.setCurrentPatient({patient:item,index:index});
           },
            alreadyCheck(index,item) {
              this.alreadyIndex = index;
              this.setAlreadyPatient(item);
            }
        },
        //生命周期之创建完成
        created: async function(){
            //this.lets()
          let loginId = await this.getLoginId();
          this.fetchOutpatientList(loginId)
          this.alreadyOutpatientList(loginId);
          let that = this;
          this.intervalId = setInterval(() => {
              if (that.tabs == 1) {
                this.fetchOutpatientList(loginId);
              } else {
                this.alreadyOutpatientList(loginId);
              }
          }, 5000)
        },
      watch:{
        $route(to,from){
        }
      },
      beforeDestroy () {
        clearInterval(this.intervalId)
      }
    }
</script>
<style lang="less" scoped>
#tabs{
    width: 100%;
    .tabs{
        background: #F1F0F5 100%;
        line-height: 30px !important;
        span{
            display: inline-block;
            width: 45%;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
        }
        .check{
            color:#D74326 !important;
        }
    }
    .ftable{
        width: 100%;
        line-height: 30px;
        font-size: 14px;
        li:nth-child(2n){
            background: #F1F0F5 100%;
         }
        li{
            overflow: hidden;/*超出部分隐藏*/
            line-height: 30px;
            white-space: nowrap;/*不换行*/
            text-overflow:ellipsis;/*超出部分文字以...显示*/
            .one{
                text-align: center;
                display: inline-block;
                width: 30%;
            }
            .two{
                display: inline-block;
                text-align: left;
                margin: auto;
                width: 55%;
                padding-left:10% ;
            }
        }
    }
    .ivu-divider, .ivu-divider-vertical{
        margin: 0 !important;
    }
    .checkinfo{
        background: #07A591 100% !important;
        color:#fff;
    }
    .lists{
        height: 25vh;
        overflow-x: auto;
    }
    // .lists::-webkit-scrollbar{width:0px;}
    .lists {

     box-sizing: border-box;

     &::-webkit-scrollbar {width: 6px;background-color: #E7EAF0;}

     &::-webkit-scrollbar-thumb {border-radius: 3px;background-color: #e1e1e2;}

     &::-webkit-scrollbar-track {background-color: #fff;}

     &::-webkit-scrollbar-button {background-color: red;display: none;}

}
}
</style>
