/**
 * Created by Girl on 2018/7/18.
 */
;var ObjaddDoctorIndex = function(
){ 			
	var isUndoCheck='onkeyup="if(isNaN(value))execCommand(\'undo\')" onafterpaste="if(isNaN(value))execCommand(\'undo\')" ';
	//定义对象
    var obj = new Object();
    obj.ID = '';
    obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
    };
    /*  first input的id名
        second datalist的id名
        third  ul的id名
        type  1位药材  2为技能
        data  datalist的下拉数据
        data1  查询已添加的数据
     */
    obj.inputList = function(first,second,third,type,data,data1){
        $(first).on('input',function(){
            var list = data;
            if(list != '' && list != null){
                $(second+' option').remove();
                if($(first).val() != ''){
                    for(var i=0;i<list.length;i++){
                        var a = '<option data-id="'+list[i].id+'" value="'+list[i].itemname+'"></option>';
                        $(second).append(a);
                    }
                }
            }
        });
        if(data1!=null&&data1.length>0){
            var skillslist = '';
            for(var i=0;i<data1.length;i++){
                var skills = data1[i];
                skillslist+='<li style="text-align: center" data-id="'+(i+1)+'" class="col-sm-3 selectHerbs"><span id="opValue">'+skills.skillname+'</span><img class="minus delLi" style="cursor: pointer;" src="/static/image/minus-circle.png"></li>';
            }
            $("#selectskill").append(skillslist);
            $('.delLi').on('click',function(){
                var liLists = $("#selectskill").children();
                for(var i=0;i<liLists.length;i++){
                    if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
                        liLists[i].remove();
                    }
                }
            });
        }
        var num=0;
        var nums='';
        $(first).on('change',function(){
            var input_select=$(first).val();
            var option_length=$(second+' option').length;
            var option_id='';
            for(var i=0;i<option_length;i++){
                var option_value=$(second+' option').eq(i).attr('value');
                if(input_select!="" && input_select==option_value){
                    option_id=$(second+' option').eq(i).attr('value');
                    break;
                }
            }
            if(option_id == ''){
                option_id = input_select;
            }
            var panduan;
            if(type == 1){
                panduan = input_select!="" && input_select == option_value;
            }else if(type == 2){
                panduan = input_select!="";
            }else if(type == 3){
            	panduan = input_select!="" && input_select == option_value;
            }
            if(panduan){
                nums = 's'+(num++);
                var herbsLi ='';
                if(type == 1){
                    herbsLi =   '<li data-id="'+nums+'" class="col-sm-3 selectHerbs">'+
                                    '<span id="opValue">'+option_id+'</span>'+
                                    '<span class="move"><input autocomplete="off" style="width: 26px;padding-left: 10px;border: none;outline: none;" type="text" placeholder="0"/>/<span>克</span></span>'+
                                    '<img class="minus delLi" style="cursor: pointer;" src="/static/image/minus-circle.png" />'+
                                '</li>';
                }else if(type == 2||type == 3){
                    herbsLi =   '<li style="text-align: center" data-id="'+nums+'" class="col-sm-3 selectHerbs">'+
                                    '<span id="opValue">'+option_id+'</span>'+
                                    '<img class="minus delLi" style="cursor: pointer;" src="/static/image/minus-circle.png" />'+
                                '</li>';
                }
                var liList = $(third).children();
                if(liList.length == 0){
                    $(third).append(herbsLi);
                }else{
                    for(var i=0;i<liList.length;i++){
                        if(liList[i].children[0].innerHTML == input_select){
                            return;
                        }
                    };
                    $(third).append(herbsLi);
                }
                $('.delLi').on('click',function(){
                    console.log($(this).parent().attr("data-id"));
                    var liLists = $(third).children();
                    console.log(liLists);
                    for(var i=0;i<liLists.length;i++){
                        if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
                            liLists[i].remove();
                        }
                    }
                })
            }
        });
    };
    
    
    /*  first input的id名
	    second datalist的id名
	    third  ul的id名
	    type  1位药材  2为技能
	    data  datalist的下拉数据
	    data1  查询已添加的数据
	 */
	obj.inputList1 = function(first,second,third,type,data,data1){
	    $(first).on('input',function(){
	        var list = data;
	        if(list != '' && list != null){
	            $(second+' option').remove();
	            if($(first).val() != ''){
	                for(var i=0;i<list.length;i++){
	                    var a = '<option data-id="'+list[i].id+'" mid="'+list[i].id+'" value="'+list[i].medicinename+'" medicineprice="'+list[i].medicineprice+'"></option>';
	                    $(second).append(a);
	                }
	            }
	        }
	    });
	    if(data1!=null&&data1.length>0){
	        var medicineslist = '';
	        for(var i=0;i<data1.length;i++){
	            var medicine = data1[i];
	            medicineslist+='<li data-id="'+(i+1)+'"  class="col-sm-3 selectHerbs"><span id="opValue" mid="'+medicine.medicineid+'" medicineprice="'+medicine.medicineprice+'">'+medicine.medicinename+'</span><span class="move" style="margin-left: 20px;"><input style="width: 40px;padding-left: 1px;border: none;outline: none;text-align: right" type="text" placeholder="0" autocomplete="off" id="dosage" onkeyup="clearNoNum(this,1,999.99)" value="'+medicine.dosage+'" mprice="'+medicine.medicineprice+'" class="mdprice" '+isUndoCheck+'/>/<span>克</span></span><img class="minus delLi" style="cursor: pointer;" src="/static/image/minus-circle.png"></li>';
	        }
	        $("#selectmedicine").append(medicineslist);
	        $('.delLi').on('click',function(){
	            console.log($(this).parent().attr("data-id"));
	            var liLists = $("#selectmedicine").children();
	            for(var i=0;i<liLists.length;i++){
	                if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
	                    liLists[i].remove();
	                }
	            }
	            sumPrice();
	        });
	    }
	    var num=0;
	    var nums='';
	    $(first).on('change',function(){
	        var input_select=$(first).val();
	        var option_length=$(second+' option').length;
	        var option_id='';
	        var m_id='';
	        var m_price='';
	        for(var i=0;i<option_length;i++){
	            var option_value=$(second+' option').eq(i).attr('value');
	            if(input_select!="" && input_select==option_value){
	                option_id=$(second+' option').eq(i).attr('value');
	                m_id=$(second+' option').eq(i).attr('mid');
	                m_price=$(second+' option').eq(i).attr('medicineprice');
	                break;
	            }
	        }
	        if(option_id == ''){
	            option_id = input_select;
	        }
	        var panduan;
	        if(type == 1){
	            panduan = input_select!="" && input_select == option_value;
	        }else if(type == 2){
	            panduan = input_select!="";
	        }
	        if(panduan){
	            nums = 'ms'+(num++);
	            var herbsLi ='';
	            if(type == 1){
	                herbsLi =   '<li data-id="'+nums+'" class="col-sm-3 selectHerbs">'+
	                                '<span id="opValue" mid="'+m_id+'">'+option_id+'</span>'+
	                                '<span class="move" style="margin-left: 20px;"><input style="width: 40px;padding-left: 1px;border: none;outline: none;" type="text" autocomplete="off" onkeyup="clearNoNum(this,1,999.99)" placeholder="0" class="mdprice" mprice="'+m_price+'" '+isUndoCheck+' />/<span>克</span></span>'+
	                                '<img class="minus delLi" style="cursor: pointer;" src="/static/image/minus-circle.png" />'+
	                            '</li>';
	            }else if(type == 2){
	                herbsLi =   '<li style="text-align: center" data-id="'+nums+'" class="col-sm-3 selectHerbs">'+
	                                '<span id="opValue">'+option_id+'</span>'+
	                                '<img class="minus delLi" style="cursor: pointer;" src="/static/image/minus-circle.png" />'+
	                            '</li>';
	            }
	            var liList = $(third).children();
	            if(liList.length == 0){
	                $(third).append(herbsLi);
	            }else{
	                for(var i=0;i<liList.length;i++){
	                    if(liList[i].children[0].innerHTML == input_select){
	                        return;
	                    }
	                };
	                $(third).append(herbsLi);
	            }
	            $('.delLi').on('click',function(){
	                console.log($(this).parent().attr("data-id"));
	                var liLists = $(third).children();
	                console.log(liLists);
	                for(var i=0;i<liLists.length;i++){
	                    if(liLists[i].getAttribute("data-id") == $(this).parent().attr("data-id")){
	                        liLists[i].remove();
	                    }
	                }
	                sumPrice();
	            });
	            $(".mdprice").on('change',function(){
	            	sumPrice();
                });
	        }
	    });
	};
	//计算药方合计价格
	function sumPrice()
	{
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
	}

    return obj;

   

}();
$(document).bind('click', function () {
    //只允许数字
    $('.MustNum').change(function () {
        $(this).val($(this).val().replaceAll(" ", ""))
        if (isNaN($(this).val()) || $(this).val().indexOf(".") == $(this).val().length - 1) {
            layer.msg('请输入正确格式的数字', {area: ['300px'], offset: ['400px'], time: 1000, shift: 6}, function () {
            });
            $(this).val("")
        }
    })
    //只允许整数
    $('.MustNums').change(function () {
        $(this).val($(this).val().replaceAll(" ", ""))
        if (isNaN($(this).val()) || $(this).val().indexOf(".") >= 0) {
            layer.msg('请输入正确格式的数字', {area: ['300px'], offset: ['400px'], time: 1000, shift: 6}, function () {
            });
            // bootbox.alert('请输入正确格式的数字');
            $(this).val("")
        }
    })
})
function getCookie(name){
	var strcookie = document.cookie;//获取cookie字符串
	var arrcookie = strcookie.split("; ");//分割
		//遍历匹配
		for ( var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0] == name){
			return arr[1];
		}
	}
	return "";
}

