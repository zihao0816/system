function created() {

  var orderID = GetQueryString("orderID");
  var sessionID = GetQueryString("sessionID");
  var isDoctor = GetQueryString("isDoctor");//1代表是医生进入此页面2代表其他用户进入此页面
  var isFinish = GetQueryString("isFinish");
  console.log(orderID)
  if (sisnull(orderID) || sisnull(sessionID) || sisnull(isDoctor)) {
    return;
  }
if(isFinish == 1){
  ajax({
    type: "post",
    url: "/api/Inquiry/orderDetails",
    contentType: "application/json", //必须有
    dataType: "json", //表示返回值类型，不必须
    data: JSON.stringify({ 
      orderID: orderID,
      isInterrogationsingle: 1,
    }),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
    success: function (val) {
      console.log(val)
      var html1 = template('template', { list: val.reorderinquiryquestion });
      $('#content').html(html1)
    }
  }, sessionID);
}else if(isFinish == 2){
  ajax({
    type: "post",
    url: "/api/Inquiry/getConsultationForm",
    contentType: "application/json", //必须有
    dataType: "json", //表示返回值类型，不必须
    success: function (val) {
      console.log(val)
      var html2 = template('Dtemplate', { list: val.parameters });
      $('#content').html(html2)
    }
  }, sessionID);
}
  
}