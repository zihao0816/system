<template>
    <div class="financeDK">
        <div class="title">
            当前位置：<span style="color: #07A591;">银行卡提现</span>
        </div>
      
        <div class="header">
            <span>{{year}}年{{month}}月5日  预计发放金额：<heads style="color:red;">¥{{waitforWith.lastmonthpredictmoney}}</heads></span>
            <span>{{month}}月5日已打款：<strong>¥{{waitforWith.lastmonthoutmoney}}</strong></span>
            <span>{{month}}月5日未打款：<strong>¥{{waitforWith.lastmonthnopaymoney}}</strong></span>
        </div>
        <div class="center">
            <div class="top">
                <div class="button">
                    <span>
                        <button class="fkzf"  @click="istrueset(1)" :class="{zfSB:istrue==1}">{{month}}月5日待打款</button>
                        <button class="fkzf"  @click="istrueset(2)" :class="{zfSB:istrue==2}">{{month}}月5日已打款</button>
                        <button class="fkzf"  @click="istrueset(3)" :class="{zfSB:istrue==3}">打款记录</button>
                    </span>
                    <span class="lt">
                        <el-date-picker
                            v-model="startendtime"
                            v-if="istrue != 1"
                            type="daterange"
                            align="center"
                            unlink-panels
                            value-format="yyyy-MM-dd"
                            range-separator="至"    
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <el-select style="margin-left:-6px;width: 150px;" v-model="isbindcard" filterable placeholder="是否绑定银行卡" v-if="istrue == 1">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select style="margin-left:-6px;width: 150px;" v-model="fuckyouma" placeholder="所属银行" v-if="istrue == 1">
                            <el-option
                                v-for="item in banklist"
                                :key="item.itemcode"
                                :label="item.itemname"
                                :value="item.itemcode">
                                <img style="vertical-align:middle;margin-right:10px;" :src="item.businessstate" width="20" height="20" alt="">
                                <span style="vertical-align:middle; color: #8492a6; font-size: 13px">{{ item.itemname }}</span>
                            </el-option>
                        </el-select>
                        <el-autocomplete
                            class="inline-input"
                            v-model="hospitallist"
                            :fetch-suggestions="querySearch"        
                            @select="handleSelect"
                            placeholder="全部机构"
                            style="margin-left:-6px;width: 150px;"
                        ></el-autocomplete>
                        <el-input  class="inputs" v-model="doclist" placeholder="医生姓名"></el-input>
                        <el-button @click="gotolist(startendtime,doclist)" type="primary">搜索</el-button> 
                    </span>
                </div>
               
            </div>
            <div class="bottom">
                <!-- <div class="operate">
                    <el-checkbox @click="toggleSelection()">本页全选</el-checkbox>
                    <el-checkbox @click="toggleSelection()">全部全选</el-checkbox>
                    <el-button class="export">导出为EXCEL表格</el-button>
                </div> -->
                <el-table v-if="istrue == 1" class="newtable" ref="multipleTable" :data="pageVal" height="90%" tooltip-effect="dark" style="width:100%" @selection-change="handleSelectionChange">
                    <el-table-column prop="username" label="医生姓名">
                        <template slot-scope="scope">
                            <span>{{ scope.row.username }}</span>
                            <span>{{ scope.row.duties }}</span>
                            <span>{{ scope.row.phone }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="所属医院">
                        <template slot-scope="scope">
                            <span>{{ scope.row.hospitalname }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="银行名称/卡号" width="200">
                        <template slot-scope="scope">
                            <span  v-if="!!scope.row.bankaccount" class="omit">{{ scope.row.bankname }}{{ scope.row.bankaddress }}</span>
                            <span  v-if="!!scope.row.bankaccount">{{ scope.row.bankaccount }} <input type="text" class="nones" :value="scope.row.bankaccount" :id="scope.row.bankaccount"></span>
                            <span  v-if="!scope.row.bankaccount">暂未绑定银行卡</span>
                            <span v-if="!!scope.row.bankaccount">
                                <span @click="copyapp(scope.row.bankaccount)" style="color:blue;">复制</span>
                                <span @click="dialogForm(scope.row,1)" style="color:blue;">修改</span>
                            </span>
                             <span v-else>
                                <div @click="dialogForm(scope.row,1)" style="color:blue;">绑定</div>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="需转账金额">
                        <template slot-scope="scope">
                            <span class="state">¥{{ scope.row.money }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <div class="operation">
                                <el-button type="text" size="small" @click="dialogForm(scope.row,2)">我已打款</el-button>
                                <el-button type="text" size="small" @click="gotoinfo(scope.row)">对账单</el-button>
                                
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-table v-if="istrue == 2||istrue == 3" class="newtable" ref="multipleTable" :data="Bankcard" tooltip-effect="dark" style="width: 1200px" height="250" @selection-change="handleSelectionChange">
                      <el-table-column prop="time" label="打款时间">
                        <template slot-scope="scope">
                            <span>{{ scope.row.ymd }}</span>
                            <span>{{ scope.row.hms }}</span>
                        </template>
                    </el-table-column>   
                    <el-table-column prop="username" label="医生姓名">
                        <template slot-scope="scope">
                            <span>{{ scope.row.username }}</span>
                            <span>{{ scope.row.duties }}</span>
                            <span>{{ scope.row.phone }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="所属医院">
                        <template slot-scope="scope">
                            <span>{{ scope.row.hospitalname }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="银行名称/卡号" width="200">
                        <template slot-scope="scope">
                            <span class="omit">{{ scope.row.bankname }}--{{ scope.row.bankaddress }}</span>
                            <span>{{ scope.row.bankaccount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="转账金额">
                        <template slot-scope="scope">
                            <span>¥{{ scope.row.money }}</span>
                            <span style="color:#999;font-size:14px;">手续费：¥{{ scope.row.costmoney }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="合计支出">
                        <template slot-scope="scope">
                            <span class="state">¥{{((scope.row.money*1)+(scope.row.costmoney*1)).toFixed(2) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <div class="operation">
                                <el-button type="text" size="small" @click="gotoinfo(scope.row)">详情</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleCurrentChange"
                    :page-size="10"
                    layout="total, prev, pager, next, jumper"
                    :total="pagesize">
                </el-pagination>
            </div>
        </div>

        <el-dialog title="" :visible.sync="dialogFormVisible">
            <div class="info">
                <div v-if="dialoglist.num == 1" class="header">
                    <img :src="dialoglist.headphoto" tit="">
                </div>
                <h3>{{dialoglist.username}} <span>{{dialoglist.duties}}</span></h3>
                <span>{{dialoglist.hospitalname}}</span>
                <!-- 打款的时候显示 -->
                <span class="sum" v-if="dialoglist.num == 2" >￥{{dialoglist.money}}</span>
                <span class="tit" v-if="dialoglist.num == 2" >需转账金额</span>
                <!-- 打款的时候显示 -->
            </div>
            <el-form  class="formCenter">
                <el-form-item label="所属银行：" :label-width="formLabelWidth">
                    <el-select v-model="banklistone" placeholder="请选择">
                        <el-option
                            v-for="item in banklist"
                            :key="item.itemcode"
                            :label="item.itemname"
                            :value="item.itemname">
                            <img style="vertical-align:middle;margin-right:10px;" :src="item.businessstate" width="20" height="20" alt="">
                            <span style="vertical-align:middle; color: #8492a6; font-size: 13px">{{ item.itemname }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开户行：" :label-width="formLabelWidth">
                    <el-input v-model="bankaddres" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号：" :label-width="formLabelWidth">
                    <el-input  maxlength="19"  id="sfz"  v-model="bankaccount" autocomplete="off"></el-input><span @click="copyidcode(bankaccount)" style="color:blue;color: blue;position: absolute;width: 30px;right:30px">复制</span>
                </el-form-item>
                
                <!-- 打款的时候显示 -->
                <el-form-item label="手续费：" :label-width="formLabelWidth" v-if="dialoglist.num == 2" >
                    <el-input v-model="dialoglist.sxf" autocomplete="off" ></el-input>
                    <span class="tit">提示：一旦填写，将无法更改！</span>
                </el-form-item>
                <!-- 打款的时候显示 -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialoglist.num == 1" type="primary" @click="setbank()">确 定</el-button>
                <el-button v-if="dialoglist.num == 2" type="primary" @click="postdk()">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>

import navigation from '@/components/common/navigation'
export default {
    name: 'financeWX',
    components: {
        navigation,
    },
    data(){
        return{
            options: [],
            value: '',
            input: '',
            pageVal: [],
            Bankcard: [],
            multipleSelection: [],
            year:'',
            month:'',
            dete:'',
            istrue :1,
            startendtime:[],
            hospitallist:'',
            restaurants: [],   
            doclist:'',
            pagesize:0,
            hosid:'',
            waitforWith:{},
            dialogFormVisible:false,
            dialoglist:{},
            region:'',
            formLabelWidth:'120px',
            banklistone: '',
            banklist: [],
            selectbank:'',
            msg:'',
            bankaddres:'',
            bankaccount:'',
            isbindcard:'是否绑定银行卡',
            options: [{
                value: '',
                label: '全部'
                }, {
                value: true,
                label: '已绑定'
                }, {
                value: false,
                label: '未绑定'
            }],
            fuckyouma:'',
        }
    },
    created(){
        this.getdates()
        this.query();
    },
    methods: {
        query(){
            var _this = this;
            this.$doRequest('/api/hospitainfo/getListByKey',{},function(res){
                for(var i in res){
                    var obj = {};
                    obj.id = res[i].id;
                    obj.value = res[i].hospitashortname;
                    _this.restaurants.push(obj);
                }
            })
            this.$doRequest('/api/doctorwithdraw/waitforWithDrawStatistics',null,function(res){
                _this.waitforWith = res;
            })
            this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardNoPayPageList',{
                pageLength:10,
                pagination:1,
            },function(res){
                _this.pagesize = parseInt(res.valCount);
                _this.pageVal = res.pageVal;
            })
            this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardHavePayPageList',{
                pageLength:10,
                pagination:1,
            },function(res){
                _this.Bankcard = res.pageVal;
            })
            this.$doRequest('api/AppHomePage/getBank',{},function(res){
                _this.banklist = res.bank;
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleCurrentChange(news){
            var _this = this;
            if(this.istrue == 1){
                 this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardNoPayPageList',{
                    pageLength:10,
                    pagination:news,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.pageVal = res.pageVal;
                })
            }else if(this.istrue == 2){
                this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardHavePayPageList',{
                    pageLength:10,
                    pagination:news,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.Bankcard = res.pageVal;
                })
            }else{
                this.$doRequest('/api/doctorwithdraw/queryAllWithdrawPageList',{
                    pageLength:10,
                    pagination:news,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.Bankcard = res.pageVal;
                })
            }
        },
        handleSelect(item){
            this.hosid = item.id;
        },
        createFilter(queryString) {
            return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        istrueset(item){
            this.istrue =item;
            this.isbindcard = '是否绑定银行卡';
            var _this = this;
            if(item == 1){
                 this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardNoPayPageList',{
                    pageLength:10,
                    pagination:1,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.pageVal = res.pageVal;
                })
            }else if(item == 2){
                this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardHavePayPageList',{
                    pageLength:10,
                    pagination:1,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.Bankcard = res.pageVal;
                })
            }else{
                this.$doRequest('/api/doctorwithdraw/queryAllWithdrawPageList',{
                    pageLength:10,
                    pagination:1,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.Bankcard = res.pageVal;
                })
            }
        },
        getdates(){
            var date=new Date;
            this.year=date.getFullYear(); 
            this.month = date.getMonth()+1;
            if(date.getMonth()+1>12){
                this.month = 1;
                this.year=date.getFullYear()+1; 
            }
            
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        gotolist(time,name){
            if(time != ''){
                var stime = time[0]?time[0]:'';
                var etime = time[0]?time[1]:'';
            }
            var _this = this;
            this.time = time;
            this.name = name;
            if(!this.hospitallist){
              this.hosid = ''
          }
            if(this.isbindcard == '是否绑定银行卡'){
                this.isbindcard = ''
            }   
            
            if(this.istrue == 1){
                this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardNoPayPageList',{
                    pageLength:10,
                    pagination:1,
                    starttime:stime,
                    username:name,
                    endtime:etime,
                    itemcode:this.fuckyouma,
                    isbindcard:this.isbindcard,
                    hospitalid:this.hosid,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.pageVal = res.pageVal;
                })
            }else if(this.istrue == 2){
                this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardHavePayPageList',{
                    pageLength:10,
                    pagination:1,
                    starttime:stime,
                    username:name,
                    isbindcard:this.isbindcard,
                    endtime:etime,
                    hospitalid:this.hosid,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.Bankcard = res.pageVal;
                })
            }else{
                this.$doRequest('/api/doctorwithdraw/queryAllWithdrawPageList',{
                    pageLength:10,
                    pagination:1,
                    starttime:stime,
                    username:name,
                    isbindcard:this.isbindcard,
                    endtime:etime,
                    hospitalid:this.hosid,
                },function(res){
                    _this.pagesize = parseInt(res.valCount);
                    _this.Bankcard = res.pageVal;
                })
            }
      },
        copyapp(appid){
            var Url2=document.getElementById(appid);
            Url2.select(); // 选择对象
            document.execCommand("Copy")
             this.$message({
                message: '复制成功！',
                type: 'warning'
            });
        },
        copyidcode(bankaccount){
            var Url2=document.getElementById('sfz');
            Url2.select(); // 选择对象
            document.execCommand("Copy")
             this.$message({
                message: '复制成功！',
                type: 'warning'
            });
        },
        dialogForm(item,num){
            this.dialogFormVisible = true;
            this.dialoglist = item;     
            this.banklistone = this.dialoglist.bankname
            this.dialoglist.num = num;
            this.bankaddres =  this.dialoglist.bankaddress
            this.bankaccount = this.dialoglist.bankaccount
        },
        setbank(){
            var _this = this
             var pattern = /^([1-9]{1})(\d{14}|\d{18})$/;
            if(this.selectbank.length == 0){
                this.msg = '请选择银行'
            }else if(this.bankaddres == null){
                this.msg = '请输入开户行'
            }else if(this.bankaddres == ''){
                this.msg = '请输入开户行'
            }else if(this.bankaccount == null){
                this.msg = '请输入银行卡号'
            }else if(this.bankaccount == ''){
                this.msg = '请输入银行卡号'
            }else {
                 this.mag = ''
                 var _this = this;
                this.$doRequest('/api/doctoraccountinfo/addorUpdateAccountinfo',{
                    doctorid:this.dialoglist.userid,
                    doctorname:this.dialoglist.username,
                    bankname:this.selectbank[0].itemname,
                    bankurl:this.dialoglist.bankurl,
                    openbank:this.dialoglist.bankaddress,
                    bankaddress:this.bankaddres,
                    itemcode:this.selectbank[0].itemcode,
                    telephone:this.dialoglist.phone,
                    type:1,
                    bankaccount:this.bankaccount,
                    monthwithdrawid:this.dialoglist.monthwithdrawid,
                    bankurl:this.dialoglist.monthwithdrawid,
                },function(res){
                   if(res.result==1){
                       _this.dialogFormVisible = false;
                       _this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardNoPayPageList',{
                            pageLength:10,
                            pagination:1,
                        },function(res){
                            _this.pagesize = parseInt(res.valCount);
                            _this.pageVal = res.pageVal;
                        })
                        
                   }else{
                      _this.$message({
                            message: res.message,
                            type: 'warning'
                        });
                   }
                   
                })
            }
        },
        postdk(){
             var _this = this;
              this.$doRequest('/api/doctorwithdraw/addDoctorWithdraw',{
                    username:this.dialoglist.username,
                    userid:this.dialoglist.userid,
                    nickname:this.dialoglist.nickname,
                    headphoto:this.dialoglist.headphoto,
                    phone:this.dialoglist.phone,
                    money:this.dialoglist.money,
                    costmoney:this.dialoglist.sxf,
                    platformmoney:this.dialoglist.money+this.dialoglist.costmoney,
                    apporder:this.dialoglist.apporder,
                    bankaccount:this.dialoglist.bankaccount,
                    accountinfoid:this.dialoglist.accountinfoid,
                    bankname:this.dialoglist.bankname,
                    bankaddress:this.dialoglist.bankaddress,
                    type:1,
                    bankaccount:this.bankaccount,
                    hospitalid:this.dialoglist.hospitalid,
                    hospitalname:this.dialoglist.hospitalname,
                    duties:this.dialoglist.duties,
                    openid:this.dialoglist.openid,
                    monthwithdrawid:this.dialoglist.monthwithdrawid,
                    bankurl:this.dialoglist.bankurl,
                },function(res){
                   if(res.result==1){
                       _this.dialogFormVisible = false;
                       _this.$doRequest('/api/doctorwithdraw/queryLastmonthBankcardNoPayPageList',{
                            pageLength:10,
                            pagination:1,
                        },function(res){
                            _this.pagesize = parseInt(res.valCount);
                            _this.pageVal = res.pageVal;
                        })
                   }else{
                        _this.$message({
                            message: res.message,
                            type: 'warning'
                        });
                   }
                   
                })
        },
        gotoinfo(item){
           this.$store.state.userInfo.userid = item.userid;
          this.$store.state.userInfo.name = item.username;
          this.$store.state.userInfo.duties = item.duties;
          this.$store.state.userInfo.phone = item.phone.substr(0,3)+'****'+item.phone.substr(7);
          this.$store.state.userInfo.hospitalname = item.hospitalname;
          this.$store.state.userInfo.headimgurl = item.headphoto;
          this.$router.push({
                path: "/financebankinfo"
            })
      },
    },
    watch:{
        banklistone(item){
            var data= this.banklist.filter(function(items){
                    return items.itemname == item; 
                })
            this.selectbank = data;
        },
        
    }
}
</script>
<style lang="less">
.financeDK{
    height: 100%;
    padding:20px 0;
    background-color: #F1F0F5;
    .title{
        font-size: 16px;
        border-left: 4px solid #07A591;
        padding-left: 6px;
        margin-left: 20px;
        .span{
            color: #07A591 ;
        }
    }
    .header{
        height: 20px;
        background: #fff;
        padding: 20px 0;
        margin: 20px;
        span{
            padding: 0 30px;
            height: 20px;
            line-height: 20px;
            display: block;
            float: left;
            border-right: 1px solid #D8D8D8;
            color: #141414;
            i{
                color: #D74326;
            }
        }
        span:nth-child(3){
            border: none;
        }
    }
    .center{
        height: 70%;
        border-radius: 6px;
        background: #fff;
        margin: 0 20px;
        .top{
            padding: 14px 20px;
            border-bottom: 1px solid #D8D8D8;
            button{
                border-radius: 0;
                height: 36px;
                width: auto;
                padding: 0 10px;
            }
           
        }
        .bottom{
            padding: 0 20px 20px;
                height: 82%;
            .operate{
                padding: 20px 16px;
                .export{
                    padding: 0 10px;
                    height: 22px;
                    border-radius: 4px;
                    background: #07A591;
                    line-height: 22px;
                    color: #fff;
                    border: none;
                    margin-left: 50px;
                }
            }
            //table样式
            .newtable{
                th.is-leaf{
                    background: #E7E6EB;
                }
                th>.cell{
                    text-align: center;
                }
                .cell{
                    text-align: center;
                    >span{
                        display: block;
                    }
                    >span.omit{
                        width: 100%;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        -o-text-overflow:ellipsis;
                        -webkit-text-overflow:ellipsis;
                        -moz-text-overflow:ellipsis;
                        white-space:nowrap;
                    }
                    .state{
                        color: #D74326;
                    }
                }
            }
        }
    }
    /deep/ .el-dialog{
        width: 35%;
        margin-top:10vh;
    }
    /deep/ .el-dialog__body{
        padding: 0px 20px !important; 
    }
}

