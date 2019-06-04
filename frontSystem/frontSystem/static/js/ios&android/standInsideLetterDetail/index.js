/**
 * Created by Girl on 2018/9/14.
 */
function query(){
    var sessionId = GetQueryString('sessionId');
    var id = GetQueryString('id');
    var type = GetQueryString('type');
    var time = GetQueryString('time');

    ajax({
        url: '/api/PlacingOrder/NoticeSelect/'+type+'/'+id,
        type: 'post',
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            $('.title').text(data.title);
            $('.contents').html(data.content);
            if(data.createtime != null && data.createtime != ''){
                $('.time').text(time);
            }
            if($('.content').height()<$(window).height()-6){
                $('.content').css('height',$(window).height()-6);
            }
        },
        error: function(e){
            console.log(e);
        }
    },sessionId);
}
