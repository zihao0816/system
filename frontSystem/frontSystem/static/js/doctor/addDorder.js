/**
 * Created by Girl on 2018/7/25.
 */
;var ObjAddDordersIndex = function(
){ 			//定义对象
    
    var obj = new Object();
    obj.ID = '';
    obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        $('.date-picker').datetimepicker({format:"hh:ii",language:"zh-CN",todayHighlight:true,todayBtn:true,startView:1});
        
        
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
            	
            	var file = $(this)[0].files[0];
  	            // if(file.size>1024*200)
  	            // {
  	        	//    bootboxAlert("头像不能大于200KB",false);
  	        	//    $(this).val('');
                //     return false;
  	            // }
  	            
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
                        if(result[0].result == 0){

                            bootboxAlert("上传成功",true);
                            $("#headphotoimg").attr("src",filelocalpath+result[0].fileUrl);
                            $("#headphotoimg").attr("picname",result[0].fileUrl);
                            $(".glyphicon-plus1").hide();
                            $("#headphotoimg").show();
                            one.val('');
                        }else{
                            bootboxAlert("上传失败",true);
                        }

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
                        if(result[0].result == 0){
                            bootboxAlert("上传成功",true);
                            num++;
                            $('.addImg-'+filecode).before('<div class="fl addImg-'+filecode+'-t" data-id="'+num+'"><img class="uploadimage" filetype="'+filecode+'" picname="'+result[0].fileUrl+'" src="'+ filelocalpath+result[0].fileUrl+'" /><img class="minu delLi" style="cursor: pointer" src="/static/image/minus-circle.png" /></div>');
                            one.val('');
                            $('.delLi').on('click',function(){
                                var liLists = $(this).parent();
                                for(var i=0;i<liLists.length;i++){
                                    if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
                                        liLists[i].remove();
                                    }
                                }
                            })
                        }else{
                            bootboxAlert("上传失败",true);
                        }

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
        
        $("#adddortor").click(function(){
        	
        	var picname=$("#headphotoimg").attr("picname").trim();
    		if(picname==null||picname=='')
    		{
    			bootboxAlert("医生头像不能为空",false);
                return false;
    		}
    		
    		var doctorname=$('#doctorname').val().trim();
    		if(doctorname==null||doctorname=='')
    		{
    			bootboxAlert("医生姓名不能为空",false);
                return false;
    		}
    		
    		var birthday=$("#birthday").val().trim();
    		var duties=$("#duties").val().trim();
    		if(duties==null||duties=='')
    		{
    			bootboxAlert("职称不能为空",false);
                return false;
    		}
    		var department=$("#department").val().trim();
    		if(department==null||department=='')
    		{
    			bootboxAlert("科室不能为空",false);
                return false;
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
    		if (isPhoneNo(telephone) == false) {
	            bootboxAlert("联系方式格式不正确",false);
	            stops;
	        }
    		var skillLen=$("#selectskill").find("li").length;
    		if(skillLen==null||skillLen<1)
    		{
    			bootboxAlert("擅长技能不能为空",false);
    			stops;
    		}
    		var zhiyezheng=$(".addImg-zhiyezheng-t").length;
    		if(zhiyezheng==null||zhiyezheng==0)
    		{
    			bootboxAlert("执业证不能为空",false);
    			stops;
    		}
    		var zigezheng=$(".addImg-zigezheng-t").length;
    		if(zigezheng==null||zigezheng==0)
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
    		$(this).attr("disabled", true);
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
        	$(this).attr("disabled", false);
            return result;

        });
        
        
        $("#reset").click(function(){
        	resetVal()
        });
        
        function resetVal()
        {
        	$("#addoctorform :input").not(":button, :submit, :reset, :hidden").val("");
        	$('[data-toggle="distpicker"]').distpicker();
        	$("#selectskill").html("");
        	$(".addImg-zhiyezheng-t").remove();
        	$(".addImg-zigezheng-t").remove();
        	$(".addImg-jishuzheng-t").remove();
        	$("#headphotoimg").hide();
    		$(".glyphicon-plus1").show();
    		$("#confirmstate").val("2");
        }
        
    };
    
    
    
    return obj;
}();