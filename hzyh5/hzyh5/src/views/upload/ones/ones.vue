<template>
  <div class="ones">
    <div class="page-py">
      <ul class="list-py">
        <li class="list-item-py" v-for="(item,index) in inquiry.reorderinquiryquestion" :key="index">
          <p>{{index+1}}.{{item.questionname}}（{{item.singleselection==1?'单选':'多选'}}）</p>
          <ul class="answerList-py">
            <li class="answer-item-py" v-for="(items,index) in item.orderinquiryoptions" :key="index">【{{items.anwser}}】</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inquiry: {},
      orderId: ""
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.query();
  },
  methods: {
    query() {
      var _this = this;
      var data = {
        orderID: this.orderId,
        isInterrogationsingle: 1,
        ischecked: 1
      };
      this.$doRequest("/api/Inquiry/orderDetails", data, res => {
        _this.inquiry = res;
      });
    }
  }
};
</script>
<style>
li {
  list-style: none;
}
.list-py {
  padding: 0 10px 20px;
}
.list-item-py {
  background: #ffffff;
  margin-top: 10px;
  border-radius: 8px;
  padding: 16px 15px;
}
.list-item-py p {
  margin-bottom: 16px;
}
.answerList-py {
  background: #f8f8f8;
}
.answerList-py li {
  display: inline-block;
}
.answer-item-py {
  padding: 10px 0;
}
</style>