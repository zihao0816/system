<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="keywords"
          content="${doctorInfoVo.doctorname},${doctorInfoVo.doctorname}${doctorInfoVo.hospitaname},${doctorInfoVo.doctorname}挂号,${doctorInfoVo.doctorname}在线问诊,${doctorInfoVo.doctorname}怎么样,${doctorInfoVo.doctorname}${doctorInfoVo.departmentname}">
    <meta name="description" content="${doctorInfoVo.intro}">
    <title>${doctorInfoVo.doctorname}-${doctorInfoVo.hospitaname}-北京好中医</title>
    <link rel="shortcut icon" type="image/x-icon" href="/img/favicon.ico"/>
    <link rel="stylesheet" href="/css/navs.css">
    <link rel="stylesheet" href="/css/footers.css">
    <link rel="stylesheet" href="/css/detail.css">
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
<#--${doctorInfoVo.orcodestatus}   ${doctorInfoVo.orderurl}-->
<body>
<div class="doctordetails">
    <div class="nav_wrap">
        <div class="nav">
            <div class="logo"><img onclick="window.location='${url}'" src="/img/logos.png" alt="北京好中医"></div>
            <ul>
                <li><a href="${url}" >首页</a></li>
                <li><a href="${url}/jump/news.html" >新闻资讯</a></li>
                <li><a href="${url}/jump/introduce.html" >关于我们</a></li>
                <li><a href="${url}/jump/recruit.html" >加入我们</a></li>
            </ul>
        </div>
    </div>
    <div class="page">
        <div class="doctor">
            <div class="headimg">
                <img width="208" height="208" onerror="this.onerror=null;this.src='/img/222.png'" src="http://www.51bjhzy.com/${doctorInfoVo. headphoto}" alt="${doctorInfoVo. doctorname}">
            </div>
            <div class="top">
                <h1>${doctorInfoVo.doctorname}</h1>
                <p>${doctorInfoVo.duties}</p>
            </div>
            <div class="code clearfix">
                <img class="always" src="/img/sssd@3x.png" alt="">
                <div class="fr doctors" >
                    <img style="width: 160px;height: 160px;"
                         src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${doctorInfoVo.qrbigurl}" alt="">
                    <p>微信扫码上方我的二维码</p>
                    <p>即可随时在微信与我沟通，在家找我复诊</p>
                </div>
                <div class="fr kefu">
                    <img style="width: 160px;height: 160px;"
                         src=" ${doctorInfoVo.orderurl}" alt="">
                    <p>微信扫码，立刻开始在线咨询</p>
                    <p>客服支持热线：400-666-0101</p>
                </div>
            </div>
            <div style="display: none" class="status">${doctorInfoVo.orcodestatus}</div>

            <div class="synopsis">
                <div style="display: none" class="docid">${doctorInfoVo.id}</div>
                <p class="title"><span></span><span>医生简介</span></p>
                <p class="content">北京好中医特邀医生</p>
                <p class="content">${doctorInfoVo.intro}</p>
            </div>
            <div class="synopsis">
                <p class="title"><span></span><span>擅长调理</span></p>
                <ul class="clearfix ulsss" style="clear: both;display: block;content: "";
                overflow: hidden;">

                </ul>
                <div style="display: none" class="skiss">${doctorInfoVo.skilled}</div>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="footone">
            <div class="son">
                <div class='erweima'><img src="/img/qrcode.jpg"></div>
                <div class="hr"></div>
                <div style="float:right">
                    <div class="phonesrc"><span class="phone">400-666-0101</span> <span
                                class="time">（工作时间09:00 ～ 20:00）</span></div>
                    <div class="phonesrc"><span class="srcs">地址：北京市顺义区国泰宏城5层</span></div>
                </div>
            </div>
        </div>
        <div class="foottwo">
            Copyright © 2019-2020 51bjhzy.com. All Rights Reserved. 京ICP备18043331号-1
        </div>
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
<script src="/js/detail.js"></script>
</html>