$(function(){
    var url = $('.url').val();
    //主题文章列表
    function getList(){
        var type = 1,classify = '主题文章',orders = 'lie';
        var list = '';
        var list2 = '';
        $.ajax({
            "type" : 'post',
            "url" : '/article?type='+type+'&classify='+ classify +'&orders='+ orders,
            "dataType" : "json",
            "contentType":"application/json",
            "data" : '',
            "success" : function(data) {
                for(var i=0; i<data.length; i++){
                    list = '<div class="list">'+
                                '<a href="'+ url +'/jump/tribuneDetail.html?id='+ data[i].id +'" target="_blank">'+
                                '<span>'+ data[i].title +'</span>' +
                                '<div><img src="'+ url +'/'+ data[i].coverurl +'"></div>' +
                                '<span>'+ data[i].shijian +'前</span>' +
                                '</a>'+
                            '</div>';
                    $('.newList').append(list);
                    list2 = '<div class="list" data-id="'+ data[i].id +'">' +
                                '<a href="'+ url +'/jump/tribuneDetail.html?id='+ data[i].id +'" target="_blank">'+
                                '<h3>'+ data[i].title +'</h3>'+
                                '<span>'+ data[i].subtitle +'</span>'+
                                '<div><img src="'+ url +'/'+ data[i].coverurl +'"></div>'+
                                '<span class="data">'+ data[i].shijian +'前</span>'+
                                '</a>'+
                            '</div>';
                    $('.center2').append(list2);
                }
            }
        });
    };
    getList();


    //主页介绍
    function introduction(){
        var type = 2,classify = '',orders = 'quan';
        var list = '';
        var number = 0;
        $.ajax({
            "type" : 'post',
            "url" : '/article?type='+type+'&classify='+ classify +'&orders='+ orders,
            "dataType" : "json",
            "contentType":"application/json",
            "data" : '',
            "success" : function(data) {
                $('.liveList').html(data[0].context);
                $('.center1').html(data[0].context);
                $('.banner').html('<img src="'+ url +'/'+ data[0].coverurl +'">');
                $('.banner').css({'background-color': data[0].covercolour});
            }
        });
    };
    introduction();

    //手持端tab切换
    $('.tab span').click(function(){
        $(this).addClass('select').siblings().removeClass();
        if($(this).index() == 0){
            $('.center1').show();
            $('.center2').hide();
        }else{
            $('.center1').hide();
            $('.center2').show();
        }
    });

    //详情id
    function getDetails(){
        var eq = url.indexOf('=');
        var id = url.substring(eq+1,url.length);
        $.ajax({
            "type" : 'post',
            "url" : '/details?id='+ id,
            "dataType" : "json",
            "contentType":"application/json",
            "data" : '',
            "success" : function(data) {
                $('.title').text(data[0].title);
                $('.label').text(data[0].label);
                $('.main').html(data[0].context);
                $('.data').text(data[0].updatetime);
                $('.center').html(data[0].context);
            }
        });
    };
    getDetails();
})