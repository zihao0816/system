<template>
    <div class="warehouse">
        <div class="page">
            <div>
                <navigation></navigation>
            </div>
            <div class="content">
                <div class="add">
                    <el-button @click="addStorage" type="primary">新建库房</el-button>
                </div>
                <div class="search">
                    <el-form :inline="true" label-width="100px">
                        <el-form-item label="库房名称：" >
                            <el-input v-model="storagename"></el-input>
                        </el-form-item>
                        <el-form-item label="库房所在地：">
                            <el-cascader :options="options" v-model="selectedOptions" @change='handleChange'></el-cascader>
                        </el-form-item>
                        <el-form-item label="库房等级：">
                            <el-select v-model="laval">
                                <el-option v-for="(item,index) in lavalList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="库房状态：">
                            <el-select v-model="type">
                                <el-option v-for="(item,index) in typeList" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="管理员账号：" >
                            <el-input v-model="account"></el-input>
                        </el-form-item>
                        <el-form-item class="btn">
                            <el-button type="primary" @click="clear">重置</el-button>
                            <el-button type="primary" @click="searchs">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="tables">
                    <el-table border :data="storageData" style="width: 100%;" highlight-current-row>
                        <el-table-column fixed prop="serialnumber" label="库房编号" :show-overflow-tooltip="true" align="center"></el-table-column>
                        <el-table-column prop="hospitaname" label="库房名称" :show-overflow-tooltip="true" align="center"></el-table-column>
                        <el-table-column prop="crank" label="库房等级" align="center"></el-table-column>
                        <!-- <el-table-column prop="ctype" label="库房类型" align="center"></el-table-column> -->
                        <el-table-column prop="province" label="所在省份" align="center"></el-table-column>
                        <el-table-column prop="city" label="所在城市" align="center"></el-table-column>
                        <el-table-column prop="contry" label="所在区域" align="center"></el-table-column>
                        <el-table-column prop="createtime" label="创建时间" width="140" align="center"></el-table-column>
                        <el-table-column label="当前状态" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.hospitastate == '1' ? '启用' : '禁用'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountname" label="管理员" width="180" align="center"></el-table-column>
                        <el-table-column label="子账号数" align="center">
                            <template slot-scope="scope">
                                <span style="color:#07A591;cursor: pointer;" @click="accounts(scope.row)">{{scope.row.counval}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="210" align="center">
                            <template slot-scope="scope">
                                <span style="font-size:14px;color:#07A591;cursor: pointer;" @click="updateData(scope.$index, scope.row)">修改资料</span>
                                <span style="font-size:14px;color:#07A591;cursor: pointer;" @click="updatePwd(scope.$index, scope.row)">修改密码</span>
                                <span style="font-size:14px;color:#07A591;cursor: pointer;" @click="updateDisable(scope.$index, scope.row)">{{scope.row.hospitastate == '1' ? '禁用' : '启用'}}</span>
                                <span style="font-size:14px;color:#07A591;cursor: pointer;" @click="inventory(scope.$index, scope.row)">库存</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="clearfix" style="padding:10px 0;text-align:right;">
                        <el-pagination style="float:right;" layout="prev, pager, next" :total="totals" :page-size="pageSizes"  @current-change="handleCurrentChanges"></el-pagination>
                    </div>
                </div>
            </div>

            <!-- 添加/编辑库房弹窗 -->
            <el-dialog class="update-data" :title="title" :visible.sync="updateDataDialogVisible" width="60%" center>
                <p>库房基础信息</p>
                <el-form :inline="true" label-width="100px">
                    <el-form-item label="库房名称：">
                        <el-input minlength="5" maxlength="10" v-model="add.hospitaname"></el-input>
                        <p>*必填项，5-10个汉字</p>
                    </el-form-item>
                    <el-form-item label="库房等级：">
                        <el-select v-model="add.crank">
                            <el-option v-for="(item,index) in lavalList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <p>*必选项</p>
                    </el-form-item>
                    <el-form-item class="province" style="width:90%" label="库房所在地：">
                        <el-cascader style="width:34%" :options="options" v-model="selectedOption" @change='handleChanges'></el-cascader>
                        <el-input style="width:64%" v-model="add.address"></el-input>
                        <p>*必选项</p>
                    </el-form-item>
                    <div v-show="isHtmlShow">
                        <p style="padding:20px 0;border-top:1px solid #dddddd;">库房管理员信息</p>
                        <el-form-item label="账号：">
                            <el-input minlength="6" maxlength="12" v-model="add.accountname" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
                            <p>*必填项，6-12位数字、字母</p>
                        </el-form-item>
                        <el-form-item label="密码：">
                            <el-input minlength="6" maxlength="12" v-model="add.password" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
                            <p>*必填项，6-12位数字、字母</p>
                        </el-form-item>
                        <el-form-item label="确认密码：">
                            <el-input minlength="6" maxlength="12" v-model="truepassword" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
                            <p>*必填项，与密码一致</p>
                        </el-form-item>
                    </div>
                    <div style="text-align:center;">
                        <el-button @click="close(1)">取消</el-button>
                        <el-button @click="submitStorage">保存</el-button>
                    </div>
                </el-form>
            </el-dialog>
            <el-dialog class="update-password" title="修改密码" :visible.sync="updatePwdDialogVisible" width="30%" center>
                <p style="margin-bottom:20px;"><span>管理员账号：</span><span>{{add.accountname}}</span></p>
                <el-form label-width="90px">
                    <el-form-item label="新密码：">
                        <el-input v-model="add.password" maxlength="12" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
                        <p>*必填项，6-12位数字、字母</p>
                    </el-form-item>
                    <el-form-item label="确认密码：">
                        <el-input v-model="truepassword" maxlength="12" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
                        <p>*必填项，与新密码一致</p>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="close(2)">取消</el-button>
                        <el-button @click="submitPwd">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog class="update-disable" :title="disableStorage ? '禁用库房' : '启用库房'" :visible.sync="disableDialogVisible" width="20%" center>
                <p v-if="disableStorage">即将关闭库房：<span style="color: #D74326;">好中医中央大药房</span>！库房关闭后，医生将无法使用当前库房开具处方。其子账号亦无法登陆当前库房。</p>
                <p v-else>即将启用库房：<span style="color: #D74326;">好中医中央大药房</span>！是否确认启用？</p>
                <div style="text-align:center;margin-top:20px;">
                    <el-button @click="disableDialogVisible = false">取消</el-button>
                    <el-button @click="submitDisable">{{disableStorage ? '禁用' : '启用'}}</el-button>
                </div>
            </el-dialog>
            <el-dialog class="inventory" title="库存预览" :visible.sync="inventoryDialogVisible" width="60%" center>
                <ul>
                    <li><span>库房：</span><span>{{add.hospitaname}}</span></li>
                    <!-- <li><span>颗粒种类（种）：</span><span>290</span></li>
                    <li><span>饮片种类（种）：</span><span>290</span></li>
                    <li><span>库存量货值（元）：</span><span>9999.00</span></li> -->
                </ul>
                <el-form :inline="true" label-width="90px">
                    <el-form-item label="药材名称：">
                        <el-select v-model="medicineId" clearable filterable remote reserve-keyword placeholder="请输入关键词"
                            :remote-method="remoteMethod"
                            :loading="selectload">
                            <el-option
                                v-for="item in options4"
                                :key="item.value"
                                :label="item.label+'-'+item.type"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="药材剂型：">
                        <el-select v-model="prescriptionshapeid" placeholder="请选择">
                            <el-option v-for="(item,i) in prescriptionshape" :key="i" :label="item.itemname" :value="item.itemcode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <el-select v-model="drugstate" placeholder="请选择">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="下架" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="供应商：">
                        <el-select v-model="supplierid" placeholder="请选择">
                            <el-option v-for="(item,i) in supplier" :key="i" :label="item.suppliername" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="search(1)">重置</el-button>
                    <el-button type="primary" @click="search(2)">查询</el-button>
                </el-form>
                <el-table border :data="inventoryData" style="width: 100%;" highlight-current-row>
                    <el-table-column align="center" type="selection"></el-table-column>
                    <el-table-column align="center" fixed prop="drugcode" label="序号" width="210" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column align="center" prop="medicinename" label="药材名称"></el-table-column>
                    <el-table-column align="center" prop="phoneticode" label="快捷码" width="180"></el-table-column>
                    <el-table-column align="center" prop="specification" label="药材规格"></el-table-column>
                    <el-table-column align="center" prop="prescriptionshapename" label="药材剂型"></el-table-column>
                    <el-table-column align="center" prop="medicineunit" label="包装单位"></el-table-column>
                    <el-table-column align="center" prop="totalstock" label="总存量"></el-table-column>
                    <el-table-column align="center" prop="suppliername" label="供应商" width="180"></el-table-column>
                    <el-table-column align="center" prop="lastwarehousetime" label="最近入库时间" width="120"></el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.drugstate == '1' ? '正常' : '下架'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" width="240" label="操作项">
                        <template slot-scope="scope">
                            <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="updateMedinine(scope.row)">修改</span>
                            <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="soldOut(scope.row)" :style="scope.row.drugstate == 1 ? '' : 'color: #D74326;'">{{scope.row.drugstate == 1 ? '下架' : '已下架'}}</span>
                            <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="checkMarket(scope.row,1)">销售明细</span>
                            <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="checkMarket(scope.row,2)">入库明细</span>
                        </template>
                    </el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer clearfix">
                    <el-pagination style="float:right;" layout="prev, pager, next" :total="total" :page-size="pageSizes"  @current-change="handleCurrentChange"></el-pagination>
                </span>
            </el-dialog>
            <el-dialog class="child-account" title="组织结构详情" :visible.sync="accountDialogVisible" width="60%" center>
                <ul>
                    <li><span>库房名称：</span><span>{{add.hospitaname}}</span></li>
                    <li><span>管理员账号：</span><span>{{add.accountname}}</span></li>
                    <li><span>子账号数：</span><span>{{counval}}</span></li>
                </ul>
                <el-table border :data="accountData" style="width: 100%;" highlight-current-row>
                    <el-table-column align="center" prop="accountname" label="子账号用户名"></el-table-column>
                    <el-table-column align="center" prop="createtime" label="创建时间"></el-table-column>
                    <el-table-column align="center" prop="logintime" label="最近登录时间"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="updatePwd(scope.$index, scope.row)">修改密码</span>
                            <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="disableAccount(scope.$index, scope.row)">{{scope.row.status == '1' ? '禁用' : '启用'}}</span>
                            <!-- <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" >查看操作日志</span> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <el-dialog class="disable-account" title="禁用账号" :visible.sync="disableAccountDialogVisible" width="20%" center>
                <p v-if="status == '1'">禁用生效后，该账号将无法登陆药房系统。</p>
                <p v-if="status == '1'">是否禁用账号：<span style="color: #D74326;">{{add.accountname}}</span></p>
                <p v-else>是否启用账号：<span style="color: #D74326;">{{add.accountname}}</span></p>
                <div style="text-align:center;margin-top:20px;">
                    <el-button @click="disableAccountDialogVisible = false">取消</el-button>
                    <el-button @click="displayAccount">{{status == '1' ? '禁用' : '启用'}}</el-button>
                </div>
            </el-dialog>
            <el-dialog title="下架提醒" :visible.sync="soldOutDrug" width="30%" center>
                <div class="center">
                    <p>即将下架药品{{soldOutMedicinename}}，医生将无法开具该药品，但系统中依然保留药品信息，且不会影响已支付订单/药房的药品领取过程</p>
                    <p>确认下架？</p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="soldOutDrug = false">取 消</el-button>
                    <el-button type="primary" @click="soldSubmit">下架</el-button>
                </span>
            </el-dialog>
            <el-dialog title="修改药品信息提醒" :visible.sync="upDrugInfo" width="60%" center>
                <div class="center">
                    <el-form :model="druginfo" :inline="true" class="form-inline" label-width="110px">
                        <el-form-item label="药品名称：">
                            <el-input v-model="druginfo.medicinename" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="药品快捷码：">
                            <el-input v-model="druginfo.phoneticode" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="药品编号：">
                            <el-input v-model="druginfo.drugcode" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="药品剂型：">
                            <el-input v-model="druginfo.prescriptionshapeid" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="包装规格：">
                            <el-input v-model="druginfo.specification" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="包装单位：">
                            <el-input v-model="druginfo.packunit" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="计量单位：">
                            <el-input v-model="druginfo.medicineunit" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="批发价：">
                            <el-input v-model="druginfo.tradeprice" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="进货价：">
                            <el-input v-model="druginfo.buyingprice" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="供应商：">
                            <el-input v-model="druginfo.suppliername" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="存量下限：">
                            <el-input v-model="druginfo.lowstock" placeholder="请输入内容"></el-input>
                            <p style="color:#D74326;">*输入值大于1</p>
                        </el-form-item>
                        <el-form-item label="存量上限：">
                            <el-input v-model="druginfo.highstock" placeholder="请输入内容"></el-input>
                            <p style="color:#D74326;">*输入值大于1</p>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="upDrugInfo = false">取 消</el-button>
                    <el-button type="primary" @click="updateDrug('druginfo')">保存修改</el-button>
                </span>
            </el-dialog>
            <!-- 销售/入库明细弹窗 -->
            <el-dialog :title="detailTit" :visible.sync="checkDrugMarket" width="60%" :before-close="handleClose" v-loading="loading" center>
                <div class="center">
                    <div class="clearfix" style="margin-bottom:20px;">
                        <div style="float:left">
                            <label>{{searchTit}}：</label>
                            <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="searchDate()">
                            </el-date-picker>
                        </div>
                        <el-button type="primary" style="float:right" @click="detailSearch()">搜索</el-button>
                    </div>
                    <el-table :data="sellStorage" border style="width: 100%" v-if="pullType == 1" highlight-current-row>
                        <el-table-column prop="drugname" label="药品名称" width="120"></el-table-column>
                        <el-table-column prop="prescriptionshapeid" label="药品剂型" width="120"></el-table-column>
                        <el-table-column prop="packagequantity" label="包装数量" width="120"></el-table-column>
                        <el-table-column prop="hospitaname" label="医院名称" width="180"></el-table-column>
                        <el-table-column prop="department" label="科室名称" width="120"></el-table-column>
                        <el-table-column prop="doctorname" label="医师名称" width="120"></el-table-column>
                        <el-table-column prop="dosage" label="成交销量" width="120"></el-table-column>
                        <el-table-column prop="price" label="成交零售价" width="120"></el-table-column>
                        <el-table-column prop="totalprice" label="成交金额" width="120"></el-table-column>
                        <el-table-column prop="suppliername" label="供应商" width="120"></el-table-column>
                        <el-table-column prop="orderid" label="处方订单号" width="240"></el-table-column>
                        <el-table-column prop="paytime" label="支付时间" width="180"></el-table-column>
                        <el-table-column prop="warehousename" label="库房" width="200"></el-table-column>
                    </el-table>
                    <el-table :data="pullStorage" border style="width: 100%" v-if="pullType == 2" highlight-current-row>
                        <el-table-column prop="suppliername" label="供应商" width="120"></el-table-column>
                        <el-table-column prop="medicinename" label="药品名称" width="200"></el-table-column>
                        <el-table-column prop="prescriptionshapename" label="药品剂型" width="100"></el-table-column>
                        <el-table-column prop="phoneticode" label="快捷码" width="140"></el-table-column>
                        <el-table-column prop="packagequantity" label="包装数量" width="100"></el-table-column>
                        <el-table-column prop="tradeprice" label="批发价"></el-table-column>
                        <el-table-column prop="buyingprice" label="进货价" width="100"></el-table-column>
                        <el-table-column prop="medicineprice" label="线上零售价" width="140"></el-table-column>
                        <el-table-column prop="offretailprice" label="线下零售价" width="140"></el-table-column>
                        <el-table-column prop="batchcode" label="批次号" width="120"></el-table-column>
                        <el-table-column prop="warehousequantity" label="入库数量" width="100"></el-table-column>
                        <el-table-column prop="warehousetime" label="入库日期" width="180"></el-table-column>
                        <el-table-column prop="warehousecode" label="入库单号" width="300"></el-table-column>
                        <el-table-column prop="username" label="操作人" width="120"></el-table-column>
                    </el-table>
                    <el-pagination v-if="mxRecords>=10" layout="prev, pager, next" :total="mxRecords" :page-size="mxPageSize" @current-change="mxhandleCurrentChange" @prev-click="mxprev" @next-click='mxnext'></el-pagination>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import navigation from '../../components/common/navigation'
import {regionDataPlus, CodeToText, TextToCode} from 'element-china-area-data'
import common from '../../../src/api/common.js'
export default {
    data(){
        return {
            //弹窗打开状态
            updateDataDialogVisible: false,
            inventoryDialogVisible: false,
            updatePwdDialogVisible: false,
            disableDialogVisible: false,
            accountDialogVisible: false,
            disableAccountDialogVisible: false,
            soldOutDrug: false,
            upDrugInfo: false,
            checkDrugMarket: false,
            //地区组件
            options: regionDataPlus,
            selectedOption: [],
            selectedOptions: [],
            //数据保存
            storageData: [],
            inventoryData: [],
            accountData: [],
            pullStorage: [],
            sellStorage: [],
            //搜索库房
            laval: '',
            type: '',
            storagename: '',
            account: '',
            province: '',
            city: '',
            contry: '',
            //搜索库存
            medicineId: '',
            prescriptionshapeid: '',
            drugstate: '',
            supplierid: '',
            selectload: false,
            options4: [],
            list: [],
            medicinenameList: [],
            prescriptionshape: [],
            supplier: [],
            title: '',
            isHtmlShow: true,
            
            lavalList: [
                {
                    value: '中央',
                    label: '中央'
                },{
                    value: '二级',
                    label: '二级'
                },{
                    value: '三级',
                    label: '三级'
                }
            ],
            typeList: [
                {
                    value: '1',
                    label: '启用'
                },{
                    value: '2',
                    label: '禁用'
                }
            ],
            total: 0,
            totals: 0,
            pagination: 1,
            paginations: 1,
            pageSizes: 10,
            add:{
                hospitaname: '',
                address: '',
                crank: '',
                province: '',
                city: '',
                contry: '',
                accountname: '',
                password: ''
            },
            truepassword: '',
            storageId: '',
            counval: '',
            accountId: '',
            disableStorage: '',
            status: '',
            soldOutId: '',
            soldOutMedicinename: '',
            druginfo: {},
            detailTit: '',
            loading: true,
            date : [],
            startdate : '',
            enddate : '',
            mxTotal : 0,
            mxPageSize : 10,
            mxPagination : 1,
            searchTit: '',
            pullType: '',
            checkid: '',
            detailTit: '',
            pullDate: '',
            pullNum: '',
            supplier: '',
            pullTotal: '',
            mxRecords: 0,//Records
        }
    },
    components: {
        navigation
    },
    created(){
        this.query();
    },
    methods:{
        //查询库房
        query(){
            let data = {
                pagination: this.paginations,
                condition: {
                    hospitanamel: this.storagename,
                    province: this.province,
                    city: this.city,
                    contry: this.contry,
                    crank: this.laval,
                    hospitastate: this.type,
                    adminname: this.account
                }
            }
            this.$doRequest('/api/backWarehouseControl/queryWarehouse', data, res=>{
                for(let i=0;i<res.parameters.rows.length;i++){
                    res.parameters.rows[i].createtime = common.timestampToTime(res.parameters.rows[i].createtime,2);
                }
                this.storageData = res.parameters.rows;
                this.totals = res.parameters.records;
            })
        },
        handleChange(v){
            this.formatCity(v,1);
        },
        handleChanges(v){
            this.formatCity(v,2);
        },
        formatCity(v,type){
            if(type == 2){
                this.add.province = v[0] == null || v[0] == '' ? '' : CodeToText[v[0]]; 
                this.add.city = v[1] == null || v[1] == '' ? '' : CodeToText[v[1]]; 
                this.add.contry = v[2] == null || v[2] == '' ? '' : CodeToText[v[2]]; 
            }else{
                this.province = v[0] == null || v[0] == '' ? '' : CodeToText[v[0]];
                this.city = v[1] == null || v[1] == '' ? '' : CodeToText[v[1]];
                this.contry = v[2] == null || v[2] == '' ? '' : CodeToText[v[2]];
            }
        },
        searchs(){
            this.query();
        },


        //修改库房资料
        updateData(index,row){
            this.updateDataDialogVisible = true;
            this.title = '修改资料';
            this.isHtmlShow = false;
            this.add.hospitaname = row.hospitaname;
            this.selectedOption = [TextToCode[row.province].code, TextToCode[row.province][row.city].code, TextToCode[row.province][row.city][row.contry].code];
            this.add.crank = row.crank;
            this.add.address = row.address;
            this.storageId = row.id;
            this.add.province = row.province;
            this.add.city = row.city;
            this.add.contry = row.contry;
        },
        //新建库房
        addStorage(){
            this.updateDataDialogVisible = true;
            this.title = '新建库房';
            this.isHtmlShow = true;
        },
        submitStorage(){
            if(this.isHtmlShow){
                if(this.add.hospitaname == '' || this.add.crank == '' || this.add.province == '' || this.add.accountname == '' || this.add.password == '' || this.truepassword == ''){
                    this.$message({message: '请填写必填的内容',type: 'warning'});
                    return false;
                }
                if(this.add.hospitaname.length < 5 || this.add.accountname.length < 6 || this.add.password.length < 6 || this.truepassword.length < 6){
                    this.$message({message: '输入内容格式不正确',type: 'warning'});
                    return false;
                }
                if(!/^[\u0391-\uFFE5]+$/.test(this.add.hospitaname)){
                    this.$message({message: '输入内容格式不正确',type: 'warning'});
                    return false;
                }
                if(this.add.password != this.truepassword){
                    this.$message({message: '密码输入不一致，请重新输入',type: 'warning'});
                    return false;
                }
                let data = this.add;
                this.$doRequest('/api/backWarehouseControl/addWarehouse', data, res=>{
                    if(res.result == 0){
                        this.updateDataDialogVisible = false;
                        this.$message({message: '添加成功',type: 'success'});
                        this.query();
                        this.addClear();
                    }
                })
            }else{
                if(this.add.hospitaname.length < 5){
                    this.$message({message: '输入内容格式不正确',type: 'warning'});
                    return false;
                }
                if(!/^[\u0391-\uFFE5]+$/.test(this.add.hospitaname)){
                    this.$message({message: '输入内容格式不正确',type: 'warning'});
                    return false;
                }
                if(this.add.hospitaname == '' || this.add.crank == '' || this.add.province == ''){
                    this.$message({message: '请填写必填的内容',type: 'warning'});
                    return false;
                }
                let data = {
                    id: this.storageId,
                    hospitaname: this.add.hospitaname,
                    address: this.add.address,
                    crank: this.add.crank,
                    province: this.add.province,
                    city: this.add.city,
                    contry: this.add.contry
                };
                this.$doRequest('api/backWarehouseControl/upWarehouse', data, res=>{
                    if(res.result == 0){
                        this.updateDataDialogVisible = false;
                        this.$message({message: '修改成功',type: 'success'});
                        this.query();
                        this.addClear();
                    }
                })
            }
        },


        //库存查询
        inventory(index,row){
            this.inventoryDialogVisible = true;
            this.storageId = row.id;
            this.add.hospitaname = row.hospitaname;
            this.queryMedicine();
            this.getMedicines();
            this.getbrand();
            this.getSupplierList();
        },
        queryMedicine(){
            let data = {
                pagination: this.pagination,
                condition: {
                    hospitaid: this.storageId,
                    id: this.medicineId,
                    prescriptionshapeid: this.prescriptionshapeid,
                    drugstate: this.drugstate,
                    supplierid: this.supplierid
                }
            }
            this.$doRequest('/api/pharmacymedicines/getListsByHid', data, res=>{
                for(let i=0;i<res.parameters.rows.length;i++){
                    res.parameters.rows[i].lastwarehousetime = common.timestampToTime(res.parameters.rows[i].lastwarehousetime,2)
                }
                this.inventoryData = res.parameters.rows;
                this.total = res.parameters.records;
            })
        },
        //监听搜索药品名称
        remoteMethod(query) {
            if (query !== '') {
                this.selectload = true;
                setTimeout(() => {
                    this.selectload = false;
                    this.options4 = this.list.filter(item => {
                        if(item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.code.toLowerCase().indexOf(query.toLowerCase()) > -1){
                            return item.label;
                        }
                    });
                }, 200);
            } else {
                this.options4 = [];
            }
        },
        //获取药品下拉列表
        getMedicines(){
            this.$doRequest("api/pharmacymedicines/getpmedicineLists", {},res => {
                this.medicinenameList = res.parameters;
                this.list = this.medicinenameList.map(item => {
                    return { value: item.id, label: item.medicinename, code: item.phoneticode, type: item.prescriptionshapename};
                });
            });
        },
        //获取剂型下啦
        getbrand(){
            this.$doRequest("api/Inquiry/getbrand",{},res => {
                this.prescriptionshape = res.parameters;
            });
        },
        //获取供应商列表
        getSupplierList(){
            this.$doRequest("api/supplier/getSupplierList",{},res => {
                this.supplier = res.parameters;
            });
        },
        //搜索
        search(type){
            if(type == 1){
                this.medicineId = '';
                this.prescriptionshapeid = '';
                this.drugstate = '';
                this.supplierid = '';
            }
            this.queryMedicine();
        },


        //修改密码
        updatePwd(index,row){
            this.updatePwdDialogVisible = true;
            this.add.accountname = row.accountname;
        },
        submitPwd(){
            if(this.add.password == '' || this.truepassword == ''){
                this.$message({message: '请填写必填的内容',type: 'warning'});
                return false;
            }
            if(this.add.password.length < 6 || this.truepassword.length < 6){
                this.$message({message: '输入内容格式不正确',type: 'warning'});
                return false;
            }
            if(this.add.password != this.truepassword){
                this.$message({message: '密码输入不一致，请重新输入',type: 'warning'});
                return false;
            }
            let data = {
                accountname: this.add.accountname,
                password: this.add.password
            }
            this.$doRequest('/api/backWarehouseControl/updaminPass', data, res=>{
                this.updatePwdDialogVisible = false;
                this.$message({message: '修改成功',type: 'success'});
                this.query();
                this.queryAccount();
                this.addClear();
            })
        },


        //禁用/启用库房
        updateDisable(index,row){
            this.disableDialogVisible = true;
            this.storageId = row.id;
            if(row.hospitastate == '1'){
                this.disableStorage = true;
            }else{
                this.disableStorage = false;
            }
        },
        submitDisable(){
            let data = {
                id: this.storageId,
                hospitastate: this.disableStorage ? '2' : '1'
            }
            this.$doRequest('/api/hospitainfo/updateByPrimaryKeySelective', data, res=>{
                this.disableDialogVisible = false;
                this.$message({message: this.disableStorage ? '禁用成功' : '启用成功',type: 'success'});
                this.query();
            })
        },


        //子账号数
        accounts(row){
            this.accountDialogVisible = true;
            this.storageId = row.id;
            this.add.hospitaname = row.hospitaname;
            this.add.accountname = row.accountname;
            this.counval = row.counval;
            this.queryAccount();
        },
        queryAccount(){
            let data = {
                cnameid: this.storageId
            }
            this.$doRequest('/api/backgrounduser/getListByKey', data, res=>{
                for(let i=0;i<res.length;i++){
                    res[i].createtime = common.timestampToTime(res[i].createtime,2);
                    res[i].logintime = common.timestampToTime(res[i].logintime,2)
                }
                this.accountData = res
            })
        },
        //禁用账号
        disableAccount(index,row){
            this.disableAccountDialogVisible = true;
            this.add.accountname = row.accountname;
            this.accountId = row.id;
            this.status = row.status;
        },
        displayAccount(){
            let data = {
                id: this.accountId,
                status: this.status == '1' ? '2' : '1'
            }
            this.$doRequest('/api/backgrounduser/updateByPrimaryKeySelective', data, res=>{
                this.disableAccountDialogVisible = false;
                this.$message({message: this.status == '1' ? '禁用成功' : '启用成功', type: 'success'});
                this.queryAccount();
            })
        },


        //分页查询条件重置
        clear(){
            this.storagename = '';
            this.selectedOptions = [];
            this.laval = '';
            this.type = '';
            this.account = '';
            this.province = '',
            this.city = '',
            this.contry = ''
        },
        addClear(){
            this.add = {
                hospitaname: '',
                address: '',
                crank: '',
                province: '',
                city: '',
                contry: '',
                accountname: '',
                password: ''
            };
            this.truepassword = '';
            this.selectedOption = [];
        },
        handleCurrentChanges(val){
            this.paginations = val;
            this.query();
        },
        handleCurrentChange(val){
            this.pagination = val;
            this.queryMedicine();
        },

        //修改库存
        updateMedinine(row){
            this.upDrugInfo = true;
            this.druginfo = row;
            if(!this.druginfo.lowstock){
                this.druginfo.lowstock = '';
            }
            if(!this.druginfo.highstock){
                this.druginfo.highstock = '';
            }
        },
        updateDrug(){
            if(!this.druginfo.lowstock){
                this.$message.error('存量下限不能为空');
                return;
            }else if(!this.druginfo.highstock){
                this.$message.error('存量上限不能为空');
                return;
            }else if(this.druginfo.lowstock > this.druginfo.highstock){
                this.$message.error('存量下限不能大于存量上限');
                return;
            }else{
                let params = {
                    id: this.druginfo.id,
                    medicinename: this.druginfo.medicinename,
                    phoneticode: this.druginfo.phoneticode,
                    tradeprice: this.druginfo.tradeprice == null || this.druginfo.tradeprice == '' ? '' : this.druginfo.tradeprice,
                    prescriptionshapeid: this.druginfo.prescriptionshapeid,
                    medicineunit: this.druginfo.medicineunit,
                    specification: this.druginfo.specification,
                    phoneticode: this.druginfo.phoneticode,
                    supplierid: this.druginfo.supplierid,
                    buyingprice: this.druginfo.buyingprice == null || this.druginfo.buyingprice == '' ? '' : this.druginfo.buyingprice,
                    highstock: this.druginfo.highstock,//存量上限
                    lowstock: this.druginfo.lowstock,//存量下限
                    packunit: this.druginfo.packunit,
                    packspecification: this.druginfo.packspecification,
                    updateby: sessionStorage.id,
                };
                this.$doRequest("api/PhMedicine/updateDrug", params,res => {
                    if(res.result >= 0){
                        this.$message({message: '药品修改成功！', type: 'success'});
                        this.upDrugInfo = false;
                    }else{
                        this.$message({message: res.message,type: 'error'});
                    }
                });
            }
        },


        //下架
        soldOut(row){
            if(row.drugstate == 1){
                this.soldOutId = row.id;
                this.soldOutMedicinename = row.medicinename;
                this.soldOutDrug = true;
            }else{
                this.$message.error('此药品已下架');
            }
        },
        soldSubmit(){
            let params = {
                drugid: this.soldOutId,
                drugstate: 2,
                updateby: sessionStorage.id
            }
            this.$doRequest("api/PhMedicine/unShelveMedicineinfo", params,res => {
                if(res.result == 1){
                    this.$message({
                        message: '下架成功',
                        type: 'success'
                    });
                    this.soldOutDrug = false;
                    this.queryMedicine();
                }else{
                    this.$message.error(res.message);
                }
            });
        },


        handleClose(){
            this.date = [];
            this.startdate = '';
            this.enddate = '';
            this.mxTotal = 0;
            this.mxPageSize = 10;
            this.mxPagination = 1;
            this.checkDrugMarket = false;
        },
        //查看销售明细/入库明细
        checkMarket(row,type){//1销售2入库
            this.loading = true;
            this.checkid = row.id;
            this.checkDrugMarket = true;
            if(type == 1){
                this.detailTit = '药品'+ row.medicinename +'销售明细';
                this.searchTit = '支付时间';
                this.pullType = 1;
                this.getSaleDetails();
            }else{

                this.detailTit = '药品'+ row.medicinename +'入库明细';
                this.searchTit = '入库时间';
                this.pullType = 2;
                this.queryPageByCondition();
            }
        },
        //获取入库明细
        queryPageByCondition(){
            let params = {
                pageLength: this.mxPageSize,
                pagination: this.mxPagination,
                condition: {
                    hospitaid: this.hospitaid,
                    drugid: this.checkid,
                    starttime: this.startdate,
                    endtime: this.enddate
                }
            };
            this.$doRequest("api/medicinetostoragedetails/queryPageByCondition", params,res => {
                if(res.result >= 0){
                    this.loading = false;
                    res.parameters.rows.forEach(item => {
                        item.warehousetime = common.timestampToTime(item.warehousetime);
                    });
                    this.mxRecords = res.parameters.records;
                    this.pullStorage = res.parameters.rows;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        //获取销售明细
        getSaleDetails(){
            let params = {
                pageLength: this.mxPageSize,
                pagination: this.mxPagination,
                condition:{
                    drugid: this.checkid,
                    starttime: this.startdate,
                    endtime: this.enddate
                }
            };
            this.$doRequest("api/PhMedicine/getSaleDetails", params,res => {
                if(res.result >= 0){
                    this.loading = false;
                    res.parameters.rows.forEach(item => {
                        item.paytime = common.timestampToTime(item.paytime);
                    });
                    this.mxRecords = res.parameters.records;
                    this.sellStorage = res.parameters.rows;
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        //明细分页
        mxhandleCurrentChange(val){
            this.mxPagination = val;
            if(this.pullType == 1){
                this.getSaleDetails();
            }else{
                this.queryPageByCondition();
            }
        },
        mxprev(val){
            this.mxPagination = val-1;
            if(this.pullType == 1){
                this.getSaleDetails();
            }else{
                this.queryPageByCondition();
            }
        },
        mxnext(val){
            this.mxPagination = val+1;
            if(this.pullType == 1){
                this.getSaleDetails();
            }else{
                this.queryPageByCondition();
            }
        },

        close(type){
            if(type == 1){
                this.updateDataDialogVisible = false;
            }else if(type == 2){
                this.updatePwdDialogVisible = false;
            }
            this.addClear();
        }
    }
}
</script>
<style lang="less" scoped>
@import 'index.less';
</style>
