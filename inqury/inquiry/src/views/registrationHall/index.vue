<template>
    <div class="registrationHall">
        <Row style="margin-top:20vh;">
            <Col span="7" offset="4">
                <Card style="border-radius:38px">
                    <div  @click="gotoinfo(1)" style="margin:2px;">
                        <div align="center">
                            <img class="titi" src="../../assets/wzgh_icon@3x.png" alt="">
                        </div>
                        <div align="center" class="titw" style="margin-top:20px;">问诊挂号</div>
                    </div>
                </Card>
            </Col>
            <Col span="7" offset="2" >
                <Card style="border-radius:38px">
                    <div  @click="gotoinfo(2)"  style="margin:2px;">
                        <div>
                            <div align="center" >
                                <img class="titi" src="../../assets/llkd_icon@3x.png" alt="">
                            </div>
                            <div align="center" class="titw" style="margin-top:20px;">理疗开单</div>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
    export default {
       components: {

        },
        data() {
            return {
            }
        },
        //生命周期之挂载完成
        methods: {
            gotoinfo(indexs){
                switch (indexs) {
                    case 1://registered
                        //inquiry
                        this.$router.push({path:'/inquiry'});
                        break;
                    case 2:
                        this.$router.push({path:'/therapy'});
                        break;
                }
           },
        },
        //生命周期之创建完成
        created: function(){
        },
    }
</script>

