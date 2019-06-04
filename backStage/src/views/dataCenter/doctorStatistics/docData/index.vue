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
        <div class="dataList">
            <span>患者支付总额（元）<i>888</i></span>
            <span class="spanColor">医生问诊总数（次）<i>666</i></span>
            <span class="lastMargin">医生开方总数（次）<i>888</i></span>
            <span>医生提成总额（元）<i>888</i></span>
            <span class="spanColor">平台收益总额（元）<i>888</i></span>
            <span class="lastMargin">当前医生待提现总额（元）<i>888</i></span>
        </div>
        <div class="docSearch">
            <p>
                <i>排序方式</i>
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
                <el-table-column label="医院" prop=""  align="center" ></el-table-column>  
                <el-table-column label="职称" prop=""  align="center" ></el-table-column>
                <el-table-column label="累计问诊次数"   align="center">
                    <template slot-scope="scope">
                        <a href="javaScript:;"></a>
                    </template>
                </el-table-column>
                <el-table-column label="累计开方次数" prop=""  align="center"></el-table-column>      
                <el-table-column label="累计患者支付金额" prop="" align="center"></el-table-column>  
                <el-table-column label="累计医生提成总额" prop=""  align="center" ></el-table-column>  
                <el-table-column label="累计平台收益总额" prop=""  align="center" ></el-table-column>
                <el-table-column label="当前医生待提现总额"  fixed="right"  align="center"></el-table-column>
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
                value: '按问诊次数',
                label: '按问诊次数'
                }, {
                value: '按开方次数',
                label: '按开方次数'
                }, {
                value: '按支付金额',
                label: '按支付金额'
                }, {
                value: '按医生待提现金额',
                label: '按医生待提现金额'
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

<style lang="less">
@import 'index.less';
</style>