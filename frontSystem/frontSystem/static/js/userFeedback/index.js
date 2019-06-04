/**
 * Created by Girl on 2018/7/16.
 */
;var ObjUserFeedbackIndex = function(
){ 			//定义对象

    var obj = new Object();
    obj.ID = '';
    obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        var tbBackgroundRole = $('#tbBackgroundRole').DataTable({
            "bServerSide" : true,
            'bAutoWidth':false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource":'/api/feedbackinfo/queryFeedbackList',
            "fnServerData" : function(sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function(condition, param) {
                    this.condition = condition;
                    this.param =  param;
                };
                //查询实体
                var UserInfo = function() {
                	var feedtime=$("#feedtime").val();
                	if(feedtime!=null&&feedtime!='')
                	{
                		this.starttime=feedtime+" 00:00:00";
                    	this.endtime=feedtime+" 59:59:59";
                	}
                	this.telephone=$("#telephone").val();
                };
                var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));

                ajax({
                    "type" : 'post',
                    "url" : sSource,
                    "dataType" : "json",
                    "data" : {
                        aoData : JSON.stringify(temp)
                    },
                    "success" : function(resp) {
                        fnCallback(resp);
                    }
                });
            },
            "bSort":false,
            filter:false,
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
            "fnRowCallback" : function(nRow, data, iDisplayIndex) {

            },

            "aLengthMenu":[10, 25, 50, 100],
            "aoColumns" : [
                {"data" : "telephone", "defaultContent": ""},
                {"data" : "person", "defaultContent": ""},
                {"data" : "content", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        return timestampToTime(row.time);
                    }
                }
            ]
        });
    };
    $("#searchBtn").click(function(){
    	$("#tbBackgroundRole").DataTable().ajax.reload();
    });
    return obj;
}();
