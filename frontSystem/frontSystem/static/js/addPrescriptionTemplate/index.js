/**
 * Created by Girl on 2018/7/25.
 */
;var ObjaddPrescriptionIndex = function(
){ 			//定义对象
    
    var obj = new Object();
    obj.ID = '';
    obj.init			= function(id){		//初始化函数,请在页面$(document).ready调用
        obj.ID = id;//记录ID编号
        $('.date-picker').datetimepicker({format:"hh:ii",language:"zh-CN",todayHighlight:true,todayBtn:true,startView:1});
      //加载药材
        var user={}
        user.aa="aaa";
        ajax({
            "type" : 'post',
            "url" : '/api/medicineinfo/getMedicineList',
            "contentType": "application/json",
            "dataType" : "json",
            "data": JSON.stringify(user),
            "success": function(data){
                ObjaddDoctorIndex.inputList1('#medicinesearch','#medicinelist','#selectmedicine',1,data,null);
                $(".mdprice").on('change',function(){
                	sumPrice();
                });
            },
            "error": function(e){

            }
        });
        
        //加载用药禁忌
        ajax({
            "type" : 'post',
            "url" : '/api/datadictionarydetail/selectBySortcodes',
            "dataType" : "json",
            "data" : {
                sortcodes : "yyjj",
            },
            "success" : function(data) {
				ObjaddDoctorIndex.inputList('.unprescription','#prescriptionlist','#selectprescription',3,data,null);
            }
        });
        
        $("#add").click(function(){
        	var prescriptionname=$("#prescriptionname").val().trim();
			if(prescriptionname==null||prescriptionname=='')
			{
				bootboxAlert("药方名称不能为空",false);
				stops;
			}
			
			var medicineLen=$("#selectmedicine").find("li").length;
			if(medicineLen==null||medicineLen<1)
			{
				bootboxAlert("药材不能为空",false);
				stops;
			}
			
			var medicines="";
			$(".selectmedicine li").each(function(){
				var obj = $(this);
				var o_span=obj.children("span").eq(0);
				var o_span_input=obj.children("span").eq(1);
				var o_span_value=o_span_input.children("input").eq(0).val();
				if(o_span_value<1)
				{
					bootboxAlert("药材克数不能为空",false);
					stops;
				}
				medicines+=o_span.attr("mid")+"@#@"+o_span.text()+"@#@"+o_span_value+",";
			});
			
			var totaldosage=$("#totaldosage").val().trim();
			var daydosage=$("#daydosage").val().trim();
			var taketime=$("#taketime").val().trim();
			if(totaldosage==null||totaldosage==''||daydosage==null||daydosage==''||taketime==null||taketime=='')
			{
				bootboxAlert("用药说明不能为空",false);
				stops;
			}
			
			var taboos = "";
			$("#selectprescription li span").each(function(){
				var obj = $(this);
				taboos+=obj.text()+",";
			});
			
			$(this).attr("disabled", true);
        	var  result = doAjax("/api/prescriptioninfo/addOrUpdatePrescriptionInfo", "post",
                    {
                      "prescriptionname": prescriptionname
                    , "medicines": medicines
                    , "specialadvice": $("#specialadvice").val()
                    , "taboo": taboos
                    , "totaldosage": totaldosage
                    , "daydosage": daydosage
                    , "taketime": taketime
                    , "prescriptiontype": "1"
                    , "state": $("#state").val()
                    },function(result){
                   	 resetVal();
                   	$(this).attr("disabled", false);
                    }, null, null, false);
        	if(result==false)
        	{
        		$(this).attr("disabled", false);
        	}
        	return result;
        });
        
        
        $("#reset").click(function(){
        	resetVal()
        });
        
        function resetVal()
        {
        	$("#addform :input").not(":button, :submit, :reset, :hidden").val("");
        	$("#selectmedicine").html("");
        	$("#selectprescription").html("");
        	$(".unprescription").val("");
        	$("#state").val("");
        }
    };
    
    $("#totaldosage").on('change',function(){
    	var totalprice=0;
		$(".mdprice").each(function(){
		   var obj=$(this);
    	   var mprice=obj.attr("mprice");
    	   var dosage=obj.val();
    	   totalprice=totalprice*1+(mprice*dosage);
		});
		var totaldosage=$("#totaldosage").val();
		if(totaldosage!='')
		{
			totalprice=totalprice*totaldosage;
		}
		
	    $("#totalprice").val(numberFormat(totalprice.toFixed(2),2));
    });
    
    return obj;
}();