/**
 * Created by Girl on 2018/7/19.
 */
;var ObjDoctorListIndex = function(
){ 			//定义对象
    var obj = new Object();
    obj.ID = '';
    obj.istrue = true;

    obj.html_dialog_addDoctor = '';
    obj.html_dialog_addDoctor = $('#addDoctorDetails .container').html();
    $('#addDoctorDetails .container').remove();

    obj.html_dialog_detailsPatient = '';
    obj.html_dialog_detailsPatient = $('#detailsPatient .container').html();
    $('#detailsPatient .container').remove();

    obj.html_dialog_detailsPrescription = '';
    obj.html_dialog_detailsPrescription = $('#detailsPrescription .container').html();
    $('#detailsPrescription .container').remove();

    obj.html_dialog_updatePrescription = '';
    obj.html_dialog_updatePrescription = $('#updatePrescription .container').html();
    $('#updatePrescription .container').remove();

    obj.html_dialog_detailsPay = '';
    obj.html_dialog_detailsPay = $('#detailsPay .container').html();
    $('#detailsPay .container').remove();

    obj.html_dialog_detailCode = '';
    obj.html_dialog_detailCode = $('#detailCode .container').html();
    $('#detailCode .container').remove();

    obj.html_dialog_detailsOrder='';
    obj.html_dialog_detailsOrder= orderList;

    obj.html_dialog_selectUpdatePrescription='';
    obj.html_dialog_selectUpdatePrescription= prescription;

    obj.html_dialog_selectUpdateInquiry='';
    obj.html_dialog_selectUpdateInquiry= inquiry;

    
    var zhicheng="<option value=''>请选择</option>";
    var keshi="<option value=''>请选择</option>";
    var hospitaname="<option value=''>请选择</option>";
    
    
    obj.init= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        var tbDoctorList = $('#tbDoctorList').DataTable({
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
                	this.confirmstate = "1";
                	this.doctorcodequery=$("#doctorcode").val();
                	this.sex=$("#sex").val();
                    this.docstate=$('#docstate').val();
                    this.websitestate=$('#websitestate').val();
                	this.openservice=$("#openservice").val();
                    this.dutiesflag="zhicheng";
                    this.doctornamel=$('#doctornames').val();
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
                    if(obj.istrue){
                        this.istruegzgw = '1'
                    }else{
                        this.istruegzgw = '2'
                    }
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
                        var openservice="";
                        // if(row.itaskisopen>0)openservice+="图文咨询、";
                        // if(row.thaskisopen>0)openservice+="电话咨询、";
                        // if(row.itagainisopen>0)openservice+="图文复诊、";
                        if(row.thagainisopen>0)openservice+="已开通";
                        if(row.thagainisopen<0)openservice+="未开通";
                        return openservice;
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return timestampToTime(row.confirmtime);
                    }
                },
                {"data" : "ordernum", "defaultContent": ""},
                {"data" : "websiteranking", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        var html='';
                        html+="<span  id=\"editData\" class='s-btn' >编辑资料</span>&emsp;";
                        html+="<span  id=\"seeOrder\" class='s-btn' data-type='two'>查看订单</span>&emsp;";
                        html+="<span  id=\"seePatient\" class='s-btn' >查看患者</span>&emsp;";
                        html+="<span  id=\"seePrescription\" class='s-btn' >查看药方</span>&emsp;";
                        html+="<span  id=\"seePay\" class='s-btn' >收支明细</span>&emsp;";
                        html+="<span  id=\"seeCode\" class='s-btn' >查看二维码</span>&emsp;";
                        html+="<span  id=\"show\" class='s-btn' >"+(row.docstate!=1?"公众号已隐藏":"公众号已显示")+"</span>&emsp;";
                        html+="<span  id=\"oshow\" class='s-btn' >"+(row.websitestate!=1?"官网已隐藏":"官网已显示")+"</span>&emsp;";
                        html+="<span  id=\"isshow\" class='s-btn' >可设为0</span>";
                        return html;
                    }
                }
            ]
        });
        


          //设置价格
        $('#tbDoctorList tbody').on('click','span#isshow',function(){
            var datatime = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
            obj.$currentDlg = bootbox.dialog({
                title: "可设置为0",
                size: 'large',
                className: 'select-size',
                message: '<div>确定要设置为0吗？</div>',
                buttons:{
                    success: {
                        label: "确定",
                        className: "btn-success btn-import{0} savebtn".format(obj.ID),
                        callback: function () {
                            doAjax("/api/doctorinfo/updateByPrimaryKeySelective", "post",
                            {
                                id:datatime.id,
                                setprice:0
                            }, ['#tbDoctorList'], null, null, false);
                        }
                    },
                    caner: {
                        label: "取消",
                        className: "btn-default",
                        callback: function () {
                        }
                    }
                }
            });
        })
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
    
    $('#gzhpaixu').click(function(){
        obj.istrue = true;
        $('#tbDoctorList').DataTable().ajax.reload();
    })
    $('#gwpaixu').click(function(){
        obj.istrue = false;
        $('#tbDoctorList').DataTable().ajax.reload();
    })

    $("#searchbtn").click(function(){
    	$('#tbDoctorList').DataTable().ajax.reload();
    });
    // 编辑资料
    $('#tbDoctorList tbody').on('click','span#editData',function(){
        var datatime = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "编辑医生信息",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_addDoctor,
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
                         , "websiteranking": $('#websiteranking').val()
                         , "confirmstate": $('#confirmstate').val()
                         , "remark": $('#remark').val()
                         , "dskills": dskills
                         , "dcertificate": dcertificates
                         , "headphoto": picname
                         }, ['#tbDoctorList'], null, null, false);
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
 	        //    if(file.size>1024*200)
 	        //    {
 	        // 	   bootboxAlert("头像不能大于200KB",false);
 	        // 	   $(this).val('');
            //        return false;
 	        //    }
            	
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
                // console.log(resp);
                console.log(resp.ordernum)
                resp.websiteranking=datatime.websiteranking;
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
                
                //load servicename
                $("#itaskisopen").attr("checked",resp.itaskisopen>0?true:false);
                $("#thaskisopen").attr("checked",resp.thaskisopen>0?true:false);
                $("#itagainisopen").attr("checked",resp.itagainisopen>0?true:false);
                $("#thagainisopen").attr("checked",resp.thagainisopen>0?true:false);

                if(resp.itaskisopen<0)
                {
                	$("#itaskprice").val('');
                }
                if(resp.thaskisopen<0)
                {
                	$("#thaskprice").val('');
                }
                if(resp.itagainisopen<0)
                {
                	$("#itagainprice").val('');
                }
                if(resp.thagainisopen<0)
                {
                	$("#thagainprice").val('');
                }
                // console.log(resp.thagainisopen) 10
                // console.log(resp.setprice);0
                // console.log($('#thagainprice').val())100
                

                var thagaintime=resp.thagaintime;
                if(thagaintime!=null&&thagaintime.indexOf("-")!=-1&&resp.itagaintime=='1')
                {
                	var _thagaintime=thagaintime.split("-");
                	$("#thagaintime1").val(_thagaintime[0]);
                	$("#thagaintime2").val(_thagaintime[1]);
                }
                var thagaintime=resp.thagaintime;
                if(thagaintime!=null&&thagaintime.indexOf("～")!=-1&&resp.itagaintime=='1')
                {
                	var _thagaintime=thagaintime.split("～");
                	$("#thagaintime1").val(_thagaintime[0].trim());
                	$("#thagaintime2").val(_thagaintime[1].trim());
                }
                
                var thasktime=resp.thasktime;
                if(thasktime!=null&&thasktime.indexOf("-")!=-1&&resp.itasktime=='1')
                {
                	var _thasktime=thasktime.split("-");
                	$("#thasktime1").val(_thasktime[0]);
                	$("#thasktime2").val(_thasktime[1]);
                }
                
                if(thasktime!=null&&thasktime.indexOf("～")!=-1&&resp.itasktime=='1')
                {
                	var _thasktime=thasktime.split("～");
                	$("#thasktime1").val(_thasktime[0].trim());
                	$("#thasktime2").val(_thasktime[1].trim());
                }
                

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
                
                $("#examineby").text(resp.examineby);
                $("#starttime").text(resp.starttime);
                $("#confirmtime").text(resp.confirmtime);
                $("#confirmstate").val(resp.confirmstate);
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
    // 查看订单
    $('#tbDoctorList tbody').on('click','span#seeOrder',function(){
    	var doctorData = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "查看订单",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_detailsOrder
        });
        if($(this).attr("data-type") == 'two'){
            $('.display-d').hide();
        }
        var tbOrder = $('#tbOrder').dataTable({
            "bServerSide": true,
            'bAutoWidth': false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource":'/api/orderinfo/queryOrderList',
            "fnServerData": function (sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function (condition, param) {
                    this.condition = condition;
                    this.param = param;
                };

                //查询实体
                var UserInfo = function () {
                	this.doctorid=doctorData.id;
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
            	{"data" : "patientname", "defaultContent": ""},
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
//                            html+="<span  id=\"seeDetailsOrder\" href=\"#\" class='s-btn'>查看订单</span>";
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
       
        $('#tbOrder tbody').on('click','span#seeDetailsOrder',function(){
            var orderList = $('#tbOrder').DataTable().row($(this).parents('tr')).data();
            if(orderList.ordertype == '1'){
                obj.$currentDlg = bootbox.dialog({
                    title: "查看问诊订单",
                    size: 'large',
                    className: 'select-size',
                    message: obj.html_dialog_selectUpdateInquiry
                });
                if(orderList.paystate == '1'){
                    $('#wzdata').hide();
                    $('.c-time').hide();
                    $('.s-style').hide();
                }else if(orderList.paystate == '2'){
                    $('.c-time').hide();
                }
                
                var nowpage=0;
                var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
                var nScrollTop = 0;  //滚动到的当前位置
                var nDivHight = $(".msg_list").height();
                $(".msg_list").scroll(function(){
	                nScrollHight = $(this)[0].scrollHeight;
	                nScrollTop = $(this)[0].scrollTop+10;
	                if(nScrollTop + nDivHight >= nScrollHight)
	                {
	                	loadchatmessage(orderList.doctorid,orderList.patientid,orderList.id,nowpage);
                    	nowpage++;
	                }
                }); 
                
//                $('.msg_list').on('scroll', function(){  
//                    if (! msg_list_loading ){
//                    	loadchatmessage(orderList.doctorid,orderList.patientid,orderList.id,nowpage);
//                    	nowpage++;
//                    }  
//                })
//                
                loadshowdata(orderList,"i");
            }else{
                obj.$currentDlg = bootbox.dialog({
                    title: "查看药方订单",
                    size: 'large',
                    className: 'select-sizes',
                    message: obj.html_dialog_selectUpdatePrescription
                });
                if(orderList.paystate == '1'){
                    $('.s-style').hide();
                    $('.c-time').hide();
                }else if(orderList.paystate == '2'){
                    $('.c-time').hide();
                }
                loadshowdata(orderList,"p");
                loadMedicine(orderList.id);
            }
        });
        $('#tbOrder tbody').on('click','span#updateDetailsOrder',function(){
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
            }else{
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
    // 查看患者
    $('#tbDoctorList tbody').on('click','span#seePatient',function() {
    	var doctorData = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "查看患者",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_detailsPatient
        });
        $('document').ready(function () {
            var tbPatient = $('#tbPatient').dataTable({
                "bServerSide": true,
                "bRetrieve":true,
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
                    	this.relationFlag="1";
                    	this.doctorid=doctorData.id;
                    	this.patientname=$("#p_patientname").val();
                    	this.telephone=$("#p_telephone").val();
                    	this.addtype=$("#p_addtype").val();
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
                    {"data": "patientname", "defaultContent": ""},
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
            });
        });
        $("#p_searchBtn").click(function(){
        	$('#tbPatient').DataTable().ajax.reload();
        });
    });
    // 查看药方
    $('#tbDoctorList tbody').on('click','span#seePrescription',function() {
    	var doctorData = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "查看药方",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_detailsPrescription
        });
        $('document').ready(function () {
            var tbPrescriptionTemplateList = $('#tbPrescriptionTemplateList').dataTable({
                "bServerSide": true,
                "bRetrieve":true,
                'bAutoWidth': false,//自动宽度
                "dom": 'rt<"bottom"flpi><"clear">',
                "sAjaxSource": "/api/prescriptioninfo/getPrescriptioinList", //mvc后台ajax调用接口。
                "fnServerData": function (sSource, aoData, fnCallback) {
                    //表格参数
                    var dataTablesParam = function (condition, param) {
                        this.condition = condition;
                        this.param = param;
                    };

                    //查询实体
                    var UserInfo = function () {
                    	this.doctorid=doctorData.id;
                    	this.prescriptionname=$("#pp_prescriptionname").val();
                    	var createtime=$("#pp_createtime").val();
                    	if(createtime!=null&&createtime!='')
                    	{
                    		this.startDate=createtime+" 00:00:00";
                    		this.endDate=createtime+" 59:59:59";
                    	}
                    	
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
                    {"data": "prescriptionname", "defaultContent": ""},
                    {"data": "medicines", "defaultContent": ""},
                    {"data" : "", "defaultContent": "",
                        "render": function (data, type,row) {
                            return numberFormat(row.totalprice,2);
                        }
                    },
                    {"data" : "", "defaultContent": "",
                        "render": function (data, type,row) {
                            return timestampToTime(row.createtime);
                        }
                    },
                    {"data": "", "defaultContent": "",
                        "render": function(data, type,row){
                            var html = '';
                            html+="<span  id=\"editPrescription\" class='s-btn' >编辑药方</span>";
                            return html;
                        }
                    }
                ]
            })
        });
        
        $("#pp_searchBtn").click(function(){
        	$('#tbPrescriptionTemplateList').DataTable().ajax.reload();
        });
        
        $('#tbPrescriptionTemplateList tbody').on('click','span#editPrescription',function(){
        	var datatime = $('#tbPrescriptionTemplateList').DataTable().row($(this).parents('tr')).data();
            obj.$currentDlg = bootbox.dialog({
                title: "编辑药方",
                size: 'large',
                className: 'patientsize',
                message: obj.html_dialog_updatePrescription,
                buttons: {
                    success: {
                        label: "提交",
                        className: "btn-success btn-import{0} savebtn3".format(obj.ID),
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
    						$(".savebtn3").attr("disabled", true);
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
                                    
                                    }, ['#tbPrescriptionTemplateList'], null, null, false);
                        	if(result==false)
                        	{
                        		$(".savebtn3").attr("disabled", false);
                        	}
                        	return result;
                        }
                    },
                    caner: {
                        label: "取消",
                        className: "btn-default",
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
                    loadJsonDataToForm(resp);
                    $("#createtime").val(timestampToTime(resp.createtime));
                    //加载药材
                    var user={}
                    user.nameby="w";
                    ajax({
                        "type" : 'post',
                        "url" : '/api/medicineinfo/getMedicineList',
                        "contentType": "application/json",
                        "dataType" : "json",
                        "data": JSON.stringify(user),
                        "success": function(data){
                            ObjaddDoctorIndex.inputList1('#medicinesearch','#medicinelist','#selectmedicine',1,data,resp.prescriptionmedicineinfoList);
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
					                console.log(liLists);
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
        })
    });
    // 收支明细
    $('#tbDoctorList tbody').on('click','span#seePay',function() {
    	var doctorData = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "收支明细",
            size: 'large',
            className: 'patientsize',
            message: obj.html_dialog_detailsPay
        });
        $('document').ready(function () {
            var tbPay = $('#tbPay').dataTable({
                "bServerSide": true,
                "bRetrieve":true,
                'bAutoWidth': false,//自动宽度
                "dom": 'rt<"bottom"flpi><"clear">',
                "sAjaxSource": "/api/accountdetals/queryAccountDetails", //mvc后台ajax调用接口。
                "fnServerData": function (sSource, aoData, fnCallback) {
                    //表格参数
                    var dataTablesParam = function (condition, param) {
                        this.condition = condition;
                        this.param = param;
                    };

                    //查询实体
                    var UserInfo = function () {
                    	this.userid=doctorData.id;
                    	this.patientname=$("#a_patientname").val();
                    	var createtime=$("#a_createtime").val();
                    	if(createtime!=null&&createtime!='')
                    	{
                    		this.starttime=createtime+" 00:00:00";
                    		this.endtime=createtime+" 59:59:59";
                    	}
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
                	{"data": "patientname", "defaultContent": ""},
                    {"data" : "", "defaultContent": "",
                        "render": function (data, type,row) {
                            return row.tradetype=="1"? "收入" : "支出";
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
                        	else if ("5"==row.serviceid)
                        	{
                        		data="药方";
                        	}
                        	else if ("6"==row.serviceid)
                        	{
                        		return "提现";
                        	}
                    		return data;
                        }
                    },
                    {"data": "ordercode", "defaultContent": ""},
                    {"data": "thismoney", "defaultContent": ""},
                    {"data": "aftermoney", "defaultContent": ""},
                    {"data" : "", "defaultContent": "",
                        "render": function (data, type,row) {
                            return timestampToTime(row.createtime);
                        }
                    },
                ]
            })
        });
        $("#a_searchBtn").click(function(){
        	$("#tbPay").DataTable().ajax.reload();
        });
    });
    // 查看二维码
    $('#tbDoctorList tbody').on('click','span#seeCode',function(){
    	var doctorData = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        obj.$currentDlg = bootbox.dialog({
            title: "查看二维码",
            size: 'small',
            className: 'patientsizc',
            message: obj.html_dialog_detailCode
        });
        
        $("#qrbigurl").attr("src",weiXinQr+doctorData.qrbigurl);
        $("#copy-text").val(weiXinQr+doctorData.qrbigurl);
        
        $('#copy').on('click',function(){
            var url=document.getElementById("copy-text");
            url.select(); // 选择对象
            document.execCommand("Copy");
            bootbox.alert({
                buttons: {
                    ok: {
                        label: '确定',
                        className: 'btn-myStyle'
                    }
                },
                className:'alertsize',
                message: "复制成功" ,
                callback: function() {
                },
                title: '提示',
            });
        })
    });
    // 显示隐藏
    $('#tbDoctorList tbody').on('click','span#show',function(){
        var datatime = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        doAjax("/api/doctorinfo/updateByPrimaryKeySelective", "post",
            {
                id:datatime.id,
                docstate:datatime.docstate==1?2:1
            }, ['#tbDoctorList'], null, null, false);
    })
    $('#tbDoctorList tbody').on('click','span#oshow',function(){
        var datatime = $('#tbDoctorList').DataTable().row($(this).parents('tr')).data();
        doAjax("/api/doctorinfo/updateByPrimaryKeySelective", "post",
            {
                id:datatime.id,
                websitestate:datatime.websitestate==1?2:1
            }, ['#tbDoctorList'], null, null, false);
    })
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
        $("#"+type+"_taboo").text(orderList.taboo==''?'无':orderList.taboo);
//        $("#"+type+"_sendcompany").text(orderList.sendcompany);
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
