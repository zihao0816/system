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
      getPatient:1,
      isaction: 1,
    }),  //相当于 //data: "{'str1':'foovalue', 'str2':'barvalue'}",
    success: function (val) {
      console.log(val)
      // 头像
      if(val.portrait == null || val.portrait == ''){
        $('#headphoto').attr("src",val.patient.headphoto);
      }else{
        $('#headphoto').attr("src",val.patient.portrait);
      }
      // 名称
      $('#patientname').html(val.patient.patientname);
      // 关系
      $('#relationship').html(val.patient.relationship);
      // 性别
      if(val.patient.sex == 1){
        $('#patientsex').html('男')
      }
      if(val.patient.sex == 2){
        $('#patientsex').html('女')
      }
      // 年龄
      $('#patientage').html(val.patient.age)
      // 病症自述
      $('#diseases').html(val.ordermaintellinfo.symptom)
      // 过敏史
      $('#pastcase').html(val.ordermaintellinfo.pastcase)
      // 既往病史
      $('#history').html(val.ordermaintellinfo.allergichistory)
    }
  }, sessionID);
}else if(isFinish == 2){
  $('.details').css('background-color','#F1F0F5')
  $('.add').css('display','block');
  $('.information').css('display','none');
}
}