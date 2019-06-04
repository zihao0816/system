<template>
    <div class="payimg">
        <div class="page">
            <div class="top">
                <img src="../../../assets/buy/yishoukuan@3x.png" width="20" alt="">
                <span>二维码付款</span>
            </div>
            <div class="content">
                <p>长按图片识别二维码</p>
                <img :src="imgUrl" alt="">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            imgUrl: this.$route.query.img
        }
    },
    created(){
        document.title = '二维码付款';
    }
}
</script>
<style lang="less" scoped>
    .payimg{
        height: 100%;
        background: #DFB741;
        overflow: hidden;
        .page{
            margin: 20px 10px 0;
            .top{
                padding: 20px 15px;
                background: #F7F7F7;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                img{
                    vertical-align: middle;
                }
                span{
                    vertical-align: middle;
                    color: #DFB741;
                    margin-left: 10px;
                }
            }
            .content{
                background: #FEFFFF;
                padding-bottom: 120px;
                border-bottom-left-radius: 4px;
                border-bottom-right-radius: 4px;
                text-align: center;
                p{
                    color: #585858;
                    padding: 40px 0 30px;
                }
                img{
                    width: 175px;
                }
            }
        }
    }
</style>
