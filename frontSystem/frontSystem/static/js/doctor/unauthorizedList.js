/**
 * Created by Girl on 2018/7/20.
 */
;var ObjUnauthorizedListIndex = function(
){ 			//定义对象
    var obj = new Object();
    obj.ID = '';

    var zhicheng="<option value=''>请选择</option>";
    var keshi="<option value=''>请选择</option>";
    var hospitaname="<option value=''>请选择</option>";

    obj.html_dialog_addDoctor = '';
    obj.html_dialog_addDoctor = $('#updateDoctorDetails .container').html();
    $('#updateDoctorDetails .container').remove();

    obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        var tbUnauthorizedList = $('#tbUnauthorizedList').DataTable({
            "bServerSide" : true,
            'bAutoWidth':false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource":'/api/doctorinfo/list',
            "fnServerData" : function(sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function(condition, param) {
                    this.condition = condition;
                    this.param =  param;
                };
                //查询实体
                var UserInfo = function() {
                    this.confirmstate="2";
                    this.ordercode=$("#ordercode").val();
                    this.doctorname=$("#doctornames").val();
                    this.patientname=$("#patientname").val();
                    this.serviceid=$("#serviceid").val();
                    this.paystate=$("#paystate").val();
                    // 姓名查询
                    // this.doctornames=$("#doctornames").val();
                    this.doctorcodequery=$("#doctorcode").val();
                	this.sex=$("#sex").val();
                	this.openservice=$("#openservice").val();
                	this.dutiesflag="zhicheng";
                	var confirmtimestart=$("#confirmtimestart").val();
                	if(confirmtimestart!=null&&confirmtimestart!='')
                	{
                		confirmtimestart=confirmtimestart+" 00:00:00";
                	}
                	this.confirmtimestart=confirmtimestart;
                	var confirmtimeend=$("#confirmtimeend").val();
                	if(confirmtimeend!=null&&confirmtimeend!='')
                	{
                		confirmtimeend=confirmtimeend+" 59:59:59";
                	}
                	this.confirmtimeend=confirmtimeend;
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
                {"data" : "telephone", "defaultContent": ""},
                {"data" : "doctorname", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return row.sex=='1'?"男":"女";
                    }
                },
                {"data" : "dutiesname", "defaultContent": ""},
                {"data" : "hospitaname", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return timestampToTime(row.starttime);
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return row.confirmstate=='1'?"已认证":"待认证";
                    }
                },
                // {"data" : "remark", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        var html='';
                        html+="<span  id=\"editData\" class='s-btn'style='padding-right:10px' >查看资料</span><span  id=\"pass\" class='s-btn' style='padding-right:10px'>通过</span><span  id=\"nopass\" class='s-btn' >不通过</span>";
                        return html;
                    }
                }
            ]
        });
        
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
            }
        });
        //筛选
        $("#searchbtn").click(function(){
            // console.log(222)
            $("#tbUnauthorizedList").DataTable().ajax.reload();
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
            }
        });
    };

    $("#searchbtn").click(function(){
    	$('#tbUnauthorizedList').DataTable().ajax.reload();
    });
    // 查看资料
    $('#tbUnauthorizedList tbody').on('click','span#editData',function(){
    	var datatime = $('#tbUnauthorizedList').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "完善认证资料",
            size: 'large',
            message: obj.html_dialog_addDoctor,
            className: 'select-sizes',
            buttons: {
                success: {
                    label: "提交",
                    className: "btn-success btn-import{0} savebtn".format(obj.ID),
                    callback: function () {
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
                            return false;
						}
						var hospitaid=$("#hospitaid").val().trim();
						if(hospitaid==null||hospitaid=='')
						{
							bootboxAlert("医院不能为空",false);
                            return false;
						}
						var telephone=$("#telephone").val().trim();
						if(telephone==null||telephone=='')
						{
							bootboxAlert("联系方式不能为空",false);
                            return false;
						}
						if (isPhoneNo(telephone) == false) {
				            bootboxAlert("联系方式格式不正确",false);
                            return false;
				        }
						var skillLen=$("#selectskill").find("li").length;
						if(skillLen==null||skillLen<1)
						{
							bootboxAlert("擅长技能不能为空",false);
                            return false;
						}
						var zhiyezheng=$(".addImg-zhiyezheng-t").length;
						if(zhiyezheng==null||zhiyezheng==0)
						{
							bootboxAlert("执业证不能为空",false);
                            return false;
						}
						var zigezheng=$(".addImg-zigezheng-t").length;
						if(zigezheng==null||zigezheng==0)
						{
							bootboxAlert("资格证不能为空",false);
                            return false;
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
                         "id": datatime.id
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
                         
                         }, ['#tbUnauthorizedList'], null, null, false);
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
        
        $("#duties").html(zhicheng);
        $("#department").html(keshi);
        $("#hospitaid").html(hospitaname);
        
        
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
                        bootboxAlert("上传成功",true);
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
                        bootboxAlert("上传成功",true);
                        num++;
                        $('.addImg-'+filecode).before('<div class="fl addImg-'+filecode+'-t" data-id="'+num+'"><img class="uploadimage" filetype="'+filecode+'" picname="'+result[0].fileUrl+'" src="'+ filelocalpath+result[0].fileUrl+'" /><img class="minu delLi" style="cursor: pointer" src="/static/image/minus-circle.png" /></div>');
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
        
        ajax({
            "type" : 'get',
            "url" : '/api/doctorinfo/getDoctorDetailsById/'+datatime.id,
            "dataType" : "json",
            "success" : function(resp) {
            	if(resp.headphoto!=''&&resp.headphoto!=null)
            	{
            		$("#headphotoimg").attr("src",filefdfspath+resp.headphoto);
                	$("#headphotoimg").attr("picname",resp.headphoto);
                	$(".glyphicon-plus1").hide();
                	$("#headphotoimg").show();
            	}
            	else
            	{
            		$("#headphotoimg").hide();
            		$(".glyphicon-plus1").show();
            	}
            	
                var sex=resp.sex;
                if(sex=='1')
                {
                    $("#man").attr("checked",true);
                }
                else
                {
                    $("#women").attr("checked",true);
                }
                loadJsonDataToForm(resp);

                $("#duties").val(resp.duties);
                $("#department").val(resp.department);

                $("#distpickerup").distpicker({
                    autoSelect: false
                });
                $('#distpickerup').distpicker('destroy');
                $('#distpickerup').distpicker({
                    province: resp.province,
                    city: resp.city,
                    district: resp.contry
                });

                $("#hospitaid").val(resp.hospitaid);
                $("#intro").val(resp.intro);
                $("#remark").val(resp.remark);

                //加载擅长技能
                ajax({
                    "type" : 'post',
                    "url" : '/api/datadictionarydetail/selectBySortcodes',
                    "dataType" : "json",
                    "data": {
                        sortcodes: "ysjn"
                    },
                    "success": function(data){
                        ObjaddDoctorIndex.inputList('#skillsearch','#skillslist','#selectskill',2,data,resp.doctorskillList);
                    },
                    "error": function(e){

                    }
                });
                
                var dqualifications=resp.doctorqualificationList;
                
                if(dqualifications.length>0)
                {
                	for(var i=0;i<dqualifications.length;i++)
                	{
                		var paperfile=dqualifications[i].paperfile;
                		var id=dqualifications[i].id;
                		var qftype=dqualifications[i].qftype;
                		var html='<div class="fl addImg-'+qftype+'-t" data-id="'+(i+1000)+'"><img class="uploadimage" filetype="'+qftype+'" picname="'+paperfile+'" src="'+filefdfspath+paperfile+'" id="'+id+'"><img class="minu delLi" style="cursor: pointer" src="/static/image/minus-circle.png"></div>';
                		$(".addImg-"+qftype).before(html);
                		
                		$('.delLi').on('click',function(){
                            var liLists = $(this).parent();
                            console.log(liLists)
                            for(var i=0;i<liLists.length;i++){
                                if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
                                    liLists[i].remove();
                                }
                            }
                        })
                	}
                	
                }
            }
        });
    });
    // 通过
    $('#tbUnauthorizedList tbody').on('click','span#pass',function(){
        var datatime = $('#tbUnauthorizedList').DataTable().row($(this).parents('tr')).data();
        doAjax("/api/doctorinfo/doctorCertified", "post",
        {
            id:datatime.id,
            confirmstate:1
        }, ['#tbUnauthorizedList'], null, null, false);
    })
    // 不通过
    $('#tbUnauthorizedList tbody').on('click','span#nopass',function(){
        var datatime = $('#tbUnauthorizedList').DataTable().row($(this).parents('tr')).data();
        doAjax("/api/doctorinfo/doctorCertified", "post",
        {
            id:datatime.id,
            confirmstate:3
        }, ['#tbUnauthorizedList'], null, null, false);
    })
    return obj;
}();