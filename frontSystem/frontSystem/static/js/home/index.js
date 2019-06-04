/**
 * Created by Girl on 2018/7/17.
 */
;var ObjhomeIndex = function(
){ 			//定义对象
    var obj = new Object();
    obj.ID = '';
    obj.html_dialog_addDoctor='';
    obj.html_dialog_addDoctor= $('#addDoctorDetails .container').html();
    $('#addDoctorDetails .container').remove();

    obj.html_dialog_addPrescriptionTemplate='';
    obj.html_dialog_addPrescriptionTemplate= prescriptionTemplate;
    // $('#addPrescription .container').remove();
    obj.init= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        
        //查询待认证医生人数
        var conditon={};
        conditon.confirmstate="2";
        ajax({
            "type" : 'post',
            "url" : '/api/doctorinfo/getCountByKey',
            "contentType": "application/json",
            "dataType" : "json",
            "data" : JSON.stringify(conditon),
            "success" : function(resp) {
                $("#prepare").text(resp.parameters);
            }
        });
    };
    
    $("#toundoctorpage").on("click", function(){
    	window.parent.document.getElementById("openundoctorpage").click();
    });
    
    

    $('#adddoctor').on('click',function(){
        obj.$currentDlg = bootbox.dialog({
            title: "添加医生信息",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_addDoctor,
            buttons: {
                success: {
                    label: "提交",
                    className: "btn-success btn-import{0} savebtn".format(obj.ID),
                    callback: function () {
//                        obj.$currentBtn = $(".btn-import{0} button[data-bb-handler]".format(obj.ID)).html('loading');
                        
                        var picname=$("#headphotoimg").attr("picname").trim();
                		if(picname==null||picname=='')
                		{
                			bootboxAlert("医生头像不能为空",false);
                			stops;
                		}
                		
                		var doctorname=$('#doctorname').val().trim();
                		if(doctorname==null||doctorname=='')
                		{
                			bootboxAlert("医生姓名不能为空",false);
                			stops;
                		}
                		
                		var birthday=$("#birthday").val().trim();
                		var duties=$("#duties").val().trim();
                		if(duties==null||duties=='')
                		{
                			bootboxAlert("职称不能为空",false);
                			stops;
                		}
                		var department=$("#department").val().trim();
                		if(department==null||department=='')
                		{
                			bootboxAlert("科室不能为空",false);
                			stops;
                		}
                		var province=$("#province").val().trim();
            			var city=$("#city").val().trim();
            			var contry=$("#contry").val().trim();
            			if(province==null||province==''||city==null||city==''||contry==null||contry=='')
            			{
            				bootboxAlert("省份不能为空",false);
            				stops;
            			}
                		var hospitaid=$("#hospitaid").val().trim();
                		if(hospitaid==null||hospitaid=='')
                		{
                			bootboxAlert("医院不能为空",false);
                			stops;
                		}
                		var telephone=$("#telephone").val().trim();
                		if(telephone==null||telephone=='')
                		{
                			bootboxAlert("联系方式不能为空",false);
                			stops;
                		}
                		var skillLen=$("#selectskill").find("li").length;
                		if(skillLen==null||skillLen<1)
                		{
                			bootboxAlert("擅长技能不能为空",false);
                			stops;
                		}
                		var zhiyezheng=$(".addImg-zhiyezheng").html().trim();
                		if(zhiyezheng==null||zhiyezheng=='')
                		{
                			bootboxAlert("执业证不能为空",false);
                			stops;
                		}
                		var zigezheng=$(".addImg-zigezheng").html().trim();
                		if(zigezheng==null||zigezheng=='')
                		{
                			bootboxAlert("资格证不能为空",false);
                			stops;
                		}
                    	
                		var dskills = "";
                		var dcertificates="";
                		$("#selectskill li span").each(function(){
                			var obj = $(this);
                			dskills+=obj.text()+",";
                		});
                		
                		$(".uploadimage").each(function(){
                			var obj = $(this);
                			dcertificates+=obj.attr("filetype")+"@#@"+obj.attr("picname")+",";
                		});
                		$(".savebtn").attr("disabled", true);
                        var result = doAjax("/api/doctorinfo/addorUpdateDoctorInfo", "post",
                         {
                         "id": ""
                         , "doctorname": doctorname
                         , "birthday": birthday
                         , "duties": duties
                         , "department": department
                         , "telephone": telephone
                         , "contry": contry
                         , "city": city
                         , "province": province
                         , "hospitaid": hospitaid
                         , "sex": $("input[name='sex']:checked").val()
                         , "intro": $('#intro').val()
                         , "ordernum": $('#ordernum').val()
                         , "confirmstate": $('#confirmstate').val()
                         , "remark": $('#remark').val()
                         , "dskills": dskills
                         , "dcertificate": dcertificates
                         , "headphoto": picname
                         , "source": "2"
                         },function(result){
                        	 resetVal();
                         }, null
                         , null, false);
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
        $('[data-toggle="distpicker"]').distpicker();

        var zhicheng="<option value=''>请选择</option>";
        var keshi="<option value=''>请选择</option>";
        var hospitaname="<option value=''>请选择</option>";
        
		$("#headphotoimg").hide();
		$(".glyphicon-plus1").show();
        
        //加载职称、科室
        ajax({
            "type" : 'post',
            "url" : '/api/datadictionarydetail/selectBySortcodes',
            "dataType" : "json",
            "data" : {
                sortcodes : "zhicheng,keshi",
            },
            "success" : function(resp) {
                for(x in resp){
                    var obj = resp[x];
                    if(obj.sortcode=='zhicheng')
                    {
                        zhicheng+="<option value='"+obj.itemcode+"'>"+obj.itemname+"</option>";
                    }
                    else if(obj.sortcode=='keshi')
                    {
                        keshi+="<option value='"+obj.itemcode+"'>"+obj.itemname+"</option>";
                    }
                }
                $("#duties").html(zhicheng);
                $("#department").html(keshi);
            }
        });

        //加载医院信息
        var hospitaCon={"hospitastate":"1"};
        ajax({
            "type" : 'post',
            "url" : '/api/hospitainfo/getListByKey',
            "dataType" : "json",
            "contentType":"application/json",
            "data" : JSON.stringify(hospitaCon),
            "success" : function(resp) {
                for(var i=0;i<resp.length;i++)
                {
                    var obj = resp[i];
                    hospitaname+="<option value='"+obj.id+"'>"+obj.hospitaname+"</option>";
                }
                $("#hospitaid").html(hospitaname);
            }
        });
        
        
        $('#headphoto').on('change',function(){
            if( $(this)[0].files[0]!="" && $(this)[0].files[0]!=null){
                var fd = new FormData();
                fd.append("file",$(this)[0].files[0]);
                var one = $(this);
                ajax({
                    url: "/api/FastDfs/uploadLocal",
                    type: 'POST',
                    data: fd,
                    dataType: 'JSON',
                    cache: false,
                    processData: false,
                    contentType:false,
                    success: function (result) {
                        bootboxAlert("上传成功",true)
                        $("#headphotoimg").attr("src",filelocalpath+result[0].fileUrl);
                        $("#headphotoimg").attr("picname",result[0].fileUrl);
                        $(".glyphicon-plus1").hide();
                    	$("#headphotoimg").show();
                        one.val('');
                    },
                    error: function (xhr,status,error) {
                    	 bootboxAlert("未知错误",false)
                    }
                })
            }
        });
        
        $(".delImg").click(function(){
        	$("#headphotoimg").attr("src","");
            $("#headphotoimg").attr("picname","");
            $(".glyphicon-plus1").show();
        	$("#headphotoimg").hide();
        });
        
        var num = 0;
        $('.uploadImgs').on('change',function(){
            if( $(this)[0].files[0]!="" && $(this)[0].files[0]!=null){
                var fd = new FormData();
                fd.append("file",$(this)[0].files[0]);
                var one = $(this);
                var filecode=one.attr("filecode");
                ajax({
                    url: "/api/FastDfs/uploadLocal",
                    type: 'POST',
                    data: fd,
                    dataType: 'JSON',
                    cache: false,
                    processData: false,
                    contentType:false,
                    success: function (result) {
                        bootboxAlert("上传成功",true)
                        num++;
                        $('.addImg-'+filecode).append('<div class="fl" data-id="'+num+'"><img class="uploadimage" filetype="'+filecode+'" picname="'+result[0].fileUrl+'" src="'+ filelocalpath+result[0].fileUrl+'" /><img class="minu delLi" style="cursor: pointer" src="/static/image/minus-circle.png" /></div>');
                        one.val('');
                        $('.delLi').on('click',function(){
                            var liLists = $(this).parent();
                            console.log(liLists)
                            for(var i=0;i<liLists.length;i++){
                                if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
                                    liLists[i].remove();
                                }
                            }
                        })
                    },
                    error: function (xhr,status,error) {
                        bootboxAlert("未知错误",false)
                    }
                })
            }
        });
        
        //加载擅长技能
        ajax({
            "type" : 'post',
            "url" : '/api/datadictionarydetail/selectBySortcodes',
            "dataType" : "json",
            "data": {
                sortcodes: "ysjn"
            },
            "success": function(data){
                ObjaddDoctorIndex.inputList('#skillsearch','#skillslist','#selectskill',2,data,null);
            },
            "error": function(e){

            }
        });
        
        function resetVal()
        {
        	$("#addoctorform :input").not(":button, :submit, :reset, :hidden").val("");
        	$('[data-toggle="distpicker"]').distpicker();
        	$("#selectskill").html("");
        	$(".addImg-zhiyezheng").html("");
        	$(".addImg-zigezheng").html("");
        	$(".addImg-jishuzheng").html("");
        	$(".addImg-jishuzheng").html("");
        	$("#headphotoimg").hide();
    		$(".glyphicon-plus1").show();
    		$("#confirmstate").val("2");
        }
        
        $('.date-picker').datetimepicker({format:"hh:ii",language:"zh-CN",todayHighlight:true,todayBtn:true,startView:1});
    });
    $('#addprescript').on('click',function(){
        obj.$currentDlg = bootbox.dialog({
            title: "添加药方信息",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_addPrescriptionTemplate,
            buttons: {
                success: {
                    label: "提交",
                    className: "btn-success btn-import{0} savebtn1".format(obj.ID),
                    callback: function () {
                    	var prescriptionname=$("#prescriptionname").val().trim();
						if(prescriptionname==null||prescriptionname=='')
						{
							bootboxAlert("药方名称不能为空",false);
							stops;
						}
						
						var medicineLen=$("#selectmedicine").find("li").length;
						if(medicineLen==null||medicineLen<1)
						{
							bootboxAlert("药材不能为空",false);
							stops;
						}
						
						var medicines="";
						$(".selectmedicine li").each(function(){
							var obj = $(this);
							var o_span=obj.children("span").eq(0);
							var o_span_input=obj.children("span").eq(1);
							var o_span_value=o_span_input.children("input").eq(0).val();
							if(o_span_value<1)
							{
								bootboxAlert("药材克数不能为空",false);
    							stops;
							}
							medicines+=o_span.attr("mid")+"@#@"+o_span.text()+"@#@"+o_span_value+",";
						});
						
						var totaldosage=$("#totaldosage").val().trim();
						var daydosage=$("#daydosage").val().trim();
						var taketime=$("#taketime").val().trim();
						if(totaldosage==null||totaldosage==''||daydosage==null||daydosage==''||taketime==null||taketime=='')
						{
							bootboxAlert("用药说明不能为空",false);
							stops;
						}
						
						
						var taboos = "";
						$("#selectprescription li span").each(function(){
							var obj = $(this);
							taboos+=obj.text()+",";
						});
						
						$(".savebtn1").attr("disabled", true);
                    	var result = doAjax("/api/prescriptioninfo/addOrUpdatePrescriptionInfo", "post",
                                {
                                  "prescriptionname": prescriptionname
                                , "medicines": medicines
                                , "specialadvice": $("#specialadvice").val()
                                , "taboo": taboos
                                , "totaldosage": totaldosage
                                , "daydosage": daydosage
                                , "taketime": taketime
                                , "prescriptiontype": "1"
                                }, ['#tbPrescriptionTemplateList'], null, null, false);
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
                    callback: function (e) {
                    }
                }
            }
        });
        
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
                ObjaddDoctorIndex.inputList1('#medicinesearch','#medicinelist','#selectmedicine',1,data,null);
                $(".mdprice").on('change',function(){
             	   var totalprice="";
             	   $(".mdprice").each(function(){
             		   var obj=$(this);
                 	   var mprice=obj.attr("mprice");
                 	   var dosage=obj.val();
                 	   totalprice=totalprice*1+(mprice*dosage);
     				});
             	   $("#totalprice").val(numberFormat(totalprice.toFixed(2),2));
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
				ObjaddDoctorIndex.inputList('.unprescription','#prescriptionlist','#selectprescription',2,data,null);
            }
        });
        
    });
    return obj;
}();