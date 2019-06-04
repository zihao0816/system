$(function(){
    var url = $('.url').val();

    //轮播
    function swiper(){
        var mySwiper = new Swiper('.swiper-container', {
            pagination: { //分页器
                el: '.swiper-pagination',
                clickable: true,
            },
            loop: true, //循环
            autoplay: true,
            // 如果需要前进后退按钮
            // 如果需要滚动条
            // scrollbar: {
            //     el: '.swiper-scrollbar',
            // },
        });
    }


    //主题文章列表
    function getList(){
        var type = 1,classify = '详情热门排行';
        var list = '';
        var number = 0;
        $.ajax({
            "type" : 'post',
            "url" : '/article?type='+type+'&classify='+ classify,
            "dataType" : "json",
            "contentType":"application/json",
            "data" : '',
            "success" : function(data) {
                for(var i=0; i<3; i++){
                    list = '<div class="swiper-slide">'+
                            '<a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank" class="lbt">'+
                            '<img src="'+ url +'/'+ data[i].coverurl+ '" alt="">'+
                            '<span>'+ data[i].title +'</span>'+
                            '</a>'+
                            '</div>';
                    $('.swiper-wrapper').append(list);
                }

                for(var i=4; i<data.length; i++){
                    number = number+1;
                    list = '<a href="'+ url +'/jump/tribuneDetail.html?id='+ data[i].id +'" target="_blank"><span>'+ number +'.'+ data[i].title +'</span></a>';
                    $('.hotList').append(list);
                }
                swiper();
            }
        });
    };
    getList();



    //详情id
    function getDetails(){
        var url = window.location.href;
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
                $('.newsMain').html(data[0].context);
                $('.data').text(data[0].updatetime);
                $('.center').html(data[0].context);


                var i = document.getElementsByTagName("meta");
                i[2]["content"] = data[0].label;
                i[3]["content"] = data[0].subtitle;
                document.title = data[0].title +'-新闻资讯-北京好中医';
            }
        });
    };
    getDetails();
})