/**
 * Created by Girl on 2018/7/20.
 */
; var ObjUnauthorizedListIndex = function (
) { 			//定义对象
  var obj = new Object();
  obj.ID = '';

  var zhicheng = "<option value=''>请选择</option>";
  var keshi = "<option value=''>请选择</option>";
  var hospitaname = "<option value=''>请选择</option>";

  obj.html_dialog_addDoctor = '';
  obj.html_dialog_addDoctor = $('#updateDoctorDetails .container').html();
  $('#updateDoctorDetails .container').remove();

  obj.init = function (id) {		//初始化函数,请在页面$(document).ready调用
    obj.ID = id;//记录ID编号
    var tbUnauthorizedList = $('#tbUnauthorizedList').DataTable({
      "bServerSide": true,
      'bAutoWidth': false,//自动宽度
      "dom": 'rt<"bottom"flpi><"clear">',
      "sAjaxSource": '/api/doctorinfo/list',
      "fnServerData": function (sSource, aoData, fnCallback) {
        //表格参数
        var dataTablesParam = function (condition, param) {
          this.condition = condition;
          this.param = param;
        };
        //查询实体
        var UserInfo = function () {
          this.confirmstate = "3";
          this.ordercode=$("#ordercode").val();
          this.doctorname=$("#doctorname").val();
          this.patientname=$("#patientname").val();
          this.serviceid=$("#serviceid").val();
          this.paystate=$("#paystate").val();
          this.sex=$('#sex').val();
        };
        var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));

        ajax({
          "type": 'post',
          "url": sSource,
          "dataType": "json",
          "data": {
            aoData: JSON.stringify(temp)
          },
          "success": function (resp) {
            fnCallback(resp);
          }
        });
      },
      "bSort": false,
      filter: false,
      "oLanguage": {
        "sLengthMenu": "每页显示 _MENU_条",
        "sZeroRecords": "没有找到符合条件的数据",
        "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
        "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
        "sInfoEmpty": "没有记录",
        "sInfoFiltered": "(从 _MAX_ 页记录中过滤)",
        "sSearch": "搜索：",
        "oPaginate": {
          "sFirst": "首页",
          "sPrevious": "前一页",
          "sNext": "后一页",
          "sLast": "尾页"
        }
      },
      "fnRowCallback": function (nRow, data, iDisplayIndex) {

      },

      "aLengthMenu": [10, 25, 50, 100],
      "aoColumns": [
        { "data": "telephone", "defaultContent": "" },
        { "data": "doctorname", "defaultContent": "" },
        {
          "data": "", "defaultContent": "",
          "render": function (data, type, row) {
            return row.sex == '1' ? "男" : "女";
          }
        },
        {"data" : "dutiesname", "defaultContent": ""},
        {"data" : "hospitaname", "defaultContent": ""},
        {
          "data": "", "defaultContent": "",
          "render": function (data, type, row) {
            return timestampToTime(row.starttime);
          }
        },
        {
          "data": "", "defaultContent": "",
          "render": function (data, type, row) {
            return row.confirmstate == '1' ? "已认证" : "待认证";
          }
        },
        { "data": "remark", "defaultContent": "" },
        {
          "data": "dutiesname", "defaultContent": "",
          "render": function (data, type, row) {
            
            var html = '';
            html += "<span  id=\"edit\" class='s-btn' >备注</span>";
            return html;
          }
        }
      ]
    });
    //点击备注
    $('#tbUnauthorizedList tbody').on('click','span#edit',function(){
      var datatime = $('#tbUnauthorizedList').DataTable().row($(this).parents('tr')).data();
      obj.$currentDlg = bootbox.dialog({
        title: "备注",
        size: 'large',
        message: '<div><textarea class="form-control" rows="6" placeholder="输入内容"  autocomplete="off" style="resize: none" id="intros"></textarea></div>',
        className: 'select-size',
        buttons:{
            success: {
                label: "确定",
                className: "btn-success btn-import{0} savebtn".format(obj.ID),
                callback: function () {
                    console.log($('#intros').val())
                    doAjax("/api/doctorinfo/updateByPrimaryKeySelective",'post',{
                      id:datatime.id,
                      remark:$('#intros').val()
                    }, ['#tbUnauthorizedList'], null, null, false);
                }
            },
            caner: {
                label: "取消",
                className: "btn-default",
                callback: function () {
                }
            }
        }
    });
    })
    //筛选
    $("#searchbtn").click(function(){
      $("#tbUnauthorizedList").DataTable().ajax.reload();
    });
    //加载职称、科室
    ajax({
      "type": 'post',
      "url": '/api/datadictionarydetail/selectBySortcodes',
      "dataType": "json",
      "data": {
        sortcodes: "zhicheng,keshi",
      },
      "success": function (resp) {

        for (x in resp) {
          var obj = resp[x];
          if (obj.sortcode == 'zhicheng') {
            zhicheng += "<option value='" + obj.itemcode + "'>" + obj.itemname + "</option>";
          }
          else if (obj.sortcode == 'keshi') {
            keshi += "<option value='" + obj.itemcode + "'>" + obj.itemname + "</option>";
          }
        }
      }
    });

    //加载医院信息
    var hospitaCon = { "hospitastate": "1" };
    ajax({
      "type": 'post',
      "url": '/api/hospitainfo/getListByKey',
      "dataType": "json",
      "contentType": "application/json",
      "data": JSON.stringify(hospitaCon),
      "success": function (resp) {
        for (var i = 0; i < resp.length; i++) {
          var obj = resp[i];
          hospitaname += "<option value='" + obj.id + "'>" + obj.hospitaname + "</option>";
        }
      }
    });
   
  };
  return obj;
}();