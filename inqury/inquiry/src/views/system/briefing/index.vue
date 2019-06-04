<template>
    <div class="briefingtop">
       <ul class="briefing">
           <li><span>{{briefiList.orderTodayCount}}</span><i>今日问诊开方量</i></li>
           <li><span>{{briefiList.orderTodaySum}}</span><i>今日问诊开方金额</i></li>
           <li><span>{{briefiList.phyTodayCount}}</span><i>今日理疗开方量</i></li>
           <li><span>{{briefiList.phyTodaySum}}</span><i>今日理疗开方金额</i></li>
           <li><span>{{briefiList.orderWeekCount}}</span><i>本周问诊开方量</i></li>
           <li><span>{{briefiList.phyWeekCount}}</span><i>本周理疗开方量</i></li>
           <li><span>{{briefiList.orderMonthCount}}</span><i>本月问诊开方量</i></li>
           <li><span>{{briefiList.phyMonthCount}}</span><i>本月理疗开方量</i></li>
       </ul>
       <!-- <div class="echarts">
           <div class="echartstop">
               <p>
                    <el-select v-model="optionsvalue"  placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </p>
                <p>
                    <el-select v-model="dayvalue"  placeholder="请选择">
                        <el-option
                        v-for="item in days"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </p>
                <p>最近30天问诊与收益趋势</p>
            </div>
            <div class="echartbottom" ref="myEcharts">

            </div>
       </div> -->
    </div>
</template>
<script>
import echarts from "echarts"
export default {
    data(){
        return {
            days:[{
                value: 'value1',
                label: '最近七天'
                },{
                value: 'value2',
                label: '最近30天' 
                },{
                value: 'value3',
                label: '最近90天'
                }
            ],
            options:[
                {
                value:'1',
                label:"问诊处方量与收益趋势"
                },{
                value:'1',
                label:"理疗处方量与收益趋势" 
                }
            ],
            dayvalue:[],
            optionsvalue:[],
            chart: null,
            briefiList:{}
        }
    },
    methods:{
        getecharts(){
            this.chart = echarts.init(this.$refs.myEcharts);
            this.chart.setOption({
                 title: {
                    text: '未来一周气温变化'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['收入','问诊开方']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: [1,2,3,4,5,6,7,8,9,12,13,23,34,56,67]
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                },
                series: [
                    {
                        name:'收入',
                        type:'line',
                        data:[1,2,3,4,5,6,7,8,9,1,2,2,3,4,3],
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'问诊开方',
                        type:'line',
                        data:[1,3,2,4,5,6,7,8,9,10,1,1,1,1,1],
                        markPoint: {
                            data: [
                                {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'},
                                [{
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                }, {
                                    symbol: 'circle',
                                    label: {
                                        normal: {
                                            position: 'start',
                                            formatter: '最大值'
                                        }
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }]
                            ]
                        }
                    }
                ]
            }) ;
        },
        getbriefing(){
            var _this=this;
            this.$doRequest("/api/reports/clinic/statistics",null,res=>{
               _this.briefiList=res;
            })
        }
    },
    mounted(){
        //  this.getecharts();
        this.getbriefing();
    }
}
</script>
<style lang="less" >
.briefingtop{
    .briefing{
        display: flex;
        flex-wrap: wrap;
        width:100%;
        height:100%;
        overflow: hidden;
        justify-content: space-around;
            li{
            height:92px;
            width:25%;
            list-style: none;
            text-align: center;
            margin-bottom:58px;
            border-right:1px solid #C1C1C1;
            span{
                display: block;
                line-height:36px;
                font-size: 36px;
                margin-bottom:48px;
            }
            i{
                display: block;
                line-height:14px;
                font-style: normal;
                font-size: 14px;
            }
        }
        // li:after{
        //     content:"|";
        //     height:100%;
        //     width:1px;
        //     color:#C1C1C1;
        // }
        li:nth-of-type(4){
            border:0;
        }
        li:nth-of-type(8){
            border:0;
        }
    }
    // .echarts{
    //     width:100%;
    //     height:593px;
    //     border: 1px solid rgba(216, 216, 216, 1);
    //     .echartstop{
    //         width:100%;
    //         height:40px;
    //         line-height: 40px;
    //         margin-bottom:10px;
    //         p{
    //             float:right;
    //             margin-right:40px;
    //             font-size: 16px;
    //         }
    //     }
    //     .echartbottom{
    //         width:100%;
    //         height:510px;
    //         // background:#ccc;
    //         padding:0 20px;
    //     }
    // }
}
    
</style>


