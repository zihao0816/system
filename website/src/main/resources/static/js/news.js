$(function(){
    var url = $('.url').val();
    $(window).scroll(function(){
        var scrollt = document.documentElement.scrollTop + document.body.scrollTop;  //获取滚动后的高度
        if( scrollt > 800 ){  //判断滚动后高度超过800px,显示
            $(".gotop").fadeIn(400); //淡出
        }else{
            $(".gotop").stop(true,true).fadeOut(400);  //如果返回或者没有超过,就淡入.必须加上stop()停止之前动画,否则会出现闪动
        }
    });
    //当点击标签的时候,使用animate在1000毫秒的时间内,返回到顶部
    $(".gotop").click(function(){
        $("html,body").animate({scrollTop:"0px"},1000);
    });


    //移动端tab切换
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

    //获取文章列表
    function getNews(){
        var type = 1,classify = '',orders = 'quan';
        $.ajax({
            "type" : 'post',
            "url" : '/article?type='+type+'&classify='+ classify +'&orders='+ orders,
            "dataType" : "json",
            "contentType":"application/json",
            "data" : '',
            "success" : function(data) {
                var list = '';//文章列表
                var hotList = '';//热门排行
                var wap = '';//wap文章列表
                for(var i=0; i<=data.length; i++){
                    //pc文章列表
                    list = '<div class="text_list">'+
                                '<div class="list_left">'+
                                    '<img src="'+ url +'/'+ data[i].coverurl +'" alt="">'+
                                '</div>'+
                                '<div class="list_right">'+
                                    '<p><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">'+ data[i].title +'</a></p>'+
                                    '<p>'+ data[i].subtitle +'</p>'+
                                    '<span><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank" >阅读全文</a></span>'+
                                '</div>'+
                            '</div>';
                    $('.texts').append(list);


                    //WAP文章列表
                    wap = '<div class="goPath" data-id="'+ data[i].id +'">' +
                            '<a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'">'+
                            '<h3>'+ data[i].title +'</h3>' +
                            '<span>'+ data[i].subtitle +'</span>' +
                            '<img src="'+ url +'/'+ data[i].coverurl +'">' +
                            '<span class="data">'+ data[i].shijian +'前</span>' +
                            '</a>'+
                          '</div>';
                    $('.center2').append(wap);
                }
            }
        });
    };
    getNews();

    function getHot(){
        var type = 1,classify = '列表热门排行',orders = 'lie';
        $.ajax({
            "type" : 'post',
            "url" : '/article?type='+type+'&classify='+ classify +'&orders='+ orders,
            "dataType" : "json",
            "contentType":"application/json",
            "data" : '',
            "success" : function(data) {
                var hotList = '';//热门排行
                for(var i=0; i<=data.length; i++){
                    hotList = '<li>'+
                        '<span><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">'+ data[i].title +'</a></span>'+
                        '<span>'+ data[i].subtitle +'</span>'+
                        '<span><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">阅读全文</a></span>'+
                        '</li>';
                    $('.hotList').append(hotList);
                }
            }
        });
    }
    getHot();

});