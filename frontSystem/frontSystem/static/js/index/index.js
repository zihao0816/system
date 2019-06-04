;var ObjIndex = function() { 			//定义对象
	var obj = new Object();
    obj.ID = '';

    obj.init= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        //查询当前登录用户

    };

    ajax({
        "type" : 'get',
        "url" : '/api/sysuserinfo/getUserInfo',
        "dataType" : "json",
        "data" : {"sessionId":getCookie('pcsessionid')},
        "success" : function(resp) {
            if(resp.result>=0)
            {
                $("#username").text("管理员—"+resp.message);
            }
        },
        "error" : function(resp) {
            console.log(resp);
        }
    });
    return obj;
}();
