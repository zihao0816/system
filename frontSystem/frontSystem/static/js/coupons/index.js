/**
 * Created by Girl on 2018/8/2.
 */
;var ObjCouponsIndex = function(
){ 			//定义对象

    var obj = new Object();
    obj.ID = '';

    obj.html_dialog_detailsCoupons = '';
    obj.html_dialog_detailsCoupons = $('#detailsCoupons .container').html();
    $('#detailsCoupons .container').remove();

    obj.html_dialog_editCoupons = '';
    obj.html_dialog_editCoupons = $('#editCoupon .containers').html();
    $('#editCoupon .containers').remove();

    $('.date-pickers').datetimepicker({format:"yyyy-mm-dd hh:ii:ss",language:"zh-CN",todayHighlight:true,todayBtn:true,startView: 2});

    obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号

        var tbCouponsList = $('#tbCouponsList').DataTable({
            "bServerSide" : true,
            'bAutoWidth':false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource":'/api/couponinfo/list',
            "fnServerData" : function(sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function(condition, param) {
                    this.condition = condition;
                    this.param =  param;
                };
                //查询实体
                var UserInfo = function() {
                	this.c_couponname=$("#c_couponname").val();
                	this.c_state=$("#c_state").val();
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
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return timestampToTime(row.createtime);
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return numberFormat(row.price.toFixed(2),2);
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return timestampToTime(row.startime)+" - "+timestampToTime(row.overtime);
                    }
                },
                {"data" : "remark", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        if(row.state=="1")
                        {
                        	data="未领取";
                        }
                        else if(row.state=="2")
                        {
                        	data="已领取";
                        }
                        else if(row.state=="3")
                        {
                        	data="已使用";
                        }
                        else if(row.state=="4")
                        {
                        	data="作废";
                        }
                        return data;
                    }
                },
                {"data" : "couponname", "defaultContent": ""},
                /*{"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        var html='';
                        html+="<span  id=\"seeData\" class='s-btn' >预览</span>&emsp;";
                        html+="<span  id=\"editCoupons\" class='s-btn' data-type='two'>编辑</span>&emsp;";
                        return html;
                    }
                }*/
            ]
        });

        $('#tbCouponsList tbody').on('click','span#seeData',function(){
        	var datatime = $('#tbCouponsList').DataTable().row($(this).parents('tr')).data();
            obj.$currentDlg = bootbox.dialog({
                title: "优惠券信息",
                size: 'small',
                className: 'details',
                message: obj.html_dialog_detailsCoupons
            })
            
            $("#s_couponname").text(datatime.couponname);
            $("#s_price").text(datatime.price);
            $("#s_startime").text(timestampToTime(datatime.startime));
            $("#s_overtime").text(timestampToTime(datatime.overtime));
            $("#s_remark").text(datatime.remark);
        });

        $('#tbCouponsList tbody').on('click','span#editCoupons',function(){
        	var datatime = $('#tbCouponsList').DataTable().row($(this).parents('tr')).data();
        	
            obj.$currentDlg = bootbox.dialog({
                title: "编辑优惠券信息",
                size: 'large',
                className: 'patientsize',
                message: obj.html_dialog_editCoupons,
                buttons: {
                    success: {
                        label: "提交",
                        className: "btn-success btn-import{0} savebtn".format(obj.ID),
                        callback: function () {
                        	var couponname=$("#couponname").val();
                        	var price=$("#price").val();
                        	var startime=$("#startime").val();
                        	var overtime=$("#overtime").val();
                        	var remark=$("#remark").val();
                        	
                        	if(couponname==null||couponname=='')
                        	{
                        		bootboxAlert("活动名称不能为空",false);
                    			stops;
                        	}
                        	
                        	if(price==null||price=='')
                        	{
                        		bootboxAlert("优惠金额不能为空",false);
                    			stops;
                        	}
                        	
                        	if(startime==null||startime=='')
                        	{
                        		bootboxAlert("开始时间不能为空",false);
                    			stops;
                        	}
                        	
                        	if(overtime==null||overtime=='')
                        	{
                        		bootboxAlert("结束时间不能为空",false);
                    			stops;
                        	}
                        	
                        	if(overtime<=startime)
                        	{
                        		bootboxAlert("结束时间不能小于开始时间",false);
                    			stops;
                        	}
                        	
                        	$(".savebtn").attr("disabled", true);
                        	var result = doAjax("/api/couponinfo/updateByPrimaryKeySelective", "post",
                                    {
                                    "id": datatime.id
                                    , "couponname": couponname
                                    , "price": price
                                    , "startime": startime
                                    , "overtime": overtime
                                    , "remark": remark
                                    , "distributingtype": "1"
                                    	
                                    }, ['#tbCouponsList'], null, null, false);
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
            
        	$("#id").val(datatime.id);
        	 $("#couponname").val(datatime.couponname);
             $("#price").val(datatime.price);
             $("#startime").val(timestampToTime(datatime.startime));
             $("#overtime").val(timestampToTime(datatime.overtime));
             $("#remark").val(datatime.remark);
             
            $('.date-pickers').datetimepicker({format:"yyyy-mm-dd hh:mm:ss",language:"zh-CN",todayHighlight:true,todayBtn:true,startView: 2});
        })
    };

    
    $("#c_searchBtn").click(function(){
    	$("#tbCouponsList").DataTable().ajax.reload();
    });
    
    
    $("#addbtn").click(function(){
    	var couponname=$("#couponname").val();
    	var price=$("#price").val();
    	var startime=$("#startime").val();
    	var overtime=$("#overtime").val();
    	var remark=$("#remark").val();
    	var type=$("#type").val();
    	
    	
    	if(couponname==null||couponname=='')
    	{
    		bootboxAlert("活动名称不能为空",false);
			stops;
    	}
    	
    	if(price==null||price=='')
    	{
    		bootboxAlert("优惠金额不能为空",false);
			stops;
    	}
    	
    	if(startime==null||startime=='')
    	{
    		bootboxAlert("开始时间不能为空",false);
			stops;
    	}
    	
    	if(overtime==null||overtime=='')
    	{
    		bootboxAlert("结束时间不能为空",false);
			stops;
    	}
    	
    	if(overtime<=startime)
    	{
    		bootboxAlert("结束时间不能小于开始时间",false);
			stops;
    	}
    	
    	if(type==null||type=='')
    	{
    		bootboxAlert("投放量不能为空",false);
			stops;
    	}
    	
    	$(this).attr("disabled", true);
    	var result = doAjax("/api/couponinfo/insertSelective", "post",
                {
                  "couponname": couponname
                , "price": price
                , "startime": startime
                , "overtime": overtime
                , "type": type
                , "remark": remark
                , "state": "1"
                , "distributingtype": "1"
                
                }, function(){
                	$("#couponname").val("");
                	$("#price").val("");
                	$("#startime").val("");
                	$("#overtime").val("");
                	$("#remark").val("");
                	$("#type").val("");
                }, null, null, false);
		$(this).attr("disabled", false);
    	return result;
    });
    
    $("#resetbtn").click(function(){
    	$("#couponname").val("");
    	$("#price").val("");
    	$("#startime").val("");
    	$("#overtime").val("");
    	$("#remark").val("");
    	$("#type").val("");
    });
    return obj;
}();