function query(){
    function hrefObj() {
        　　var localhref = window.location.href;
           var localarr = localhref.split('?')[1].split('&');
           var tempObj = {};
           for (var i = 0; i < localarr.length; i++) {
           　　tempObj[localarr[i].split('=')[0]] = localarr[i].split('=')[1];
           }
          return tempObj;
        }
    var orderId = hrefObj().orderId;
    var sessionID = hrefObj().sessionId;
    ajax({
        url: '/api/Inquiry/orderDetails',
        type: 'post',
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({prescriptionOrderId:orderId,getPrescriptionOrder:1,getPatient:1,isaction:1,isAccordingexchanges:1,isInterrogationsingle:1,ischecked:1}),
        success: function(data){
            var orderprescriptioninfos = data.orderprescriptioninfos[0];
            function timestampToTime(timestamp) {
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '年';
                var M = date.getMonth()+1 + '月'
                var D = date.getDate() + '日';
                var h = date.getHours() + ':';
                var m = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
                var s = date.getSeconds();
                return Y+M+D+'     '+h+m;
            }
            $('#navdd').text(orderprescriptioninfos.orderid);
            $('#buytime').text(timestampToTime(data.orderprescriptioninfos[0].buytime)+'    '+'开方');
            if(data.patient.patientname != ""){
                $('#docname').text(data.patient.patientname);
            }else{
                $('#docname').text(data.patient.patientnickname);
            }
            $("#userimg").attr("src",data.patient.headphoto);
            $('#sex').text(data.patient.sex==1?"男":"女");
            $('#year').text(data.ordermaintellinfo.age !=null?data.ordermaintellinfo.age:"-");
            $('#urls').text(data.patient.city!=null?data.patient.city:"-");
            $('#diatitle').text(orderprescriptioninfos.arguedisease+'；'+orderprescriptioninfos.doctorconclusion);
            $('#prescriptionshape').text(orderprescriptioninfos.prescriptionshape);
            $('#hospitaName').text(orderprescriptioninfos.brand);
            var medicinalDetails = orderprescriptioninfos.medicinalDetails.split('，')
            for(var i in medicinalDetails){
                if(orderprescriptioninfos.ordermedicines[i].decoctionid != null){
                    var str = "("+orderprescriptioninfos.ordermedicines[i].decoctionname+")";
                    medicinalDetails[i]+=str;
                }
                var strlist = ''
            }
            $('#MedicinalDetails').text(medicinalDetails.join(' '));
            $('.totaldosage').text(orderprescriptioninfos.totaldosage);
            $('#daydosage').text(orderprescriptioninfos.daydosage);
            $('#taketime').text(orderprescriptioninfos.taketime);
            $('#price').text(orderprescriptioninfos.price);
            $('#totalprice').text(orderprescriptioninfos.totalprice);
            $('#costprice').text(orderprescriptioninfos.costprice);
            $('#doctorprice').text(orderprescriptioninfos.doctorprice);
            $('#quantity').text(orderprescriptioninfos.quantity);
            $('#isprescription').text(orderprescriptioninfos.isprescription != 2?"可看":"不可看");
            
        },error(){
            console,log(err);
        }
        
    },sessionID)
}