ajax = function(json,sessionID){
	var ck=sisnull(sessionID)?getCookie('pcsessionid'):sessionID;
	if(ck!=null&&ck!='')
	{
		json.headers={"sessionID":ck};
	}
	var zx=json.success;
    json.success=null;
    var dos=function(res){
        isLogin(res,zx);
    }
    json.success=dos;
    $.ajax(json)
};
function load_DropDownList_Get(url, type, dropName, text, value, json, callback, shval, zidinyi) {
    var dropDownList = $(dropName);
    // console.log(dropDownList);
    dropDownList.html("");
    var option = document.createElement("option");
    option.text = shval == null ? '请选择' : shval;
    option.value = '';
    dropDownList.append(option);
    if (dropDownList.children('option').length < 2) {
        ajax({
            type: type,
            url: url,
            async: true,
            contentType: "application/json", //必须有
            dataType: "json", //表示返回值类型，不必须
            data: JSON.stringify(json),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
            success: function (jsonResult) {
                if (jsonResult instanceof Array) {
                    $.each(jsonResult, function (index, content) {
                        var option = document.createElement("option");
                        var optiontext = eval('content.' + text);
                        var optionvalue = eval('content.' + value);
                        var option = '<option value="' + optionvalue + '"  ';
                        if (zidinyi != null) {
                            for (var i = 0; i < zidinyi.length; i++) {
                                var att = zidinyi[i][0] + '="' + eval('content.' + zidinyi[i][1]) + '"  ';
                                option += att;
                            }
                        }
                        option += '>' + optiontext + '</option>';
                        dropDownList.append(option);
                    });
                    if (typeof(callback) == 'function') {
                        callback();
                    }
                }
            }
        });
    }
};
function isLogin(res,success) {
    if(res.action=="-1"){
       try {
           window.parent.location.href = '/';
       }catch (err) {
           window.location.href = '/';
       }
    }
    if(typeof (success)=="function"){
        success(res)
    }
}
//字符串非空判断
function sisnull(pannull) {
    return pannull == null?true:false;
}
//getval
function getval(pannull) {
    return pannull == null || pannull.trim() == ""?null:pannull.trim();
}
//url:路径
//ajax类型
//json
//uptable 执行成功后刷新的表，或者方法
// successback ajax成功后方法
// errorback ajax失败后方法
//async
function doAjax(url, type, json, uptable, successback, errorback,async,sessionID) {
    var re;
    ajax({
        type: type,
        url: url,
        async: async==null?true:async,
        contentType: "application/json", //必须有
        dataType: "json", //表示返回值类型，不必须
        data: JSON.stringify(json),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
        success: function (result) {
            if (successback != null && typeof(successback) == 'function') {
                re= successback(result);
            } else {
                if (result.result >= 0) {
                    bootboxAlert("操作成功",true)
                    if (uptable != null) {
                        if (typeof(uptable) == 'function') {
                            uptable(result);
                        } else {
                            for (var i = 0; i < uptable.length; i++) {
                                $( uptable[i]).DataTable().ajax.reload();
                            }
                        }
                    }
                    re= true
                } else if (result.result == -1) {
                    var detail=sisnull(result.message)?sisnull(result.detail)?sisnull(result.action)?null:result.action:result.detail:result.message;
                    if(detail=='操作失败'){detail="未知错误，请联系管理员";}
                    bootboxAlert("操作失败！"+(detail==null?"":" :"+detail),false)
                    re= false
                }
            }
        },
        error: function (xhr,status,error) {
            if (errorback != null && typeof(errorback) == 'function') {
                re= errorback(xhr,status,error);
            } else {
            	if(error=='操作失败'){error="未知错误，请联系管理员";}
                bootboxAlert("操作失败！"+(error==null?"":" :"+error),false)
            }
            re= false;
        }
    },sessionID);
    return re;
}


