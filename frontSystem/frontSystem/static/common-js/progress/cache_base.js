
/**
 * 定义上传信息显示div的id
 */
var cacheBase = "cacheBase_";
var $cacheBase = "#cacheBase_";

var cacheBase_progress = "cacheBase_progress_";
var $cacheBase_progress = "#cacheBase_progress_";

/**
 * 上传处理,title--显示的title信息,redisKey--redis保存的key值，functionName--上传执行完成后，执行的函数名称
 */
var getCacheManage = function(title,redisKey,functionName){

    showCacheBootbox(title);

    checkCacheStatus(redisKey,functionName);

};

var showCacheBootbox = function(title){
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
        url : "/api/common/getCacheBase?redisKey="+tid,
        dataType : "json",
        success :	function(data) {
            if(data.result == null) {
                var base = data;
                if(base.status == 1) {
                    update_progress_cache(base.message + " . . .  " + base.progress,base.progress);

                    //执行函数（查询或其他）
                    executeCacheFunction(functionName);
                    //关闭所有
                    bootbox.hideAll();
                }else if(base.status == 0){

                    update_progress_cache(base.message + " . . .  " + base.progress,base.progress);
                    setTimeout(function(){checkCacheStatus(tid,functionName);},3000);
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