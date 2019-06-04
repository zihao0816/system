<template>
    <div class="app">
        <router-view v-if="ishahaha==''"/>
        <Login v-if="ishahaha==''"></Login> 
        <Layout v-if="ishahaha!==''">
            <Header :style="{position: 'fixed', width: '100%' ,height: '10vh',background:'#232340'}">
                <tit></tit>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{position: 'fixed', height: '90vh', minWidth: '14.5vw',width: '14.5vw',maxWidth: '14vw', left: 0, overflow: 'auto',margin:'10vh 0 0 0',background:'#232340'}">
                  <siderpage></siderpage>
                </Sider>
               <Content :style="{height: '89.5vh',width:'80vw', left: 0, overflow: 'auto',margin:'10vh 0 0 14.5vw'}">
                    <Card  dis-hover :bordered="false" :style="{ position: 'relative',height: '99.9%',width:'99.9%', left: 0, overflow: 'hidden', overflowY: 'auto',margin:'auto',borderRadius:'5px'}">
                        <router-view/>
                        <div class="footers">
                            技术支持@北京好中医医疗信息有限公司版权所有    电话:400-666-0101
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import siderpage from '@/components/siderpage';
import tit from "./components/headers";
import Login from "./views/login/index";
    export default {
        name: 'App',
        components: {
            siderpage,
            tit,
            Login
        }, 
        data() {
            return {
               isShow:false,
               isRouter:true,
               parameters:"" ,
               ishahaha:''
            }
        },
        watch:{
            '$store.state.session': function () {
                this.ishahaha= sessionStorage.getItem('session');
             }
        },
        //生命周期之创建完成
        created: function(){
            if(sessionStorage.getItem('session')==null){
                this.ishahaha="";
            }else{
                this.ishahaha = sessionStorage.getItem('session');
            }
        },
        //生命周期之挂载完成
        methods: {
            // isLogin(){
            //     this.isShow=true;
            //     this.isRouter=false;
            // } 
        },
        mounted(){
            // var time = setInterval(()=>{
                
            // },10)
            // if(this.ishahaha != ''){
            //     clearInterval(time)
            // }
        }
    }
</script>
<style  scoped>
.app{
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.ivu-modal-header{
    background: #f1f0f5 !important;
}
.footers{
    width: 85.5vw;
    text-align: center;
    font-size: 12px;
    line-height: 30px;
    height: 30px;
    background: #E7E6EB;
    position:fixed;
    bottom:0;
    right: 0;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin-right: 20px;
}
.ivu-card{
    position:initial;
}
.ivu-layout-header{
    padding:0;
}
 .ivu-poptip-popper{
    /* color:red; */
}
.v-modal{
    opacity:.5;
    background:#000;
}
/* number格式下输入框背景 */
input{
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
    -webkit-appearance: none;
    outline: none !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"] {
    -moz-appearance: textfield;
}


.ivu-btn:hover {
    color: #07a591;
    background-color: #fff;
    border-color: #07a591;
}
</style>