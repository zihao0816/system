/**
 * Created by Girl on 2018/9/14.
 */
;var ObjStandInsideLetterIndex = function(
){
    var obj = new Object();
    obj.ID = '';

    obj.html_dialog_updateStandInsideLetter = '';
    obj.html_dialog_updateStandInsideLetter = $('#updateStandInsideLetter .container').html();
    $('#updateStandInsideLetter .container').remove();
    obj.init= function(id){
        obj.ID = id;//记录ID编号
        var tbStandInsideLetterList = $('#tbStandInsideLetterList').DataTable({
            "bServerSide" : true,
            'bAutoWidth':false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            "sAjaxSource":'/api/mailinfo/list',
            "fnServerData" : function(sSource, aoData, fnCallback) {
                //表格参数
                var dataTablesParam = function(condition, param) {
                    this.condition = condition;
                    this.param =  param;
                };
                //查询实体
                var UserInfo = function() {
                    this.title = $('#title').val();
                    this.createtime = $('#createtime').val();
                    this.pushstate = $('#pushstate').val();
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
                        console.log(resp)
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
                {"data" : "", "defaultContent": "",
                    "render":function(data,type,row){
                        var txt = '<div style="text-overflow: ellipsis;white-space: normal;overflow: hidden;width: 310px;height: 20px;">'+row.title+'</div>';
                        return txt;
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render":function(data,type,row){
                        var txt = '<div style="text-overflow: ellipsis;white-space: normal;overflow: hidden;width: 310px;height: 20px;">'+row.mailabstract+'</div>';
                        return txt;
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render":function(data,type,row){
                        if(row.pushtype == 1){
                            return '立即推送'
                        }else if(row.pushtype == 2){
                            return '定时推送'
                        }
                    }
                },
                {"data" : "createtime", "defaultContent": ""},
                {"data" : "createname", "defaultContent": ""},
                {"data" : "", "defaultContent": "",
                    "render": function(data,type,row){
                        if(row.pushstate == 1){
                            return '未推送'
                        }else if(row.pushstate == 2){
                            return '已推送'
                        }
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        var html='';
                        if(row.pushstate == 1){
                            html+="<span  id=\"editData\" class='s-btn' >编辑</span>&emsp;";
                            html+="<span  id=\"delData\" class='s-btn'>删除</span>&emsp;";
                        }else if(row.pushstate == 2){
                            html+="<span  id=\"seeData\" class='s-btn'>查看</span>";
                        }
                        return html;
                    }
                }
            ]
        });
        $('#tbStandInsideLetterList tbody').on('click','span#delData',function(){
            var datas = $('#tbStandInsideLetterList').DataTable().row($(this).parents('tr')).data();

            if(checkstate(datas.id))
            {
            	bootboxAlert('该消息已经发送，不允许删除',false);
                return false;
            }

            obj.$currentDlg = bootbox.dialog({
                title: "删除站内信息",
                size: 'large',
                className: 'patientsize',
                message: '<div>确定要删除此信息？</div>',
                buttons: {
                    success: {
                        label: "提交",
                        className: "btn-success btn-import{0} savebtn".format(obj.ID),
                        callback: function () {
                            return doAjax('/api/mailinfo/delete','post',[datas.id],function(res){
                                $('#tbStandInsideLetterList').DataTable().ajax.reload();
                            },null, null, false);
                        }
                    },
                    caner: {
                        label: "取消",
                        className: "btn-default savebtn",
                        callback: function () {

                        }
                    }
                },
            });
        });
        $('#tbStandInsideLetterList tbody').on('click','span#seeData',function(){
            var data = $('#tbStandInsideLetterList').DataTable().row($(this).parents('tr')).data();
            console.log(data)
            obj.$currentDlg = bootbox.dialog({
                title: "查看站内信息",
                size: 'large',
                className: 'patientsize',
                message: obj.html_dialog_updateStandInsideLetter,
                onEscape: function() {
                    UE.getEditor('editor').destroy();
                }
            });
            var ue = UE.getEditor('editor');
            $('#prescriptionname').val(data.title);
            $('.medicines').val(data.mailabstract);
            $('#maxlength').text($('.prescriptionname').val().length);
            $('#maxlengths').text($('.medicines').val().length);
            $('.prescriptionname').attr('disabled',true);
            $('.medicines').attr('disabled',true);
            UE.getEditor('editor').ready(function () {
                insertHtml(data.content);
            });
            $('input[name="user"][value="'+data.usertype+'"]').attr('checked',true);
            $('input[name="time"][value="'+data.pushtype+'"]').attr('checked',true);
            $('input[name="user"]').attr('disabled',true);
            $('input[name="time"]').attr('disabled',true);
            if(data.pushtime != null && data.pushtime != ''){
               var pushtime = data.pushtime.split(',');
                $('.addtimes').empty();
               for(var i=0;i<pushtime.length;i++){
                   var a = pushtime[i].split(' ')[0]+'T'+pushtime[i].split(' ')[1];
                   var addtime = '<div class="fl" style="margin: 0 20px 16px 0;position: relative">'+
                       '<input class="form-controls" disabled type="datetime-local" value="'+a+'" />'+
                       '<img src="/static/image/minus-circle.png" style="position: absolute;top: -6px;right: -6px;background: #ffffff;width: 14px;">'+
                       '</div>';
                   $('.addtimes').append(addtime);
               }
                // $('#addtimes').append('<label class="glyphicon glyphicon-plus fl" style="color: #dfdfdf;border: 1px solid #dfdfdf;border-radius: 4px;padding: 9px 26px;cursor: pointer;"></label>')
            }
            if($("input[name='time']:checked").val() == 2){
                $('#displaytime').show()
            }else{
                $('#displaytime').hide()
            }
            $("input[name='time']").click(function(){
                if( $(this).val() == 2){
                    $('#displaytime').show()
                }else{
                    $('#displaytime').hide()
                }
            });
            $('.createby').val(data.createname);
            $('.createtime').val(data.createtime);
            $('.pushstate').val(data.pushstate==1?'未推送':'已推送');
        });
        $('#tbStandInsideLetterList tbody').on('click','span#editData',function(){
            var datatime = $('#tbStandInsideLetterList').DataTable().row($(this).parents('tr')).data();

            if(checkstate(datatime.id))
            {
            	bootboxAlert('该消息已经发送，不允许编辑',false);
                return false;
            }

            obj.$currentDlg = bootbox.dialog({
                title: "编辑站内信息",
                size: 'large',
                className: 'patientsize',
                message: obj.html_dialog_updateStandInsideLetter,
                buttons: {
                    success: {
                        label: "提交",
                        className: "btn-success btn-import{0} savebtn".format(obj.ID),
                        callback: function () {

                        	if(checkstate(datatime.id))
                            {
                            	bootboxAlert('该消息已经发送，不允许提交',false);
                                return false;
                            }

                            if($('#prescriptionname').val() == ''){
                                bootboxAlert('标题不能为空',false);
                                return false;
                            }
                            if($('.medicines').val() == ''){
                                bootboxAlert('简介不能为空',false);
                                return false;
                            }
                            if(getContent() == null || getContent() == ''){
                                bootboxAlert('内容不能为空',false);
                                return false;
                            }
                            if($('input[name="time"]:checked').val() == 2){
                                if($('.time').val() == ''){
                                    bootboxAlert('定时发送时间不能为空',false);
                                    return false;
                                }
                            }
                            var list = [];
                            console.log($('.addtimes').children())
                            if($('.addtimes').children().length>0){
                                for(var i=0;i<$('.addtimes').children().length;i++){
                                    var time = $('.addtimes').children()[i].children[0].value;
                                    list.push(time.replace(/T/,' '))
                                }
                            }
                            var result = doAjax('/api/mailinfo/updateByPrimaryKeySelectives','post',{
                                id: datatime.id,
                                title: $('#prescriptionname').val(),
                                mailabstract: $('.medicines').val(),
                                content: getContent(),
                                usertype: $('input[name="user"]:checked').val(),
                                pushtype: $('input[name="time"]:checked').val(),
                                pushtime: list
                            },function(res){
                                console.log(res)
                                $('#tbStandInsideLetterList').DataTable().ajax.reload();
                                UE.getEditor('editor').destroy();
                            },null, null, false);
                            return result;
                        }
                    },
                    caner: {
                        label: "取消",
                        className: "btn-default savebtn",
                        callback: function () {
                            UE.getEditor('editor').destroy();
                        }
                    }
                },
                onEscape: function() {
                    UE.getEditor('editor').destroy();
                }
            });
            var ue = UE.getEditor('editor');
            $('#prescriptionname').val(datatime.title);
            $('.medicines').val(datatime.mailabstract);
            $('#maxlength').text($('#prescriptionname').val().length);
            $('#maxlengths').text($('.medicines').val().length);
            UE.getEditor('editor').ready(function () {
                insertHtml(datatime.content);
            });
            $('input[name="user"][value="'+datatime.usertype+'"]').attr('checked',true);
            $('input[name="time"][value="'+datatime.pushtype+'"]').attr('checked',true);
            if(datatime.pushtime != null && datatime.pushtime != ''){
                var pushtime = datatime.pushtime.split(',');
                $('.addtimes').empty();
                for(var i=0;i<pushtime.length;i++){
                    var a = pushtime[i].split(' ')[0]+'T'+pushtime[i].split(' ')[1];
                    var addtime = '<div class="fl" style="margin: 0 20px 16px 0;position: relative">'+
                        '<input class="form-controls" type="datetime-local" value="'+a+'" />'+
                        '<img class="deltime" src="/static/image/minus-circle.png" style="position: absolute;top: -6px;right: -6px;background: #ffffff;width: 14px;">'+
                        '</div>';
                    $('.addtimes').append(addtime);
                }
            }
            if($("input[name='time']:checked").val() == 2){
                $('#displaytime').show()
            }else{
                $('#displaytime').hide()
            }
            $("input[name='time']").click(function(){
                if( $(this).val() == 2){
                    $('#displaytime').show()
                }else{
                    $('#displaytime').hide()
                    $('.addtimes').empty();
                }
            });
            $('.createby').val(datatime.createname);
            $('.createtime').val(datatime.createtime);
            $('.pushstate').val(datatime.pushstate==1?'未推送':'已推送');
            $('.prescriptionname').bind("input propertychange",function(){
                $('#maxlength').text($('.prescriptionname').val().length);
                if($('.prescriptionname').val().length>30){
                    var a= $('.prescriptionname').val();
                    $('.prescriptionname').attr('maxlength',30);
                    $('#maxlength').text('30');
                    $('.length').css('color','#d74326');

                    $('.prescriptionname').val(a.substring(0,30));

                }else{
                    $('.length').css('color','#000000');
                }
            });
            $('.medicines').bind("input propertychange",function(){
                $('#maxlengths').text($('.medicines').val().length);
                var a = $('.medicines').val();
                if($('.medicines').val().length>65){
                    var b= $('.medicines').val();
                    $('.medicines').attr('maxlength',65);
                    $('#maxlengths').text('65');
                    $('.lengths').css('color','#d74326');
                    $('.medicines').val(a.substring(0,65));

                }else{
                    $('.lengths').css('color','#000000');
                }
            });
            $('.addtime').click(function(){
                var a = '<div class="fl" style="margin: 0 20px 16px 0;position: relative">'+
                    '<input class="form-controls time" type="datetime-local"/>'+
                    '<img class="deltime" src="/static/image/minus-circle.png" style="position: absolute;top: -6px;right: -6px;background: #ffffff;width: 14px;cursor: pointer;">'+
                    '</div>';
                $('.addtimes').append(a);
                $('.deltime').click(function(){
                    $(this).parent().remove();
                })
            });
            $('.deltime').click(function(){
                $(this).parent().remove();
            })
        });
    };
    $('#search').click(function(){
        $('#tbStandInsideLetterList').DataTable().ajax.reload();
    })
    function insertHtml(value) {
//         value = prompt('插入html代码', '');
//        console.log(value)
        UE.getEditor('editor').execCommand('insertHtml', value)
    }
    function getContent() {
        var arr = [];
        arr.push(UE.getEditor('editor').getContent());
        return arr.join("\n");
    }


    //检查是否可以编辑和删除
    function checkstate(mailid)
    {
    	var result=true;
        ajax({
            "type" : 'get',
            "url" : '/api/mailinfo/getById/'+mailid,
            "dataType" : "json",
            "async" : false,
            "success" : function(data) {
            	if(data.pushstate==1)
            	{
            		result=false;
            	}
            }
        });
        return result;
    }


    return obj;
}();