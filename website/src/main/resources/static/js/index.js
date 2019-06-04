
function carousel(){
    var loading=document.getElementsByClassName("swiper");
    var oldot=document.querySelectorAll('#ulradius li');
    var leftclick=document.getElementsByClassName("swterLeft")[0];
    var rightclick=document.getElementsByClassName("swterRight")[0];
    var box=document.getElementsByClassName("wdith")[0];
    var num=0;
    var timer = null;
    autoPlay();
    leftclick.onclick = function(){
        num --;
        if(num == -1){
            num = loading.length - 1;
        }
        slider();
    }
    rightclick.onclick = function(){
        num ++;
        if(num == loading.length){
            num = 0;
        }
        slider();
    }
    for(var j=0;j<oldot.length;j++){
        oldot[j].onmouseenter=function(){
            num=j;
            slider();
        }
    }
    function slider(){
        for(var i=0;i<loading.length;i++){
            loading[i].style.display="none";
            oldot[i].style.backgroundColor="#D8D8D8";
        }
        loading[num].style.display="block";
        oldot[num].style.backgroundColor="red";
    }
    /*function autoPlay(){
        timer=setInterval(()=>{
            num++;
            if(num==loading.length){
                num=0;
            }
            slider();
        },2000);
        box.onmouseenter = function(){
            clearInterval(timer);
        }
        box.onmouseleave = function(){
            autoPlay();
        }
    }*/
}
/*carousel();*/
function mingpian(){
    var mingpian=document.getElementsByClassName("mingpian");
    var docnames=document.getElementsByClassName("docname")[0];
    var hovers=document.getElementsByClassName("hovers")[0];
    var gengduo=document.getElementsByClassName("gengduo")[0];
    var docid = document.getElementsByClassName("docid");
    for(var i=0;i<mingpian.length;i++){
        (function(j) {
            mingpian[j].onclick = function () {
                var Id = docid[j].innerHTML;
                window.location.href = ("/detail/"+ Id+".html" );
            }

        })(i)
    }
    gengduo.onclick=function(){
        localStorage.clear();
        window.location.href=("/list/1/10.html");
    }
    var sdy=document.getElementsByClassName("skissss");
    var shan=document.getElementsByClassName("shanchangnr");
    for(var j=0;j<shan.length;j++) {
        var str=sdy[j].innerHTML;
        shan[j].innerHTML=str.split(',').join('&emsp;');
    }
}
mingpian();
// var mingpian=document.getElementsByClassName("mingpian");
var kefuindex=document.getElementsByClassName("kefuindex");
var doctorindex=document.getElementsByClassName("doctorindex");
var statusindex=document.getElementsByClassName("statusindex");
for(var j=0;j<doctorindex.length;j++){
    if(statusindex[j].innerHTML/1==1){
        kefuindex[j].style.display="block";
        doctorindex[j].style.display="none";
    }else{
        kefuindex[j].style.display="none";
        doctorindex[j].style.display="block";

    }
}

//获取主页大图
function getOnly() {
    var type = 1,classify = '首页重推',orders = 'lie';
    var list = '';
    $.ajax({
        "type" : 'post',
        "url" : '/article?type='+type+'&classify='+ classify +'&orders='+ orders,
        "dataType" : "json",
        "contentType":"application/json",
        "data" : '',
        "success" : function(data) {
            list = '<a href="'+ url +'/jump/detail1.html?id='+ data[0].id +'" target="_blank" >'+
                '<img src="'+ url +'/'+ data[0].coverurl +'" alt="">'+
                '<span>'+ data[0].title +'</span>'+
                '</a>';
            $('.article_left_top').html(list);

            for(var i=1; i<3; i++){
                list = '<a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'"  target="_blank" class="texts_img">' +
                    '<img src="'+ url +'/'+ data[i].coverurl +'" />' +
                    '<span>'+ data[i].title +'</span>' +
                    '</a>';
                $('.article_left_bottom').append(list);
            }
        }
    });
}
getOnly();

//获取首页大标题
function getImportant(){
    var type = 1,classify = '首页大标题',orders = 'lie';
    var list = '';
    $.ajax({
        "type" : 'post',
        "url" : '/article?type='+type+'&classify='+ classify +'&orders='+ orders,
        "dataType" : "json",
        "contentType":"application/json",
        "data" : '',
        "success" : function(data) {
            $('.important1').html('<a href="'+ url +'/jump/detail1.html?id='+ data[0].id +'" target="_blank">'+ data[0].title +'</a>');
            $('.important2').html('<a href="'+ url +'/jump/detail1.html?id='+ data[1].id +'" target="_blank">'+ data[1].title +'</a>');
            $('.important3').html('<a href="'+ url +'/jump/detail1.html?id='+ data[2].id +'" target="_blank">'+ data[2].title +'</a>');
            $('.important4').html('<a href="'+ url +'/jump/detail1.html?id='+ data[3].id +'" target="_blank">'+ data[3].title +'</a>');
            var subtitle1 = '<span class="xq">'+ data[0].subtitle +'</span>'+
                '<span><a href="'+ url +'/jump/detail1.html?id='+ data[0].id +'" target="_blank">[详情]</a></span>';
            $('.subtitle1').html(subtitle1);
            var subtitle2 = '<span class="xq">'+ data[1].subtitle +'</span>'+
                '<span><a href="'+ url +'/jump/detail1.html?id='+ data[1].id +'" target="_blank">[详情]</a></span>';
            $('.subtitle2').html(subtitle2);
            var subtitle3 = '<span class="xq">'+ data[2].subtitle +'</span>'+
                '<span><a href="'+ url +'/jump/detail1.html?id='+ data[2].id +'" target="_blank">[详情]</a></span>';
            $('.subtitle3').html(subtitle3);
            var subtitle4 = '<span class="xq">'+ data[3].subtitle +'</span>'+
                '<span><a href="'+ url +'/jump/detail1.html?id='+ data[3].id +'" target="_blank">[详情]</a></span>';
            $('.subtitle4').html(subtitle4);
        }
    });
};
getImportant();

//获取首页小标题
function assistant() {
    var type = 1,classify = '首页小标题',orders = 'lie';
    var list = '';
    $.ajax({
        "type" : 'post',
        "url" : '/article?type='+type+'&classify='+ classify +'&orders='+ orders,
        "dataType" : "json",
        "contentType":"application/json",
        "data" : '',
        "success" : function(data) {
            for(var i=0; i<3; i++){
                list = '<li><span><i></i></span><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">'+ data[i].title +'</a></li>';
                $('.assistant1').append(list);
            }
            for(var i=3; i<6; i++){
                list = '<li><span><i></i></span><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">'+ data[i].title +'</a></li>';
                $('.assistant2').append(list);
            }
            for(var i=6; i<9; i++){
                list = '<li><span><i></i></span><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">'+ data[i].title +'</a></li>';
                $('.assistant3').append(list);
            }
            for(var i=9; i<12; i++){
                list = '<li><span><i></i></span><a href="'+ url +'/jump/detail1.html?id='+ data[i].id +'" target="_blank">'+ data[i].title +'</a></li>';
                $('.assistant4').append(list);
            }
        }
    });
};
assistant();