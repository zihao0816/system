//var ObjConstIndex = function() { 			//定义对象
//	var obj = new Object();


var CookieUserSID = 'UserSID';

var UserCenterURL = 'http://www.usercenter.com:8088';//用户中心

var checkTicketURL = 'http://127.0.0.1:8088';

/*
    API URL 配置信息
*/


var API_UserVerify = '/api/sso/getUser?ticket=';//API Service  获取用户信息
var API_UserLogout = '/api/sso/logOut/';//API Service 用户注销
var API_CheckTicket = '/api/sso/checkTicket?ticket=';//API Service 用户校验
//	var API_GetResourceMenu='/api/menu/querymenu?useid='//获取用户资源菜单
//	var API_GetResourceButton='/api/menu/querymenu?useid='//获取用户资源菜单
var API_GetMenu = '/api/menu/queryResourceButtonByUid?ticket=';//	//API Service获取用户资源菜单
var API_GetResourceByMenu = '/api/menu/queryRoleUrl';//API Service 获取URL用户所在的权限资源


/*
    项目信息
*/

var Author = 'aiz.cn';
var Website = 'suibian.com';//网站
var WebsiteName = '北京好中医后台管理系统';
var WebsiteEmail = '';
var WebsiteUrl = '';
var CompanyName = '';
var WebsitePhone = '';
var CompanyAddress = '';
var CompanyBeian = '';
var CompanyInfo = '';
var timeOut = 1000;

$("#logout").click(function(){
	ajax({
        "type" : 'get',
        "url" : '/api/sysuserinfo/logout',
        "dataType" : "json",
        "data" : {"sessionId":getCookie('pcsessionid')},
        "success" : function(resp) {
             window.location.href = '/';
        },
	  	  "error" : function(resp) {
	  		console.log(resp);
        }
    });
});



//  return obj;
//}();