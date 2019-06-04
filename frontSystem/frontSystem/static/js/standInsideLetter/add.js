/**
 * Created by Girl on 2018/9/14.
 */
;var ObjAddStandInsideLetter = function(
){
    var obj = new Object();
    obj.ID = '';
    obj.init= function(id){
        obj.ID = id;//记录ID编号
        $('#maxlength').text('0');
        $('#maxlengths').text('0');
        $('input[name="user"][value="1"]').attr('checked',true);
        $('input[name="times"][value="1"]').attr('checked',true);
        if($("input[name='times']:checked").val() == 2){
            $('#displaytime').show()
        }else{
            $('#displaytime').hide()
        }
        $("input[name='times']").click(function(){
            if( $(this).val() == 2){
                $('#displaytime').show()
            }else{
                $('#displaytime').hide()
                $('.addtimes').empty();
            }
        });
        $('.prescriptionname').bind("input propertychange",function(){
            $('#maxlength').text($('.prescriptionname').val().length);
            if($('.prescriptionname').val().length>30){
                var a = $('.prescriptionname').val();
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

                $('.medicines').val(a.substring(0,65))

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

        $('.add').click(function(){
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
            if($('input[name="times"]:checked').val() == 2){
                if($('.time').val() == ''){
                    bootboxAlert('定时发送时间不能为空',false);
                    return false;
                }
            }
            var list = [];
            if($('.addtimes').children().length>0){
                for(var i=0;i<$('.addtimes').children().length;i++){
                    var time = $('.addtimes').children()[i].children[0].value;
                    list.push(time.replace(/T/,' '))
                }
            }

            var result = doAjax('/api/mailinfo/insertSelectives','post',{
                title: $('#prescriptionname').val(),
                mailabstract: $('.medicines').val(),
                content: getContent(),
                usertype: $('input[name="user"]:checked').val(),
                pushtype: $('input[name="times"]:checked').val(),
                pushtime: list
            },function(res){
                if(res.result == 1){
                    reset();
                }
            },null, null, false);
            return result;
        })
    };
    function reset(){
        $('#prescriptionname').val('');
        $('.medicines').val('');
        $('#maxlength').text('0');
        $('#maxlengths').text('0');
        $('.length').css('color','#000000');
        $('.lengths').css('color','#000000');
        $('.addtimes').children().remove();
        UE.getEditor('editor').setContent('');
    }
    return obj;
}();