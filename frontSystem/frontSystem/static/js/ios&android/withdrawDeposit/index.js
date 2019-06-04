// 提现详情
function query() {
  var sessionId = GetQueryString('sessionId');
  var id = GetQueryString('id');
  var serviceTel = common().serviceTel;
  var type = GetQueryString('type');
  ajax({
    url: '/api/PlacingOrder/NoticeSelect/' + type + '/' + id ,
    type: 'get',
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      // 提现金额
      var money = data.money.toFixed(2);
      $('#money').html('-'+money);
      // 申请时间
      $('#startName').html('发起提现申请');
      $('#startTime').html(timestampToTime(data.createtime));
      // 等待处理时间
      $('#awaitName').html('等待处理');
      $('#awaitTime').html(timestampToTime(data.updatetime));
      // 提现状态
      switch (data.state){
        case 1:
        $('#endStatus').css('color','#C1C1C1')
                       .html('提现成功');
        break;
        case 2:
        $('#endStatus').html('提现成功');
        $('#statusImg').attr('src','/static/image/txcg@2x.png');
        break;
        case 3:
        $('#endStatus').html('提现失败');
        $('#statusImg').attr('src','/static/image/txcg@3x.png');
      }
      // 完成时间
      $('#endTime').html(timestampToTime(data.updatetime));
    },
    error: function (e) {
      console.log(e);
    }
  }, sessionId);
  // 客服电话
  // 从浏览器拿url
  // let url = window.location.search
  // let serverTel = url.substring(url.length - 10,url.length)
  $('#serverTel').html(serviceTel);
  $('#serverTel').attr('href', 'tel:' + serviceTel);
}
query();
