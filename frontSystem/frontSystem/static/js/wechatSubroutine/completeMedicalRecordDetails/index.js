/**
 * Created by Girl on 2018/8/13.
 */
function query(){
    var orderID=GetQueryString("orderId");
    var sessionID=GetQueryString("sessionId");
    console.log(sessionID)
    if(sisnull(orderID)||sisnull(sessionID)){
        return;
    }

    ajax({
        url: '/api/Inquiry/orderDetails',
        type: 'post',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({orderID: orderID,getDoctor:1,isInterrogationsingle: 1,getPrescriptionOrder: 2,getPatient: 1, isaction: 1, isAccordingexchanges: 1}),
        success: function(data){
            console.log(data)
            var html = data.doctor.doctorName +'<img class="yirenzhen" width="50px" src="/static/common-image/yirenzhen@3x.png" />';
            $('#headerImg').attr('src',filefdfspath+data.doctor.doctorFace);
            $('#doctorname').html(html);
            $('#position').text(data.doctor.duties);
            $('#address').text(data.doctor.hospitaname);
            $('#patientname').text(data.patient.patientname);
            $('#sex').text(data.patient.sex==1?'男':'女');
            $('#age').text(data.ordermaintellinfo.age);
            $('#height').text(data.ordermaintellinfo.height+'cm');
            $('#weight').text(data.ordermaintellinfo.weight+'kg');
            if(data.ordermaintellinfo.symptom == null || data.ordermaintellinfo.symptom == ''){
                $('#content').text('无');
            } else{
                $('#content').text(data.ordermaintellinfo.symptom);
            }
            if(data.ordermaintellinfo.pastcase == null || data.ordermaintellinfo.pastcase == ''){
                $('#pastcase').text('无');
            }else{
                $('#pastcase').text(data.ordermaintellinfo.pastcase);
            }
            if(data.ordermaintellinfo.allergichistory == null || data.ordermaintellinfo.allergichistory == ''){
                $('#allergichistory').text('无');
            } else{
                $('#allergichistory').text(data.ordermaintellinfo.allergichistory);
            }
            if(data.orderprescriptioninfos == null || data.orderprescriptioninfos.length<1){
                $('#records').remove();
            }else{
                var html = '';
                var orders='';


                $('#records').empty();

                for(var i=0;i<data.orderprescriptioninfos.length;i++){
                    var a = '';
                    if(data.orderprescriptioninfos[i].saletype != 2){
                        a = '<span class="fl label-colors"><span class="fl subs">减</span>优惠券</span><span class="fr">暂无优惠</span>';
                    }else{
                        a = '<span class="fl label-colors "><span class="fl sub">减</span>优惠券</span><span class="fr">- ￥'+data.orderprescriptioninfos[i].saleprice+'</span>';
                    }
                    if(data.orderprescriptioninfos.length > 1){
                        orders = '<p class= "orders" style="color: #141414; font-size:16px;text-align:center; padding:20px 0; background-color: #f1f0f5"><span style="flex:1; height: 12px; margin:0 25px 10px 20px; border-bottom:solid 1px #141414; display:block;float:left" ></span>药方信息<span style="flex:1; height: 12px; margin:0 25px 10px 20px; border-bottom:solid 1px #141414; display:block;float:right" ></span></p>';
                    }
                    if(data.orderprescriptioninfos[i].taboo == null || data.orderprescriptioninfos[i].taboo == ''){
                        data.orderprescriptioninfos[i].taboo = '无'
                    }
                    var buyTime = timestampToTime(data.orderprescriptioninfos[i].buytime),
                        payTime = timestampToTime(data.orderprescriptioninfos[i].paytime),
                        newaddress = data.orderprescriptioninfos[i].address.split('$');

                    html = '<div class="dialectical">'+
                                orders +'<div class="order">'+
                                '<p class="label-colors marginbottoms">医生辩证</p>'+
                                '<p class="doctorconclusion">'+data.orderprescriptioninfos[i].doctorconclusion+'</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="prescription">'+
                                '<p class="clearfix marginbottoms"><span class="fl label-colors">药房</span><span class="fr">'+data.orderprescriptioninfos[i].hospitaName+'</span></p>'+
                                '<p class="clearfix"><span class="fl label-colors">药态</span><span class="fr">'+data.orderprescriptioninfos[i].prescriptionshape+'</span></p>'+
                            '</div>'+
                            '<div class="medication">'+
                                '<div class="marginbottom">'+
                                    '<p class="marginbottoms">R：</p>'+
                                    '<p class="border-b m-padding">'+
                                        '<span>'+data.orderprescriptioninfos[i].medicinalDetails+'</span>'+
                                    '</p>'+
                                '</div>'+
                                '<div class="marginbottom">'+
                                    '<p class="label-colors marginbottoms">用药说明</p>'+
                                    '<p class="padding-top span-style">共<span>'+data.orderprescriptioninfos[i].totaldosage+'</span>剂，每日<span>'+data.orderprescriptioninfos[i].daydosage+'</span>剂，每剂分<span>'+data.orderprescriptioninfos[i].taketime+'</span>次服用</p>'+
                                '</div>'+
                                '<div class="marginbottom">'+
                                    '<p class="label-colors marginbottoms">医嘱</p>'+
                                    '<p class="padding-top">'+data.orderprescriptioninfos[i].specialadvice+'</p>'+
                                '</div>'+
                                '<div>'+
                                    '<p class="label-colors marginbottoms">用药禁忌</p>'+
                                    '<p class="paddingall">'+data.orderprescriptioninfos[i].taboo+'</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class="delivery">'+
                                '<p class="clearfix label-colors marginbottom">配送信息</p>'+
                                '<p class="clearfix"><span class="fl label-colors marginbottom">收货人：</span><span class="fl">'+newaddress[1]+'</span><span class="fr">'+data.orderprescriptioninfos[i].telephone+'</span></p>'+
                                '<p class="clearfix"><span class="fl label-colors marginbottom">收货地址：</span><span class="fr marginbottom">'+newaddress[0]+'</span></p>'+
                                '<p class="clearfix"><span class="fl label-colors">配送方式：</span><span class="fr">￥0.00</span><p style="font-size:12px;color:#A3A3A3;padding-top:5px; text-align:right">平台推广期间免运费</p></p>'+
                            '</div>'+
                            '<div class="pay">'+
                                '<p class="clearfix marginbottom"><span class="fl label-colors">药方总价</span><span class="fr">'+data.orderprescriptioninfos[i].totalprice+'</span></p>'+
                                '<p class="clearfix marginbottom"><span class="label-colors">'+ a +'</p>'+
                                '<p class="clearfix marginbottom"><span class="fl label-colors">实付款</span><span class="fr">￥'+data.orderprescriptioninfos[i].actualprice+'</span></p>'+
                                '<p class="clearfix marginbottom"><span class="fl label-colors">订单号</span><span class="fr">'+data.orderprescriptioninfos[i].orderid+'</span></p>'+
                                '<p class="clearfix marginbottom"><span class="fl label-colors">下单时间</span><span class="fr">'+buyTime+'</span></p>'+
                                '<p class="clearfix"><span class="fl label-colors">支付时间</span><span class="fr">'+payTime+'</span></p>'+
                            '</div>';
                    $('#records').append(html);
                }
            }
        }
    },sessionID)
}
