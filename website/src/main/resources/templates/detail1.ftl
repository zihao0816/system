<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>第一届中国互联网+中医发展论坛邀您共会-新闻资讯-北京好中医</title>
    <meta name=keywords content="">
    <meta name=description content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico">
    <link rel="stylesheet" href="/css/navs.css">
    <link rel="stylesheet" href="/css/footers.css">
    <link rel="stylesheet" href="/css/detailaa.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.2/css/swiper.css">
    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.js"></script>
    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
    <!-- 加载Swiper的css文件 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.2/js/swiper.js"></script><!-- 加载Swiper的js文件 -->
</head>

<body>
<div class="nav_wrap">
    <div class="nav">
        <div class="logo"><a href="${url}"><img src="/img/logos.png" alt="北京好中医"></a></div>
        <ul>
            <li><a href="${url}">首页</a></li>
            <li><a href="${url}/jump/news.html" class="nav_news">新闻资讯</a></li>
            <li><a href="${url}/jump/introduce.html" >关于我们</a></li>
            <li><a href="${url}/jump/recruit.html">加入我们</a></li>
        </ul>
    </div>
</div>

<div class="nav_headers">
    <ul>
        <li>您的位置 :</li>
        <li><a href="https://www.51bjhzy.com" target="_blank">北京好中医</a></li>
        <span> > </span>
        <li><a href="${url}/jump/news.html" target="_blank">新闻资讯</a></li>
        <span> > </span>
        <li class="title"></li>
    </ul>
</div>
<div class="article_wrap">
    <div class="content">
        <div class="texts">
            <h1 class="title"></h1>
            <p class="source">标签：<span class="label"></span></p>
            <div class="introduce">

            </div>
        </div>
        <div class="aside">
            <div style="height: 240px;" class="swiper-container">
                <div class="swiper-wrapper">
                    <!-- 下面是4个不同颜色的轮播滑块 -->

                </div>
                <div class="swiper-pagination"></div><!--分页器（就是4个点点）-->
            </div>
            <div class="ranking">
                <p>热门排行</p>
                <ul class="hot">

                </ul>
            </div>
        </div>
    </div>
</div>

<!-- footer -->
<div class="footer">
    <div class="footone">
        <div class="son">
            <div class="erweima">
                <img src="/img/qrcode.jpg">
                <p>北京好中医公众号</p>
            </div>
            <div class="hr"></div>
            <div style="float:right">
                <div class="phonesrc">
                    <span class="phone">400-666-0101</span> <span class="time">（工作时间09:00 ～ 20:00）</span>
                </div>
                <div class="phonesrc"><span class="srcs">地址：北京市顺义区国泰宏城5层</span></div>
            </div>
        </div>
    </div>
    <div class="foottwo">
        Copyright © 2019-2020 51bjhzy.com. All Rights Reserved. 京ICP备18043331号-1
    </div>
</div>

<#-- 移动版 -->
<div class="mobile">
    <header>
        <img src="/img/logo@3x.png">
        <span>传承 · 创新 · 发展</span>
    </header>
    <div class="details">
        <h3 class="title"></h3>
        <span class="info"><span class="data"></span> 来源：北京好中医</span>
        <div class="center">

        </div>
    </div>
</div>
<!-- 联系浮窗 -->
<div class="float">
    <ul>
        <li>
            <i></i>
            <div></div>
        </li>
        <li>
            <i></i>
            <div><span>客服电话</span><span>400-666-0101</span></div>
        </li>
    </ul>
</div>
</body>
<input type="hidden" value="${url}" class="url">
<script>
    var _hmt = _hmt || [];
    (function () {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?0a978a08c7fa859c35e4d980bf322107";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
    var url = $('.url').val();
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
                $('.introduce').html(data[0].context);
                $('.data').text(data[0].updatetime);
                $('.center').html(data[0].context);
                $('.label').text(data[0].label);

                var i = document.getElementsByTagName("meta");
                i[1]["content"] = data[0].label;
                i[2]["content"] = data[0].subtitle;
                document.title = data[0].title +'-新闻资讯-北京好中医';
            }
        });
    };
    getDetails();

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

                for(var i=0; i<data.length; i++){
                    number = i+1;
                    list = '<li><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">'+ number +'.'+ data[i].title +'</a></li>';
                    $('.hot').append(list);
                }
                swiper();
            }
        });
    };
    getList();
</script>
</html>