function bootboxAlert(msg,type) {
    var message = '';
    if (type) {
        message = '<div style="text-align: center"><img width="32" height="32" src="/static/image/check-circle-fill.png" /><p>' + msg + '</p></div>';
    } else {
        message = '<div style="text-align: center"><img width="32" height="32" src="/static/image/close-circle-fill.png" /><p>' + msg + '</p></div>';
    }
    bootbox.alert({
        buttons: {
            ok: {
                label: '知道了',
                className: 'btn-success'
            }
        },
        className: 'alert-size',
        message: message,
        callback: function () {
            // alert('关闭了alert');
        },
        title: "提示信息"
    })

}

function cancelAlert(msg){
	var flag=true;
    bootbox.confirm({
        title: '提示信息',
        message: msg,
        className: 'alert-size',
        button: {
            confirm: {
                label: '确定',
                className: 'btn-success',
                callback: function () {
                	flag=true;
                }
            },
            cancel: {
                label: '取消',
                className: 'btn-danger',
                callback: function () {
                	flag=false;
                }
            }
        },
        callback: function(){
        }
    });
    
    return flag;
}

/**
 * 加载json的数据到页面的表单中 只支持type=text
 */
function loadJsonDataToForm(jsonStr){
    try{
        var obj = jsonStr;
        var key,value;
        for(x in obj){
            key = x;
            value = obj[x];
            var thisobj=$("#"+key);
            if (thisobj.attr("type") == "text"||thisobj.attr("type") == "date") {
                thisobj.val(value);
            }
        }
    }catch(e){
    	bootboxAlert("加载表单："+e.message+",数据内容"+JSON.stringify(jsonStr),false);
    }
}

