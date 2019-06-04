/**
 * Created by Girl on 2018/7/17.
 */
;var ObjpatientManagementIndex = function () { 			//定义对象
    var obj = new Object();
    obj.ID = '';
    obj.html_dialog_editPatient = '';
    obj.html_dialog_editPatient = $('#editPatient .container').html();
    $('#editPatient .container').remove();

    obj.html_dialog_detailsMedicalRecord = '';
    obj.html_dialog_detailsMedicalRecord = $('#detailsMedicalRecord .container').html();
    $('#detailsMedicalRecord .container').remove();

    obj.html_dialog_detailsDoctor = '';
    obj.html_dialog_detailsDoctor = $('#detailsDoctor .container').html();
    $('#detailsDoctor .container').remove();

    obj.html_dialog_detailsOrder = '';
    obj.html_dialog_detailsOrder = orderList;

    obj.html_dialog_selectUpdatePrescription = '';
    obj.html_dialog_selectUpdatePrescription = prescription;

    obj.html_dialog_selectUpdateInquiry = '';
    obj.html_dialog_selectUpdateInquiry = inquiry;

    obj.html_dialog_detailsMedicalRecords = '';
    obj.html_dialog_detailsMedicalRecords = $('#detailsMedicalRecords .container').html();
    $('#detailsMedicalRecords .container').remove();
    
    obj.html_dialog_showimg = '';
    obj.html_dialog_showimg = $('#showimg .container').html();
    $('#showimg .container').remove();

    obj.init = function (id) {		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        $("#distpickerquery").distpicker({
            autoSelect: false
        });
        var tbPatient = $('#tbPatient').DataTable({
            "bServerSide": true,
            'bAutoWidth': false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource": '/api/patientinfo/list',
            "fnServerData": function (sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function (condition, param) {
                    this.condition = condition;
                    this.param = param;
                };
                //查询实体
                var UserInfo = function () {
                	this.patientname = $('#patientname').val()
                    this.likephone = $('#phone').val()
                    this.sex = $('#sex').val()
                    this.age = $('#age').val();
                    this.province = $('#province').val().replace('区','').replace('县','');
                    this.city = $('#city').val().replace('区','').replace('县','');
                    this.conty = $('#district').val().replace('区','').replace('县','');
                };
                var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));

                ajax({
                    "type": 'post',
                    "url": sSource,
                    "dataType": "json",
                    "data": {
                        aoData: JSON.stringify(temp)
                    },
                    "success": function (resp) {
                        fnCallback(resp);
                    }
                })
            },
            "bSort": false,
            filter: false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_条",
                "sZeroRecords": "没有找到符合条件的数据",
                "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
                "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
                "sInfoEmpty": "没有记录",
                "sInfoFiltered": "(从 _MAX_ 页记录中过滤)",
                "sSearch": "搜索：",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                }
            },
            "fnRowCallback": function (nRow, data, iDisplayIndex) {

            },

            "aLengthMenu": [10, 25, 50, 100],
            "aoColumns": [
                {
                    "data": "patientname", "defaultContent": "",
                    "render": function (data, type, row) {
                        var html = ' <img width="50px" height="50xp" src="' + row.headphoto + '">';

                        return html;
                    }
                },
                {"data": "patientnickname", "defaultContent": ""},
                {"data": "patientname", "defaultContent": ""},
                {
                    "data": "patientname", "defaultContent": "",
                    "render": function (data, type, row) {
                        return row.sex == 1 ? "男" : "女";
                    }
                },
                {"data": "age", "defaultContent": ""},
                {"data": "province", "defaultContent": ""},
                {"data": "telephone", "defaultContent": ""},
                {"data": "registertime", "defaultContent": ""},
                {"data": "remark", "defaultContent": ""},
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        var html = '';
                        html += "<span  id=\"editData\" class='s-btn' >编辑资料</span>&emsp;";
                        html += "<span  id=\"seeMedicalRecord\" class='s-btn' >查看病历</span>&emsp;";
                        html += "<span  id=\"seeOrder\" class='s-btn'data-type='one' >查看订单</span>&emsp;";
                        html += "<span  id=\"seeDoctor\" class='s-btn' >查看医生</span>&emsp;";
                        html += "<span  id=\"editQuan\" class='s-btn' >领取</span>";
                        return html;
                    }
                }
            ]
        });
    };
    $('#tbPatient tbody').on('click','span#editQuan',function(){
        var data = $('#tbPatient').DataTable().row($(this).parents('tr')).data();
        var results= doAjax("/api/patientinfo/updateByPrimaryKeySelectives", "post",
            {
                "id": data.id,
                'remark': data.remark == '未领取'?'已领取奖品':'未领取'

            }, ['#tbPatient'], null,null, false);
        return results;
    });
    $('#cxone').click(function () {
        $('#tbPatient').DataTable().ajax.reload();
    });
    $("#distpicker3").distpicker({
        autoSelect: false
    });
    $('#tbPatient tbody').on('click', 'span#editData', function () {
        var datatime = $('#tbPatient').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "编辑资料",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_editPatient,
            buttons: {
                success: {
                    label: "保存",
                    className: "btn-success btn-import{0} savebtn".format(obj.ID),
                    callback: function () {
                    	
                    	var patientname=$('#patientnameup').val();
                    	if(patientname==null||patientname=='')
                		{
                			bootboxAlert("真实姓名不能为空",false);
                			stops;
                		}
                    	var birthday=$('#birthdayup').val();
                    	if(birthday==null||birthday=='')
                		{
                			bootboxAlert("年龄不能为空",false);
                			stops;
                		}
                    	var weight=$('#weightup').val();
                    	if(weight==null||weight=='')
                		{
                			bootboxAlert("体重不能为空",false);
                			stops;
                		}
                    	var height=$('#heightup').val();
                    	if(height==null||height=='')
                		{
                			bootboxAlert("身高不能为空",false);
                			stops;
                		}
                    	var telephone=$('#telephoneup').val();
                    	if(telephone==null||telephone=='')
                		{
                			bootboxAlert("联系方式不能为空",false);
                			stops;
                		}
                    	if (isPhoneNo(telephone) == false) {
				            bootboxAlert("联系方式格式不正确",false);
				            stops;
				        }
                    	var remark=$('#remarkup').val();
                    	if(remark==null||remark=='')
                		{
                			bootboxAlert("备注不能为空",false);
                			stops;
                		}
                    	var conty=$('#contyup').val();
                    	var city=$('#cityup').val();
                    	var province=$('#provinceup').val();
                    	if(province==null||province==''||city==null||city==''||conty==null||conty=='')
            			{
            				bootboxAlert("省份不能为空",false);
            				stops;
            			}
                    	var sex=$("input[name='sexup']:checked").val()
                    	$(".savebtn").attr("disabled", true);
                        var result= doAjax("/api/patientinfo/updateByPrimaryKeySelective", "post",
                            {
                                "id": datatime.id
                                , "patientname": patientname
                                , "birthday": birthday
                                , "weight": weight
                                , "height": height
                                , "telephone": telephone
                                , "remark": remark
                                , "conty": conty
                                , "city": city
                                , "province": province
                                , "sex": sex
                            }, ['#tbPatient'], null,null, false);
                        if(result==false)
                        {
                        	$(".savebtn").attr("disabled", false);
                        }
                    	return result;
                    }
        			
                },
                caner: {
                    label: "取消",
                    className: "btn-default savebtn",
                    callback: function () {
                    }
                }
            }
        });
        $("#distpickerup").distpicker({
            autoSelect: false
        });
        $('[data-toggle="distpicker"]').distpicker();
        $('#headphotoup').prop("src", datatime.headphoto);
        $('#patientnicknameup').val(datatime.patientnickname);
        $('#patientnameup').val(datatime.patientname);
        var sss=datatime.birthday;
        console.log(sss)
        $('#birthdayup').val(sss);
        $("input[type=radio][name='sexup'][value='" + datatime.sex + "']").prop("checked", true);
        $('#distpickerup').distpicker('destroy')
        $('#distpickerup').distpicker({
            province: datatime.province,
            city: datatime.city,
            district: datatime.conty
        })
        // $('#provinceup option[value=' + datatime.province + ']').attr("selected", "selected");
        // $('#cityup option[value=' + datatime.city + ']').attr("selected", "selected");
        // $('#provinceup option[value=' + datatime.server + ']').attr("selected", "selected");
        $('#weightup').val(datatime.weight);
        $('#heightup').val(datatime.height);
        $('#telephoneup').val(datatime.telephone);
        $('#registertimeup').text(datatime.registertime);
        $('#remarkup').val(datatime.remark);
    });
    $('#tbPatient tbody').on('click', 'span#seeMedicalRecord', function () {
    	var patientData = $('#tbPatient').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "查看病历",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_detailsMedicalRecord
        });
        $('document').ready(function () {
            var tbMedicalRecord = $('#tbMedicalRecord').dataTable({
                "bServerSide": true,
                'bAutoWidth': false,//自动宽度
                "dom": 'rt<"bottom"flpi><"clear">',
                "sAjaxSource": "/api/orderinfo/queryOrderListByPatient", //mvc后台ajax调用接口。
                "fnServerData": function (sSource, aoData, fnCallback) {
                    //表格参数
                    var dataTablesParam = function (condition, param) {
                        this.condition = condition;
                        this.param = param;
                    };

                    //查询实体
                    var UserInfo = function () {
                    	this.paystate="2";
                    	this.patientid=patientData.id;
                    	var buytime=$("#m_buytime").val();
                    	if(buytime!=null&&buytime!='')
                    	{
                    		this.starttime=buytime+" 00:00:00";
                    		this.endtime=buytime+" 59:59:59";
                    	}
                    	this.doctorname=$("#m_doctorname").val();
                    };

                    var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));

                    ajax({
                        "type": 'post',
                        "url": sSource,
                        "dataType": "json",
                        "data": {
                            aoData: JSON.stringify(temp)
                        },
                        "success": function (resp) {
                            fnCallback(resp);
                        }
                    });
                },
                "filter": false,
                "bSort": false,
                "oLanguage": {
                    "sLengthMenu": "每页显示 _MENU_条",
                    "sZeroRecords": "没有找到符合条件的数据",
                    "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
                    "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
                    "sInfoEmpty": "没有记录",
                    "sInfoFiltered": "(从 _MAX_ 页记录中过滤)",
                    "sSearch": "搜索：",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "前一页",
                        "sNext": "后一页",
                        "sLast": "尾页"
                    }
                },
                "fnRowCallback": function (nRow, data, iDisplayIndex) {

                },
                "aLengthMenu": [10, 25, 50, 100],
                "aoColumns": [
                    {"data": "doctorname", "defaultContent": ""},
                    {"data": "dutiesname", "defaultContent": ""},
                    {"data" : "", "defaultContent": "",
                        "render": function (data, type,row) {
                        	return timestampToTime(row.buytime);
                        }
                    },
                    {"data" : "", "defaultContent": "",
                        "render": function (data, type,row) {
                        	if ("1"==row.serviceid)
                        	{
                        		data="图文复诊";
                        	}
                        	else if ("2"==row.serviceid)
                        	{
                        		data="电话复诊";
                        	}
                        	else if ("3"==row.serviceid)
                        	{
                        		data="图文咨询";
                        	}
                        	else if ("4"==row.serviceid)
                        	{
                        		data="电话咨询";
                        	}
                    		return data;
                        }
                    },
                    {"data": "", "defaultContent": "",
                    	"render": function (data, type, row) {
                            var html = '';
                            var showmsg=row.doctorconclusion==undefined?"":row.doctorconclusion;
                            html += "<div style='word-break: break-all'  >"+showmsg+"</div>";
                            return html;
                        }
                    },
                    {
                        "data": "", "defaultContent": "",
                        "render": function (data, type, row) {
                            var html = '';
                            html += "<span  id=\"detailMedicalRecord\" class='s-btn' >病历详情</span>";
                            return html;
                        }
                    }
                ]
            })
        });
        $('#tbMedicalRecord tbody').on('click', 'span#detailMedicalRecord', function () {
        	var medicalData = $('#tbMedicalRecord').DataTable().row($(this).parents('tr')).data();
            obj.$currentDlg = bootbox.dialog({
                title: "病历详情",
                size: 'large',
                className: 'patientsize',
                message: obj.html_dialog_detailsMedicalRecords
            });
            if(medicalData.orderprescriptionid!=null&&medicalData.orderprescriptionid!='')
            {
            	$("#orderprescriptionform").show();
            	loadMedicine(medicalData.orderprescriptionid);
            }
            else
            {
            	$("#orderprescriptionform").hide();
            }
            
            
            var servicename="";
            if ("1"==medicalData.serviceid)
        	{
            	servicename="图文复诊";
        	}
        	else if ("2"==medicalData.serviceid)
        	{
        		servicename="电话复诊";
        	}
        	else if ("3"==medicalData.serviceid)
        	{
        		servicename="图文咨询";
        	}
        	else if ("4"==medicalData.serviceid)
        	{
        		servicename="电话咨询";
        	}
            
            $("#mr_ordercode").text(medicalData.ordercode);
            $("#mr_servicename").text(servicename);
            $("#mr_buytime").text(timestampToTime(medicalData.buytime));
            $("#mr_doctorname").text(medicalData.doctorname);
            $("#mr_dutiesname").text(medicalData.dutiesname);
            $("#mr_departmentname").text(medicalData.departmentname);
            $("#mr_hospitaname").text(medicalData.hospitaname);
            $("#mr_doctorconclusion").text(medicalData.doctorconclusion);
            
            
            //药方数据展示
            $("#ps_ordercode").text(medicalData.orderprescriptioncode);
            $("#ps_buytime").text(timestampToTime(medicalData.ps_buytime));
            $("#ps_doctorname").text(medicalData.doctorname);
            $("#ps_servicename").text(servicename);
            if(medicalData.ps_totalprice)
            if(medicalData.ps_totalprice!=undefined)
            {
            	$("#ps_totalprice").text("￥"+numberFormat(medicalData.ps_totalprice.toFixed(2),2));	
            }
            
            $("#ps_paytime").text(timestampToTime(medicalData.ps_paytime));
            if(medicalData.ps_paystate=="1")
            {
            	$("#ps_paystate").text("待支付");
            }
            else if(medicalData.ps_paystate=="2")
            {
            	$("#ps_paystate").text("已支付");
            }
            else if(medicalData.ps_paystate=="3"||medicalData.ps_paystate=="4")
            {
            	$("#ps_paystate").text("已取消");
            }
            
            if(medicalData.ps_address&&medicalData.ps_address.indexOf("$")!=-1)
            {
            	var address=medicalData.ps_address.split("$");
                if(address[0]!=null&&address[0]!='')
                {
                	$("#ps_address").text(address[0]);
                }
               
                if(address[1]!=null&&address[1]!='')
                {
                	$("#ps_receiver").text(address[1]);
                }
            } 
            else
            {
            	$("#ps_address").text(medicalData.ps_address);
            }
            
            $("#ps_prescriptionname").text(medicalData.ps_prescriptionname);
            $("#ps_telephone").text(medicalData.ps_telephone);
            $("#ps_totaldosage").text(numberFormat(medicalData.ps_totaldosage,0));
            $("#ps_daydosage").text(numberFormat(medicalData.ps_daydosage,0));
            $("#ps_taketime").text(numberFormat(medicalData.ps_taketime,0));
            $("#ps_prescriptionshape").text(medicalData.ps_prescriptionshape);
            $("#ps_specialadvice").text(medicalData.ps_specialadvice);
            $("#ps_taboo").text(medicalData.ps_taboo);
            $("#ps_sendcompany").text(medicalData.ps_sendcompany);
            
            
            //查询主诉数据
            var orderobj={"orderID":medicalData.id,"getCase":"1"};
            ajax({
                "type" : 'post',
                "url" : '/api/Inquiry/orderDetails',
                "dataType" : "json",
                "contentType":"application/json",
                "data" : JSON.stringify(orderobj),
                "success" : function(data) {
                	var mr_initialCases="";
                   	for(var i=0;i<data.initialCases.length;i++)
                    {
                   		mr_initialCases+='<a href="javascript:;" url="'+filefdfspath+data.initialCases[i]+'" class="showimg"><img src="'+filefdfspath+data.initialCases[i]+'" /></a>';
                    }
                   	$("#mr_initialCases").html(mr_initialCases==''?"无":mr_initialCases);
                   	
                   	var ordermaintellinfo=data.ordermaintellinfo;
                   	$("#mr_age").text(ordermaintellinfo.age);
                   	$("#mr_height").text(ordermaintellinfo.height);
                   	$("#mr_weight").text(ordermaintellinfo.weight);
                   	$("#mr_allergichistory").text(ordermaintellinfo.allergichistory);
                   	$("#mr_pastcase").text(ordermaintellinfo.pastcase);
                   	$("#mr_symptom").text(ordermaintellinfo.symptom);
                   	
                   	//舌照面照
                   	var mr_accordingTtongue="";
                   	for(var i=0;i<data.accordingTtongue.length;i++)
                    {
                   		mr_accordingTtongue+='<a href="javascript:;" url="'+filefdfspath+data.accordingTtongue[i]+'" class="showimg"><img src="'+filefdfspath+data.accordingTtongue[i]+'" /></a>';
                    }
                   	for(var i=0;i<data.surfaceAccording.length;i++)
                    {
                   		mr_accordingTtongue+='<a href="javascript:;" url="'+filefdfspath+data.surfaceAccording[i]+'" class="showimg"><img src="'+filefdfspath+data.surfaceAccording[i]+'" /></a>';
                    }
                   	for(var i=0;i<data.otherdetails.length;i++)
                    {
                   		mr_accordingTtongue+='<a href="javascript:;" url="'+filefdfspath+data.otherdetails[i]+'" class="showimg"><img src="'+filefdfspath+data.otherdetails[i]+'" /></a>';
                    }
                   	$("#mr_accordingTtongue").html(mr_accordingTtongue==''?"无":mr_accordingTtongue);
                   	
                   	
                   	//问诊单
                   	var mr_reorderinquiryquestion="";
                   	var roq=data.reorderinquiryquestion;
                   	for(var i=0;i<roq.length;i++)
                    {
                   		mr_reorderinquiryquestion+='<p style="margin-top: 5px;">'+(i+1)+'.'+roq[i].questionname+'</p><p>';
                   		var oio=roq[i].orderinquiryoptions;
                   		for(j=0;j<oio.length;j++)
                   		{
                   			var ischecked=oio[j].ischecked=='1'?"checked":"";
                   			mr_reorderinquiryquestion+='<input type="checkbox" disabled '+ischecked+' />'+oio[j].anwser+"&nbsp;&nbsp;&nbsp;";
                   		}
                   		mr_reorderinquiryquestion+="</p>";
                    }
                   	$("#mr_reorderinquiryquestion").html(mr_reorderinquiryquestion==''?"无":mr_reorderinquiryquestion);
                   	
                   	
                   	$(".showimg").click(function(){
                   		var url=$(this).attr("url");
                   		obj.$currentDlg = bootbox.dialog({
                            title: "查看图片",
                            size: 'large',
                            className: 'showimgsize',
                            message: obj.html_dialog_showimg
                        });
                   		
                   		$("#showimgurl").attr("src",url);
                   	});
                   	
                }
            });
            
        });
        
        $("#m_searchBtn").click(function(){
        	$('#tbMedicalRecord').DataTable().ajax.reload();
        });
    });
    $('#tbPatient tbody').on('click', 'span#seeDoctor', function () {
    	var patientData = $('#tbPatient').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "查看医生",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_detailsDoctor
        });
        $('document').ready(function () {
            var tbDoctor = $('#tbDoctor').dataTable({
                "bServerSide": true,
                "bRetrieve": true,
                'bAutoWidth': false,//自动宽度
                "dom": 'rt<"bottom"flpi><"clear">',
                "sAjaxSource": "/api/doctorpatientinfo/queryPatientDoctor", //mvc后台ajax调用接口。
                "fnServerData": function (sSource, aoData, fnCallback) {
                    //表格参数
                    var dataTablesParam = function (condition, param) {
                        this.condition = condition;
                        this.param = param;
                    };

                    //查询实体
                    var UserInfo = function () {
                    	this.relationFlag="2";
                    	this.patientid=patientData.id;
                    	this.doctorname=$("#ps_doctorname").val();
                    	this.telephone=$("#ps_telephone").val();
                    	this.addtype=$("#ps_addtype").val();
                    };

                    var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));

                    ajax({
                        "type": 'post',
                        "url": sSource,
                        "dataType": "json",
                        "data": {
                            aoData: JSON.stringify(temp)
                        },
                        "success": function (resp) {
                            fnCallback(resp);
                        }
                    });
                },
                "filter": false,
                "bSort": false,
                "oLanguage": {
                    "sLengthMenu": "每页显示 _MENU_条",
                    "sZeroRecords": "没有找到符合条件的数据",
                    "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
                    "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
                    "sInfoEmpty": "没有记录",
                    "sInfoFiltered": "(从 _MAX_ 页记录中过滤)",
                    "sSearch": "搜索：",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "前一页",
                        "sNext": "后一页",
                        "sLast": "尾页"
                    }
                },
                "fnRowCallback": function (nRow, data, iDisplayIndex) {

                },
                "aLengthMenu": [10, 25, 50, 100],
                "aoColumns": [
                	{"data": "doctorname", "defaultContent": ""},
                    {"data": "telephone", "defaultContent": ""},
                    {"data": "service1", "defaultContent": ""},
                    {"data": "service2", "defaultContent": ""},
                    {"data": "service3", "defaultContent": ""},
                    {"data": "service4", "defaultContent": ""},
                    {
                        "data": "", "defaultContent": "",
                        "render": function (data, type, row) {
                            return row.service1*1+row.service2*1+row.service3*1+row.service4*1;
                        }
                    },
                    {"data": "prescriptionum", "defaultContent": ""},
                    {
                        "data": "", "defaultContent": "",
                        "render": function (data, type, row) {
                            return row.addtype==1? "扫二维码" : "问诊查询";
                        }
                    }
                ]
            })
        });
        $("#ps_searchBtn").click(function(){
        	$('#tbDoctor').DataTable().ajax.reload();
        });
    });
    $('#tbPatient tbody').on('click', 'span#seeOrder', function () {
    	var patientData = $('#tbPatient').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "查看订单",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_detailsOrder
        });
        if ($(this).attr("data-type") == 'one') {
            $('.display-p').hide();
        }
        var tbOrder = $('#tbOrder').dataTable({
            "bServerSide": true,
            'bAutoWidth': false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource": "/api/orderinfo/queryOrderList", //mvc后台ajax调用接口。
            "fnServerData": function (sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function (condition, param) {
                    this.condition = condition;
                    this.param = param;
                };

                //查询实体
                var UserInfo = function () {
                	this.patientid=patientData.id;
                	this.ordercode=$("#l_ordercode").val();
                	this.doctorname=$("#l_doctorname").val();
                	this.patientname=$("#l_patientname").val();
                	this.paystate=$("#l_paystate").val();
                };

                var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));

                ajax({
                    "type": 'post',
                    "url": sSource,
                    "dataType": "json",
                    "data": {
                        aoData: JSON.stringify(temp)
                    },
                    "success": function (resp) {
                        fnCallback(resp);
                    }
                });
            },
            "filter": false,
            "bSort": false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_条",
                "sZeroRecords": "没有找到符合条件的数据",
                "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
                "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
                "sInfoEmpty": "没有记录",
                "sInfoFiltered": "(从 _MAX_ 页记录中过滤)",
                "sSearch": "搜索：",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                }
            },
            "fnRowCallback": function (nRow, data, iDisplayIndex) {

            },
            "aLengthMenu": [10, 25, 50, 100],
            "aoColumns": [
            	{"data" : "ordercode", "defaultContent": ""},
            	{"data" : "doctorname", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                    	if ("1"==row.serviceid)
                    	{
                    		data="图文复诊";
                    	}
                    	else if ("2"==row.serviceid)
                    	{
                    		data="电话复诊";
                    	}
                    	else if ("3"==row.serviceid)
                    	{
                    		data="图文咨询";
                    	}
                    	else if ("4"==row.serviceid)
                    	{
                    		data="电话咨询";
                    	}
                    	else if ("5"==row.serviceid)
                    	{
                    		data="药方";
                    	}
                		return data;
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        if ("4"==row.orderstate)
                        {
                            return "已取消";
                        }
                        if ("1"==row.paystate)
                        {
                            return "待支付";
                        }
                        else if ("2"==row.paystate)
                        {
                            return "已支付";
                        }
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                    	return timestampToTime(row.buytime);
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                    	return numberFormat(row.totalprice.toFixed(2),2);
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                    	return timestampToTime(row.paytime);
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                    	if("1"==row.ordertype&&"2"!=row.orderstate)
                    	{
                    		return "00小时00分钟";
                    	}
                    	else if("2"==row.ordertype&&"1"!=row.paystate)
                    	{
                    		return "00小时00分钟";
                    	}
                    	else
                    	{
                    		if(row.remaintime==null||row.remaintime=='')
                    		{
                    			return "00小时00分钟";
                    		}
                    		var servicetime=row.servicetime;
                        	var remaintime=row.remaintime;
                        	var addtime=row.addtime;
                        	var lasttime=servicetime*60+addtime*60-remaintime*1;
                        	var hour=Math.floor(lasttime/60);
                        	var minute=lasttime%60;
                        	return hour+"小时"+minute+"分钟";
                    	}
                    }
                },
                {"data": "", "defaultContent": "",
                    "render": function(data, type,row){
                        var html='';
                        if(("1"==row.ordertype&&"2"==row.orderstate)||("2"==row.ordertype&&("2"==row.orderstate||"1"==row.orderstate)))
                        {
                            html+="<span  id=\"updateDetailsOrder\" href=\"#\" class='s-btn'>编辑订单</span>";
                        }
                        else
                        {
                            html+="<span  id=\"seeDetailsOrder\" href=\"#\" class='s-btn'>查看订单</span>";
                        }
                        return html;
                    }
                }
            ]
        });
        
        $("#searchBtnOpt").click(function(){
       	 	$('#tbOrder').DataTable().ajax.reload();
       });
        
        $('#tbOrder tbody').on('click', 'span#seeDetailsOrder', function () {
            var orderList = $('#tbOrder').DataTable().row($(this).parents('tr')).data();
            if(orderList.ordertype == '1'){
                obj.$currentDlg = bootbox.dialog({
                    title: "查看问诊订单",
                    size: 'large',
                    className: 'select-size',
                    message: obj.html_dialog_selectUpdateInquiry
                });
                if (orderList.paystate == '1') {
                    $('#wzdata').hide();
                    $('.c-time').hide();
                    $('.s-style').hide();
                } else if (orderList.paystate == '2') {
                    $('.c-time').hide();
                }
                
                var msg_list_loading = false;
                var nowpage=0;
                $('.msg_list').on('scroll', function(){  
                    if (! msg_list_loading ){
                    	loadchatmessage(orderList.doctorid,orderList.patientid,orderList.id,nowpage);
                    	nowpage++;
                    }  
                }) 
                
                loadshowdata(orderList,"i");
            } else {
                obj.$currentDlg = bootbox.dialog({
                    title: "查看药方订单",
                    size: 'large',
                    className: 'select-sizes',
                    message: obj.html_dialog_selectUpdatePrescription
                });
                if (orderList.paystate == '1'||orderList.paystate == '3') {
                    $('.s-style').hide();
                    $('.c-time').hide();
                } else if (orderList.paystate == '2') {
                    $('.c-time').hide();
                }
                loadshowdata(orderList,"p");
                loadMedicine(orderList.id);
            }
        });
        $('#tbOrder tbody').on('click', 'span#updateDetailsOrder', function () {
        	var orderLists = $('#tbOrder').DataTable().row($(this).parents('tr')).data();
        	if(orderLists.ordertype == '1'){
                obj.$currentDlg = bootbox.dialog({
                    title: "编辑问诊订单",
                    size: 'large',
                    className: 'select-size',
                    message: obj.html_dialog_selectUpdateInquiry,
                    buttons: {
                        success: {  
                            label: "保存",
                            className: "btn-success btn-import{0} savebtn1".format(obj.ID),
                            callback: function () {
                            	var orderid=orderLists.id;
                            	var ordercode=orderLists.ordercode;
                            	var serviceid=orderLists.serviceid;
                				var addtime=$("#orderAddTime").text();
                				$(".savebtn1").attr("disabled", true);
                            	var result = doAjax("/api/orderaddtimeinfo/insertComplete", "post",
                                { 
                    				"orderid": orderid,
                    				"createby": ordercode+","+serviceid,//暂用创建人代替
                    				"addtime": addtime
                                },['#tbOrder'], null
                                , null, false);
                            	
                            	if(result==false)
                            	{
                            		$(".savebtn1").attr("disabled", false);
                            	}
                            	return result;
                            }
                        },
                        caner: {
                            label: "取消",
                            className: "btn-default savebtn1",
                            callback: function () {
                            }
                        }
                    }
                });
                $('#wzdata').hide();
                $('.s-style').hide();
                loadshowdata(orderLists,"i");
            } else {
                obj.$currentDlg = bootbox.dialog({
                    title: "编辑药方订单",
                    size: 'large',
                    className: 'select-sizes',
                    message: obj.html_dialog_selectUpdatePrescription,
                    buttons: {
                        success: {
                            label: "保存",
                            className: "btn-success btn-import{0} savebtn2".format(obj.ID),
                            callback: function () {
                            	var orderid=orderLists.id;
                				var addtime=$("#prescriptionAddTime").text();
                				$(".savebtn2").attr("disabled", true);
                            	var result = doAjax("/api/orderaddtimeinfo/insertComplete", "post",
                                { 
                    				"orderid": orderid,
                    				"addtime": addtime
                                }, ['#tbOrder'], null
                                , null, false);
                            	
                            	if(result==false)
                            	{
                            		$(".savebtn2").attr("disabled", false);
                            	}
                            	return result;
                            }
                        },
                        caner: {
                            label: "取消",
                            className: "btn-default savebtn2",
                            callback: function () {
                            }
                        }
                    }
                });
                $('.s-style').hide();
                loadshowdata(orderLists,"p");
                loadMedicine(orderLists.id);
            }
        	loadDoTime();
        });
    });
    
    

    function loadshowdata(orderList,type)
    {
    	var lasttimeshow="";
        if("1"==orderList.ordertype&&"2"!=orderList.orderstate)
    	{
        	lasttimeshow="00小时00分钟";
    	}
    	else if("2"==orderList.ordertype&&"1"!=orderList.paystate)
    	{
    		lasttimeshow="00小时00分钟";
    	}
    	else
    	{
    		if(orderList.remaintime==null||orderList.remaintime=='')
    		{
    			lasttimeshow = "00小时00分钟";
    		}
    		var servicetime=orderList.servicetime;
        	var remaintime=orderList.remaintime;
        	var addtime=orderList.addtime;
        	var lasttime=servicetime*60+addtime*60-remaintime*1;
        	var hour=Math.floor(lasttime/60);
        	var minute=lasttime%60;
        	lasttimeshow=hour+"小时"+minute+"分钟";
    	}
        var servicename="";
        if ("1"==orderList.serviceid)
    	{
        	servicename="图文复诊";
    	}
    	else if ("2"==orderList.serviceid)
    	{
    		servicename="电话复诊";
    	}
    	else if ("3"==orderList.serviceid)
    	{
    		servicename="图文咨询";
    	}
    	else if ("4"==orderList.serviceid)
    	{
    		servicename="电话咨询";
    	}
    	else if ("5"==orderList.serviceid)
    	{
    		servicename="药方";
    	}
        $("#"+type+"_ordercode").text(orderList.ordercode);
        $("#"+type+"_buytime").text(timestampToTime(orderList.buytime));
        $("#"+type+"_doctorname").text(orderList.doctorname);
        $("#"+type+"_patientname").text(orderList.patientname);
        $("#"+type+"_servicename").text(servicename);
        $("#"+type+"_orderprice").text("￥"+numberFormat(orderList.totalprice.toFixed(2),2));
        $("#"+type+"_lasttime").text(lasttimeshow);
        $("#"+type+"_totalprice").text("￥"+numberFormat(orderList.totalprice.toFixed(2),2));
        $("#"+type+"_paytime").text(timestampToTime(orderList.paytime));
        
        if(orderList.paystate=="1")
        {
        	$("#"+type+"_paystate").text("待支付");
        }
        else if(orderList.paystate=="2")
        {
        	$("#"+type+"_paystate").text("已支付");
        }
        else if(orderList.paystate=="3"||orderList.paystate=="4")
        {
        	$("#"+type+"_paystate").text("已取消");
        }
        
        $("#"+type+"_lasttime2").text(lasttimeshow);

        if(orderList.address&&orderList.address.indexOf("$")!=-1)
        {
        	var address=orderList.address.split("$");
            if(address[0]!=null&&address[0]!='')
            {
            	$("#"+type+"_address").text(address[0]);
            }
            if(address[1]!=null&&address[1]!='')
            {
            	$("#"+type+"_receiver").text(address[1]);
            }
        }
        else
        {
        	$("#"+type+"_address").text(orderList.address);
        }
        
        $("#"+type+"_prescriptionname").text(orderList.prescriptionname);
        $("#"+type+"_telephone").text(orderList.telephone);
        $("#"+type+"_totaldosage").text(numberFormat(orderList.totaldosage,0));
        $("#"+type+"_daydosage").text(numberFormat(orderList.daydosage,0));
        $("#"+type+"_taketime").text(numberFormat(orderList.taketime,0));
        $("#"+type+"_prescriptionshape").text(orderList.prescriptionshape);
        $("#"+type+"_specialadvice").text(orderList.specialadvice);
        $("#"+type+"_taboo").text(orderList.taboo);
        $("#"+type+"_sendcompany").text(orderList.sendcompany);
    }
    
    //加载订单药材
    function loadMedicine(_ordercode)
    {
        var conditionobj={"orderprescription":_ordercode};
        ajax({
            "type" : 'post',
            "url" : '/api/ordermedicine/getListByKey',
            "dataType" : "json",
            "contentType":"application/json",
            "data" : JSON.stringify(conditionobj),
            "success" : function(data) {
            	var medicines="";
               	for(var i=0;i<data.length;i++)
                {
                    var obj = data[i];
                    medicines+="<li>"+obj.medicinename+"&emsp;"+obj.dosage+"g</li>";
                }
                $("#p_medicines").html(medicines);
            }
        });
    }
    
    function loadDoTime()
    {
    	$("#prescriptionminusbtn").click(function(){
        	var prescriptionAddTime=$("#prescriptionAddTime").text();
        	if(prescriptionAddTime==1)
        	{
        		return false;
        	}
        	$("#prescriptionAddTime").text(prescriptionAddTime*1-1)
        });
        $("#prescriptionaddbtn").click(function(){
        	var prescriptionAddTime=$("#prescriptionAddTime").text();
        	$("#prescriptionAddTime").text(prescriptionAddTime*1+1)
        });
        $("#orderminusbtn").click(function(){
        	var orderAddTime=$("#orderAddTime").text();
        	if(orderAddTime==1)
        	{
        		return false;
        	}
        	$("#orderAddTime").text(orderAddTime*1-1)
        });
        $("#orderaddbtn").click(function(){
        	var orderAddTime=$("#orderAddTime").text();
        	$("#orderAddTime").text(orderAddTime*1+1)
        });
    }
    
    
    return obj;
}();