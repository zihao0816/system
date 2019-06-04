<template>
    <div class="docData">
         <p class="dealTime daystimes">
            <span class="fontsleft">统计周期:</span>
            <el-date-picker
                v-model="times"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </p> 
        <div class="dataList docQualification">
            <span>已资质认证医生总数<i>888</i></span>
            <span class="spanColor">未资质认证医生总数<i>666</i></span>
            <span>已多点执业认证医生总数<i>888</i></span>
            <span class="lastMargin spanColor">未多点执业认证医生总数<i>888</i></span>
        </div>
        <div class="docSearch">
            <p>
                <i>认证</i>
                <el-select v-model="docNnmber" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </p>
            <p>
                <i>科室</i>
                <el-select v-model="docNnmber" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </p>
            <p>
                <i>医院</i>
                <el-select v-model="docNnmber" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </p>
            <p>
                <i>医院</i>
                <el-select v-model="docNnmber" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </p>
            <p>
                <i>职称</i>
                <el-select v-model="docNnmber" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </p>
            <p><i>医生姓名</i><input type="text" class="tet" v-model="docName" /></p>
            <p><el-button type="primary">搜索</el-button></p>
        </div>
        <div class="dataTable">
            <el-table  style="width:100%;" border  highlight-current-row>
                <el-table-column label="医生姓名" prop=""  align="center"></el-table-column>      
                <el-table-column label="科室" prop="" align="center"></el-table-column>  
                <el-table-column label="机构" prop=""  align="center" ></el-table-column>  
                <el-table-column label="职称" prop=""  align="center" ></el-table-column> 
                <el-table-column label="资质认证" prop=""  align="center" ></el-table-column>
                <el-table-column label="多点执业认证"    align="center"></el-table-column>
                <el-table-column label="操作"   align="center">
                <template slot-scope="scope">
                    <el-button  type="text" size="small" @click="handleClick(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
            </el-table>
        </div>
        <div class="block" style="float:right;font-size：16px;">
            <el-pagination
            @current-change="getpage"
            :current-page.sync="pageIndex"
            layout="total, prev, pager, next"
            :page-count="pageSum">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            pageIndex:1,
            pageSum:1,
            times:'',
            options: [{
                value: '',
                label: '全部'
                }, {
                value: '已资质认证',
                label: '已资质认证'
                }, {
                value: '未资质认证',
                label: '未资质认证'
                }, {
                value: '已多点执业认证',
                label: '已多点执业认证'
                },
                 {
                value: '未多点执业认证',
                label: '未多点执业认证'
            }],
            
            docNnmber:'',
            docName:'',
            tableData:[]
        }
    },
    methods:{
        getpage(){
            
        }
    }
}
</script>

