<template>
    <div class="tickling">
    </div>
</template>
<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
        },
        //生命周期之创建完成
        created: function(){
          this.$router.go(-1);
        },
    }
</script>

