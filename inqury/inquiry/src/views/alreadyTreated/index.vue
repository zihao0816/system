<template>
    <div class="alreadyTreated">
      <treated :doctorid="doctorid" :patientid="patientid"></treated>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
  import { mapState, mapActions ,mapGetters, mapMutations } from 'vuex'
  import treated from "@/views/alreadyTreated/treated"//添加医生弹窗
  import common from '@/api/common';
    export default {
       components: {
         treated
        },
        data() {
            return {
              patientOrder:{},
              order:{},
              doctorid:'',
              patientid:''
            }
        },
      computed: {
        ...mapGetters([]),
        ...mapState({
          alreadyPatientList:(state)=>state.outpatient.alreadyPatientList,
          alreadyPatient:(state)=>state.outpatient.alreadyPatient
        })
      },
      watch: {
        alreadyPatient:function(value) {
            this.doctorid = value.doctorid;
            this.patientid = value.patientid;
        }
      },
        //生命周期之挂载完成
        methods: {
          ...mapActions([
            'findAlreadyPatientList'
          ])
        },
        //生命周期之创建完成
        created: function(){
        },
    }
</script>

