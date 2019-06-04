<!DOCTYPE html>
<html lang="en">
<head>
    <title>北京好中医-全国三甲医院专家在线复诊调方平台</title>
    <meta charset="UTF-8">
    <meta name=keywords
          content="北京好中医,在线复诊,好中医,北京中医,北京中医医院哪家好,北京口碑好的老中医,北京有名的中医大夫，北京哪有好中医">
    <meta name=description
          content="北京好中医，值得信赖的中医在线复诊购药平台，汇集张代钊、李萍萍、马万千等众多公立三甲中医院的名老中医。为患者提供在线复诊、在线开药、预约线下面诊等全方位服务">
    <meta name=list content="北京好中医-全国三甲医院专家在线复诊调方平台">
    <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico"/>
    <link rel="stylesheet" href="/css/navs.css">
    <link rel="stylesheet" href="/css/footers.css">
    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="/css/detailaa.css">
    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.js"></script>
    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.2/css/swiper.css"><!-- 加载Swiper的css文件 -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.2/js/swiper.js"></script>
    <link rel="stylesheet" href="/detail.ftl">
    <script>
        var _hmt = _hmt || [];
        (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?0a978a08c7fa859c35e4d980bf322107";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    </script>

</head>
<body>
<div class="nav_wrap">
    <div class="nav">
        <div class="logo"><img onclick="window.location='${url}'" src="/img/logos.png" alt="北京好中医"></div>
        <ul>
            <li><a href="${url}" class="nav_news">首页</a></li>
            <li><a href="${url}/jump/news.html" >新闻资讯</a></li>
            <li><a href="${url}/jump/introduce.html" >关于我们</a></li>
            <li><a href="${url}/jump/recruit.html">加入我们</a></li>
        </ul>
    </div>
</div>

<div class="index">
    <div class="banner">
        <#--<a href="${url}/jump/tribune.html" target="_blank"><img src="/img/banner-51.png" alt=""></a>-->
        <img src="/img/banner-xg.jpg" alt="">
    </div>
    <div class="lbt-list">
        <div class="zys-tit">
            <hr class="hr">
            <span><img src="/img/zys_ic@3x.png" alt=""><span class="st">这里汇集专业中医师</span></span>
            <hr class="hr">
        </div>
        <div class="wdith" style="height:800px;" id="banner">
            <div class="swiper-container" style="width:1200px;overflow: hidden;" id="container">
                <div class="swiper-wrapper">
                    <#list doctorList?chunk(6) as row>
                        <div class="swiper-slide" style="height:800px;">
                            <#list row as item>
                                <div class="mingpian">
                                    <div class="imgs">
                                        <img onerror="this.onerror=null;this.src='/img/222.png'" class="imgone" src="http://www.51bjhzy.com/${item.headphoto}" alt="${item.doctorname}">
                                        <div style="display: none" class="statusindex">${item.orcodestatus}</div>
                                    </div>
                                    <span class="hovers">
                                        <div class="fuji">
                                            <div style="display: none" class="docid">${item.id}</div>
                                            <div>
                                                <a class="docname wosss " href="${url}/detail/${item.id}.html">${item.doctorname} </a>
                                                <span class="hovees">${item.duties}</span>
                                            </div>
                                            <div>
                                                <img class="lj" src="/img/Path 311@2x.png" alt="">
                                            </div>
                                            <div class="scfuji">
                                                <span class="shanchang">擅长：</span>
                                                <span class="shanchangnr"></span>
                                            </div>
                                            <div><img class="ls" src="/img/Path 31245@2x.png" alt=""></div>
                                            <div class="ckinfo">
                                                <a href="${url}/detail/${item.id}.html" class="findsss">查看 </a>&nbsp;&nbsp;
                                                <img class="ckicon" src="/img/none.png" alt="">
                                            </div>
                                             <div class="qrCode">
                                                <div class="qrCode_left">
                                                    <p>微信扫码，在线咨询</p>
                                                    <p>
                                                        <img class="doctorindex"
                                                             src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${item.qrbigurl}"
                                                             alt="">
                                                        <img class="kefuindex"
                                                             src="${item.orderurl}"
                                                             alt="">
                                                    </p>
                                                </div>
                                                <p class="qrCode_right">
                                                    <img src="/img/youce.png" alt="">
                                                </p>
                                            </div>
                                        </div>
                                        <div style="display: none;" class="skissss">${item.skillname}</div>
                                </div>
                            </#list>
                        </div>

                    </#list>
                </div>
                <!-- 如果需要分页器 -->
                <div class="pagination"></div>

                <!-- 如果需要导航按钮 -->
                <div class="swiper-button-prev displayLeft" style="display:none; background:url(/img/left_icn@3x1.png);margin-top:-40;width:48px;height:48px;filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=360);"></div>
                <div class="swiper-button-next displayRight" style="display:none; background:url(/img/ck_icn@3x.png);right:20px;margin-top:-40;width:48px;height:48px;"></div>

                <!-- 如果需要滚动条 -->
                <#--<div class="swiper-scrollbar"></div>-->
            </div>


        </div>
        <div class="gengduo">
            <a href="${url}/list/1/10.html" style="display: none "> </a>了解更多<h1 style="color: #32303b;font-size: 16px;font-weight: normal;display: inline">北京好中医</h1> >>
        </div>
    </div>
    <div class="hzy_article">
        <div class="zys-tit">
            <hr class="hr">
            <span><span class="st">关注健康, 享受生活</span></span>
            <hr class="hr">
        </div>
        <div class="article">
            <div class="article_left">
                <div class="article_left_top">

                </div>
                <div class="article_left_bottom">


                </div>
            </div>
            <div class="article_right">
                <div class="article_content_wrap">
                    <div class="article_content">
                        <p class="important1"></p>
                        <p class="subtitle1"></p>
                        <ul class="assistant1">

                        </ul>
                    </div>
                    <div class="article_content">
                        <p class="important2"></p>
                        <p class="subtitle2"></p>
                        <ul class="assistant2">

                        </ul>
                    </div>
                </div>
                <div class="article_content contentThree">
                    <p class="important3"></p>
                    <p class="subtitle3"></p>
                    <ul class="assistant3">

                    </ul>
                </div>
                <div class="article_content">
                    <p class="important4"><a href="${url}/jump/detail04165.html" target="_blank">治疗手脚冰凉、夜尿多的壮阳穴--腰阳关</a></p>
                    <p class="subtitle4"></p>
                    <ul class="assistant4">

                    </ul>
                </div>
            </div>
        </div>
        <div class="artile_footer"> <a href="${url}/jump/news.html" target="_blank">了解更多资讯</a></div>
    </div>
    <#-- 潘家园专题 -->
    <div class="special">
        <a href="${url}/jump/special_pjy.html" target="__blank">
            <div>
                <img src="../img/special/img_pjyyg.png">
                <h3>潘家园医馆</h3>
                <span>北京好中医潘家园医馆是北京好中医旗下的实体医疗机构。是北京好中医在线诊疗，线下医疗闭环运营的重要组成部分，医馆秉承好中医，用好药的经营理念，聘请国医大师张代钊，叶霈智，储真真等北京知名专家到馆坐诊。</span>
                <i class="goPath"></i>
            </div>
        </a>
    </div>
    <div class="zys-list">
        <div class="zys-tit">
            <hr class="hr">
            <span><img class="DSB" src="/img/hz_ic@3x.png" alt=""><span class="st">战略合作伙伴</span></span>
            <hr class="hr">
        </div>
        <div class="fons">
            <div>
                <img src="/img/zk-logo@2x.png" alt="">
            </div>
            <div>
                <img src="/img/krt-logo@2x.png" alt="">
            </div>
            <div>
                <img src="/img/tx_logo@2x.png" alt="">
            </div>
            <div>
                <img src="/img/aly_logo@2x.png" alt="">
            </div>
            <div>
                <img src="/img/dxy_logo@2x.png" alt="">
            </div>
            <div>
                <img src="/img/sf_logo@2x.png" alt="">
            </div>
            <div>
                <img src="/img/jd_logo@2x.png" alt="">
            </div>
        </div>
    </div>
</div>
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
<input type="hidden" value="${url}" class="url">
</body>
<#---->
<script>
    var url = $('.url').val();
    var mySwiper = new Swiper('.swiper-container', {
        autoplay:true,
        loop: true,
        pagination: {
            el: '.pagination',
            clickable :true
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    var container=document.getElementById("container");
    container.onmouseenter=function(){
        mySwiper.autoplay.stop();
    }
    container.onmouseleave=function(){
        mySwiper.autoplay.start();
    }
</script>
<script src="../js/float.js"></script>
<script type="text/javascript" src="/js/index.js"></script>
</html>
