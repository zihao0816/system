<template>
    <div class="tickling">
        <el-input
            type="textarea"
            :rows="2"
            placeholder="请填写您的问题"
            v-model="content"
            @change="isEmpty(content)"
            :class="isempty ? 'empty': ''">
        </el-input>
        <el-button @click="submitTick">发送</el-button>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                id: this.$store.state.userInfo.id,
                usertype: 1,
                content: '',
                isempty: false
            }
        },
        methods: {
            isEmpty(content){
                if(content){
                    this.isempty = false;
                }else{
                    this.isEmpty = true;
                }
            },
            submitTick(){
                if(this.content == ''){
                    this.isempty = true;
                    this.$toastMsg('请填写您的问题');
                    return;
                }
                let params = {
                  person: this.$store.state.userInfo.id,
                    usertype: 1,
                    content: this.content
                };
                this.$doRequest("/api/feedbackinfo/insertSelective", params,res => {
                  this.$toastMsg('反馈成功');
                  this.$router.back(-1);
                })
            }
        },
        //生命周期之创建完成
        created: function(){
            this.$isLogin(window.location.search.substr(1));
            document.title = '问题反馈';
        },
    }
</script>
<style lang="less">
    .tickling{
        padding: 16px 20px 40px;
        background: #fff;
        .el-textarea__inner{
            border: 1px solid #F1F0F5;
            padding: 10px;
            height: 200px;
            margin-bottom: 22px;
        }
        .el-button{
            width: 100%;
            height: 40px;
            background: #D74326;
            line-height: 40px;
            color: #fff;
            text-align: center;
            padding: 0;
        }
        .empty{
            textarea{
                border: #D74326 1px solid;
            }
        }
    }

</style>
