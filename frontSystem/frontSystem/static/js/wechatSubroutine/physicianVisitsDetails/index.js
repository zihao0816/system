function created() {
    imglist = []
    function hrefObj() {
        var localhref = window.location.href;
        var localarr = localhref.split('?')[1].split('&');
        var tempObj = {};
        for (var i = 0; i < localarr.length; i++) {
            tempObj[localarr[i].split('=')[0]] = localarr[i].split('=')[1];
        }
        return tempObj;
    }
    var orderID = hrefObj().orderID;
    var sessionID = hrefObj().sessionID;
    if(sisnull(orderID)||sisnull(sessionID)){
        return;
    }
    ajax({
        type: "post",
        url: "/api/Inquiry/orderDetails",
        contentType: "application/json", //必须有
        dataType: "json", //表示返回值类型，不必须
        data: JSON.stringify({
            orderID:orderID,
            getPatient:1,
            isaction:1,
            isAccordingexchanges:1,
            isInterrogationsingle:1,
            ischecked:1
        }), 
        success: function (val) {
            // 病症主诉
            if(val.ordermaintellinfo.allergichistory == null && val.ordermaintellinfo.pastcase == null && val.ordermaintellinfo.symptom == null && val.ordermaintellinfo.allergichistory == '' && val.ordermaintellinfo.pastcase == '' && val.ordermaintellinfo.symptom == ''){
                $('#talk').css('dispaly','none');
            }
            // 问诊单
            if(val.reorderinquiryquestion == null && val.reorderinquiryquestion == ''){
                $('#inquiry').css('display','none');
            } 
            // 舌照面照
            if(val.accordingTtongue == null && val.accordingTtongue == '' && val.surfaceAccording == null && val.surfaceAccording == '' &&  val.otherdetails == null && val.otherdetails == ''){
                $('#photo').css('display','none');
            }
            
            $('#patientname').text(val.patient.patientname);
            $('#sex').text(val.patient.sex=="1"?"男":"女");
            $('#city').text(val.patient.city==''?'-':val.patient.city);
            $('#height').text(val.ordermaintellinfo.height==null?"-":val.ordermaintellinfo.height+"cm");
            $('#weight').text(val.ordermaintellinfo.weight==null?"-":val.ordermaintellinfo.weight+"kg");
            $('#age').text(val.ordermaintellinfo.age);
            $('.symptom').text(val.ordermaintellinfo.symptom);
            if(val.ordermaintellinfo.specialperiod == null || val.ordermaintellinfo.specialperiod == ''){
                val.ordermaintellinfo.specialperiod = '-';
            }else{
                val.ordermaintellinfo.specialperiod = val.ordermaintellinfo.specialperiod;
            }
            $('#specialperiod').text(val.ordermaintellinfo.specialperiod);
            if(val.ordermaintellinfo.pastcase == null || val.ordermaintellinfo.pastcase == ''){
                val.ordermaintellinfo.pastcase = '-';
            }else{
                val.ordermaintellinfo.pastcase = val.ordermaintellinfo.pastcase;
            }
            $('#pastcase').text(val.ordermaintellinfo.pastcase);
            if(val.ordermaintellinfo.allergichistory == null || val.ordermaintellinfo.allergichistory == ''){
                val.ordermaintellinfo.allergichistory = '-';
            }else{
                val.ordermaintellinfo.allergichistory = val.ordermaintellinfo.allergichistory;
            }
            $('#allergichistory').text(val.ordermaintellinfo.allergichistory);


            if(val.initialCases!=null&&val.initialCases.length>0){
                $('#initialCases').empty();
                for(var i=0;i<val.initialCases.length;i++){
                    $('#initialCases').append('<li><img class="smallimg" src="'+filefdfspath+val.initialCases[i]+'"></li><p>')
                }
            }else{
                $('.first').remove();
            }

            $('.reorderinquiryquestion').empty();
            for(var i=0;i<val.reorderinquiryquestion.length;i++){
                var html='  <li><p class="one" style="word-wrap:break-word;overflow:hidden;">'+(i+1)+'.问：'+val.reorderinquiryquestion[i].questionname+'</p><p style="word-wrap:break-word;overflow:hidden;">&ensp;&nbsp;答：'
                for(var j=0;j<val.reorderinquiryquestion[i].orderinquiryoptions.length;j++){
                    html+=val.reorderinquiryquestion[i].orderinquiryoptions[j].anwser+"  ";
                }
                html+='</p></li>';
                $('.reorderinquiryquestion').append(html);
            }
            $('.Accordingtotongueexchanges').empty();
            var imglength = val.accordingTtongue.length + val.surfaceAccording.length;
            var accordingTtonguelength = val.accordingTtongue.length;
            
            for(var i=0;i<val.accordingTtongue.length;i++){
                imglist.push(filefdfspath+val.accordingTtongue[i])
                $('.Accordingtotongueexchanges').append('<li data-original='+filefdfspath+val.accordingTtongue[i]+' ><img class="smallimg"  src="'+filefdfspath+val.accordingTtongue[i]+'"></li>')
            }
            for(var i=0;i<val.surfaceAccording.length;i++){
                imglist.push(filefdfspath+val.surfaceAccording[i])                
                $('.Accordingtotongueexchanges').append('<li data-original='+filefdfspath+val.surfaceAccording[i]+')"><img class="smallimg" src="'+filefdfspath+val.surfaceAccording[i]+'"></li>')  
            }
            $('#Accordingtotongueexchangeslength').text(imglength+"张");
            var istrue = {
                navbar : false,
                title : false,
                toolbar : true,
                tooltip : false,
                movable : false,
                zoomable : false,
                rotatable : false,
                scalable : false,
                transition : false,
                fullscreen : false,
                keyboard : false,
            }
            var viewer = new Viewer(document.getElementById('viewer'),istrue);
        }
    },sessionID);
}