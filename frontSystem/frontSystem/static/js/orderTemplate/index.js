var messagetext = "提现成功"
var messagetype = 1
var content
var tips
var id
function query() {
  // 初始数据
  ajax({
    type: 'post',
    url: '/api/messagetemplate/getListByKey',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify({ messagetype: messagetype }),
    success: function (data) {
      $('#onecontent').text(data[0].title)
      $('#onedetails').val(data[0].content)
      $('#onetips').val(data[0].tips)
      $('#oneid').text(data[0].id)
      id = $('#oneid').text()
      content = $('#onedetails').val()
      tips = $('#onetips').val()
      console.log($('#onedetails').val())
    }

  })
  // tab 切换 显示内容
  $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
    // 点击获取当前li的html内容
    messagetext = $(this).text();
    switch (messagetext) {
      case "提现成功":
        messagetype = 1
        break;
      case "提现失败":
        messagetype = 2
        break;
      case "药方下单成功":
        messagetype = 3
        break;
      case "药方购买成功":
        messagetype = 4
        break;
    }
    ajax({
      type: 'post',
      url: '/api/messagetemplate/getListByKey',
      contentType: "application/json",
      dataType: 'json',
      data: JSON.stringify({ messagetype: messagetype }),
      success: function (data) {
        // console.log(data)
        // 标题
        $('#onecontent').text(data[0].title)
        $('#towcontent').text(data[0].title)
        $('#threecontent').text(data[0].title)
        $('#fourcontent').text(data[0].title)
        // 内容
        $('#onedetails').val(data[0].content)
        $('#towdetails').val(data[0].content)
        $('#threedetails').val(data[0].content)
        $('#fourdetails').val(data[0].content)
        // 提示
        $('#onetips').val(data[0].tips)
        $('#towtips').val(data[0].tips)
        $('#threetips').val(data[0].tips)
        $('#fourtips').val(data[0].tips)
        //id 
        $('#oneid').text(data[0].id)
        $('#towid').text(data[0].id)
        $('#threeid').text(data[0].id)
        $('#fourid').text(data[0].id)
        switch (messagetext) {
          case "提现成功":
            messagetype = 1
            id = $('#oneid').text()
            content = $('#onedetails').val()
            tips = $('#onetips').val()
            break;
          case "提现失败":
            messagetype = 2
            id = $('#towid').text()
            content = $('#towdetails').val()
            tips = $('#towtips').val()
            break;
          case "药方下单成功":
            messagetype = 3
            id = $('#threeid').text()
            content = $('#threedetails').val()
            tips = $('#threetips').val()
            break;
          case "药方购买成功":
            messagetype = 4
            id = $('#fourid').text()
            content = $('#fourdetails').val()
            tips = $('#fourtips').val()
            break;
        }
      }
    })
  })
}
query();
// one保存
$('#onepreserve').click(function () {
  content = $('#onedetails').val()
  tips = $('#onetips').val()
  ajax({
    type: 'post',
    url: '/api/messagetemplate/updateByPrimaryKeySelective',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify({
      id: id,
      content: content,
      tips: tips
    }),
    success: function (data) {
      // console.log(dat)
      query();
      bootboxAlert("保存成功",true);
    },
    error: function (e) {
      console.log(e)
    }
  })
})
// tow保存
$('#towpreserve').click(function () {
  content = $('#towdetails').val()
  tips = $('#towtips').val()
  ajax({
    type: 'post',
    url: '/api/messagetemplate/updateByPrimaryKeySelective',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify({
      id: id,
      content: content,
      tips: tips
    }),
    success: function (data) {
      // console.log(data)
      query();
      bootboxAlert("保存成功",true);
    },
    error: function (e) {
      console.log(e)
    }
  })
})
// three保存
$('#threepreserve').click(function () {
  content = $('#threedetails').val()
  tips = $('#threetips').val()
  ajax({
    type: 'post',
    url: '/api/messagetemplate/updateByPrimaryKeySelective',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify({
      id: id,
      content: content,
      tips: tips
    }),
    success: function (data) {
      // console.log(data)
      query();
      bootboxAlert("保存成功",true);
    },
    error: function (e) {
      console.log(e)
    }
  })
})
// four保存
$('#fourpreserve').click(function () {
  content = $('#fourdetails').val()
  tips = $('#fourtips').val()
  ajax({
    type: 'post',
    url: '/api/messagetemplate/updateByPrimaryKeySelective',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify({
      id: id,
      content: content,
      tips: tips
    }),
    success: function (data) {
      // console.log(data)
      query();
      bootboxAlert("保存成功",true);
    },
    error: function (e) {
      console.log(e)
    }
  })
})