//操作区域的按钮（公共）
.operation{
    button{
        height: 22px;
        background-color: rgba(245, 245, 245, 1);
        border: 1px solid rgba(216, 216, 216, 1);
        border-radius: 2px;
        line-height: 22px;
        text-align: center;
        padding: 0;
        color: #141414;
        display: block;
        margin: 6px auto;
    }
    .el-button+.el-button{
        margin: 6px auto;
    }
}
.foright{
    float: right;
}
.financeDK .center .top > div {
    .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
        width: 200px;
    }
    .inputs{
        width: 120px;
        margin-left:-6px;
    }
}
.lt{
    float: right;
}
.nones{
    position: relative;
    top: -10000px;
    width: 1px;
}
.info{
        width: 100%;
        padding: 20px 0;
        border-bottom: 1px solid #E7E6EB;
        .header{
            width: 80px;
            height: 80px;
            border-radius: 40px;
            padding: 0;
            margin: 0 auto;
            overflow: hidden;
            background: #ff0;
            img{
                width: 100%;
                height: auto;
            }
        }
        h3{
            width: 100%;
            line-height: 48px;
            text-align: center;
            font-size: 20px;
            color: #141414;
            font-weight: normal;
            span{
                color: #9B9B9B;
                display: inline;
            }
        }
        span{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            display: block;
        }
        .sum{
            color: #141414;
            font-size: 28px;
        }
        .tit{
            color: #9B9B9B;
        }
    }
    .formCenter{
        padding: 20px 0;
        .el-input__inner{
            width: 290px;
            height: 40px;
        }
        .el-form-item__label{
            font-size: 16px;
        }
        .tit{
            color: #D74326;
        }
    }
    //弹框底部操作键
    .el-dialog__footer{
        text-align: center;
        .el-button{
            width: 130px;
            height: 40px;
            border: 1px solid #07A591;
            color: #07A591;
            font-size: 18px;
        }
        .el-input__inner{
            font-size: 16px;
            color: #141414;
        }
        .el-button--primary{
            background: #07A591;
            border: 1px solid #07A591;
            color: #fff;
        }
    }
    .fkzf{
        border: 0;
        background-color: transparent;
        padding: 0 5px !important;
        outline: none;
        font-size: 12px;
        background: rgb(245,245,245);
    }
    .zfSB{
        background: rgb(96,168,252);
        color:#fff;
        
    }
</style>

