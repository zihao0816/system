/**
 * Created by Girl on 2018/7/18.
 */
//药方查询、编辑
var prescription =      '<div style="height: 380px;overflow-y: auto;overflow-x: hidden">'+
                            '<form role="form" class="formWidth" >'+
                                '<div class="p-title">'+
                                    '<h4>药方订单</h4>'+
                                '</div>'+
                                '<div class="p-content">'+
                                    '<div class="c-message">'+
                                        '<table cellspacing="0" cellpadding="0" border="0" class="clearfix">'+
                                            '<tr>'+
                                                '<td><label>订单号：</label><span id="p_ordercode"></span></td>'+
                                                '<td><label>问诊类型：</label><span id="p_servicename"></span></td>'+
                                                '<td><label>问诊医生：</label><span id="p_doctorname"></span></td>'+
                                                '<td><label>问诊患者：</label><span id="p_patientname"></span></td>'+
                                                '<td><label>处方：</label><span id="p_prescriptionname"></span></td>'+
                                                '<td><label>收货人：</label><span id="p_receiver"></span></td>'+
                                                '<td><label>联系方式：</label><span id="p_telephone"></span></td>'+
                                                '<td><label>收货地址：</label><span id="p_address"></span></td>'+
                                                '<td><label>下单时间：</label><span id="p_buytime"></span></td>'+
                                            '</tr>'+
                                        '</table>'+
                                    '</div>'+
                                    '<div class="c-prescription">'+
                                        '<p style="font-weight: 600;font-size: 16px;">R：</p>'+
                                        '<ul class="clearfix" id="p_medicines">'+
                                            
                                        '</ul>'+
                                        '<p class="clearfix">'+
                                            '<label>用药说明：</label>'+
                                            '<span>共<span class="span-style" id="p_totaldosage"></span>剂，每日<span class="span-style" id="p_daydosage"></span>剂，每剂分<span class="span-style" id="p_taketime"></span>次服用</span>'+
                                            '<span class="fr"><label>药态：</label><span id="p_prescriptionshape"></span></span>'+
                                        '</p>'+
                                        '<p><label>特殊医嘱：</label><span id="p_specialadvice"></span></p>'+
                                        '<p><label>用药禁忌：</label><span id="p_taboo"></span></p>'+
                                    '</div>'+
                                    '<div style="margin-top:6px;">'+
                                        '<label>煎药说明：</label>'+
                                        '<ul class="medicinelist"></ul>'+
                                    '</div>'+
                                    '<div class="c-pay">'+
                                        '<p class="clearfix">'+
                                            '<label>服务剩余时间：</label>'+
                                            '<span id="p_lasttime"></span>'+
                                            '<span class="fr">'+
                                                '<label>订单总价：</label>'+
                                                '<span id="p_totalprice"></span>'+
                                            '</span>'+
                                        '</p>'+
                                        '<p class="clearfix">'+
                                            '<span class="s-style">'+
                                                '<label>付款时间：</label>'+
                                                '<span id="p_paytime"></span>'+
                                            '</span>'+
                                            '<span class="s-style">'+
                                                '<label>支付方式：</label>'+
                                                '<span>微信支付</span>'+
                                            '</span>'+
                                            '<span>'+
                                                '<label>配送方式：</label>'+
                                                '<span id="p_sendcompany">顺丰快递&ensp;货到付款</span>'+
                                            '</span>'+
                                            '<span class="fr">'+
                                                '<label>支付状态：</label>'+
                                                '<span id="p_paystate"></span>'+
                                            '</span>'+
                                        '</p>'+
                                    '</div>'+
                                '</div>'+
                            '</form>'+
                            '<div class="c-time clearfix">'+
                                '<label class="fl t-title">增加服务时间</label>'+
                                '<div class="fl t-hour">'+
                                    '<span class="s1" id="prescriptionminusbtn">-</span>'+
                                    '<span class="s2"><span class="number" id="prescriptionAddTime">1</span>/小时</span>'+
                                    '<span class="s3" id="prescriptionaddbtn">+</span>'+
                                '</div>'+
                                '<span class="fl" style="color: #7baeea;">'+
                                    '<label>服务剩余时间：</label>'+
                                    '<span id="p_lasttime2"></span>'+
                                '</span>'+
                            '</div>'+
                        '</div>';
