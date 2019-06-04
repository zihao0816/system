;var ObjComboBoxCommon = function() { 			//定义对象
//////////////////////////////////////////
/* 
说明:	公共模块-下拉框初始化
1、注意事项:	
2、示例: 
html:
<select class='select-test' id='select-test' ><option value='1'>Name1</option></select>
js:
if(typeof(ObjComboBoxCommon) != 'undefined'){
	ObjComboBoxCommon.loadDict('.container{0} .select'.format(obj.ID),'');
}
3、可查询的字典类型：
4、可查询的数据权限
*/
//////////////////////////////////////////
	var obj = new Object();  
	obj.loadDict = function(element , type){
		/*加载字典表中的列表*/
		//serviceState@wsp	业态
		//category@wsp		品类
		//item@wsp			品项
		//trademark@wsp		品牌
		var api = '/api/dict/querybycode/{0}'.format(type);
		obj.load(element , api , 'id' , 'name');
	}
	obj.loadDataType = function(element , type){
		/*加载数据权限表中的列表*/
		var api = '/api/dataConf/querybycode/{0}'.format(type);
		obj.load(element , api , 'id' , 'name');
	}
	obj.load = function(element , api , value , display, callback){
		$(element).empty();
		$(element).append("<option value=''>加载中...</option>");
		$.ajax({
			url : api,
			type : "GET",
			dataType: "json",
			beforeSend:ObjCompanyMain.beforeAjaxSend,
			success: function(data){
				$(element).empty();
				$("<option value=''>请选择</option>").appendTo(element);
				for(var i = 0 ; i < data.length ; ++i){
					var html= "<option value='{0}'>{1}</option>".format(data[i][value] , data[i][display]);
					$(html).appendTo(element);
				}
				if(typeof(callback) == 'function'){
					callback(data);
				}
			},
			error:function(xhr,status,error){
				$(element).empty();
				$("<option value=''>ErrorOfLoad</option>").appendTo(element);
				console.log(status + ' : ' + error);
			}
		});
	}
	return obj;
}();