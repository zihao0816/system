;var ObjLoginIndex = function(
){ 			//定义对象

	var obj = new Object();
  obj.ID = '';


  obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
    obj.ID = id;//记录ID编号
  };
  
  $(".userpwd").bind("input propertychange change",function(event){
	  var usercode=$("#usercode").val();
	  var password=$("#password").val();
	  if(usercode!=''&&password!='')
	  {
		  $("#loginBtn").attr("disabled",false);
	  }
	  else
	  {
		  $("#loginBtn").attr("disabled",true); 
	  }
  });
    // $('#aaaaa').click(function () {
    //     ajax({
    //         "type" : 'post',
    //         "contentType": "application/json",
    //         "dataType" : "json",
    //         "url" : '/api/weixinpay/test',
    //         "success" : function(resp) {
    //             WeixinJSBridge.invoke(
    //                 'getBrandWCPayRequest', resp.weiAppLetEntity,
    //                 function(res){
    //                     if(res.errMsg=='get_brand_wcpay_request:ok'){
    //                         bootbox.alert('支付成功');
    //                     }else{
    //                         bootbox.alert(res.errMsg);
    //                     }
    //                 });
    //         },
    //         "error" : function(resp) {
    //
    //         }
    //     });
    // })

$('#loginBtn').click(function(){
	  var conditon={};
	  var usercode=$("#usercode").val();
	  var password=$("#password").val();
	  if(usercode==null||$.trim(usercode)=='')
      {
		  $("#showmsg").text("请输入用户名");
		  return false;
      }
	  
	  if(password==null||$.trim(password)=='')
      {
		  $("#showmsg").text("请输入密码");
		  return false;
      }
      conditon.usercode=usercode;
      conditon.password=$.md5(password);
      $(this).attr("disabled", true);
	  ajax({
          "type" : 'post',
          "url" : '/api/sysuserinfo/login',
          "contentType": "application/json",
          "dataType" : "json",
          "data" : JSON.stringify(conditon),
          "success" : function(resp) {
        	  if(resp==null||resp.result*1<0)
        	  {
        		  $("#showmsg").text(resp.message);
        		  $("#password").val("");
        	  }
        	  else
        	  {
        		  $.cookie('pcsessionid', resp.sessionId);
                  window.location.href = '/index';
        	  }
        	  $(this).attr("disabled", false);
          },
	  	  "error" : function(resp) {
	  		$("#div-info").show();
	  		$("#showmsg").text(resp.message);
	  		$(this).attr("disabled", false);
          }
      });
  	
  });
	return obj;
}();
