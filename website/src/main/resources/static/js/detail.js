function fn(){
    var ski=document.getElementsByClassName("skiss")[0];
    var oul=document.getElementsByClassName("ulsss")[0];
    var kefu=document.getElementsByClassName("kefu")[0];
    var doc=document.getElementsByClassName("doctors")[0];
    var status=document.getElementsByClassName("status")[0];
    if(status.innerHTML/1==1){
        kefu.style.display="block";
        doc.style.display="none";
    }else{
        kefu.style.display="none";
        doc.style.display="block";
    }
    // console.log(222,doc,kefu,status.innerHTML);
    // console.log(111,ski);


    var shan=ski.innerHTML.split(",");
    var str=""
    for(var i=0;i<shan.length;i++){
        var lis=document.createElement("li");
        lis.innerHTML=shan[i];
        // str +=` <li class="fl">`+ shan[i]+`</li>`;
        oul.appendChild(lis);
    }

}fn();