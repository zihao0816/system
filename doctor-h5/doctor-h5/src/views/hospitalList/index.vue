<template>
    <div class="hospitalList">
        <header>
            <i></i>
            <form action="javascript:return true;">
                <input type="text" placeholder="搜索机构" @keypress="search()" v-model="parameters">
            </form>
        </header>
        <div class="center">
            <!-- <p>A</p> -->
            <ul>
                <li v-for="(item,index) in hospitainfoName" :key="index" @click="selectName(item.id,item.hospitaname)">{{ item.hospitaname}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            //登录信息暂存
            doctorname: this.$route.query.doctorname || '',
            telephone: this.$route.query.telephone || '',
            phoneCode: this.$route.query.phoneCode || '',
            site: this.$route.query.site || [],
            hospitaid: this.$route.query.site || '',
            parameters: '',
            hospitainfoName: []
        }
    },
    //挂载完成
    methods: {
        getListByKey(){
            let params = {
                parameters: this.parameters
            };
            this.$doRequest("/api/AppHomePage/getHospitainfoName", params,res => {
                this.hospitainfoName = res.mapre;
            });
        },
        selectName(id,name){
            this.$router.push({path: '/login', query: {
                        doctorname: this.doctorname,
                        telephone: this.telephone,
                        phoneCode: this.phoneCode,
                        site: this.site,
                        hospitainfoName: name,
                        hospitaid: id}
                    });
        },
        search(){
            this.getListByKey();
        }
    },
    //生命周期之创建完成
    created: function() {
        this.getListByKey();
        document.title = '医疗机构';
    }
}
</script>
<style lang="less">
.hospitalList{
    width: 100%;
    background: #fff;
    header{
        width: 100%;
        height: 50px;
        background: #fff;
        padding: 6px 0;
        position: relative;
        i{
            width: 16px;
            height: 16px;
            position: absolute;
            left: 7%;
            top: 17px;
            background: url(../../assets/Search@3x.png);
            background-size: 100%;
        }
        input{
            width: 90%;
            height: 38px;
            line-height: 38px;
            background: #f1f1f2;
            font-size: 16px;
            padding-left: 30px;
            display: block;
            margin: 0 auto;
            border-radius: 4px;
            color: #818181;
            font-weight: 200;
        }
    }
    .center{
        p{
            width: 100%;
            height: 22px;
            background: #f1f0f5;
            font-size: 12px;
            line-height: 22px;
            padding-left: 20px;
        }
        ul{
            // padding: 0 20px;
            li{
                padding: 0 20px;
                height: 54px;
                line-height: 54px;
                border-bottom: 1px solid #f1f0f5;
            }
        }
    }
}
</style>