//问诊单查询、编辑
var inquiry =   '<div style="height: 380px;overflow-y: auto;overflow-x: hidden" class="msg_list">'+
                    // '<form role="form" class="formWidth">'+
                    //     '<div class="p-title">'+
                    //         '<h4>问诊订单</h4>'+
                    //     '</div>'+
                    //     '<div class="p-content">'+
                    //         '<div class="c-message">'+
                    //             '<p class="clearfix">'+
                    //                 '<span class="fl">'+
                    //                     '<label>订单号：</label>'+
                    //                     '<span id="i_ordercode"></span>'+
                    //                 '</span>'+
                    //                 '<span class="fr">'+
                    //                     '<label>下单时间：</label>'+
                    //                     '<span id="i_buytime"></span>'+
                    //                 '</span>'+
                    //             '</p>'+
                    //             '<p class="clearfix">'+
                    //                 '<span class="fl">'+
                    //                     '<label>问诊医生：</label>'+
                    //                     '<span id="i_doctorname"></span>'+
                    //                 '</span>'+
                    //                 '<span class="fr">'+
                    //                     '<label>问诊患者：</label>'+
                    //                     '<span id="i_patientname"></span>'+
                    //                 '</span>'+
                    //             '</p>'+
                    //         '</div>'+
                    //         '<div class="c-prescription clearfix" style="padding-bottom: 10px;">'+
                    //             '<div class="fl">'+
                    //                 '<label>类型：</label>'+
                    //                 '<div id="i_servicename"></div>'+
                    //             '</div>'+
                    //             '<div class="fr">'+
                    //                 '<label>单价：</label>'+
                    //                 '<div id="i_orderprice"></div>'+
                    //             '</div>'+
                    //         '</div>'+
                    //         '<div class="c-pay">'+
                    //             '<p class="clearfix">'+
                    //                 '<label>服务剩余时间：</label>'+
                    //                 '<span id="i_lasttime"></span>'+
                    //                 '<span class="fr">'+
                    //                     '<label>订单总价：</label>'+
                    //                     '<span id="i_totalprice"></span>'+
                    //                 '</span>'+
                    //             '</p>'+
                    //             '<p class="clearfix">'+
                    //                 '<span class="s-style">'+
                    //                     '<label>付款时间：</label>'+
                    //                     '<span id="i_paytime"></span>'+
                    //                 '</span>'+
                    //                 '<span class="s-style">'+
                    //                     '<label>支付方式：</label>'+
                    //                     '<span>微信支付</span>'+
                    //                 '</span>'+
                    //                 '<span class="fr">'+
                    //                     '<label>支付状态：</label>'+
                    //                     '<span id="i_paystate"></span>'+
                    //                 '</span>'+
                    //             '</p>'+
                    //         '</div>'+
                    //     '</div>'+
                    // '</form>'+
                    // '<div class="c-time clearfix">'+
                    //     '<label class="fl t-title">增加服务时间</label>'+
                    //     '<div class="fl t-hour">'+
                    //         '<span class="s1" id="orderminusbtn">-</span>'+
                    //         '<span class="s2"><span class="number" id="orderAddTime">1</span>/小时</span>'+
                    //         '<span class="s3" id="orderaddbtn">+</span>'+
                    //     '</div>'+
                    //     '<span class="fl" style="color: #7baeea;">'+
                    //         '<label>服务剩余时间：</label>'+
                    //         '<span id="i_lasttime2"></span>'+
                    //     '</span>'+
                    // '</div>'+
                    '<form role="form" class="formWidth" id="wzdata" style="margin-top: 20px;">'+
                        '<div class="p-title">'+
                            '<h4>问诊记录</h4>'+
                        '</div>'+
                        '<div class="p-content">'+
                            '<ul id="message">'+
                                
                            '</ul>'+
                        '</div>'+
                    '</form>'+
                '</div>';

var lengthen = '<div class="c-time clearfix">'+
                '<label class="fl t-title">增加服务时间</label>'+
                '<div class="fl t-hour">'+
                    '<span class="s1" id="orderminusbtn">-</span>'+
                    '<span class="s2"><span class="number" id="orderAddTime">1</span>/小时</span>'+
                    '<span class="s3" id="orderaddbtn">+</span>'+
                '</div>'+
                '<span class="fl" style="color: #7baeea;">'+
                    '<label>服务剩余时间：</label>'+
                    '<span id="i_lasttime2"></span>'+
                '</span>'+
                '</div>';
