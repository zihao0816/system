/**
 * Created by Girl on 2018/7/18.
 */
;var ObjorderIndex = function(){
        //全局变量
        var orderList = '';
        function printHealth(id){
            window.open('/downloadTemplate?prescriptionOrderId='+id)
        };
        function dispatchfn(obj){
            console.log(obj);
            var datas = {'parameters':obj.id,'status':obj.status};
            ajax({
                "type" : 'post',
                "url" : '/api/orderinfo/upDispatch',
                "dataType" : "json",
                "contentType":"application/json",
                "data" : JSON.stringify(datas),
                "success" : function(data) { 
                   console.log(data);                  
                        $("#tbOrderList").DataTable().ajax.reload(); 
                }
            });
        };
        //定义对象
        var obj = new Object();
        obj.ID = '';
        
        obj.html_dialog_selectUpdatePrescription='';
        obj.html_dialog_selectUpdatePrescription= prescription;
    
        obj.html_dialog_selectUpdateInquiry='';
        obj.html_dialog_selectUpdateInquiry= inquiry;
    
        obj.html_dialog_selectUpdateIengthen='';
        obj.html_dialog_selectUpdateIengthen= lengthen;
        // $('#selectInquiry .container').remove();
        obj.init = function(id){	//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
    
        var details = {};//记录订单详情
    
        var tbOrderList = $('#tbOrderList').DataTable({
            "bServerSide" : true,
            'bAutoWidth':false,//自动宽度
            "dom": 'rt<"bottom"flpi><"clear">',
            // "sAjaxSource":'/api/orderinfo/queryOrderList',
            "sAjaxSource":'/api/orderinfo/queryOrderListup',//新接口
            "fnServerData" : function(sSource, aoData, fnCallback) {
                // console.log(sSource);
                //表格参数
                var dataTablesParam = function(condition, param) {
                    // console.log(condition);
                    this.condition = condition;
                    this.param =  param;
                };
                //查询实体
                var UserInfo = function() {
                    this.ordercode=$("#ordercode").val();
                    this.doctorname=$("#doctorname").val();
                    this.patientname=$("#patientname").val();
                    this.serviceid=$("#serviceid").val();
                    this.dispatch=$("#dispatch").val();
                    this.paystate=$("#paystate").val();
                    this.hospitaname=$("#hospital").val();
                    this.department=$("#class").val();
                    this.starttime=$("#confirmtimestart").val();
                    this.endtime=$("#confirmtimeend").val();
                };
            //    console.log(new UserInfo());
                var temp = new dataTablesParam(new UserInfo(), JSON.stringify(aoData));   
                console.log(JSON.stringify(aoData)); 
                ajax({
                    "type" : 'post',
                    "url" : sSource,
                    "dataType" : "json",
                    "data" : {
                        aoData : JSON.stringify(temp)
                    },
                    "success" : function(resp) {
                        // console.log(resp);
                        fnCallback(resp);
                    }
                });
            },
            "bSort":false,
            filter:false,
            "oLanguage": {
                "sLengthMenu": "每页显示 _MENU_条",
                "sZeroRecords": "没有找到符合条件的数据",
                "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
                "sInfo": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条",
                "sInfoEmpty": "没有记录",
                "sInfoFiltered": "(从 _MAX_ 页记录中过滤)",
                "sSearch": "搜索：",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                }
            },
            "fnRowCallback" : function(nRow, data, iDisplayIndex) {  
            },
    
            "aLengthMenu":[10, 25, 50, 100],
            "aoColumns" : [
                //下单时间
                {"data" : "buytime", "defaultContent": "",
                    "render": function (data, type,row) {
                        data = timestampToTime(row.buytime);
                        return data;
                    }
                },
                //医生信息
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        data = '<div class="doctorinfo">'+
                                '<span>'+ row.doctorname +'</span>'+
                                '<span>'+ row.department+'</span>'+
                                '<span>'+ row.hospitaname +'</span>'+
                                '</div>';
                        return data;
                    }
                },
                //患者信息
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        data = '<div class="doctorinfo">'+
                                '<span>'+ row.patientname +'</span>'+
                                '<span>微信昵称：'+ row.patientnickname+'</span>'+
                                '</div>';
                        return data;
                    }
                },
                //订单列表
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        // console.log(row);
                        var paystate = '';
                        if(row.paystate == 1 && row.orderstate != 4){
                            paystate = '<span class="not">待支付</span>';
                        }else if(row.paystate == 2){
                            paystate = '<span class="pay">已支付</span>';
                        }else if(row.orderstate == 4){
                            paystate = '<span>已取消</span>';
                        }
                        var time = timestampToTime(row.buytime);
                        var totalprice = row.totalprice;
                        if(totalprice>0){
                            totalprice = totalprice.toFixed(2);
                        }else{
                            totalprice = 0;
                        }
                        var saleprice = row.saleprice;
                        if(saleprice>0){
                            saleprice = row.saleprice.toFixed(2);
                        }else{
                            saleprice = 0;
                        }
                        var wzinfo = '<div class="yflist">'+
                                        '<span>在线问诊------¥'+ totalprice +'（优惠金额：-¥'+ saleprice +'）</span>'+
                                        '<span>订单号：'+ row.ordercode +'</span>'+
                                        '<div>'+
                                        '<span>下单时间：'+ time +'</span>'+
                                            paystate+
                                        '</div>'+
                                    '</div>';
                        var yfinfo = '';
                        var yfinfolist = row.orderprescriptioninfo;
                        for(var i=0;i<yfinfolist.length;i++){
                            if(yfinfolist[i].paystate == 1 && yfinfolist[i].orderstate != 4){
                                paystate = '<span class="not">待支付</span>';
                                var dispatch="";
                            }else if(yfinfolist[i].paystate == 2){
                                paystate = '<span class="pay fr">已支付</span><span data-id="'+ yfinfolist[i].id +'" class="printOrder fr" id="printOrder">打印调理单</span>';
                                 //发货 
                                if(yfinfolist[i].dispatch == 0){
                                    var dispatch = '<span data-dispatch="'+ yfinfolist[i].dispatch +'" data-id="'+ yfinfolist[i].id +'" class="notdis" style="color:red;text-indent:2px;">未发货</span>';                             
                                }else{
                                    // console.log(123456);
                                    var dispatch = '<span data-dispatch="'+ yfinfolist[i].dispatch +'" data-id="'+ yfinfolist[i].id+'" class="notdis" style="color:#377d22;text-indent:2px; data-dispatch="'+ yfinfolist[i].dispatch+'">已发货</span>'; 
                                }  
                            }else if(yfinfolist[i].orderstate == 4){
                                paystate = '<span>已取消</span>';
                            }
                            var time = timestampToTime(yfinfolist[i].buytime);
                            //药方订单金额处理
                            var totalprice = yfinfolist[i].totalprice;
                            if(totalprice>0){
                                totalprice = totalprice.toFixed(2);
                            }else{
                                totalprice = 0;
                            }
                            var saleprice = yfinfolist[i].saleprice;
                            if(saleprice>0){
                                saleprice = saleprice.toFixed(2);
                            }else{
                                saleprice = 0;
                            }
                            yfinfo += '<div class="yflist">'+
                                            '<span>药方订单------¥'+ totalprice +'（优惠金额：-¥'+ saleprice +'）</span>'+
                                            '<span>订单号：'+ yfinfolist[i].orderid +'</span>'+
                                            '<div>'+
                                            '<span>下单时间：'+ time +'</span>'+
                                            paystate+
                                            dispatch+
                                            '</div>'+
                                        '</div>';
                        }
                        data = wzinfo + yfinfo;
                        return data;
                        //修改发货状态
                    }
                },
                //医生收益
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        var doctorprice = row.doctorprice;
                            if(doctorprice>0){
                                doctorprice = doctorprice.toFixed(2);
                            }else{
                                doctorprice = 0;
                            }
                            var wzsum = '<span>'+doctorprice+'</span>';

                            var box = '';
                            var yfinfolist = row.orderprescriptioninfo;
                            var span = '';
                            var yfsum = 0;
                            for(var i=0;i<yfinfolist.length;i++){
                                if(yfinfolist[i].paystate == 2){
                                    if(yfinfolist[i].doctorprice){
                                        if(yfinfolist[i].doctorprice>0){
                                            yfsum = yfinfolist[i].doctorprice.toFixed(2);
                                        }
                                        span = '<span>'+ yfsum +'</span>';
                                    }else{
                                        span = '<span></span>';
                                    }
                                }else{
                                    span = '<span></span>';
                                }
                                box += span;
                            }
                            data = wzsum + box;
                            return data;
                    }
                },
                //平台收益
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        var platformprice = row.platformprice;
                        if(platformprice>0){
                            platformprice = platformprice.toFixed(2);
                        }
                        var wzsum = '<span>'+ platformprice +'</span>';
                        

                        var box = '';
                        var yfinfolist = row.orderprescriptioninfo;
                        var ptsum = 0;
                        for(var i=0;i<yfinfolist.length;i++){
                            if(yfinfolist[i].paystate == 2){
                                if(yfinfolist[i].platformprice){
                                    if(yfinfolist[i].platformprice>0){
                                        ptsum = yfinfolist[i].platformprice.toFixed(2);
                                    }
                                    span = '<span>'+ ptsum +'</span>';
                                }else{
                                    span = '<span></span>';
                                }
                            }else{
                                span = '<span></span>';
                            }
                            box += span;
                        }




                        // var yfsum = 0;
                        // var yfinfolist = row.orderprescriptioninfo;
                        // for(var i=0;i<yfinfolist.length;i++){
                        //     if(yfinfolist[i].platformprice){
                        //         yfsum += yfinfolist[i].platformprice;
                        //     }
                        // }
                        // if(yfsum>0){
                        //     yfsum = yfsum.toFixed(2);
                        // }
                        // //判断是否有药方
                        // if(yfinfolist.length != 0){
                        //     data = wzsum + '<span class="special">'+ yfsum +'</span>';
                        // }else{
                        //     data = wzsum;
                        // }
                        data = wzsum + box;
                        return data;
                    }
                },
                //合计
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        //合集金额处理
                        var actualpricesum = row.actualpricesum;
                        if(actualpricesum>0){
                            actualpricesum = actualpricesum.toFixed(2);
                        }else{
                            actualpricesum = 0;
                        }
                        var doctorpricesum = row.doctorpricesum;
                        if(doctorpricesum>0){
                            doctorpricesum = doctorpricesum.toFixed(2);
                        }else{
                            doctorpricesum = 0;
                        }
                        var platformpricesum = row.platformpricesum;
                        if(platformpricesum>0){
                            platformpricesum = platformpricesum.toFixed(2);
                        }else{
                            platformpricesum = 0;
                        }
                        var salepricesum = row.salepricesum;
                        if(salepricesum>0){
                            salepricesum = salepricesum.toFixed(2);
                        }else{
                            salepricesum = 0;
                        }
                        data = '<div class="total">'+
                                '<span>患者总付款：¥'+ actualpricesum +'</span>'+
                                '<span>医生总收益：¥'+ doctorpricesum +'</span>'+
                                '<span>平台总收益：¥'+ platformpricesum +'</span>'+
                                '<span>优惠总金额：-¥'+ salepricesum +'</span>'+
                                '</div>'
                        return data;
                    }
                },
                {"data" : "", "defaultContent": "",
                    "render": function (data, type,row) {
                        data = '<a id="seeOrder">查看详情</a>';
                        return data;
                    }
                },
            ]
        });
       
        function loadshowdata(orderList,type){
            var lasttimeshow="";
            if("1"==orderList.ordertype&&"2"!=orderList.orderstate)
            {
                lasttimeshow="00小时00分钟";
            }
            else if("2"==orderList.ordertype&&"1"!=orderList.paystate)
            {
                lasttimeshow="00小时00分钟";
            }
            else
            {
                if(orderList.remaintime==null||orderList.remaintime=='')
                {
                    lasttimeshow = "00小时00分钟";
                }
                var servicetime=orderList.servicetime;
                var remaintime=orderList.remaintime;
                var addtime=orderList.addtime;
                var lasttime=servicetime*60+addtime*60-remaintime*1;
                var hour=Math.floor(lasttime/60);
                var minute=lasttime%60;
                lasttimeshow=hour+"小时"+minute+"分钟";
            }
            var servicename="";
            if ("1"==orderList.serviceid)
            {
                servicename="图文复诊";
            }
            else if ("2"==orderList.serviceid)
            {
                servicename="在线复诊";
            }
            else if ("3"==orderList.serviceid)
            {
                servicename="图文咨询";
            }
            else if ("4"==orderList.serviceid)
            {
                servicename="电话咨询";
            }
            else if ("5"==orderList.serviceid)
            {
                servicename="药方";
            }
            $("#"+type+"_ordercode").text(orderList.ordercode);
            $("#"+type+"_buytime").text(timestampToTime(orderList.buytime));
            $("#"+type+"_doctorname").text(orderList.doctorname);
            $("#"+type+"_patientname").text(orderList.patientname);
            $("#"+type+"_servicename").text(servicename);
            $("#"+type+"_orderprice").text("￥"+numberFormat(orderList.totalprice.toFixed(2),2));
            $("#"+type+"_lasttime").text(lasttimeshow);
            $("#"+type+"_totalprice").text("￥"+numberFormat(orderList.totalprice.toFixed(2),2));
            $("#"+type+"_paytime").text(timestampToTime(orderList.paytime));
            
            if(orderList.paystate=="1")
            {
                $("#"+type+"_paystate").text("待支付");
            }
            else if(orderList.paystate=="2")
            {
                $("#"+type+"_paystate").text("已支付");
            }
            else if(orderList.paystate=="3"||orderList.paystate=="4")
            {
                $("#"+type+"_paystate").text("已取消");
            }
            
            $("#"+type+"_lasttime2").text(lasttimeshow);

            if(orderList.address&&orderList.address.indexOf("$")!=-1)
            {
                var address=orderList.address.split("$");
                if(address[0]!=null&&address[0]!='')
                {
                    $("#"+type+"_address").text(address[0]);
                }
                if(address[1]!=null&&address[1]!='')
                {
                    $("#"+type+"_receiver").text(address[1]);
                }
            }
            else
            {
                $("#"+type+"_address").text(orderList.address);
            }
            
            $("#"+type+"_prescriptionname").text(orderList.prescriptionname);
            $("#"+type+"_telephone").text(orderList.telephone);
            $("#"+type+"_totaldosage").text(numberFormat(orderList.totaldosage,0));
            $("#"+type+"_daydosage").text(numberFormat(orderList.daydosage,0));
            $("#"+type+"_taketime").text(numberFormat(orderList.taketime,0));
            $("#"+type+"_prescriptionshape").text(orderList.prescriptionshape);
            $("#"+type+"_specialadvice").text(orderList.specialadvice);
            $("#"+type+"_taboo").text(orderList.taboo);
            $("#"+type+"_sendcompany").text(orderList.sendcompany);
        }
            
        //加载订单药材
        function loadMedicine(_ordercode){
            var conditionobj={"orderprescription":_ordercode};
            ajax({
                "type" : 'post',
                "url" : '/api/ordermedicine/getListByKey',
                "dataType" : "json",
                "contentType":"application/json",
                "data" : JSON.stringify(conditionobj),
                "success" : function(data) {
                    var medicines="";
                    var medicineList = [];
                        for(var i=0;i<data.length;i++)
                    {
                        var obj = data[i];
                        medicines+="<li>"+obj.medicinename+"&emsp;"+obj.dosage+"g</li>";
                        if(data[i].decoctionname && data[i].decoctionname != null && data[i].decoctionname != ''){
                            medicineList.push(data[i].medicinename+'：'+data[i].decoctionname+'；');
                        }
                    }
                    $("#p_medicines").html(medicines);
                    for(var j=0;j<medicineList.length;j++){
                        $('.medicinelist').append('<li style="display:inline-block;margin-bottom:0;">'+medicineList[j]+'</li>')
                    }
                }
            });
        }



        //查看订单详情
        $('#tbOrderList tbody').on('click','a#seeOrder',function(){
            orderList = $('#tbOrderList').DataTable().row($(this).parents('tr')).data();
            getOrderdetail(orderList);
        });
        };
        
        //渲染订单详情
        function getOrderdetail(orderList){
            var details = '';
            var datas = {'parameters': orderList.id};
                ajax({
                    "type" : 'post',
                    "url" : '/api/orderinfo/getOrderdetail',
                    "dataType" : "json",
                    "contentType":"application/json",
                    "data" : JSON.stringify(datas),
                    "success" : function(data) {
                        var yfarr = data.orderprescriptioninfo;//药方详情
                        var yfdetails = '';//药材详情
                        var serve = ''//延长服务按钮
                        
                        if(yfarr){
                            for(var i=0; i<yfarr.length; i++){
                                //药材处理
                                var medicine = '';
                                var specification = '';
                                var mode = '';//煎药说明
                                for(var j=0; j<yfarr[i].medicinalMaterials.length;j++){
                                    if(yfarr[i].medicinalMaterials[j].specification){
                                        specification = '('+ yfarr[i].medicinalMaterials[j].specification +')';
                                    }
                                    if(yfarr[i].medicinalMaterials[j].medicinename != undefined){
                                        medicine +=  '<span>'+ yfarr[i].medicinalMaterials[j].medicinename +''+ yfarr[i].medicinalMaterials[j].dosage + yfarr[i].medicinalMaterials[j].medicineunit+specification+'</span>';
                                    }
                                    if(yfarr[i].medicinalMaterials[j].decoctionid){
                                        mode += yfarr[i].medicinalMaterials[j].medicinename +'('+ yfarr[i].medicinalMaterials[j].decoctionname +')&nbsp;&nbsp;&nbsp;&nbsp;';
                                    }
                                }
                                //收货地址处理
                                var address = yfarr[i].address;
                                var overaddress = '';
                                var overname = '';
                                if(address){
                                    var eq = address.indexOf('$');
                                    var total = address.length;
                                        overaddress = address.substring(0,eq);
                                        overname = address.substring(eq+1,total);
                                }
                                //处理操作按钮
                                var paystate = yfarr[i].paystate;//支付状态1待支付2已支付3取消
                                var orderstate = yfarr[i].orderstate;//订单状态
                                var printOrder = '';//打印调理单按钮
                                var state = '';
                                var patch = '';
                                if(paystate == 1 && orderstate != 4){
                                    state = '<span class="fr" class="state" data-id="'+ yfarr[i].id +'" style="color:#ec3923">待支付</span>';
                                }else if(paystate == 2){
                                    state = '<span class="fr" class="state" style="color:#377d22">已支付</span>';
                                }else if(orderstate == 4){
                                    state = '<span class="fr" class="state" style="color:#ccc">已取消</span>';
                                }
                                
    
                                //计算服务剩余时间
                                var lasttime = '';
                                var hours = '';
                                var minutes = '';
                                var newtime = yfarr[i].servicetime * 60 * 60 * 1000 + yfarr[i].buytime;
                                var oldtime = new Date();
                                    lasttime = newtime - oldtime.getTime();
                                    hours = parseInt((lasttime / (1000 * 60 * 60)));
                                    minutes = parseInt((parseFloat(lasttime / (1000 * 60 * 60)) - parseInt(lasttime / (1000 * 60 * 60))) * 60);
                                
                                //剩余时间文案
                                var sysj = hours +'时'+ minutes +'分';

                                var pay = '';//延长支付按钮
                                var cancel = '';//取消订单按钮
                                if(paystate == 1 && orderstate != 4){
                                    cancel = '<button data-id="'+ yfarr[i].id +'" class="prints">取消订单</button>';
                                    pay = '<button data-id="'+ yfarr[i].id +'" data-hours="'+hours+'" data-minutes="'+minutes+'" data-code="'+yfarr[i].ordercode+'" data-serviceId="'+orderList.serviceid+'" class="lengthen" data-type="yf">延长支付时间</button>';
                                }
                                if(paystate == 2){
                                    printOrder = '<button data-id="'+ yfarr[i].id +'" class="printOrder">打印调理单</button>';
                                }
    
                                //药方详情list
                                var time = timestampToTime(yfarr[i].buytime);
                                //涉及金额保留两位小数点
                                var saleprice = parseFloat(yfarr[i].saleprice);
                                var totalprice = parseFloat(yfarr[i].totalprice);
                                var actualprice = parseFloat(yfarr[i].actualprice);

                                //药方的患者实付款
                                var yfactualprice = '';
                                if(paystate == 1 && orderstate != 4){
                                    yfactualprice = '<span>待付款</span>';
                                }else{
                                    yfactualprice = actualprice;
                                }
                                

                                //特殊医嘱
                                var specialadvice = yfarr[i].specialadvice;
                                if(!yfarr[i].specialadvice || yfarr[i].specialadvice == null || yfarr[i].specialadvice == '' || yfarr[i].specialadvice == undefined){
                                    specialadvice = ''
                                }
                                //用药禁忌
                                var taboo = yfarr[i].taboo;
                                if(!yfarr[i].taboo || yfarr[i].taboo == null || yfarr[i].taboo == '' || yfarr[i].taboo == undefined){
                                    taboo = ''
                                }

                                //联系方式
                                var phone = ''
                                if(yfarr[i].telephone){
                                    phone = yfarr[i].telephone;
                                }

                                yfdetails += '<h3><span class="fl">药方订单：'+ yfarr[i].orderid +'</span><span class="fl time">下单时间：'+ time +'</span>'+ state +'</h3>'+
                                                '<div class="yforder">'+
                                                    '<div class="yfinfo">'+
                                                        '<table>'+
                                                            '<tr>'+
                                                                '<td><span>问诊类型：</td>'+
                                                                '<td align="right">药方</td>'+
                                                                '<td><span>待煎费：</span></td>'+
                                                                '<td align="right">¥0</td>'+
                                                                '<td><span>优惠券：</span></td>'+
                                                                '<td align="right">¥'+ saleprice +'</td>'+
                                                            '</tr>'+
                                                            '<tr>'+
                                                                '<td><span>药方价格：</span></td>'+
                                                                '<td align="right">¥'+ totalprice +'</td>'+
                                                                '<td><span>运费：</span></td>'+
                                                                '<td align="right">¥0</td>'+
                                                                '<td><span>总计：</span></td>'+
                                                                '<td align="right">¥'+ actualprice +'</td>'+
                                                            '</tr>'+
                                                        '</table>'+
                                                        '<table>'+
                                                            '<tr>'+
                                                                '<td><span>收货人：</span></td>'+
                                                                '<td align="right">'+ overname +'</td>'+
                                                                '<td><span>联系方式：</span></td>'+
                                                                '<td align="right">'+ phone +'</td>'+
                                                                '<td><span>配送方式：</span></td>'+
                                                                '<td align="right"></td>'+
                                                            '</tr>'+
                                                            '<tr>'+
                                                                '<td colspan="6"><span>收货地址:</span>'+ overaddress +'</td>'+
                                                            '</tr>'+
                                                            '<tr>'+
                                                                '<td><span>药房：</span></td>'+
                                                                '<td align="right">'+ yfarr[i].hospita +'</td>'+
                                                                '<td><span>剂型：</span></td>'+
                                                                '<td align="right">'+ yfarr[i].prescriptionshape +'   '+ yfarr[i].brand +'</td>'+
                                                            '</tr>'+
                                                        '</table>'+
                                                        '<div class="yinfodDetail">'+
                                                        '<h3>R:</h3>'+
                                                        '<div class="medicine">'+
                                                            medicine+
                                                        '</div>'+
                                                        '<div class="explain">'+
                                                            '<span>用药说明：共'+ yfarr[i].totaldosage +'剂，每日'+ yfarr[i].daydosage +'剂，每剂分'+ yfarr[i].taketime +'次服用；&nbsp&nbsp&nbsp&nbsp&nbsp药态：'+ yfarr[i].prescriptionshape +'</span>'+
                                                            '<span>特殊医嘱：'+ specialadvice +'</span>'+
                                                            '<span>用药禁忌：'+ taboo +'</span>'+
                                                            '<span>煎药说明：'+ mode +'</span>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<table class="paytable">'+
                                                        '<tr>'+
                                                            '<td><span>支付剩余时间：</span></td>'+
                                                            '<td align="right">'+ sysj +'</td>'+
                                                            '<td><span>患者实付款：</span></td>'+
                                                            '<td align="right">'+ yfactualprice +'</td>'+
                                                        '</tr>'+
                                                    '</table>'+
                                                    '<div class="handle">'+
                                                        pay+
                                                        cancel+
                                                        printOrder+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>';
                            }
                        }else{
                            yfdetails = '暂无药方';
                        }
                        //订单详情
                        var time = timestampToTime(orderList.buytime);
                        //金额的处理
                        //患者总付款
                        var actualpricesum = orderList.actualpricesum;
                        if(actualpricesum>0){
                            actualpricesum = actualpricesum.toFixed(2);
                        }
                        //医生收益
                        var doctorprice = orderList.doctorprice;
                        if(doctorprice>0){
                            doctorprice = doctorprice.toFixed(2);
                        }
                        //医生总收益
                        var doctorpricesum = orderList.doctorpricesum;
                        if(doctorpricesum>0){
                            doctorpricesum = doctorpricesum.toFixed(2);
                        }
                        //平台总收益
                        var platformpricesum = orderList.platformpricesum;
                        if(platformpricesum>0){
                            platformpricesum = platformpricesum.toFixed(2);
                        }else{
                            platformpricesum = 0;
                        }
                        //患者实付款
                        var actualpricesum = orderList.actualpricesum;
                        if(actualpricesum>0){
                            actualpricesum = actualpricesum.toFixed(2);
                        }
                        //总计
                        var actualpricesum = orderList.actualpricesum;
                        if(actualpricesum>0){
                            actualpricesum = actualpricesum.toFixed(2)
                        }
                        //问诊费用
                        var totalprice = orderList.totalprice;
                        if(totalprice>0){
                            totalprice = totalprice.toFixed(2);
                        }
                        var saleprice = orderList.saleprice;
                        if(saleprice>0){
                            saleprice = saleprice.toFixed(2);
                        }

                        //服务是否过期处理
                        var lasttime = '';
                        var hours = '';
                        var minutes = '';
                        var newtime = data.servicetime * 60 * 60 * 1000 + data.buytime;
                        var oldtime = new Date();
                            lasttime = newtime - oldtime.getTime();
                            hours = parseInt((lasttime / (1000 * 60 * 60)));
                            minutes = parseInt((parseFloat(lasttime / (1000 * 60 * 60)) - parseInt(lasttime / (1000 * 60 * 60))) * 60);

                        if(hours != 0 || minutes != 0){
                            serve = '<button data-id="'+ orderList.id +'" data-hours="'+hours+'" data-minutes="'+minutes+'" data-code="'+orderList.ordercode+'" data-serviceId="'+orderList.serviceid+'" class="lengthen" data-type="fw">延长服务时间</button>';    
                        }
                        var chatting = '<button class="checkMessage" data-id="'+ orderList.id +'" data-doctorid="'+ orderList.doctorid +'" data-patientid="'+ data.patientid +'">查看聊天记录</button>';
                        //剩余时间文案
                        var sysj = hours +'时'+ minutes +'分';

                        details =   '<div class="orderDetails">'+
                                            '<h3><span class="fl">问诊订单：'+ orderList.ordercode +'</span><span class="fr time">下单时间：'+ time +'</span></h3>'+
                                            '<div class="patient">'+
                                                '<div class="patientinfo">'+
                                                    '<div class="photo">'+
                                                        '<img src="'+ data.headphoto +'">'+
                                                    '</div>'+
                                                    '<div class="info">'+
                                                        '<span>'+ orderList.patientname +'</span>'+
                                                        '<span>微信昵称：'+ orderList.patientnickname +'</span>'+
                                                    '</div>'+
                                                    '<div class="sum">'+
                                                        '<span>¥'+ actualpricesum +'</span>'+
                                                        '<span>患者总付款</span>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="patientinfo">'+
                                                    '<div class="photo">'+
                                                        '<img src="https://service.51bjhzy.com/'+ data.yheadphoto +'">'+
                                                    '</div>'+
                                                    '<div class="info">'+
                                                        '<span>'+ orderList.doctorname +'</span>'+
                                                        '<span>'+ orderList.department +'</span>'+
                                                        '<span>'+ orderList.hospitaname +'</span>'+
                                                    '</div>'+
                                                    '<div class="sum">'+
                                                        '<span>¥'+ doctorpricesum +'</span>'+
                                                        '<span>医生总收益</span>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="patientinfo">'+
                                                    '<div class="sum">'+
                                                        '<span>¥'+ platformpricesum +'</span>'+
                                                        '<span>平台总收益</span>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="wzinfo">'+
                                                '<table>'+
                                                    '<tr>'+
                                                        '<td><span>问诊类型：</span></td>'+
                                                        '<td align="right">在线问诊</td>'+
                                                        '<td><span>优惠券：</span></td>'+
                                                        '<td align="right">¥'+ saleprice +'</td>'+
                                                    '</tr>'+
                                                    '<tr>'+
                                                        '<td><span>问诊费用：</span></td>'+
                                                        '<td align="right">¥'+ totalprice +'</td>'+
                                                        '<td><span>患者应付款：</span></td>'+
                                                        '<td align="right">¥'+ actualpricesum +'</td>'+
                                                    '</tr>'+
                                                '</table>'+
                                                '<table>'+
                                                    '<tr>'+
                                                        '<td><span>服务剩余时间：</span></td>'+
                                                        '<td align="right">'+ sysj +'</td>'+
                                                        '<td><span>患者实付款：</span></td>'+
                                                        '<td align="right">¥'+ actualpricesum +'</td>'+
                                                    '</tr>'+
                                                    '<tr>'+
                                                        '<td><span>支付时间：</span></td>'+
                                                        '<td align="right" colspan="3">'+ time +'</td>'+
                                                    '</tr>'+
                                                '</table>'+
                                            '</div>'+
                                            '<div class="handle">'+
                                                serve+
                                                chatting+
                                            '</div>'+
                                            yfdetails +
                                        '</div>';
                        obj.$currentDlg = bootbox.dialog({
                            title: "查看问诊订单",
                            size: 'large',
                            className: 'select-maxsize',
                            message: details
                        });
                        
                        //打印调理单
                        $('.printOrder').click(function(){
                            var id = $(this).attr('data-id');
                            printHealth(id);
                        });

                       
                        // $('.notdis').click(function(){
                        //     console.log(1234);
                        //     var id = $(this).attr('data-id');
                        //     printHealth(id);
                        // });
    
                        //取消操作
                        $('.prints').click(function(){
                            var id = $(this).attr('data-id');
                            cancelOrder(id);
                        });
                        //延长服务
                        $('.lengthen').click(function(){
                            var id = $(this).attr('data-id');
                            var serviceId = $(this).attr('data-serviceId');
                            var code = $(this).attr('data-code');
                            var type = $(this).attr('data-type');
                            var minutes = $(this).attr('data-minutes');
                            var hours = $(this).attr('data-hours');
                            var title = '';
                            if(type == 'fw'){
                                title = '延长服务时间';
                            }else{
                                title = '延长支付时间';
                            }
                            getlengthen(id,serviceId,code,type,title,minutes,hours);
                        });
                        //查看聊天记录
                        $('.checkMessage').click(function(){
                            var doctorid = $(this).attr('data-doctorid');
                            var patientid = $(this).attr('data-patientid');
                            var id = $(this).attr('data-id');
                            checkMessage(doctorid,patientid,id);
                        });
                    }
                });
        }


        $('#tbOrderList tbody').on('click','.notdis',function(){
            var id = $(this).attr('data-id');
            var status=$(this).attr('data-dispatch');
            if(status==1){
                status='0'; 
            }else{
                status='1';  
            }
            var obj={};
            obj.id=id;
            obj.status=status;
            dispatchfn(obj);
        });

        //取消订单
        function cancelOrder(id){
            obj.$currentDlg = bootbox.dialog({
                title: "取消订单",
                size: 'large',
                className: 'select-size',
                message: '<div>确定要取消该订单？</div>',
                buttons:{
                    success: {
                        label: "确定",
                        className: "btn-success btn-import{0} savebtn".format(obj.ID),
                        callback: function () {
                            doAjax("/api/orderprescriptioninfo/cancelorder", "post",{id:id,orderstate:4},
                            function (res) {
                                    bootbox.hideAll();
                                    getOrderdetail(orderList);
                                    $("#tbOrderList").DataTable().ajax.reload(); 
                            }, null, false);
                        }
                    },
                    caner: {
                        label: "取消",
                        className: "btn-default",
                        callback: function () {
                        }
                    }
                }
            });
            
        };

        //查看聊天记录
        function checkMessage(doctorid,patientid,id){
            obj.$currentDlg = bootbox.dialog({
                title: "查看问诊记录",
                size: 'large',
                className: 'select-size',
                message: obj.html_dialog_selectUpdateInquiry
            });
            // var nowpage=0;
            loadchatmessage(doctorid,patientid,id);
            // nowpage++;
        }
        
        //延长服务时间
        function getlengthen(id,serviceId,code,type,title,minutes,hours){
            obj.$currentDlg = bootbox.dialog({
                title: title,
                size: 'large',
                className: 'select-size',
                message: obj.html_dialog_selectUpdateIengthen,
                buttons: {
                    success: {
                        label: "保存",
                        className: "btn-success btn-import{0} savebtn".format(obj.ID),
                        callback: function () {
                            var addtime=$("#orderAddTime").text();
                            $(".savebtn").attr("disabled", true);
                            var data = {};
                            if(type == 'fw'){
                                data = {
                                    "orderid": id,
                                    "createby": code+","+serviceId,//暂用创建人代替
                                    "addtime": addtime
                                };
                            }else{
                                data = {
                                    "orderid": id,
                                    "addtime": addtime
                                };
                            }
                            var result = doAjax("/api/orderaddtimeinfo/insertComplete", "post", data,['#tbOrderList'], function(){
                                bootbox.hideAll();
                                getOrderdetail(orderList);
                            }, null, false);
                        return result;
                        }
                    },
                    caner: {
                        label: "取消",
                        className: "btn-default savebtn",
                        callback: function () {
                        }
                    }
                }
            });
            
            var newTime=0;
            $("#orderminusbtn").click(function(){
                var orderAddTime=$("#orderAddTime").text();
                if(orderAddTime==1)
                {
                    return false;
                }
                $("#orderAddTime").text(orderAddTime*1-1);
                var a = $("#orderAddTime").text()
                newTime = hours*1-a*1;
                $('#i_lasttime2').text((newTime+1) + '时' + minutes + '分')
            });
            $("#orderaddbtn").click(function(){
                var orderAddTime=$("#orderAddTime").text();
                $("#orderAddTime").text(orderAddTime*1+1)
                var a = $("#orderAddTime").text()
                newTime = hours*1+a*1;
                $('#i_lasttime2').text(newTime + '时' + minutes + '分')
            });
            $('#i_lasttime2').text(hours + '时' + minutes + '分')
        }
        

        //列表打印调理单
        $('#tbOrderList tbody').on('click','#printOrder',function(){
            // var orderList = $('#tbOrderList').DataTable().row($(this).parents('tr')).data();

            var id = $(this).attr('data-id');
            printHealth(id)
        });
    
        $("#searchBtn").click(function(){
            $("#tbOrderList").DataTable().ajax.reload(); 
        });
        
        function loadDoTime(){
            $("#prescriptionminusbtn").click(function(){
                var prescriptionAddTime=$("#prescriptionAddTime").text();
                if(prescriptionAddTime==1)
                {
                    return false;
                }
                $("#prescriptionAddTime").text(prescriptionAddTime*1-1)
            });
            $("#prescriptionaddbtn").click(function(){
                var prescriptionAddTime=$("#prescriptionAddTime").text();
                $("#prescriptionAddTime").text(prescriptionAddTime*1+1)
            });
            $("#orderminusbtn").click(function(){
                var orderAddTime=$("#orderAddTime").text();
                if(orderAddTime==1)
                {
                    return false;
                }
                $("#orderAddTime").text(orderAddTime*1-1)
            });
            $("#orderaddbtn").click(function(){
                var orderAddTime=$("#orderAddTime").text();
                $("#orderAddTime").text(orderAddTime*1+1)
            });
        }
        

        //编辑订单
        $('#tbOrderList tbody').on('click','span#editOrder',function(){
            var orderLists = $('#tbOrderList').DataTable().row($(this).parents('tr')).data();
            if(orderLists.ordertype == '1'){
                obj.$currentDlg = bootbox.dialog({
                    title: "编辑问诊订单",
                    size: 'large',
                    className: 'select-size',
                    message: obj.html_dialog_selectUpdateInquiry,
                    buttons: {
                        success: {
                            label: "保存",
                            className: "btn-success btn-import{0} savebtn".format(obj.ID),
                            callback: function () {
                                var orderid=orderLists.id;
                                var ordercode=orderLists.ordercode;
                                var serviceid=orderLists.serviceid;
                                var addtime=$("#orderAddTime").text();
                                $(".savebtn").attr("disabled", true);
                                var result = doAjax("/api/orderaddtimeinfo/insertComplete", "post",
                                { 
                                    "orderid": orderid,
                                    "createby": ordercode+","+serviceid,//暂用创建人代替
                                    "addtime": addtime
                                },['#tbOrderList'], null
                                , null, false);
                                if(result==false)
                                {
                                    $(".savebtn").attr("disabled", false);
                                }
                                return result;
                            }
                        },
                        caner: {
                            label: "取消",
                            className: "btn-default savebtn",
                            callback: function () {
                            }
                        }
                    }
                });
                $('#wzdata').hide();
                $('.s-style').hide();
                loadshowdata(orderLists,"i");
            }else{
                obj.$currentDlg = bootbox.dialog({
                    title: "编辑药方订单",
                    size: 'large',
                    className: 'select-sizes',
                    message: obj.html_dialog_selectUpdatePrescription,
                    buttons: {
                        success: {
                            label: "保存",
                            className: "btn-success btn-import{0} savebtn1".format(obj.ID),
                            callback: function () {
                                var orderid=orderLists.id;
                                var addtime=$("#prescriptionAddTime").text();
                                $(".savebtn1").attr("disabled", true);
                                var result = doAjax("/api/orderaddtimeinfo/insertComplete", "post",
                                { 
                                    "orderid": orderid,
                                    "addtime": addtime
                                }, ['#tbOrderList'], null
                                , null, false);
                                if(result==false)
                                {
                                    // $(".savebtn1").attr("disabled", false);
                                    
                                }
                                return result;
                            }
                        },
                        caner: {
                            label: "取消",
                            className: "btn-default",
                            callback: function () {
                            }
                        }
                    }
                });
                $('.s-style').hide();
                loadshowdata(orderLists,"p");
                loadMedicine(orderLists.id);
            }
            loadDoTime();
        });


        //获取医院列表
        load_DropDownList_Get('/api/hospitainfo/getListByKey', 'post', '#hospital', 'hospitaname', 'hospitaname', {}, null, "请选择医院");
        //获取科室列表
        load_DropDownList_Get('/api/datadictionarydetail/getListByKey', 'post', '#class', 'itemname', 'itemname', {sortcode:"keshi"}, null, "请选择科室");
        return obj;
    }();
    