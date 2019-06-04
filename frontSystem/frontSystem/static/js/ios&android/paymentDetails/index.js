// 收支详情
function query() {
  var sessionId = GetQueryString('sessionId');
  var id = GetQueryString('id');
  var type = GetQueryString('type');
  var serviceTel = common().serviceTel;
  ajax({
    url: '/api/PlacingOrder/NoticeSelect/' + type + '/' + id,
    type: 'get',
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      console.log(data)
      switch (type) {
        // 问诊订单
        case '12':
          // 收支
            var totalprice = data.doctorprice.toFixed(2);
          $('#totalPrice').html('+' + totalprice);
          // 订单号
          $('#ordercode').html(data.ordercode);
          // 处理时间
          $('#payTime').html(timestampToTime(data.paytime));
          // 收支类型
          switch (data.serviceid) {
            case 1:
              $('#serviceId').html('图文复诊');
              break;
            case 2:
              $('#serviceId').html('在线复诊');
              break;
            case 3:
              $('#serviceId').html('图文咨询');
              break;
            case 4:
              $('#serviceId').html('电话咨询');
              break;
          }
          break;
        case '4':
          // 收支
          var doctorprice = data.doctorprice.toFixed(2);
          $('#totalPrice').html('+'+ doctorprice);
          // 订单号
          $('#ordercode').html(data.orderid);
          // 收支类型
          $('#serviceId').html('药方订单');
          // 处理时间
          $('#payTime').html(timestampToTime(data.paytime));
          break;
        case '1':
          // 收支
          var money = data.money.toFixed(2);
          $('#totalPrice').html('-'+ money);
          // 收支类型
          $('#serviceId').html('提现');
          // 订单号
          $('#ordercode').html(data.withdrawcode);
          // 处理时间
          $('#payTime').html(timestampToTime(data.updatetime));
          break;
      }
    },
    error: function (e) {
      console.log(e);
    }
  }, sessionId);
  // 客服电话
  // 从浏览器拿url
  // let url = window.location.search
  // let serverTel = url.substring(url.length - 10,url.length)
  $('#serverTels').html(serviceTel);
  $('#serverTel').attr('href', 'tel:' + serviceTel);
}
