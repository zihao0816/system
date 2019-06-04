/**
 * Created by Girl on 2018/7/18.
 */
;var ObjPrescriptionTemplateListIndex = function(
){ 			//定义对象
    var obj = new Object();
    obj.ID = '';
    obj.html_dialog_editPrescriptionTemplate='';
    obj.html_dialog_editPrescriptionTemplate= prescriptionTemplate;
    // $('#updatePrescription .container').remove();
    obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        var tbPrescriptionTemplateList = $('#tbPrescriptionTemplateList').DataTable({
            "bServerSide" : true,
            'bAutoWidth':false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource":'/api/prescriptioninfo/getPrescriptioinList',
            "fnServerData" : function(sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function(condition, param) {
                    this.condition = condition;
                    this.param =  param;
                };
                //查询实体
                var UserInfo = function() {
                	this.prescriptionname=$("#pname").val();
                	this.prescriptiontype=$("#prescriptiontype").val();
                	var startDate=$("#startDate").val();
                	if(startDate!=null&&startDate!='')
                	{
                		startDate=startDate+" 00:00:00";
                	}
                	this.startDate=startDate;
                	var endDate=$("#endDate").val();
                	if(endDate!=null&&endDate!='')
                	{
                		endDate=endDate+" 59:59:59";
                	}
                	this.endDate=endDate;
                };
                var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));

                ajax({
                    "type" : 'post',
                    "url" : sSource,
                    "dataType" : "json",
                    "data" : {
                        aoData : JSON.stringify(temp)
                    },
                    "success" : function(resp) {
                        fnCallback(resp);
                    }
                });
            },
            "bSort":false,
            filter:false,
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
            "fnRowCallback" : function(nRow, data, iDisplayIndex) {

            },

            "aLengthMenu":[10, 25, 50, 100],
            "aoColumns" : [
                {"data" : "prescriptionname", "defaultContent": ""},
                {"data" : "medicines", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return row.prescriptiontype=='1'?"经典药方":"医生药方";
                    }
                },
                {"data" : "createby", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return timestampToTime(row.createtime);
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        var html='';
                        html+="<span  id=\"editData\" class='s-btn'>编辑药方</span>";
                        return html;
                    }
                }
            ]
        });

        $('#tbPrescriptionTemplateList tbody').on('click','span#editData',function(){
        	var datatime = $('#tbPrescriptionTemplateList').DataTable().row($(this).parents('tr')).data();
            obj.$currentDlg = bootbox.dialog({
                title: "修改药方信息",
                size: 'large',
                className: 'patientsize',
                message: obj.html_dialog_editPrescriptionTemplate,
                buttons: {
                    success: {
                        label: "保存",
                        className: "btn-success btn-import{0} savebtn".format(obj.ID),
                        callback: function () {
                        	
                        	var prescriptionname=$("#prescriptionname").val().trim();
    						if(prescriptionname==null||prescriptionname=='')
    						{
    							bootboxAlert("药方名称不能为空",false);
    							return false;
    						}
    						
    						var totaldosage=$("#totaldosage").val().trim();
    						var daydosage=$("#daydosage").val().trim();
    						var taketime=$("#taketime").val().trim();
    						if(totaldosage==null||totaldosage==''||daydosage==null||daydosage==''||taketime==null||taketime=='')
    						{
    							bootboxAlert("用药说明不能为空",false);
    							return false;
    						}
    						
    						var medicineLen=$("#selectmedicine").find("li").length;
    						if(medicineLen==null||medicineLen<1)
    						{
    							bootboxAlert("药材不能为空",false);
    							return false;
    						}
    						
    						var taboos = "";
    						$("#selectprescription li span").each(function(){
    							var obj = $(this);
    							taboos+=obj.text()+",";
    						});
    						
    						var medicines="";
    						$(".selectmedicine li").each(function(){
    							var obj = $(this);
    							var o_span=obj.children("span").eq(0);
    							var o_span_input=obj.children("span").eq(1);
    							var o_span_value=o_span_input.children("input").eq(0).val();
    							if(o_span_value<1)
    							{
    								bootboxAlert("药材克数不能为空",false);
        							return false;
    							}
    							medicines+=o_span.attr("mid")+"@#@"+o_span.text()+"@#@"+o_span_value+",";
    						});
    						$(".savebtn").attr("disabled", true);
                        	var result = doAjax("/api/prescriptioninfo/addOrUpdatePrescriptionInfo", "post",
                                    {
                                    "id": datatime.id
                                    , "prescriptionname": prescriptionname
                                    , "medicines": medicines
                                    , "specialadvice": $("#specialadvice").val()
                                    , "taboo": taboos
                                    , "totaldosage": totaldosage
                                    , "daydosage": daydosage
                                    , "taketime": taketime
                                    , "state": $("#state").val()
                                    }, ['#tbPrescriptionTemplateList'], null, null, false);
                    		$(".savebtn").attr("disabled", false);
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
            
            
            ajax({
                "type" : 'get',
                "url" : '/api/prescriptioninfo/getPrescriptioninfoVoById/'+datatime.id,
                "dataType" : "json",
                "success" : function(resp) {
                	
                	if(resp.prescriptiontype=='1')
                	{
                		$("#stateshow").show();
                	}
                	else
                	{
                		$("#stateshow").hide();
                	}
                	
                    loadJsonDataToForm(resp);
                    $("#createby").val(datatime.createby);
                    $("#createtime").val(timestampToTime(resp.createtime));
                    $("#state").val(resp.state);
                    $("#totalprice").val(numberFormat(resp.totalprice.toFixed(2),2));
                    //加载药材
                    var user={}
                    user.aa="aaa";
                    ajax({
                        "type" : 'post',
                        "url" : '/api/medicineinfo/getMedicineList',
                        "contentType": "application/json",
                        "dataType" : "json",
                        "data": JSON.stringify(user),
                        "success": function(data){
                            ObjaddDoctorIndex.inputList1('#medicinesearch','#medicinelist','#selectmedicine',1,data,resp.prescriptionmedicineinfoList);
                            $(".mdprice").on('change',function(){
                            	sumPrice();
                            });
                        },
                        "error": function(e){

                        }
                    });
                    
                    //加载用药禁忌
                    ajax({
                        "type" : 'post',
                        "url" : '/api/datadictionarydetail/selectBySortcodes',
                        "dataType" : "json",
                        "data" : {
                            sortcodes : "yyjj",
                        },
                        "success" : function(data) {
							ObjaddDoctorIndex.inputList('.unprescription','#prescriptionlist','#selectprescription',3,data,resp.taboo);
							var taboo=resp.taboo;
							if(taboo!=null&&taboo.length>0)
							{
								var taboos=taboo.split(",");
								var taboohtml="";
								for(var i=0;i<taboos.length;i++)
								{
									if(taboos[i]!='')
									{
										taboohtml+='<li style="text-align: center" data-id="'+(i+1000)+'" class="col-sm-3 selectHerbs"><span id="opValue">'+taboos[i]+'</span><img class="minus delLi" style="cursor: pointer;" src="/static/image/minus-circle.png"></li>';
									}
								}
								$("#selectprescription").html(taboohtml);
								$('.delLi').on('click',function(){
					                console.log($(this).parent().attr("data-id"));
					                var liLists = $("#selectprescription").children();
					                for(var i=0;i<liLists.length;i++){
					                    if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
					                        liLists[i].remove();
					                    }
					                }
					            });
							}
                        }
                    });
                }
            });
            
            
            $("#totaldosage").on('change',function(){
            	var totalprice=0;
        		$(".mdprice").each(function(){
        		   var obj=$(this);
            	   var mprice=obj.attr("mprice");
            	   var dosage=obj.val();
            	   totalprice=totalprice*1+(mprice*dosage);
        		});
        		var totaldosage=$("#totaldosage").val();
        		if(totaldosage!='')
        		{
        			totalprice=totalprice*totaldosage;
        		}
        		
        	    $("#totalprice").val(numberFormat(totalprice.toFixed(2),2));
            });
        })

    };
    
    
    $("#searchBtn").click(function(){
    	$("#tbPrescriptionTemplateList").DataTable().ajax.reload();
    });
//    load_DropDownList_Get('/api/data_dictionaries_type/getListByKey', 'post', '#formlimits', 'data_access_name', 'data_value', {"state":0}, null, "请选择来源字典");
    return obj;
}();
