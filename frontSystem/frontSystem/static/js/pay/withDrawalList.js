/**
 * Created by Girl on 2018/7/20.
 */
; var ObjWithDrawalListIndex = function (
) { 			//定义对象
    var obj = new Object();
    obj.ID = '';

    obj.html_dialog_updatePay = '';
    obj.html_dialog_updatePay = $('#updatePay .container').html();
    $('#updatePay .container').remove();
    obj.init = function (id) {		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        var tbWithDrawalList = $('#tbWithDrawalList').DataTable({
            "bServerSide": true,
            'bAutoWidth': false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource": '/api/doctorwithdrawcash/queryWithdrawcashList',
            "fnServerData": function (sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function (condition, param) {
                    this.condition = condition;
                    this.param = param;
                };
                //查询实体
                var UserInfo = function () {
                    this.withdrawcode = $("#withdrawcode").val();
                    var createtime = $("#createtime").val();
                    if (createtime != null && createtime != '') {
                        this.starttime = createtime + " 00:00:00";
                        this.endtime = createtime + " 59:59:59";
                    }
                    this.state = $("#state").val();
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
                { "data": "withdrawcode", "defaultContent": "" },
                { "data": "telephone", "defaultContent": "" },
                { "data": "doctorname", "defaultContent": "" },
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        return timestampToTime(row.createtime);
                    }
                },
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        return numberFormat(row.sourcemoney, 2);
                    }
                },
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        return numberFormat(row.thismoney, 2);
                    }
                },
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        return numberFormat(row.aftermoney, 2);
                    }
                },
                //{"data" : "account", "defaultContent": ""},
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        if (row.state == "1") {
                            return "申请";
                        }
                        else if (row.state == "2") {
                            return "同意";
                        }
                        else if (row.state == "3") {
                            return "不同意";
                        }

                    }
                },
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        if (row.state != "1") {
                            return row.username
                        }
                    }
                },
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        if (row.state != "1") {
                            return timestampToTime(row.updatetime);
                        }
                    }
                },
                {
                    "data": "", "defaultContent": "",
                    "render": function (data, type, row) {
                        var html = '';
                        html += '<span  id=\"agree\" class="s-btn agree">同意</span>&emsp;';
                        html += "<span  id=\"disagree\" class='s-btn disagree'>不同意</span>&emsp;";
                        if (row.state == "1") {
                            return html;
                        }
                    }
                }
            ]
        });

        //同意
        $('#tbWithDrawalList tbody').on('click', 'span#agree', function () {
            var datatime = $('#tbWithDrawalList').DataTable().row($(this).parents('tr')).data();
            if (datatime.aftermoney * 1 < 0) {
                bootboxAlert("提现金额不能大于账户金额", false);
                stops;
            }
            ajax({
                "type": 'post',
                "url": '/api/doctorwithdrawcash/complete',
                "dataType": "json",
                "data": {
                    wcashId: datatime.id,
                },
                "success": function (resp) {
                    bootboxAlert(resp.message, resp.result < 0 ? false : true);
                    $("#tbWithDrawalList").DataTable().ajax.reload();
                }
            });
        });

        //不同意
        $('#tbWithDrawalList tbody').on('click', 'span#disagree', function () {
            var datatime = $('#tbWithDrawalList').DataTable().row($(this).parents('tr')).data();
            ajax({
                "type": 'post',
                "url": '/api/doctorwithdrawcash/cancel',
                "dataType": "json",
                "data": {
                    wcashId: datatime.id,
                },
                "success": function (resp) {
                    bootboxAlert(resp.message, resp.result < 0 ? false : true);
                    $("#tbWithDrawalList").DataTable().ajax.reload();
                }
            });
        })
    };

    $("#searchBtn").click(function () {
        $("#tbWithDrawalList").DataTable().ajax.reload();
    });
    return obj;
}();