/**
 * 格式化时间
 * @param timestamp 时间
 * @param timetype 格式 默认YYYY-DD-MM hh:mm:ss1=YYYY-MM-DD HH:MM,2=YYYY-DD-MM,3=hh:mm:ss,4=YYYY-DD
 * @returns
 */
function timestampToTime(timestamp,timetype) {
    if (timestamp == null || timestamp == '') {
        return "";
    }
    var date = new Date(timestamp*1);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) ;
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) ;
    var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) ;
    var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    var returndate = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    switch (timetype) {
        case 1:
            returndate = Y + "-" + M + "-" + D + " " + h + ":" + m;
            break;
        case 2:
            returndate = Y + "-" + M + "-" + D;
            break;
        case 3:
            returndate = h + ":" + m + ":" +  s;
            break;
        case 4:
            returndate = Y + ":" +  M
            break;
        case 5:
            returndate = Y + "年" + M + "月" + D + "日"+'  ' +h + ":" + m + ":" +  s;    
            break;
    }

    return returndate.trim();
}


//加载聊天记录
function loadchatmessage(doctorid,patientid,orderid)
{
    console.log('dfdfd')
//	doctorid="11a2a0de572d4624ae01188a413130a2";
//	patientid="330b68c42fc14f55bb72cd9226a9cd71";
	var rownum=10;
    var index = 0;
    var newMsg = [];
    var msgdate = function(){
        ajax({
            "type" : 'get',
            "url" : '/api/im/getMessagesTwoWayPc/'+orderid+'/'+doctorid+'/'+patientid+'/'+index+'/'+rownum,
            "dataType" : "json",
            "success" : function(data) {
                newMsg = [];
                index++
                var content=data.content;
                for(var j=0;j<content.length;j++){
                    newMsg.push(content[j]);
                }
                if(newMsg==null){return false;}
                var message= $("#message").html();
                   for(var i=0;i<newMsg.length;i++)
                {
                    var obj = newMsg[i].message;
                    var messagetype="";
                    var position="";
                    if(obj==null){return false;}
                    
                    if(obj.type=='text')
                    {
                        messagetype=obj.body.replace('\\n','<br>');
                    }
                    else if(obj.type=='picture')
                    {
                        messagetype='<img width="100px" height="100px" src="'+filefdfspath+obj.body+'" />';
                    }
                    else if(obj.type=='voice')
                    {
                        var voicetype="";
                        if(obj.body.indexOf(".mp3"))
                        {
                            voicetype="audio/mpeg";
                        }
                        else if(obj.body.indexOf(".wav"))
                        {
                            voicetype="audio/wav";
                        }
                        messagetype='<audio controls style="width:200px"><source src="'+filefdfspath+obj.body+'" type="'+voicetype+'"></audio><a href="'+filefdfspath+obj.body+'" target="_blank">下载</a>';
                    }
                    
                    if(newMsg[i].senderId==doctorid)
                    {
                        position="fl";
                    }
                    else
                    {
                        position="fr";
                    }
                    
                    message+='<li class="clearfix"><img class="'+position+'" src="/static/image/img1.png" width="40px" height="40px" /><div class="c-rotate '+position+'"></div><div class="c-text '+position+'">'+messagetype+'</div></li>';
                }
                $("#message").html(message);
                if(index<=data.totalPages){
                    msgdate();
                }
            }
        });
    }
    msgdate();
   
}

//验证手机号
function isPhoneNo(phone) {
    var pattern = /^1[34578]\d{9}$/;
    return pattern.test(phone);
}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return decodeURIComponent(r[2]); return null;
}
//检查是否数字，min 最小值 max最大值
function checkNum(ob,min,max) {
	if(ob.value.length==1){ob.value=ob.value.replace(/[^1-9]/g,'')}else{ob.value=ob.value.replace(/\D/g,'')};
	if(ob.value<min||ob.value>max){ob.value='';}
}

function numberFormat(number, decimals, dec_point, thousands_sep) {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.ceil(n * k) / k;
        };
 
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }
 
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function clearNoNum(obj,min,max) {
	obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
    obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字而不是
    obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
    obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
    if(obj.value*1<min){obj.value=min;}
    if(obj.value*1>max){obj.value=max;}
}

function common(){
    var result = '';
    ajax({
        url: '/api/Configuration/getConfiguration',
        type: 'get',
        dataType: "json",
        async:false,
        success: function(res){
            result = res
        }
    });
    return result;
}


var filelocalpath="/api/StaticFile/fastdfsLocalURL/";
var filefdfspath="https://service.51bjhzy.com/";
var weiXinQr="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";