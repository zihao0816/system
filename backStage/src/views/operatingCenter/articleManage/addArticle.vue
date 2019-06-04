<template>
    <div class="addOfficalArticle">
        <div>
          <navigation></navigation>
        </div>
      <div class="addArticle">
        <div class="return" @click="$router.push('/articleManage');">
          <img src="../../../assets/img/fhui@3x.png" alt=""/>
          <span>返回</span>
        </div>
        <el-form :model="articleForm" :rules="articleRules"  ref="articleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="类型" prop="articleType">
            <el-select v-model="articleForm.articleType" placeholder="请选择类型">
              <el-option label="文章" value="1"></el-option>
              <el-option label="主题介绍" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form :model="articles" :rules="articleRule" ref="articles" :inline="true" label-width="100px" class="demo-ruleForm">
            <el-form-item label="文章标题" prop="title">
              <el-input style="width:400px" maxlength="30" v-model="articles.title"  placeholder="请输入文章标题/主题标题">
                <span slot="suffix">{{articles.title.length>0?articles.title.length:0}}/30</span>
              </el-input>
            </el-form-item>
            <el-form-item label="权重" prop="weight" >
              <el-input v-model="articles.weight" class="articleWeight"></el-input>
              <span>* 整数，数字越大排序越靠前</span>
            </el-form-item>
          </el-form>
          <el-form-item label="副标题" prop="subhead">
            <el-input  type="textarea" :rows="2" style="width:400px" maxlength="100"  v-model="articleForm.subhead" placeholder="请输入文章副标题/主题副标题">
            </el-input>
          </el-form-item>
           <el-form-item label="推荐位置" prop="arrposid">
             <el-checkbox-group v-model="articleForm.arrposid">
              <el-checkbox label="首页重推"></el-checkbox>
              <el-checkbox label="首页大标题"></el-checkbox>
              <el-checkbox label="首页小标题"></el-checkbox>
              <el-checkbox label="列表热门排行" ></el-checkbox>
              <el-checkbox label="详情热门排行" ></el-checkbox>
              <el-checkbox label="主题文章" ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="封面" prop="articlePic">
            <el-upload
              class="upload-demo"
              drag
              ref="docupload"
              action="/api/FastDfs/upload"
              :on-success="imgSuccess"
              :headers="getheader"
              >
              <span class="picWidth">
                  <img v-if="articleForm.articlePic" :src="articleForm.articlePic" alt="">
              </span>
              <i v-if="!articleForm.articlePic" class="el-icon-upload"></i>
              <div v-if="!articleForm.articlePic" class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="封面底色" >
              <el-color-picker v-model="articleForm.piColor"></el-color-picker>
          </el-form-item>
          <el-form-item label="内容" class="articleEdit" prop="articleEdit">
            <quill-editor 
              v-model="articleForm.articleEdit" 
              ref="myQuillEditor" 
              :options="editorOption">
          </quill-editor>
          </el-form-item>
          <el-form-item label="标签描述" prop="describe">
              <el-input style="width:500px" maxlength="30"  v-model="articleForm.describe">
                <span slot="suffix">{{articleForm.describe.length>0?articleForm.describe.length:0}}/30</span>
              </el-input>
          </el-form-item> 
          <el-form-item class="articleBtn">
            <el-button type="primary" @click="submitForm('articleForm','articles')">正式发布</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        title="发布确认"
        :visible.sync="centerDialogVisible"
        width="25%"
        center>
        <p>即将发布:{{articles.title}}</p>
        <p>推荐位置:{{articleForm.arrposid.join(',')}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button :loading="articleLoading" type="primary" @click="confirmClick" >确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import addArticle from './addArticle'
import navigation from "../../../components/common/navigation";
import { quillEditor } from 'vue-quill-editor'
export default {
  data(){
    
    return {
      dayTimes:new Date(),
      centerDialogVisible:false,
      editorOption:{},
      articleLoading:false,
      getheader:{sessionId:sessionStorage.getItem("sessionId")},
      articleForm:{
        articleType:'',
        subhead:'',
        arrposid:[],
        describe:'',
        articleEdit:null,
        piColor:'',
        articlePic:'',
      },
      articles:{
         title:'',
        weight:'',
      },
      articleRules:{
        articleType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        arrposid: [{ required: true, message: '请选择推荐位置', trigger: 'blur' }],
        describe: [{ required: true, message: '请填写文章标签描述', trigger: 'change' }],
        subhead: [{ required: true, message: '请填写文章副标题', trigger: 'blur' }],
        articleEdit: [{ required: true, message: '请填写文章内容', trigger: 'blur' }],
        articlePic: [{ required: true, message: '请填加封面', trigger: 'blur' }],
      },
      articleRule:{
        title: [{ required: true, message: '请填写文章标题', trigger: 'blur' }],
        // weight: [{ validator: checkAge, trigger: 'blur' }],
      },
      picUrl:'',
      creatime:'',
      isstick:'',
      isshow:'',
      validType:''
    }
  },
  methods:{
    imgSuccess(res, file, fileList){
      this.articleForm.articlePic=res[0].fileUrl;
      this.picUrl=res[0].fileUrl;
    },
    submitForm(articleForm,articles){
      let nums=/^-?[1-9]\d*$/;
      if(!nums.test(this.articles.weight)&&this.articles.weight!=''){
          this.$message({
                message: '权重为整数',
                type: 'success'
              });
              return;
      }
      let _this=this;
      this.$refs[articleForm].validate((valid) => {
        if(valid){
          this.validType=1;
        }
      })
       _this.$refs[articles].validate((valid) => {
          if(this.validType&&valid){
            _this.centerDialogVisible=true;
          }
       });
    },
    confirmClick(){
        this.articleLoading=true;
        let _this=this; 
        let obj={
         title:this.articles.title,
         subtitle:this.articleForm.subhead,
         classify:this.articleForm.arrposid.join(','),
         type:this.articleForm.articleType,
         weight:this.articles.weight,
         context:this.articleForm.articleEdit,
         coverurl:this.picUrl,
         label:this.articleForm.describe,
         covercolour:this.articleForm.piColor
        };
        if(this.$route.query.articleType==1){
          this.$doRequest("/api/article/insertSrticle",obj,res=>{
            _this.articleLoading=false;
            _this.centerDialogVisible = false;
            _this.$emit("update:articleType",false);
            _this.$router.push('/articleManage');
          })
        }else if(this.$route.query.articleType==2){
          obj.id=this.$route.query.articleList.id;
            this.$doRequest("/api/article/upArticle",obj,res=>{
            _this.articleLoading=false;
            _this.centerDialogVisible = false;
            _this.$emit("update:articleType",false);
            _this.$router.push('/articleManage');
              _this.$message({
                message: '发布成功',
                type: 'success'
              });
          })
        }
    }
  },
  created(){
    if(this.$route.query.articleType===2){
      this.articles.title=this.$route.query.articleList.title||'';
      this.articleForm.subhead=this.$route.query.articleList.subtitle;
      this.articleForm.arrposid=this.$route.query.articleList.classify.split(',');
      this.articleForm.articleType=this.$route.query.articleList.type;
      this.articles.weight=this.$route.query.articleList.weight;
      this.articleForm.articleEdit=this.$route.query.articleList.context;
      this.picUrl=this.$route.query.articleList.coverurl;
      this.articleForm.articlePic="http://www.51bjhzy.com/"+this.$route.query.articleList.coverurl;
      this.articleForm.describe=this.$route.query.articleList.label;
      this.state=this.$route.query.articleList.state;
      this.isstick=this.$route.query.articleList.isstick;
      this.isshow=this.$route.query.articleList.isshow;
      this.articleForm.piColor=this.$route.query.articleList.covercolour;
    }
    
  },
  components:{
    navigation
  }
}
</script>
<style lang="less">
.addOfficalArticle{
   padding:20px;
    padding-bottom:0;
    box-sizing: border-box;
    overflow-y: auto;
    display: block;
    
  .addArticle{
    margin-top: 15px;
    background:#FFF;
    width:100%;
    padding:20px 0;
    position: relative;
    .return{
      position: absolute;
      top:-30px;
      right:0;
      cursor: pointer;
      img{
          float:left;
          width:20px;
          height:20px;
          margin-right:10px;
      }
    }
    .el-input{
      width:auto;
    }
    .articleEdit{
      .el-form-item__content{
        .ql-container{
           min-height: 300px;
           overflow: hidden;
        }
      }
    }
    .articleBtn{
      text-align: center;
    }
    .el-dialog__body{
      p{
        font-size: 16px;
        padding:10px;
      }
    }
    .el-upload-list--text{
      display: none;
    }

    .upload-demo .picWidth{
      width:100%;
      height:100%;
      overflow: hidden;
      img{
        max-width: 100%;
        max-height: 100%;
        height:auto;
        width:auto;
      }
    }
  }
}
</style>
