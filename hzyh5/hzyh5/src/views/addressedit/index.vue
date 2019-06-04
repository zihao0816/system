<template>
    <div class="addressEdit">
         <div class="addAddress" @click="addAddress" >
            <i class="el-icon-circle-plus-outline"></i>
            <span>新增收货地址</span>
        </div>

        <div class="delivery">
        </div> 
        <div class="editTontent" :style="addressTitle.length>0?'padding:18px 0 10px;':''">
            <div class="center_content" v-for="(item,index) in addressTitle" :key="index"> 
                <div class="content_left" @click="getcodes(item,2)">
                    <img src="../../assets/icon_dizhi.png" alt="">
                </div>
                <div class="content_center" @click="getcodes(item,2)">
                     <div>
                        <span> {{item.receiver}}</span>
                        <span>{{item.telephone }}</span>
                    </div>
                    <div>
                        <span>
                            <i v-if="item.isdefault==1">
                                <span>默认</span>
                            </i>
                            {{''+item.province+item.city+item.county+item.address}}
                        </span>
                    </div> 
                </div> 
                <div class="content_right">
                    <span @click="editClick(item)">编辑</span>
                </div> 
            </div>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
export default {
    data(){
        return {
             patientid: this.$store.state.userInfo.id,
             addressTitle:[],
        }
    },
    methods:{
        getcodes(items,type){
            this.$store.state.addressList=items;
            this.$router.push({path: '/myOrderDetailsYF',query:{id:this.$store.state.addressId,befrom: 'orderList',addressType:type,addressInfo:items}});
        },
        addAddress(){
            this.$router.push({path: '/address'});
        },
        getMyAddress(){
             let params = {
                    patientid: this.patientid
                };
            let _this=this;
            this.$doRequest("/api/patientaddressinfo/getListByKey", params, res=>{
                _this.addressTitle=res;
            })
        },
        editClick(item){
            this.$router.push({path: '/address',query:{id:item}});
        }

    },
    created(){
        document.title = '收货地址管理';
    },
    mounted(){
        this.getMyAddress();
    }
}
</script>
