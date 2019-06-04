
/**
 * 定义上传信息显示div的id
 */
var cacheBase = "cacheBase_";
var $cacheBase = "#cacheBase_";

var cacheBase_progress = "cacheBase_progress_";
var $cacheBase_progress = "#cacheBase_progress_";

var cache_message_ = "cache_message_";
var $cache_message_ = "#cache_message_";

var cache_message_but_ = "cache_message_but_";
var $cache_message_but_ = "#cache_message_but_";

/**
 * 上传处理,title--显示的title信息,redisKey--redis保存的key值，functionName--上传执行完成后，执行的函数名称
 */
var getCacheManage = function(title,redisKey,functionName){
	//显示进度信息
    showCacheBootbox(title);
    //更新进度信息
    checkCacheStatus(redisKey,functionName);
};

var showCacheBootbox = function(title){
	//关闭所有
    bootbox.hideAll();
    var message = "<div class='modal-body' id='cache_'>" +
        "<div class='row'>" +
        "<div class='progress progress-striped active'>" +
        "<div id='"+cacheBase_progress+"' class='progress-bar progress-bar-primary' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%'>" +
        "</div>" +
        "</div>"+
        "</div>"+
        "<div class='row'>" +
        "<div id='"+cacheBase+"' class='col-md-12'></div>"+
        "</div>"+
        "<div class='row'>" +
        "<div id='"+cache_message_+"' class='col-md-12'></div>"+
        "</div>"+
        "<div class='row'>" +
        "<div id='"+cache_message_but_+"' class='col-md-12'></div>"+
        "</div>"+
        "</div>";
    var title = "<label style='color:#46B8DA'>"+title+"</label>&nbsp;&nbsp;";
    var obj = new Object();
    obj.$currentDlg = bootbox.dialog({
        title: title,
        message: message
    });
    
};

/**
 * 获取进度信息
 */
var checkCacheStatus = function(tid , functionName) {
    $.ajax({
        url : "/api/common/getProgressInfo?redisKey="+tid,
        dataType : "json",
        success :	function(data) {
            if(data.result == null) {
                var base = data;
                if(base.progressStatus == 0) {
                	update_progress_cache(base.progressMessage + " . . .  " + base.progress,base.progress);
                    var tdata = base.data;
                    var cacheKey = tdata.cacheKey;
					
					var str = "<br /><label style='color:";
					if(cacheKey != null && cacheKey == ""){
						str += "#00FF00'>";
					}else{
						str += "red'>";
					}
					str += tdata.message+"</label>";
					
					$($cache_message_).html(str);
					
					if(cacheKey != null && cacheKey != ""){
						showBut(cacheKey);
						
						//更新失效时间
						updateInvalidTime();
					}
                    //执行函数（查询或其他）
                    executeCacheFunction(functionName);
                    
                }else if(base.progressStatus == -1){
                    update_progress_cache(base.progressMessage + " . . .  " + base.progress,base.progress);
                    setTimeout(function(){checkCacheStatus(tid,functionName);},5000);
                }else{
                    // bootbox.hideAll();
                    $("#cache_").html(base.message);
                }
            }else if(data.result == -1){
               // bootbox.hideAll();
                $("#cache_").html(data.message);
            }else if(data.result == 0){
                // bootbox.hideAll();
                $("#cache_").html(data.message.message);
            }
        }
    });
};

//更新进度信息
var update_progress_cache = function(message,progress){
    $($cacheBase).html(message);
    //设置进度
    $($cacheBase_progress).width(progress);
};


/**
 * 执行函数
 */
var executeCacheFunction = function(functionName){
    if(functionName != null && functionName != ""){
        if(typeof functionName == "function"){
            functionName();
        } else {
            bootbox.alert(functionName);
        }
    }
};



/**
 * 更新失效时间
 */
var updateInvalidTime = function (){
	var invalid_time = $("#invalid_time").html();
	if(invalid_time > 1 ){
		$("#invalid_time").html(invalid_time - 1);
		setTimeout(function(){updateInvalidTime();},1000);
	}else{
		$("#invalid_time_info").html("信息已失效，无法再次获取");
	}
};



//打开错误提示表单或下载错误数据div
var showBut = function(redisKey){
		var vbut = "<button onclick='getUploadErrorBase(\""+redisKey+"\")' class='btn btn-outline btn-primary' type='button'>表格打开</button>&nbsp;&nbsp;&nbsp;&nbsp;";
		vbut += "<button onclick='downloadErrorMessage()' class='btn btn-outline btn-primary' type='button'>下载Excel</button>";
		vbut += "(<label id = 'invalid_time_info'>该信息<label id = 'invalid_time'>30</label>分钟后失效</label>)" +
				"<form id='download_error_message_' style='display: none;'><input id='redisKey_' name='redisKey' value='"+redisKey+"'></form>";
		vbut += "<div class='row'><div id= 'upload_error_message' class='col-md-12'>" +
				"</div></div>";
	$($cache_message_but_).html(vbut);
};

/**
 * 下载
 */
var downloadErrorMessage = function (){
	var redisKey = $("#redisKey_").val();
	 $("#download_error_message_").attr({action:"/api/common/downloadCacheListBase?redisKey=" + redisKey});
	 $("#download_error_message_").submit();
};

/**
 * 获取上传错误信息到表格
 */
//获取上传的结果
var getUploadErrorBase = function(redisKey){
	$.ajax({
		url : "/api/common/getCacheListBase?redisKey=" + redisKey,
		dataType : "json",
		data:{t:new Date().getTime()},
		success :	function(data) {
			var status =data.result;
			if(status == "-1") {
				bootbox.alert(data.message);
			} else {
				openUploadError(data);
			}
		}
	});
};


var openUploadError = function(data){
	var vbut = "<div class='row'><div class='col-md-12' style='height:10px;'></div></div>";
		vbut += "<div class='row'><div class='col-md-12' style='max-height:400px; overflow:auto'>";
		vbut += "<table id='table_error_message_' class='table table-bordered table-hover'>";
		vbut += "<thead><tr><th>行</th><th>信息</th></tr></thead>";
		if(data != null && data.length > 0) {
			for(var i = 0;i < data.length;i++){
				var base = data[i];
				if(base != null && base.length == 2){
					vbut += "<tr><td>"+base[0]+"</td><td>"+base[1]+"</td></tr>";
				}
			}
		}else{
			vbut += "<tr><td colspan='2'>找不到错误信息</td></tr>";
		}
		vbut += "</table>";
		vbut += "</div></div>";
	
	$("#upload_error_message").html(vbut);
};

