<template>
  <div class="im">
    <div class="page-py">
      <div>
        <div class="tabbars-py">
          <tab :line-width="2" active-color="#d74326">
            <tab-item :selected="tabIndex === item.src" v-for="(item,index) in tabMenu" :key="index" @on-item-click="tabChange(index,item.src)">{{item.name}}</tab-item>
          </tab>
        </div>
        <transition>
          <component v-bind:is="tabIndex"></component>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import immsg from "./imMsg/index";
import doctorDetails from "./../doctorDetails/index";
import caseList from "./../caseList/index";

export default {
  name: "im",
  created() {},
  data() {
    return {
      tabMenu: [
        {
          name: "医生详情",
          src: "doctorDetails"
        },
        {
          name: "线上问诊",
          src: "immsg"
        },
        {
          name: "我的病历",
          src: "caseList"
        }
      ],
      tabIndex: this.$store.state.tabIndex,
      state: 1
    };
  },
  mounted() {
    
  },
  components: {
    immsg,
    doctorDetails,
    caseList
  },
  methods: {
    tabChange(index, src) {
      for (var i = 0; i < this.tabMenu.length; i++) {
        this.tabIndex = this.tabMenu[index].src;
        this.$store.state.tabIndex = this.tabMenu[index].src;
        console.log(3,this.tabIndex);
      }
    }
  }
};
</script>
<style scoped>
@import 'index.css';
</style>



