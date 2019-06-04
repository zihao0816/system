

function clearfixss() {
    var clearfix = document.getElementsByClassName("clearfixaa");
    var docid = document.getElementsByClassName("docidd");
    for (var i = 0; i < clearfix.length; i++) {
        (function(j) {
            clearfix[j].onclick = function () {
                var Id = docid[j].innerHTML;
                window.location.href = ("/detail/"+ Id+".html" );
            }
        })(i);
    }
}

clearfixss();

function fn() {
    var sdy = document.getElementsByClassName("skissss");
    var shan = document.getElementsByClassName("shanchangnr");
    for (var j = 0; j < shan.length; j++) {
        var str = sdy[j].innerHTML;
        shan[j].innerHTML = str.split(',').join('&emsp;');
    }
}

fn();

function turnOverPage(na, gong) {
    if (na < 1) {
        window.location.href = ("/list/1/10.html");
    }
    if (gong < na) {
        window.location.href = ("/list/" + gong +"/10.html");
    }
    if (na >= 1 && gong >= na) {
        var pagex = na - 1;
        localStorage.setItem('id', pagex);
         window.location.href = ("/list/" + na + "/10.html");
    }
}

function turnOverPageone(page) {
    var pages = page / 1 - 1;
    localStorage.setItem('id', pages);
    window.location.href = ("/list/" + page + "/10.html");
}

var oldot = document.querySelectorAll('.paginations p a');
for (var i = 0; i < oldot.length; i++) {
    // loading[i].style.display="none";
    oldot[i].style.backgroundColor = "#FFF";
    oldot[i].style.color = "black";
}
if (localStorage.id) {
    oldot[localStorage.id].style.backgroundColor = "#FF7860";
    oldot[localStorage.id].style.color = "#fff";
} else {
    oldot[0].style.backgroundColor = "#FF7860";
    oldot[0].style.color = "#FFF";
}

var inpta = document.getElementsByClassName("inptaa")[0];
var pagetion = document.getElementsByClassName("pagetions")[0];
if(localStorage.id){
    inpta.value = (localStorage.id / 1 + 1);
}else{
    inpta.value=1;
}
var ids=oldot[localStorage.id]?oldot[localStorage.id].innerHTML:oldot[0].innerHTML;
function login() {
    inpta.onchange = function () {
        // alert(inpta.value,oldot.length);
        if ((inpta.value != ids) && (inpta.value <= oldot.length) && (inpta.value / 1 > 0)) {
            pagetion.onclick = function () {
                if (inpta.value / 1 !== (localStorage.id / 1 + 1)) {
                    localStorage.setItem("id", (inpta.value - 1));
                    window.location.href = ("/list/" + inpta.value + "/10.html");
                }
            }
        }
    }
}
login();
var bodys=document.getElementsByTagName("body")[0];

bodys.onkeydown=function(event){
    var e = event || window.event;
    if(e && e.keyCode==13){
        if ((inpta.value != ids) && (inpta.value <= oldot.length) && (inpta.value / 1 > 0)) {
            localStorage.id=inpta.value/1-1;
            window.location.href = ("/list/" + inpta.value + "/10.html");
        }
    }
}

var leftclick=document.getElementsByClassName("lefts")[0];
var rightclick=document.getElementsByClassName("rights")[0];


if((!localStorage.id)||localStorage.id==0){
    leftclick.style.cssText='cursor: not-allowed; pointer-events: none;color:#ccc';
    leftclick.onclick=function(e){
        var e=e||window.event;
        e.stopPropagation();
    }
}
if(localStorage.id==oldot.length-1||oldot.length==1){
    rightclick.style.cssText='cursor: not-allowed; pointer-events: none;color:#ccc';
    rightclick.onclick=function(e){
        var e=e||window.event;
        e.stopPropagation();
    }
}
var test = window.location.href;
var arr=test.split("/");
var idsss=arr[4]-1;
for(var k=0;k<oldot.length;k++){
    oldot[k].style.backgroundColor = "#FFF";
    oldot[k].style.color = "#000";
}
oldot[idsss].style.backgroundColor = "#FF7860";
oldot[idsss].style.color = "#fff";
inpta.value=arr[4];
//http://localhost:8888/list/1/10.html
var kefu=document.getElementsByClassName("kefu");
var doc=document.getElementsByClassName("doctors");
var statuslist=document.getElementsByClassName("statuslist");
for(var j=0;j<doc.length;j++){

    if(statuslist[j].innerHTML/1==1){
        kefu[j].style.display="block";
        doc[j].style.display="none";
        // status[j].style.display="none";
    }else{
        kefu[j].style.display="none";
        doc[j].style.display="block";
        // status[j].style.display="none";
    }
}






