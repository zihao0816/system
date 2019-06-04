<template>
  <div class="articleManage">
    <div>
      <navigation></navigation>
    </div>
    <div class="articleContent">
      <div  class="articeTable">
        <div class="content">
          <div class="add">
              <el-form :inline="true"  class="demo-form-inline">
                 <el-form-item>
                    <el-button type="primary" @click="addEssay(1)">+ 添加文章</el-button>
                </el-form-item>
                <el-form-item label="类别:">
                    <el-select v-model="articlesTitle" placeholder="请选择类型">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="文章" value="1"></el-option>
                      <el-option label="主题介绍" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="推荐位置:">
                    <el-select v-model="articlesPosition" placeholder="请选择类型">
                      <el-option label="全部" value=""></el-option>
                      <el-option label="首页重推" value="首页重推"></el-option>
                      <el-option label="首页大标题" value="首页大标题"></el-option>
                      <el-option label="首页小标题" value="首页小标题"></el-option>
                      <el-option label="列表热门排行" value="列表热门排行"></el-option>
                      <el-option label="详情热门排行" value="详情热门排行"></el-option>
                      <el-option label="主题文章" value="主题文章"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章标题:">
                    <el-input v-model="title" placeholder="请输入文章标题" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜素</el-button>
                </el-form-item>
              </el-form>
          </div>
          <!-- 表格 -->
          <div class="tables" style="margin:30px 0px">
            <el-table border :data="storageData"  highlight-current-row>
              <el-table-column prop="type" label="类型" align="center" >
                <template slot-scope="scope" class="operation">
                  <span>{{scope.row.type==1?'文章':'主题介绍'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="标题" align="center" ></el-table-column>
              <el-table-column prop="classify" label="推荐位置" align="center" ></el-table-column>
              <el-table-column label="显示" align="center" >
                <template slot-scope="scope">
                  <el-switch @change="getShows(scope.row)" active-value='1' inactive-value='2' v-model="scope.row.isshow" active-color="#07a591" inactive-color="#C0CCDA"></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="发布时间" align="center" >
                <template slot-scope="scope">
                   <span>{{$common.timestampToTime(scope.row.updatetime,1)}}</span>
                </template>    
              </el-table-column>
              <el-table-column prop="weight" label="权重" align="center" ></el-table-column>
              <el-table-column label="操作"  align="center" class="operation">
                <template slot-scope="scope" class="operation">
                  <el-button type="text" size="small" @click="addEssay(2,scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteArticle(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="block" style="float:right;">
            <el-pagination
            @current-change="search"
            :current-page.sync="pageIndex"
            layout="total, prev, pager, next"
            :page-count="pageSum">
            </el-pagination>
          </div>
          <el-dialog
            title="提示"
            :visible.sync="DialogVisible"
            width="30%"
            center>
            <span >您确定要删除标题为{{deleteList.title}}文章吗?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="DialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="deleteClick">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import addArticle from "./addArticle";
import navigation from "../../../components/common/navigation";
export default {
  data() {
    return {
      DialogVisible:false,
      deleteList:{},
      articleType: false,
      origin: "",
      classify: this.classify,
      originArr:[],
      input: '',
      articleShow:'',
      articleList:{},
      title: '',
      articlesTitle:'',
      // 分页数据
      storageData: [],
      pageIndex: 1, //页数
      pageSum: 1 ,//条数
     articlesPosition:'',
    };
  },
  methods: {
    getShows(items){
     let _this=this;
      this.$doRequest("/api/article/upArticle", {id:items.id,isshow:items.isshow}, res => {
        _this.search();
      });
    },
    deleteClick(){
      let _this=this;
      this.$doRequest("/api/article/upArticle", {id:this.deleteList.id,state:2}, res => {
        _this.search();
        _this.$message({
            message: '删除成功',
            type: 'success'
        });
        _this.DialogVisible=false;
      });
    },
    deleteArticle(items){
      this.deleteList=items; 
      this.DialogVisible=true;

    },
    // 搜索
    search() {
      let params = {
        pageLength: 10,
        pagination: this.pageIndex,
        condition: {
          type:this.articlesTitle,
          title: this.title,
          classify:this.articlesPosition
        }
      };
      let _this = this;
      this.$doRequest("/api/article/queryTheArticle", params, res => {
        _this.storageData  = res.pageVal;
        _this.pageSum = res.pageCount/1;
      });
    },
    // 添加文章
    addEssay(index,item) {
        this.$router.push({path:'/addArticle',query:{articleType:index,articleList:item}});
    },
  },
  components: {
    // addArticle,
    navigation
  },
  mounted() {
    this.search();   
  }
};
</script>
<style lang="less">
@import "index.less";
</style>
