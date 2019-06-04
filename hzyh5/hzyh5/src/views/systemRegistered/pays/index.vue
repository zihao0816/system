<template>
    <div class="pays">
        <button @click="pay">支付</button>
    </div>
</template>
<script>
export default {
    created(){
        this.pay();
    },
    methods:{
        pay(){
            var url = this.$store.state.url;
            location.href = url + '&redirect_url=http://hzyh5.51bjhzy.com/systemRegistered/payResult';
            sessionStorage.setItem('doctorid',this.$store.state.doctorId);
            sessionStorage.setItem('hospitainid',this.$store.state.clinicId);
            sessionStorage.setItem('patientid',this.$route.query.patientid)
        }
    }
}
</script>
<style lang="less" scoped>

</style>
