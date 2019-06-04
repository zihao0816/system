<template>
    <div class="pushStorage">
        <div class="page">
            <div class="title">
                <span>当前位置：</span>
                <span>入库</span>
            </div>
            <!-- <div class="card">
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                    <span></span>
                </div>
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                    <span></span>
                </div>
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                    <span></span>
                </div>
                <div>
                    <h3>999999</h3>
                    <p>当前库存药品种类（单位：个）</p>
                </div>
            </div> -->
            <div class="push">
                <div class="bills">
                    <p class="clearfix message"><span>待入库药品</span><span @click="centerDialogVisible = true">历史入库明细</span></p>
                    <el-form :show-message="false" :model="push" :rules="rules" ref="push" :inline="true" class="form-inline" label-width="120px">
                        <el-form-item label="归属库房：" prop="storageid">
                            <el-select placeholder="请选择" v-model="push.storageid" @change="storageChange(push)">
                                <el-option v-for="(item,index) in push.storageList" :key="index" :label="item.hospitaname" :value="index"></el-option>
                            </el-select>
                            <p>*请选择归属库房</p>
                        </el-form-item>
                        <el-form-item label="药材剂型：" prop="prescriptionshapeid">
                            <el-select placeholder="请选择" v-model="push.prescriptionshapeid" @change="brandChange(push)">
                                <el-option v-for="(item,index) in push.prescriptionList" :key="index" :label="item.itemname" :value="index"></el-option>
                            </el-select>
                            <p>*必选</p>
                        </el-form-item>
                        <el-form-item label="供应商：" prop="supplierid">
                            <el-select placeholder="请选择" v-model="push.supplierid" @change="supplierChange(push)">
                                <el-option v-for="(item,index) in push.supplierList" :key="index" :label="item.suppliername" :value="index"></el-option>
                            </el-select>
                            <p>*请选择供应商</p>
                        </el-form-item>
                        <el-form-item label="品牌商：" prop="brand.name">
                            <el-input :disabled="true" v-model="push.brand.name"></el-input>
                        </el-form-item>
                        <el-form-item label="药品名称：" prop="pmedicineid">
                            <el-select v-model="push.pmedicineid" @change="pmedicineChanges(push)" clearable filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading" placeholder="请输入药品名称">
                                <el-option v-for="(item,index) in push.pmedicineList" :key="item.id" :label="item.medicinename" :value="index"></el-option>
                            </el-select>
                            <p>*请输入药材包装名称</p>
                        </el-form-item>
                        <el-form-item label="药品快捷码：" prop="medicinecode">
                            <el-input :disabled="true" v-model="push.medicinecode"></el-input>
                        </el-form-item>
                        <el-form-item label="药材名称：" prop="medicinename">
                            <el-input :disabled="true" v-model="push.medicinename"></el-input>
                        </el-form-item>
                        <el-form-item label="包装规格：" prop="specification">
                            <el-input :disabled="true" v-model="push.specification"></el-input>
                            <p style="opacity:0;">隐藏</p>
                        </el-form-item>
                        <el-form-item label="计量单位：" prop="medicineunit">
                            <el-input :disabled="true" v-model="push.medicineunit"></el-input>
                        </el-form-item>
                        <el-form-item label="包装单位：" prop="packunit">
                            <el-input :disabled="true" v-model="push.packunit"></el-input>
                        </el-form-item>
                        <el-form-item label="存量上限：" prop="highstock">
                            <el-input v-model="push.highstock"></el-input>
                            <p>*必填</p>
                        </el-form-item>
                        <el-form-item label="存量下限：" prop="lowstock">
                            <el-input v-model="push.lowstock"></el-input>
                            <p>*必填</p>
                        </el-form-item>
                        <el-form-item label="进货单号：" prop="purchasecode">
                            <el-input v-model="push.purchasecode"></el-input>
                            <p>*请输入供应商单据号</p>
                        </el-form-item>
                        <el-form-item label="批次号：" prop="batchcode">
                            <el-input v-model="push.batchcode"></el-input>
                            <p style="color:#C1C1C1;">选填</p>
                        </el-form-item>
                        <el-form-item label="生产日期：" prop="productiondate">
                            <el-date-picker type="date" v-model="push.productiondate" placeholder="请选择" :picker-options="pickerOptions1"></el-date-picker>
                            <p style="color:#C1C1C1;">选填</p>
                        </el-form-item>
                        <el-form-item label="批发价格：" prop="tradeprice">
                            <el-input v-model="push.tradeprice"></el-input>
                            <p style="color:#C1C1C1;">选填</p>
                        </el-form-item>
                        <el-form-item label="进货价格：" prop="buyingprice">
                            <el-input v-model="push.buyingprice"></el-input>
                            <p>*必填</p>
                        </el-form-item>
                        <el-form-item label="包装数量：" prop="packagequantity">
                            <el-input @blur="calculateBlur(push)" v-model="push.packagequantity"></el-input>
                            <p>*必填</p>
                        </el-form-item>
                        <el-form-item label="当量值：" v-if="push.isshow" prop="equivalentvalue">
                            <el-input :disabled="true" v-model="push.equivalentvalue"></el-input>
                        </el-form-item>
                        <el-form-item class="only" label="入库数量：" prop="warehousequantity">
                            <el-input class="inputw" :disabled="true" v-model="push.warehousequantity"></el-input>
                            <el-input style="width:30%;" :disabled="true" v-model="push.warehousequantityunit"></el-input>
                            <span></span>
                        </el-form-item>
                        <el-form-item v-if="!push.isshow"></el-form-item>
                        <el-form-item>
                            <el-button size="mini" type="primary" @click="resetForm('push')">重置</el-button>
                            <el-button size="mini" type="primary" @click="addTemporaryList('push')">添加至列表</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="add-list">
                    <p class="clearfix message"><span class="titles">待入库列表</span><el-button size="mini" type="primary" @click="finish">完成入库</el-button></p>
                    <el-table border :data="temporaryData" style="width: 100%;" highlight-current-row>
                        <el-table-column fixed prop="purchasecode" label="进货单号" align="center"></el-table-column>
                        <el-table-column prop="prescriptionshapename" label="药材剂型" align="center"></el-table-column>
                        <el-table-column prop="suppliername" label="供应商" align="center"></el-table-column>
                        <el-table-column prop="medicinename" label="药材名称" align="center"></el-table-column>
                        <el-table-column prop="drugname" label="药品名称" align="center"></el-table-column>
                        <el-table-column prop="phoneticode" label="药品快捷码" align="center"></el-table-column>
                        <el-table-column prop="batchcode" label="批次号" align="center"></el-table-column>
                        <el-table-column prop="productiondate" label="生产日期" align="center"></el-table-column>
                        <el-table-column prop="warehousequantity" label="入库数量" align="center"></el-table-column>
                        <el-table-column prop="warehousetime" label="入库日期" align="center"></el-table-column>
                        <el-table-column prop="packspecification" label="包装规格" align="center"></el-table-column>
                        <el-table-column prop="packunit" label="包装单位" align="center"></el-table-column>
                        <el-table-column prop="tradeprice" label="批发价" align="center"></el-table-column>
                        <el-table-column prop="buyingprice" label="进货价" align="center"></el-table-column>
                        <el-table-column prop="brandname" label="品牌商" align="center"></el-table-column>
                        <el-table-column fixed="right" label="操作" align="center">
                            <template slot-scope="scope">
                                <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="delTemporaryList(scope.$index, scope.row)">移除</span>
                                <span style="font-size:14px;color:#07A591;text-decoration:underline;cursor: pointer;" @click="handleEdits(scope.$index, scope.row)">修改</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <el-dialog class="dialog-push" title="历史入库记录" :visible.sync="centerDialogVisible" width="60%" center>
                <el-form :inline="true" class="form-inline clearfix" label-width="100px">
                    <el-form-item label="入库时间：">
                        <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <div style="float:right">
                        <el-button type="primary" size="mini" @click="reset">重置</el-button>
                        <el-button type="primary" size="mini" @click="search">查询</el-button>
                    </div>
                </el-form>
                <el-table border :data="pushData" style="width: 100%;" highlight-current-row>
                    <el-table-column fixed prop="suppliername" label="供应商" ></el-table-column>
                    <el-table-column prop="medicinename" label="药品名称" ></el-table-column>
                    <el-table-column prop="prescriptionshapename" label="药品剂型"></el-table-column>
                    <el-table-column prop="phoneticode" label="快捷码" ></el-table-column>
                    <el-table-column prop="packspecification" label="包装规格" ></el-table-column>
                    <el-table-column prop="packunit" label="包装单位"></el-table-column>
                    <el-table-column prop="packagequantity" label="包装数量" ></el-table-column>
                    <el-table-column prop="tradeprice" label="批发价" ></el-table-column>
                    <el-table-column prop="buyingprice" label="进货价"></el-table-column>
                    <el-table-column prop="medicineprice" label="线上零售价" ></el-table-column>
                    <el-table-column prop="offretailprice" label="线下零售下" ></el-table-column>
                    <el-table-column prop="batchcode" width="120" label="批次号"></el-table-column>
                    <el-table-column prop="warehousequantity" label="入库数量" ></el-table-column>
                    <el-table-column prop="warehousetime" width="120" label="入库日期"></el-table-column>
                    <el-table-column label="入库单号" width="280">
                        <template slot-scope="scope">
                            <span style="color:#07A591;cursor: pointer;" @click="handleEdit(scope.$index, scope.row)">{{scope.row.warehousecode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" prop="username" label="操作人"></el-table-column>
                </el-table>
                <span slot="footer" class="dialog-footer clearfix">
                    <el-pagination style="float:right;" layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
                </span>
                <el-dialog class="dialog-pushDetails" :title="title" append-to-body :visible.sync="dialogPushDetail" width="60%" center>
                    <!-- <div class="see" style="display:flex;font-size:18px;margin-bottom:20px;">
                        <p style="margin-right:40px;">
                            <span>操作人：</span>
                            <span>张三丰</span>
                        </p>
                        <p style="margin-right:40px;">
                            <span>入库日期：</span>
                            <span>2018-09-01 12:00:09</span>
                        </p>
                        <p style="margin-right:40px;">
                            <span>入库药品数：</span>
                            <span>23</span>
                        </p>
                        <p>
                            <span>总入库金额：</span>
                            <span>200.14</span>
                        </p>
                    </div> -->
                    <el-table border :data="pushDetailDate" style="width: 100%;" highlight-current-row>
                        <el-table-column fixed prop="warehousecode" label="入库单号" width="280"></el-table-column>
                        <el-table-column prop="suppliername" label="供应商" ></el-table-column>
                        <el-table-column prop="medicinename" label="药品名称"></el-table-column>
                        <el-table-column prop="phoneticode" label="药品快捷码"></el-table-column>
                        <el-table-column prop="packspecification" label="包装规格"></el-table-column>
                        <el-table-column prop="packunit" label="包装单位"></el-table-column>
                        <el-table-column prop="medicineunit" label="计量单位"></el-table-column>
                        <el-table-column prop="tradeprice" label="批发价格" ></el-table-column>
                        <el-table-column prop="buyingprice" label="进货价格" ></el-table-column>
                        <el-table-column prop="medicineprice" label="线上零售价格"></el-table-column>
                        <el-table-column prop="offretailprice" label="线下零售价格"></el-table-column>
                        <el-table-column prop="batchcode" label="批次号"></el-table-column>
                        <el-table-column fixed="right" prop="warehousequantity" label="入库数量"></el-table-column>
                    </el-table>
                    <span slot="footer" class="dialog-footer clearfix">
                        <el-pagination style="float:right;" layout="prev, pager, next" :total="totals" :page-size="pageSizes" @current-change="handleCurrentChanges"></el-pagination>
                    </span>
                </el-dialog>
            </el-dialog>
            <el-dialog class="dialog-pushUpdate" title="修改待入库药品信息提醒" :visible.sync="dialogUpdatePush" width="60%" center>
                <p class="titles">待入库药品</p>
                <el-form :show-message="false" :model="pushUpdate" ref="pushUpdate" :rules="rulesUpdate" :inline="true" class="form-inline" label-width="120px">
                    <el-form-item label="归属库房：" prop="storageid">
                        <el-select placeholder="请选择" disabled v-model="pushUpdate.storageid">
                            <el-option v-for="(item,index) in pushUpdate.storageList" :key="index" :label="item.hospitaname" :value="index"></el-option>
                        </el-select>
                        <p>*请选择归属库房</p>
                    </el-form-item>
                    <el-form-item label="药材剂型：" prop="prescriptionshapeid">
                        <el-select placeholder="请选择" disabled v-model="pushUpdate.prescriptionshapeid" @change="brandChange(pushUpdate)">
                            <el-option v-for="(item,index) in pushUpdate.prescriptionList" :key="index" :label="item.itemname" :value="index"></el-option>
                        </el-select>
                        <p>*必选</p>
                    </el-form-item>
                    <el-form-item label="供应商：" prop="supplierid">
                        <el-select placeholder="请选择" disabled v-model="pushUpdate.supplierid">
                            <el-option v-for="(item,index) in pushUpdate.supplierList" :key="index" :label="item.suppliername" :value="index"></el-option>
                        </el-select>
                        <p>*请选择供应商</p>
                    </el-form-item>
                    <el-form-item label="品牌商：" prop="brand.name">
                        <el-input :disabled="true" v-model="pushUpdate.brand.name"></el-input>
                    </el-form-item>
                    <el-form-item label="药品名称：" prop="pmedicineid">
                        <el-select v-model="pushUpdate.pmedicineid" disabled @change="pmedicineChanges(pushUpdate)" clearable filterable remote reserve-keyword :remote-method="remoteMethodUpdate" :loading="loading" placeholder="请输入药品名称">
                            <el-option v-for="(item,index) in pushUpdate.pmedicineList" :key="item.id" :label="item.medicinename" :value="index"></el-option>
                        </el-select>
                        <p>*请输入药材包装名称</p>
                    </el-form-item>
                    <el-form-item label="药品快捷码：" prop="medicinecode">
                        <el-input :disabled="true" v-model="pushUpdate.medicinecode"></el-input>
                    </el-form-item>
                    <el-form-item label="药材名称：" prop="medicinename">
                        <el-input :disabled="true" v-model="pushUpdate.medicinename"></el-input>
                    </el-form-item>
                    <el-form-item label="包装规格：" prop="specification">
                        <el-input :disabled="true" v-model="pushUpdate.specification"></el-input>
                        <p style="opacity:0;">隐藏</p>
                    </el-form-item>
                    <el-form-item label="计量单位：" prop="medicineunit">
                        <el-input :disabled="true" v-model="pushUpdate.medicineunit"></el-input>
                    </el-form-item>
                    <el-form-item label="包装单位：" prop="packunit">
                        <el-input :disabled="true" v-model="pushUpdate.packunit"></el-input>
                    </el-form-item>
                    <el-form-item label="存量上限：" prop="highstock">
                        <el-input v-model="pushUpdate.highstock"></el-input>
                        <p>*必填</p>
                    </el-form-item>
                    <el-form-item label="存量下限：" prop="lowstock">
                        <el-input v-model="pushUpdate.lowstock"></el-input>
                        <p>*必填</p>
                    </el-form-item>
                    <el-form-item label="进货单号：" prop="purchasecode">
                        <el-input v-model="pushUpdate.purchasecode"></el-input>
                        <p>*请输入供应商单据号</p>
                    </el-form-item>
                    <el-form-item label="批次号：" prop="batchcode">
                        <el-input v-model="pushUpdate.batchcode"></el-input>
                        <p style="color:#C1C1C1;">选填</p>
                    </el-form-item>
                    <el-form-item label="生产日期：" prop="productiondate">
                        <el-date-picker type="date" v-model="pushUpdate.productiondate" placeholder="请选择" :picker-options="pickerOptions1"></el-date-picker>
                        <p style="color:#C1C1C1;">选填</p>
                    </el-form-item>
                    <el-form-item label="批发价格：" prop="tradeprice">
                        <el-input v-model="pushUpdate.tradeprice"></el-input>
                        <p style="color:#C1C1C1;">选填</p>
                    </el-form-item>
                    <el-form-item label="进货价格：" prop="buyingprice">
                        <el-input v-model="pushUpdate.buyingprice"></el-input>
                        <p>*必填</p>
                    </el-form-item>
                    <el-form-item label="包装数量：" prop="packagequantity">
                        <el-input @blur="calculateBlur(pushUpdate)" v-model="pushUpdate.packagequantity"></el-input>
                        <p>*必填</p>
                    </el-form-item>
                    <el-form-item label="当量值：" v-if="pushUpdate.isshow" prop="equivalentvalue">
                        <el-input :disabled="true" v-model="pushUpdate.equivalentvalue"></el-input>
                    </el-form-item>
                    <el-form-item label="入库数量：" class="only" prop="warehousequantity">
                        <el-input style="width:60%;" :disabled="true" v-model="pushUpdate.warehousequantity"></el-input>
                        <el-input style="width:36%;" :disabled="true" v-model="pushUpdate.warehousequantityunit"></el-input>
                        <span></span>
                    </el-form-item>
                    <el-form-item v-if="!pushUpdate.isshow"></el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="resetForms(pushUpdate)">重置</el-button>
                        <el-button size="mini" type="primary" @click="updateTemporaryList('pushUpdate')">添加至列表</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog class="dialog-pushDel" title="移除列表提醒" :visible.sync="dialogDelPush" width="18%" center>
                <p style="font-size:16px;">即将把“{{thismedicine}}”药品移除当前待入库列表。</p>
                <p style="margin:20px 0;font-size:16px;">确认移除？</p>
                <div style="text-align:center;">
                    <el-button type="primary" size="mini" @click="confirmDel">确认移除</el-button>
                    <el-button type="primary" size="mini" @click="dialogDelPush = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<style lang="less">
    @import "index.less";
</style>
<script>
import common from '../../api/common.js'
    export default {
        components: {
            
        },
        data() {
            return {
                loading: false,
                centerDialogVisible: false,
                dialogPushDetail: false,
                dialogUpdatePush: false,
                dialogDelPush: false,
                pushData:[],
                pushDetailDate: [],
                total:0,
                pagination: 1,
                pageSize: 10,
                totals:0,
                paginations: 1,
                pageSizes: 10,
                title: '',
                warehousecode: '',
                temporaryData: [],  //临时入库信息
                push: {
                    isshow: false,
                    storageid: '',  //库房下标，以便取数据
                    storageList: [],  //归属库房
                    prescriptionshapeid: '',  //药材剂型下标，以便取数据
                    prescriptionList: [],  //药材剂型
                    supplierid: '',   //供应商下标
                    supplierList: [],  //供应商
                    brand: {},   //品牌商
                    pmedicineid: '',   //药品下标
                    pmedicineList: [],  //药品
                    list:[],
                    medicinecode: '',   //药品快捷码
                    medicinename: '',   //药材名称
                    specification: '',  //包装规格
                    medicineunit: '',   //计量单位
                    packunit: '',   //包装单位
                    highstock: '',  //存量上线
                    lowstock: '',   //存量下限
                    purchasecode: '',   //进货单号
                    batchcode: '',   //批次号
                    productiondate: '',   //生产日期
                    tradeprice: '',   //批发价格
                    buyingprice: '',   //进货价格
                    packagequantity: '',   //包装数量
                    equivalentvalue: '',   //当量值
                    warehousequantity: '',   //入库数量
                    warehousequantityunit: ''  //入库数量单位
                },
                rules:{
                    storageid: [{required: true,trigger: 'blur'}],  //库房下标，以便取数据
                    prescriptionshapeid: [{required: true,trigger: 'blur'}],  //药材剂型下标，以便取数据
                    supplierid: [{required: true,trigger: 'blur'}],   //供应商下标
                    brand: [{required: true}],   //品牌商
                    pmedicineid: [{required: true,trigger: 'blur'}],   //药品下标
                    medicinecode: [{required: true}],   //药品快捷码
                    medicinename: [{required: true}],   //药材名称
                    specification: [{required: true}],  //包装规格
                    medicineunit: [{required: true}],   //计量单位
                    packunit: [{required: true}],   //包装单位
                    highstock: [{required: true}],  //存量上线
                    lowstock: [{required: true}],   //存量下限
                    purchasecode: [{required: true}],   //进货单号
                    batchcode: [{required: false}],   //批次号
                    productiondate: [{required: false}],   //生产日期
                    tradeprice: [{required: false}],   //批发价格
                    buyingprice: [{required: true}],   //进货价格
                    packagequantity: [{required: true}],   //包装数量
                    equivalentvalue: [{required: true}],   //当量值
                    warehousequantity: [{required: true}],   //入库数量
                },
                pushUpdate: {
                    isshow: false,   //剂型对应显示的内容
                    storageid: '',  //库房下标，以便取数据
                    storageList: [],  //归属库房
                    prescriptionshapeid: '',  //药材剂型下标，以便取数据
                    prescriptionList: [],  //药材剂型
                    supplierid: '',   //供应商下标
                    supplierList: [],  //供应商
                    brand: {},   //品牌商
                    pmedicineid: '',   //药品下标
                    pmedicineList: [],  //药品
                    list:[],
                    medicinecode: '',   //药品快捷码
                    medicinename: '',   //药材名称
                    specification: '',  //包装规格
                    medicineunit: '',   //计量单位
                    packunit: '',   //包装单位
                    highstock: '',  //存量上线
                    lowstock: '',   //存量下限
                    purchasecode: '',   //进货单号
                    batchcode: '',   //批次号
                    productiondate: '',   //生产日期
                    tradeprice: '',   //批发价格
                    buyingprice: '',   //进货价格
                    packagequantity: '',   //包装数量
                    equivalentvalue: '',   //当量值
                    warehousequantity: '',   //入库数量
                    warehousequantityunit: ''  //入库数量单位
                },
                rulesUpdate:{
                    storageid: [{required: true,trigger: 'blur'}],  //库房下标，以便取数据
                    prescriptionshapeid: [{required: true,trigger: 'blur'}],  //药材剂型下标，以便取数据
                    supplierid: [{required: true,trigger: 'blur'}],   //供应商下标
                    brand: [{required: true}],   //品牌商
                    pmedicineid: [{required: true,trigger: 'blur'}],   //药品下标
                    medicinecode: [{required: true}],   //药品快捷码
                    medicinename: [{required: true}],   //药材名称
                    specification: [{required: true}],  //包装规格
                    medicineunit: [{required: true}],   //计量单位
                    packunit: [{required: true}],   //包装单位
                    highstock: [{required: true}],  //存量上线
                    lowstock: [{required: true}],   //存量下限
                    purchasecode: [{required: true}],   //进货单号
                    batchcode: [{required: false}],   //批次号
                    productiondate: [{required: false}],   //生产日期
                    tradeprice: [{required: false}],   //批发价格
                    buyingprice: [{required: true}],   //进货价格
                    packagequantity: [{required: true}],   //包装数量
                    equivalentvalue: [{required: true}],   //当量值
                    warehousequantity: [{required: true}],   //入库数量
                },
                thismedicine: '',  //当前药品
                thisDelId: '',   //当前删除id
                thisRow: {},   //当前查看的数据
                date: '',
                starttime: '',
                endtime: '',
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                }
            }
        },
        //生命周期之创建完成
        created: function(){
            this.query();
            this.queryCondition();
            this.queryStorage();
            this.queryBrand();
            this.querySupplier();
            this.pmedicineChange(this.push);
            this.pmedicineChange(this.pushUpdate);
        },
        //生命周期之挂载完成
        methods: {
            queryStorage(){
                this.$doRequest('/api/hospitainfo/getHLists',null,res =>{
                    this.push.storageList = res.parameters;
                    this.pushUpdate.storageList = res.parameters;
                });
            },
            queryBrand(){
                this.$doRequest('/api/Inquiry/getbrand',null,res =>{
                    this.push.prescriptionList = res.parameters;
                    this.pushUpdate.prescriptionList = res.parameters;
                });
            },
            querySupplier(){
                this.$doRequest('/api/supplier/getSupplierList',{},res=>{
                    this.push.supplierList = res.parameters;
                    this.pushUpdate.supplierList = res.parameters;
                });
            },
            query(){
                if(sessionStorage.getItem('temporaryData')){
                    this.temporaryData = JSON.parse(sessionStorage.getItem('temporaryData'))
                }
            },
            queryCondition(){
                var cnameid = JSON.parse(sessionStorage.getItem('userInfo')).cnameid;
                var data = {
                    pagination: this.pagination,
                    condition: {
                        hospitaid: cnameid,
                        starttime: this.starttime,
                        endtime: this.endtime
                    }
                }
                this.$doRequest('/api/medicinetostoragedetails/queryPageByCondition',data,res=>{
                    for(var i=0;i<res.parameters.rows.length;i++){
                        res.parameters.rows[i].warehousetime = common.timestampToTime(res.parameters.rows[i].warehousetime,2)
                    }
                    this.pushData = res.parameters.rows;
                    this.total = res.parameters.total;
                })
            },
            queryConditionDetail(id){
                var cnameid = JSON.parse(sessionStorage.getItem('userInfo')).cnameid;
                var data = {
                    "pagination": this.paginations,
                    "condition": {
                        "hospitaid": cnameid,
                        "warehousecode": id
                    }
                }
                this.$doRequest('/api/medicinetostoragedetails/queryPageByCondition',data,res=>{
                    this.pushDetailDate = res.parameters.rows;
                    this.totals = res.parameters.total;
                })
            },
            handleCurrentChange(val){
                this.pagination = val + 1;
                this.queryCondition();
            },
            handleCurrentChanges(val){
                this.paginations = val + 1;
                this.queryConditionDetail(this.warehousecode);
            },
            handleEdit(index,row){
                this.dialogPushDetail = true;
                this.warehousecode = row.warehousecode;
                this.queryConditionDetail(row.warehousecode);
                this.title = "“入库单号"+row.warehousecode+"”————入库明细";
            },
            handleEdits(index,row){
                this.thisRow = row;
                this.dialogUpdatePush = true;
                if(row.prescriptionshapename == '颗粒'){
                    this.pushUpdate.isshow = true;
                }else{
                    this.pushUpdate.isshow = false;
                }
                this.pushUpdate.storageid = row.hospitaname;
                this.pushUpdate.prescriptionshapeid = row.prescriptionshapename;
                this.pushUpdate.supplierid = row.suppliername;
                this.pushUpdate.brand.id = row.brandid;
                this.pushUpdate.brand.name = row.brandname;
                this.pushUpdate.pmedicineid = row.drugname;
                this.pushUpdate.medicinecode = row.phoneticode;
                this.pushUpdate.medicinename = row.medicinename;
                this.pushUpdate.specification = row.packspecification;
                this.pushUpdate.medicineunit = row.medicineunit;
                this.pushUpdate.packunit = row.packunit;
                this.pushUpdate.highstock = row.highstock;
                this.pushUpdate.lowstock = row.lowstock;
                this.pushUpdate.purchasecode = row.purchasecode;
                this.pushUpdate.batchcode = row.batchcode;
                this.pushUpdate.productiondate = row.productiondate
                this.pushUpdate.tradeprice = row.tradeprice;
                this.pushUpdate.buyingprice = row.buyingprice;
                this.pushUpdate.packagequantity = row.packagequantity;
                this.pushUpdate.equivalentvalue = row.equivalentvalue;
                this.pushUpdate.warehousequantity = row.warehousequantity;
                this.pushUpdate.warehousequantityunit = row.medicineunit;
            },
            storageChange(data){
                data.prescriptionList = [];
                data.supplierid = '';
                data.supplierList = [];
                data.brand = {};
                this.resetItem(data);
                this.queryBrand();
                this.querySupplier();
            },
            brandChange(data){
                var index = data.prescriptionshapeid;
                if(index == 0){
                    this.push.isshow = true;
                }else{
                    this.push.isshow = false;
                }
                data.brand.name = data.prescriptionList[index].prescriptionshapebrands[0].itemname;
                data.brand.id = data.prescriptionList[index].prescriptionshapebrands[0].itemcode;  
                this.resetItem(data);
            },
            resetItem(data){
                data.pmedicineList = [];
                data.list = [];
                data.pmedicineid = '';
                data.medicinecode = ''; 
                data.medicinename = '';   
                data.specification = '';  
                data.medicineunit = '';  
                data.packunit = '';   
                data.highstock = '';  
                data.lowstock = ''; 
            },
            pmedicineChange(data){
                var that = this;
                // var a = data.prescriptionshapeid !== ""? data.prescriptionList[data.prescriptionshapeid].itemcode : '';
                var datas = {
                    brandid: data.brand.id ? data.brand.id : '',
                    prescriptionshapeid: data.prescriptionshapeid !== "" ? data.prescriptionList[data.prescriptionshapeid].itemcode : '',
                    hospitaid: data.storageid !== "" ? data.storageList[data.storageid].id : '',
                    supplierid: data.supplierid !== "" ? data.supplierList[data.supplierid].id : ''
                }
                this.$doRequest('/api/pharmacymedicines/getpmedicineLists',datas,res=>{
                    data.list = res.parameters
                })
            },
            pmedicineChanges(data){  
                if(data.pmedicineid !== null && data.pmedicineid !== ''){
                    var medicinename = data.pmedicineList[data.pmedicineid].medicinename;
                    this.$doRequest('/api/PhMedicine/getDimName',{medicinename:medicinename},res=>{
                        data.medicinecode = res.parameters;
                    })
                    data.medicinename = data.pmedicineList[data.pmedicineid].medname;
                    data.specification = data.pmedicineList[data.pmedicineid].packspecification;
                    data.medicineunit = data.pmedicineList[data.pmedicineid].medicineunit;
                    data.packunit = data.pmedicineList[data.pmedicineid].packunit;
                    data.equivalentvalue = data.pmedicineList[data.pmedicineid].equivalentvalue;
                    
                    data.highstock = data.pmedicineList[data.pmedicineid].highstock;
                    data.lowstock = data.pmedicineList[data.pmedicineid].lowstock;
                }else{
                    data.medicinecode = "";
                    data.medicinename = "";
                    data.specification = "";
                    data.medicineunit = "";
                    data.packunit = "";
                    data.equivalentvalue = "";
                    data.warehousequantity = "";
                    data.warehousequantityunit = "";
                    data.highstock = "";
                    data.lowstock = "";
                }
            },
            supplierChange(data){
                this.resetItem(data);
            },
            calculateBlur(data){
                var datas = {};
                if(data.packagequantity != null && data.packagequantity != ''){
                    if(data.prescriptionshapeid == 1 || data.prescriptionshapeid == '饮片'){
                        if(data.packunit != null && data.packunit != ''){
                            datas = {
                                prescriptionshapeid: data.prescriptionList[1].itemcode,
                                packunit: data.packunit,
                                packagequantity: data.packagequantity
                            }
                        }
                    }
                    if(data.prescriptionshapeid == 0 || data.prescriptionshapeid == '颗粒'){
                        if(data.packunit != null && data.packunit != '' && data.equivalentvalue != null && data.equivalentvalue != ''){
                            datas = {
                                prescriptionshapeid: data.prescriptionList[0].itemcode,
                                packunit: data.packunit,
                                packagequantity: data.packagequantity,
                                equivalentvalue: data.equivalentvalue
                            }
                        }
                    }
                }
                if(datas != ''){
                    this.$doRequest('/api/PhMedicine/calculateQuantity',datas,res=>{
                        data.warehousequantity = res.parameters;
                        data.warehousequantityunit = data.pmedicineList[data.pmedicineid].medicineunit ? data.pmedicineList[data.pmedicineid].medicineunit : data.warehousequantityunit;
                    })
                }
            },
            remoteMethod(query){
                if (query !== '') {
                    var code = query.toLowerCase();
                    this.loading = true;
                    var drugList = this.push.list;
                    this.loading = false;
                    var list = drugList.map(item =>{
                        return {
                            id: item.id,
                            medicineid: item.medicineid,
                            medicinename:item.medicinename,
                            medicineprice:item.medicineprice,
                            medicineunit:item.medicineunit,
                            packspecification:item.packspecification,
                            medname: item.medname,
                            equivalentvalue: item.equivalentvalue,
                            packunit: item.packunit,
                            phoneticode:item.phoneticode,
                            codeList: item.phoneticode != '' ? item.phoneticode.split(',') : item.phoneticode,
                            highstock: item.highstock,
                            lowstock: item.lowstock
                        }
                    })
                    this.push.pmedicineList = list.filter(item => {
                        var codes = item.codeList;
                        for(var i=0;i<codes.length;i++){
                            if(codes[i].indexOf(code) > -1){
                                return true;
                            }
                        }
                        if(item.medicinename.indexOf(code) > -1){
                            return true;
                        }
                        return false;
                    });
                } else {
                    this.push.pmedicineList = [];
                }
            },
            remoteMethodUpdate(query){
                if (query !== '') {
                    var code = query.toLowerCase();
                    this.loading = true;
                    var drugList = this.pushUpdate.list;
                    this.loading = false;
                    var list = drugList.map(item =>{
                        return {
                            id: item.id,
                            medicineid: item.medicineid,
                            medicinename:item.medicinename,
                            medicineprice:item.medicineprice,
                            medicineunit:item.medicineunit,
                            packspecification:item.packspecification,
                            medname: item.medname,
                            equivalentvalue: item.equivalentvalue,
                            packunit: item.packunit,
                            phoneticode:item.phoneticode,
                            codeList: item.phoneticode != '' ? item.phoneticode.split(',') : item.phoneticode,
                            highstock: item.highstock,
                            lowstock: item.lowstock
                        }
                    })
                    this.pushUpdate.pmedicineList = list.filter(item => {
                        var codes = item.codeList;
                        for(var i=0;i<codes.length;i++){
                            if(codes[i].indexOf(code) > -1){
                                return true;
                            }
                        }
                        if(item.medicinename.indexOf(code) > -1){
                            return true;
                        }
                        return false;
                    });
                } else {
                    this.pushUpdate.pmedicineList = [];
                }
            },
            addTemporaryList(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var list = this.push;
                        var date = new Date(),
                            year = date.getFullYear(),
                            month = date.getMonth()+1,
                            day = date.getDate();
                        if(month < 10){
                            month = '0' + month;
                        }
                        if(day < 10){
                            day = '0' + day;
                        }
                        
                        if(list.productiondate != ''){
                            var productiondate = new Date(list.productiondate),
                            pyear = productiondate.getFullYear(),
                            pmonth = productiondate.getMonth()+1,
                            pday = productiondate.getDate();
                            if(pmonth < 10){
                                pmonth = '0' + pmonth;
                            }
                            if(pday < 10){
                                pday = '0' + pday;
                            }
                        }
                        if(list.lowstock >= list.highstock){
                            this.$dialogMsg('存量下线不能大于存量上限','error');
                            return;
                        }
                        var data = {
                            id: list.pmedicineList[list.pmedicineid].id,  //药品id
                            hospitaid: list.storageList[list.storageid].id,  //库房id
                            hospitaname: list.storageList[list.storageid].hospitaname,   //库房名称
                            prescriptionshapeid: list.prescriptionList[list.prescriptionshapeid].itemcode,  //药材剂型id
                            prescriptionshapename: list.prescriptionList[list.prescriptionshapeid].itemname,   //药材剂型名称
                            supplierid: list.supplierList[list.supplierid].id,  //供应商id
                            suppliername: list.supplierList[list.supplierid].suppliername,   //供应商名称
                            brandid: list.brand.id, //品牌商itemcode
                            brandname: list.brand.name,  //品牌商name
                            drugname: list.pmedicineList[list.pmedicineid].medicinename,  //药品名称
                            phoneticode: list.medicinecode,  //药品快捷码
                            medicinename: list.medicinename,  //药材名称
                            medicineid: list.pmedicineList[list.pmedicineid].medicineid,  //药材id
                            packspecification: list.specification,  //包装规格
                            medicineunit: list.medicineunit,   //计量单位
                            packunit: list.packunit,  //包装单位
                            highstock: list.highstock,  //存量上线
                            lowstock: list.lowstock,   //存量下限
                            purchasecode: list.purchasecode,   //进货单号
                            batchcode: list.batchcode,  //批次号
                            productiondate: list.productiondate =='' ? '' : pyear + '-' + pmonth + '-' + pday,  //生产日期
                            tradeprice: list.tradeprice,  //批发价
                            buyingprice: list.buyingprice,  //进货价
                            packagequantity: list.packagequantity,   //包装数量
                            equivalentvalue: list.equivalentvalue,   //当量值
                            warehousequantity: list.warehousequantity,  //入库数量
                            warehousetime: year + '-' + month + '-' + day, //入库日期
                            updateby: JSON.parse(sessionStorage.getItem('userInfo')).id  //当前操作人
                        }
                        this.temporaryData.push(data);
                        sessionStorage.setItem('temporaryData',JSON.stringify(this.temporaryData));
                        this.resetForm('push');
                    } else {
                        return false;
                    }
                });
            },
            delTemporaryList(index,row){
                this.dialogDelPush = true;
                this.thismedicine = row.drugname;
                this.thisDelId = row.id;
            },
            updateTemporaryList(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var list = this.pushUpdate;
                        var oldList = this.thisRow;
                        var temporaryData = this.temporaryData;
                        var date = new Date(),
                            year = date.getFullYear(),
                            month = date.getMonth()+1,
                            day = date.getDate();
                        if(month < 10){
                            month = '0' + month;
                        }
                        if(day < 10){
                            day = '0' + day;
                        }
                        if(list.productiondate != ''){
                            var productiondate = new Date(list.productiondate),
                            pyear = productiondate.getFullYear(),
                            pmonth = productiondate.getMonth()+1,
                            pday = productiondate.getDate();
                            if(pmonth < 10){
                                pmonth = '0' + pmonth;
                            }
                            if(pday < 10){
                                pday = '0' + pday;
                            }
                        }
                        var data = {
                            id: list.pmedicineid == oldList.drugname ? oldList.id : list.pmedicineList[list.pmedicineid].id,  //药品id
                            hospitaid: list.storageid == oldList.hospitaname ? oldList.hospitaid : list.storageList[list.storageid].id,  //库房id
                            hospitaname: list.storageid == oldList.hospitaname ? oldList.hospitaname : list.storageList[list.storageid].hospitaname,   //库房名称
                            prescriptionshapeid: list.prescriptionshapeid == oldList.prescriptionshapename ? oldList.prescriptionshapeid : list.prescriptionList[list.prescriptionshapeid].itemcode,  //药材剂型id
                            prescriptionshapename: list.prescriptionshapeid == oldList.prescriptionshapename ? oldList.prescriptionshapename : list.prescriptionList[list.prescriptionshapeid].itemname,   //药材剂型名称
                            supplierid: list.supplierid == oldList.suppliername ? oldList.supplierid : list.supplierList[list.supplierid].id,  //供应商id
                            suppliername: list.supplierid == oldList.suppliername ? oldList.suppliername : list.supplierList[list.supplierid].suppliername,   //供应商名称
                            brandid: list.brand.id, //品牌商itemcode
                            brandname: list.brand.name,  //品牌商name
                            drugname: list.pmedicineid == oldList.drugname ? oldList.drugname: list.pmedicineList[list.pmedicineid].medicinename,  //药品名称
                            phoneticode: list.medicinecode,  //药品快捷码
                            medicinename: list.medicinename,  //药材名称
                            medicineid: list.pmedicineid == oldList.drugname ? oldList.medicineid : list.pmedicineList[list.pmedicineid].medicineid,  //药材id
                            packspecification: list.specification,  //包装规格
                            medicineunit: list.medicineunit,   //计量单位
                            packunit: list.packunit,  //包装单位
                            highstock: list.highstock,  //存量上线
                            lowstock: list.lowstock,   //存量下限
                            purchasecode: list.purchasecode,   //进货单号
                            batchcode: list.batchcode,  //批次号
                            productiondate: list.productiondate != '' ? pyear + '-' + pmonth + '-' + pday : list.productiondate,  //生产日期
                            tradeprice: list.tradeprice,  //批发价
                            buyingprice: list.buyingprice,  //进货价
                            packagequantity: list.packagequantity,   //包装数量
                            equivalentvalue: list.equivalentvalue,   //当量值
                            warehousequantity: list.warehousequantity,  //入库数量
                            warehousetime: year + '-' + month + '-' + day, //入库日期
                            updateby: JSON.parse(sessionStorage.getItem('userInfo')).id  //当前操作人
                        }
                        for(var i=0;i<temporaryData.length;i++){
                            if(temporaryData[i].id == oldList.id){
                                temporaryData[i] = data;
                            }
                        }
                        this.temporaryData = temporaryData;
                        sessionStorage.setItem('temporaryData',JSON.stringify(this.temporaryData));
                        this.dialogUpdatePush = false;
                        this.query();
                    } else {
                        return false;
                    }
                });
            },
            confirmDel(){
                var list = this.temporaryData;
                var newList = [];
                var that = this;
                for(var i=0;i<list.length;i++){
                    if(list[i].id != that.thisDelId){
                        newList.push(list[i]);
                    }
                }
                this.temporaryData = newList;
                sessionStorage.setItem('temporaryData',JSON.stringify(this.temporaryData));
                this.dialogDelPush = false;
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            resetForms(data){
                data.highstock = '';  
                data.lowstock = '';   
                data.purchasecode = '';   
                data.batchcode = '';   
                data.productiondate = '';   
                data.tradeprice = '';   
                data.buyingprice = '';   
                data.packagequantity = '';   
                data.warehousequantity = '';   
            },
            finish(){
                var data = this.temporaryData;
                this.$doRequest('/api/PhMedicine/finishWarehouse',data,res=>{
                    this.$dialogMsg(res.message,'success');
                    this.temporaryData = [];
                    sessionStorage.setItem('temporaryData',JSON.stringify(this.temporaryData));
                })
            },
            search(){
                this.paginations = 1;
                this.starttime = this.date[0];
                this.endtime = this.date[1];
                this.queryCondition();
            },
            reset(){
                this.date = '';
                this.starttime = '';
                this.endtime = '';
            }
        },
        computed: {
            storageid(){
                return this.push.storageid;
            },
            brandid(){
                return this.push.brand.id;
            },
            prescriptionshapeid(){
                return this.push.prescriptionshapeid;
            },
            supplierid(){
                return this.push.supplierid;
            },
            ustorageid(){
                return this.pushUpdate.storageid;
            },
            ubrandid(){
                return this.pushUpdate.brand.id;
            },
            uprescriptionshapeid(){
                return this.pushUpdate.prescriptionshapeid;
            },
            usupplierid(){
                return this.pushUpdate.supplierid;
            }
        },
        watch:{
            storageid(newValue,old){
                this.pmedicineChange(this.push)
            },
            brandid(newValue,old){
                this.pmedicineChange(this.push)
            },
            prescriptionshapeid(newValue,old){
                this.pmedicineChange(this.push)
            },
            supplierid(newValue,old){
                this.pmedicineChange(this.push)
            },
            ustorageid(newValue,old){
                this.pmedicineChange(this.pushUpdate)
            },
            ubrandid(newValue,old){
                this.pmedicineChange(this.pushUpdate)
            },
            uprescriptionshapeid(newValue,old){
                this.pmedicineChange(this.pushUpdate)
            },
            usupplierid(newValue,old){
                this.pmedicineChange(this.pushUpdate)
            }
        }
    }
</script>