//订单列表弹框查询
var orderList =     '<div class="row">'+
                        '<form class="form-horizontal form-inline ">'+
                            '<div class="from-group col-sm-4" style="margin-left: 8px;">'+
                                '<label class="control-label">订单号</label>'+
                                '<input type="text" class="form-control" placeholder="输入订单号" style="width: 70%" id="l_ordercode"/>'+
                            '</div>'+
                            '<div class="from-group col-sm-3 display-d">'+
                                '<label class="control-label">问诊医生</label>'+
                                '<input type="text" class="form-control" placeholder="输入医生姓名" style="width: 70%" id="l_doctorname"/>'+
                            '</div>'+
                            '<div class="from-group col-sm-3 display-p">'+
	                            '<label class="control-label">问诊患者</label>'+
	                            '<input type="text" class="form-control" placeholder="输入患者姓名" style="width: 70%" id="l_patientname"/>'+
                            '</div>'+
                            '<div class="form-group col-sm-3">'+
                                '<label class="control-label">支付状态</label>'+
                                '<select class="form-control" id="l_paystate">'+
                                    '<option value="">请选择</option>'+
                                    '<option value="1">待支付</option>'+
                                    '<option value="2">已支付</option>'+
                                    '<option value="3">已取消</option>'+
                                '</select>'+
                            '</div>'+
                            '<input type="button" class="btn btn-default submit" value="确定" id="searchBtnOpt"/>'+
                        '</form>'+
                    '</div>'+
                    '<div id="container" class="out_box" style="margin-top: 26px;height: 300px;overflow-y: auto;overflow-x: hidden;">'+
                        '<table class="display table" id="tbOrder" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th>订单号</th>'+
                                    '<th class="display-p">问诊患者</th>'+
                                    '<th class="display-d">问诊医生</th>'+
                                    '<th>问诊类型</th>'+
                                    '<th>支付状态</th>'+
                                    '<th>下单时间</th>'+
                                    '<th>订单总价</th>'+
                                    '<th>支付时间</th>'+
                                    '<th class="display-t">服务剩余时间</th>'+
                                    '<th>操作</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>'+
                            '</tbody>'+
                        '</table>'+
                    '</div>';
var isUndo='onkeyup="if(isNaN(value))execCommand(\'undo\')" onafterpaste="if(isNaN(value))execCommand(\'undo\')" ';
var prescriptionTemplate =          '<form class="form-horizontal" style="height: 360px;overflow-y: auto;overflow-x: hidden">'+
                                        '<div class="form-group">'+
                                            '<label for="name" class="col-sm-2 control-label">药方名称</label>'+
                                            '<div class="col-sm-3">'+
                                                '<input type="text" class="form-control" autocomplete="off" id="prescriptionname" />'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group f-herbs">'+
                                            '<label class="col-sm-2 control-label">药材</label>'+
                                            '<div class="col-sm-3">'+
                                                '<input type="text" class="form-control medicines" autocomplete="off" id="medicinesearch" list="medicinelist" placeholder="输入关键字" />'+
                                                '<datalist id="medicinelist"></datalist>'+
                                            '</div>'+
                                            '<div class="col-sm-12" style="padding: 0">'+
                                                '<div class="col-md-2"></div>'+
                                                '<ul class="col-sm-10 selectmedicine" id="selectmedicine"></ul>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<label class="col-sm-2 control-label">特殊医嘱</label>'+
                                            '<div class="col-sm-3">'+
                                                '<input type="text" class="form-control" autocomplete="off" placeholder="填写服药时间，特殊医嘱" id="specialadvice"/>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<label class="col-sm-2 control-label">用药禁忌</label>'+
                                            '<div class="col-sm-3">'+
                                                '<input type="text" autocomplete="off" class="form-control unprescription" list="prescriptionlist" placeholder="输入关键字" />'+
                                                '<datalist id="prescriptionlist"></datalist>'+
                                            '</div>'+
                                            '<div class="col-sm-12" style="padding: 0">'+
                                                '<div class="col-md-2"></div>'+
                                                '<ul class="col-sm-8" id="selectprescription"></ul>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<label class="col-sm-2 control-label">用药说明</label>'+
                                            '<div class="col-sm-6" style="padding-top: 7px;">'+
                                                '<span>共<span class="span-style"><input autocomplete="off" type="text" style="width: 26px;border: none;outline: none" id="totaldosage" '+isUndo+' /></span>剂，每日<span class="span-style"><input type="text" style="width: 26px;border: none;outline: none" id="daydosage" '+isUndo+' autocomplete="off"/></span>剂，每剂分<span class="span-style"><input type="text" style="width: 26px;border: none;outline: none" id="taketime" '+isUndo+' autocomplete="off"/></span>次服用</span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<label class="col-sm-2 control-label">药方总价</label>'+
                                            '<div class="col-sm-3">'+
                                                '<input type="text" class="form-control" disabled id="totalprice"/>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group">'+
	                                        '<label class="col-sm-2 control-label">创建人</label>'+
	                                        '<div class="col-sm-3">'+
	                                            '<input type="text" class="form-control" disabled id="createby"/>'+
	                                        '</div>'+
	                                    '</div>'+
	                                    '<div class="form-group">'+
	                                        '<label class="col-sm-2 control-label">创建时间</label>'+
	                                        '<div class="col-sm-3">'+
	                                            '<input type="text" class="form-control" disabled id="createtime"/>'+
	                                        '</div>'+
	                                    '</div>'+
	                                    '<div class="form-group" id="stateshow">'+
	                                        '<label class="col-sm-2 control-label">药方状态</label>'+
	                                        '<div class="col-sm-10">'+
	                                            '<select class="col-sm-2 form-controls " id="state">'+
	                                            '<option value="1" >显示</option>'+
	                                            '<option value="2" >隐藏</option>'+
	                                            '</select>'+
	                                        '</div>'+
	                                    '</div>'+
                                    '</form>';

var newOrderDetails = '<div>'+
                      
                      '</div>';

