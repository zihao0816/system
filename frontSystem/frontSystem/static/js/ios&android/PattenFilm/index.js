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
      isAccordingexchanges: 1,
    }),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
    success: function (val) {
      console.log(1);
      console.log(val)
      for (var i = 0; i < val.accordingTtongue.length; i++) {
        $('#tonguecontent').append('<img class="smallimg" src="' + filefdfspath + val.accordingTtongue[i] + '">')
      }
      for (var j = 0; j < val.surfaceAccording.length; j++) {
        $('#facecontent').append('<img  class="smallimg" src="' + filefdfspath + val.surfaceAccording[j] + '">')
      }
      for (var z = 0; z < val.otherdetails.length; z++) {
        $('#others').append('<img class="smallimg" src="' + filefdfspath + val.otherdetails[z] + '">')
      }
      var obj = new zoom('mask', 'bigimg', 'smallimg', 'page');
      obj.init();
    }
  }, sessionID);
}else{
  $('.dasheds').css('border-top','none')
}
}