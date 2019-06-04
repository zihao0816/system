<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>北京有名的中医推荐-北京好中医</title>
    <meta name=keywords
          content="北京好中医,在线复诊,好中医,北京中医,北京中医医院哪家好,北京口碑好的老中医,北京有名的中医大夫，北京哪有好中医">
    <meta name=description
          content="北京好中医，值得信赖的中医在线复诊购药平台，汇集张代钊、李萍萍、马万千等众多公立三甲中医院的名老中医。为患者提供在线复诊、在线开药、预约线下面诊等全方位服务">
    <meta name=list content="北京好中医-全国三甲医院专家在线复诊调方平台">
    <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico"/>
    <link rel="stylesheet" href="/css/navs.css">
    <link rel="stylesheet" href="/css/footers.css">
    <link rel="stylesheet" href="/css/list.css">
    <!-- <script src="../js/index.js"></script> -->
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
            <li><a href="${url}">首页</a></li>
            <li><a href="${url}/jump/news.html" >新闻资讯</a></li>
            <li><a href="${url}/jump/introduce.html" >关于我们</a></li>
            <li><a href="${url}/jump/recruit.html" >加入我们</a></li>
        </ul>
    </div>
</div>
<div class="doctorlist">
    <div class="page-py">
        <div class="top-py">
            <hr>
            <p class="">
                <img width="24" height="24" src="/img/zys_icn@3x.png" alt=""/>
                <span>这里汇集专业中医师</span>
            </p>
            <hr>
        </div>
        <div class="box">
            <div class="list-py">
                <ul class="listdoc">
                    <#list remap.reGetDoctorsItems as item>
                        <li class="clearfixaa">
                            <div class="qrCode">
                                <div class="qrCode_left">
                                    <p>微信扫码，在线咨询</p>
                                    <p>
                                        <img class="doctors" src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${item.qrbigurl}">
                                        <img class="kefu" width="130" height="130" src="${item.orderurl}">
                                    </p>
                                </div>
                                <p class="qrCode_right">
                                    <img src="/img/youce.png" alt="">
                                </p>
                            </div>
                            <div style="display: none" class="docidd">${item.id}</div>
                            <div class="fl headphoto-py">
                                <img class="imgone-py" width="180" height="180" onerror="this.onerror=null;this.src='/img/222.png'" alt=""
                                     src="http://www.51bjhzy.com/${item.headphoto}">
                                <#--<div class="imgtwo-py ">-->
                                <#--<img class="doctors" src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${item.qrbigurl}">-->
                                <#--<img class="kefu" width="130" height="130" src="${item.orderurl}">-->
                                <#--</div>-->
                                <div style="display: none" class="statuslist">${item.orcodestatus}</div>
                            </div>
                            <div class="fr content-py">
                                <p class="name-py"><span><a href="${url}/detail/${item.id}.html" style="display: inline-block">${item.doctorname}</a></span><span>${item.duties}</span></p>
                                <div class="clearfix intro-py">
                                    <img class="fl left-py" src="/img/none.png" alt="" >
                                    <p><span>擅长：</span><span class="shanchangnr"></span></p>
                                    <div style="width:100%;height:14px">
                                        <img style="float:right;" class="fr right-py" src="/img/none.png" alt="" >
                                    </div>

                                </div>
                                <div class="fr see-py">
                                    <span><a href="${url}/detail/${item.id}.html" style="display: inline-block">查看</a></span>
                                    <img src="/img/none.png" alt="">
                                </div>
                                <div style="display: none;" class="skissss">${item.skillname}</div>
                            </div>
                        </li>
                    </#list>
                </ul>
            </div>
            <div class="list-py" style="display: none;background:red;"></div>
            <div class="list-py" style="display: none;background:yellow;"></div>
        </div>
        <div class="pagetions">
            <div class="paginations">
                <a href="${url}/list/${remap.page -1}/10.html" class="a_left lefts" onclick="turnOverPage(${remap.page} - 1,${remap.pageye})"> < </a>
                <p class="nodeclick">
                    <#list 1..remap.pageye as t>
                        <a href="${url}/list/${t}/10.html" onclick="turnOverPageone(${t})">${t}</a>
                    </#list>
                </p>
                <a href="${url}/list/${remap.page +1}/10.html" class="a_left rights" onclick="turnOverPage(${remap.page} + 1,${remap.pageye})">></a>
                <div class="ye">
                    <a href="javascript:;">前往</a>
                    <div><input type="text" value="1" class="inptaa"></div>
                    页
                </div>
            </div>
        </div>
    </div>
</div>
<div class="footer">
    <div class="footone">
        <div class="son">
            <div class='erweima'><img src="/img/qrcode.jpg"></div>
            <div class="hr"></div>
            <div style="float:right">
                <div class="phonesrc"><span class="phone">400-666-0101</span> <span class="time">（工作时间09:00 ～ 20:00）</span>
                </div>
                <div class="phonesrc"><span class="srcs">地址：北京市顺义区国泰宏城5层</span></div>
            </div>
        </div>
    </div>
    <div class="foottwo">
        Copyright © 2019-2020 51bjhzy.com. All Rights Reserved. 京ICP备18043331号-1
    </div>
</div>
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
<script>
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?0a978a08c7fa859c35e4d980bf322107";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>
<script type="text/javascript" src="/js/list.js"></script>
</html>