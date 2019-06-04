/**
 * Created by Girl on 2018/9/19.
 */
function query(){
    var sessionId = GetQueryString('sessionId');
    var prescriptionOrderId = GetQueryString('prescriptionOrderId');
    var tel = common().serviceTel;
    ajax({
        url: '/api/Inquiry/orderDetails', 
        type: 'post',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            getDoctor: 1,//是否获取医生信息
            getPrescriptionOrder: 1,//药方订单详细信息
            prescriptionOrderId: prescriptionOrderId,
            isaction: 1,//获取主诉信息
            getPatient: 1//患者详情信息
        }),
        success: function(res){
            var medical = res.orderprescriptioninfos[0];
            var isprescription = medical.isprescription;//药房是否可见
            var pageSum=medical.ordermedicines.length;
            var pageIndex=pageSum/42>=1?Math.ceil(pageSum/43):1;
            pageIndex=pageSum%42>=35? pageIndex+1:pageIndex;
            var secrecy = '';
            var icon = '';
            if(isprescription != 1){//1查看2保密
                secrecy = '<div class="secrecy">密</div>';
                icon = '<span class="stateIcon"></span>';
            }
            for(var i=1;i<=pageIndex;i++){
                var paddingall=`
                <div class="page">
                <div class="header paddings">
                    <div class="secrecyInfo">
                        `+ secrecy +`
                    </div>
                    <div class="header_left">
                        <p>供应商:<span class="hostName"></span> </p>
                        <p class="">剂型:<span class="dosage"></span><span class="dosageLength" style="margin-right:70px;"></span></p>
                    </div>  
                    <div class="header_right">
                        <p>北京好中医处方笺</p>
                        <p class="phone fat">客服电话：<span class="">400-666-0101</span></p>
                    </div>           
                 </div> 
                     <div class="paddings" style="margin-top:20px;"> 
                         <div style="overflow: hidden;">
                             <p class="time fl fat" style="margin-right:100px;">开方时间: <span class="paytimes thin"></span></p>
                             <p class="padbottom fl fat" >订单编号：<span class="code thin"></span></p>
                         </div>
                         <div class="padbottom clearfix">
                             <p class="fl fat" style="margin-right: 80px;">患者姓名：<span class="name thin"></span></p>
                             <p class="fl fat" style="margin-right: 80px;">性别：<span class="sex thin"></span></p>
                             <p class="fl fat">年龄：<span class="age thin"></span></p>
                         </div>
                         
                         <div style="overflow:hidden;height:44px;">
                             <p class="fl fat">诊断：<span class="symptoms thin"></span><span class="thin">;</span><span class="doctorconclusion thin" style="word-break: break-all;margin-left：20px;"></span></p>
                         </div>  
                        <div class="clearfix " style="height:35px;">
                            <p class="fl fat">收货地址：<span class="receiver thin" style="margin-right: 16px;"></span><span class="telephone thin"></span></span><span class="address thin" style="margin-left:16px;"></span></p>
                        </div> 
                        <div style="margin-top: 6px;" class="borderdetail">
                            `+ icon +`
                            <ul class="clearfix padbottom addlist">
                                <p class="fat">R:</p>
                            </ul>
                            <div style="width:100%;height:5px;"></div>    
                             <div class='last'>
                             </div>
                         </div>
                     </div>
                     <div class="clearfix padbottom paddings">
                             <p class="fl fat" style="margin-right: 260px;">审方：</p>
                             <p class="fl fat">抓药:</p>   
                             <p class="fr fat" style="margin-right:150px;">发药:</p>
                     </div>
                     <div style="overflow: hidden;font-size: 12px;" class="paddings">
                         <p class="fl fat" style="margin-right:6px;">温馨提示:</p>                         
                             <p class="fl">1、请遵医嘱用药 <span style='width:40px;display: inline-block;'></span> 2、 因各药房药名录入规则不同，同一种药在纸质处方与电子处方的药名显示可能不同</p>
                             <p class="fl" style="margin-left:71px;">3、请将药品放置阴凉干燥处保存 <span style='width:40px;display: inline-block;'></span>  4、 本药方3日内有效</p>
                             <p class="fr" style="margin-left:20px;">第<span class="numDay"></span>张<span class="pagy"></span></p>
                     </div>
                 </div>  
             </div>
               `;
               $('body').append(paddingall);
               $('.numDay').eq(i-1).text(i);
                var page=(i-1)*42;
                 if(42*i<=pageSum){
                     var arr=medical.ordermedicines.slice(page,i*42);
                } if(i*42>pageSum&&(i-1)*42<pageSum){
                    var arr=medical.ordermedicines.slice(page,pageSum);
                    if(arr.length<=34){           
                            var last=`<p class="padbottom fat" style="height:28px; font-size:18px;">用药说明：
                            <span class="thin">共</span>
                            <span class="total"></span>
                            <span class="thin">剂，每日</span>
                            <span class="daytotal"></span>
                            <span class="thin">剂，每剂分</span>
                            <span class="number"></span>
                            <span class="thin">次服用</span>      
                            </p>
                            <p class="padbottom fat fats" style="height:70px;">医嘱: <span class="specialadvice thin"></span></p>
                            <p class="padbottom fat fats" style="text-align: right;height:38px;margin-right:30px;">医生签名：<span class="doctorname thin"></span></p>`
                            $('.last').eq(i-1).append(last);                   
                            $('.addlist').eq(i-1).css( "border-bottom","1px dashed #979797") ; 
                    }else if(arr.length==35||arr.length==36){                         
                                var last1=`<p class="padbottom fat fats" style="height:28px; font-size:18px;">用药说明：<span class="thin">共</span><span class="total thin"></span><span class="thin">剂，每日</span><span class="daytotal thin"></span><span class="thin">剂，每剂分</span><span class="number thin"></span><span class="thin">次服用</span></p>
                                     <p class="padbottom fat fats" style="height:70px;">医嘱: <span class="specialadvice thin"></span></p>
                                 `
                                $('.last').eq(i-1).append(last1);                   
                                $('.addlist').eq(i-1).css( "border-bottom","1px dashed #979797") ;    
                    }
                 }
                 if((arr.length==35||arr.length==36)&&i==pageIndex){       
                    var last=`
                        <p class="padbottom fat fats" style="text-align: right;height:38px;margin-right:30px;">医生签名：<span class="doctorname thin"></span></p>`
                     $('.last').eq(i-1).append(last); 
                 } 
                 if(arr.length>36&&i==pageIndex){        
                    var last=`<p class="padbottom fat fats" style="height:28px;font-size:18px;">用药说明：<span class="thin">共</span><span class="total"></span><span class="thin">剂，每日</span><span class="daytotal"></span><span class="thin">剂，每剂分</span><span class="number"></span><span class="thin">次服用</span></p>
                    <p class="padbottom fat fats" style="height:70px;font-size:16px;">医嘱: <span class="specialadvice thin"></span></p>
                    <p class="padbottom fat fats" style="text-align: right;height:38px;margin-right:30px;font-size:16px;">医生签名：<span class="doctorname thin"></span></p>`
                    $('.last').eq(i-1).append(last);                   
                    $('.addlist').eq(i-1).css( "border-bottom","1px dashed #979797") ; 
                 }    
                 if(i*42>pageSum&&(i-1)*42>=pageSum){
                    arr=i==pageIndex?[]:arr; 
                 }
                for(var j=0;j<arr.length;j++){
                    var li = `<li>
                            <span class='medicalName fat'>`+ arr[j].medicinename +`</span >
                            <span class='medicalSum'>`+(arr[j].dosage + arr[j].medicineunit)+`</span>
                            <span class="decoctionname">`+(arr[j].decoctionname != null?'('+arr[j].decoctionname+')':' ')+`</span>
                        </li>`; 
                    $('.addlist').eq(i-1).append(li);
                }
            }
            $('.pagy').text("("+"共"+pageIndex+"张"+")");
            $('.hostName').text(medical.brand);
            $('.dosage').text(medical.prescriptionshape); 
            $('.dosageLength').text("("+medical.ordermedicines.length+"味"+")");                         
            $('.code').text(medical.orderid);
            $('.name').text(res.orderprescriptioninfos[0].hispatientname);
            $('.paytime').text(medical.paytime==null?'':timestampToTime(medical.paytime,2));
            $('.sex').text(res.orderprescriptioninfos[0].hissex==1?'男':'女');
            $('.age').text(res.orderprescriptioninfos[0].hisage);
            $('.symptoms').text(res.orderprescriptioninfos[0].arguedisease);
            $('.tel').text(tel);
            $('.doctorconclusion').text(medical.doctorconclusion);
            $('.total').text(medical.totaldosage);
            $('.quantity').text(medical.totaldosage+'剂');
            $('.daytotal').text(medical.daydosage);
            $('.number').text(medical.taketime);
            $('.prescriptionshape').text(medical.prescriptionshape+'（请将药品放于阴凉干燥处保存）');
            // $('.specialadvice').text(medical.specialadvice);
            $('.specialadvice').text((medical.specialadvice==null?'':medical.specialadvice)+(medical.taboo==null?'':medical.taboo));
            // for(var i=0;i<medical.ordermedicines.length;i++){
            //     var li = `<li>
            //     <span class='medicalName'></span>
            //     <span class='medicalSum'></span>
            //     <span class="decoctionname"></span>
            //     </li>`;
            //     $('.addlist').append(li);
            //     $('.medicalName').eq(i).text(medical.ordermedicines[i].medicinename);
            //     $('.medicalSum').eq(i).text(medical.ordermedicines[i].dosage+medical.ordermedicines[i].medicineunit);                 
            //     if(medical.ordermedicines[i].decoctionname){
            //         $('.decoctionname').eq(i).text("("+medical.ordermedicines[i].decoctionname+")");  
            //     }else{
            //         $('.decoctionname').eq(i).text(medical.ordermedicines[i].decoctionname);   
            //     }                              
            // }
            var instructionsList = [];
            for(var i=0;i<medical.ordermedicines.length;i++){
                if(medical.ordermedicines[i].decoctionname != null && medical.ordermedicines[i].decoctionname != ''){
                    instructionsList.push(medical.ordermedicines[i].medicinename+'：'+medical.ordermedicines[i].decoctionname+'；');
                }
            }
            for(var j=0;j<instructionsList.length;j++){
                $('.instructions').append('<li style="display:inline-block;">'+instructionsList[j]+'</li>');
            }
            $('.doctorname').text(res.doctor.doctorName);
            $('.paytimes').text(medical.paytime==null?'':timestampToTime(medical.paytime,5));
            $('.telephone').text(medical.telephone == null || medical.telephone == ''?'':medical.telephone);
            if(medical.address != null && medical.address != '' && medical.address.split('$')){
                $('.address').text(medical.address.split('$')[0]);
                $('.receiver').text(medical.address.split('$')[1])
            }
        }
    },sessionId)
}
