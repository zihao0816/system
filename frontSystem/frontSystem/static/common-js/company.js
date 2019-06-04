;var ObjCompanyMain = function() {
	document.onkeydown=function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e && e.keyCode==27){ // 按 Esc
			bootbox.hideAll();//关闭弹窗
		}
	};
	var obj 			= new Object();
	obj.html_dialog_searching='';
	obj.html_dialog_searching= $('#searchingPopup .container').html();
	$('#searchingPopup .container').remove();
	obj.Client 			= "WebClient";	//客户端类型
	obj.UserSID			= '';			//用户SESSION ID
	obj.UserID  		= '';			//用户ID
	obj.CompID         ='';          //公司ID
	obj.UserName       ='';        //用户名
	obj._funcs 			= new Map();
	obj.main_tab= null;
	obj.putObj = function(id,o){//记录对象
		obj._funcs.put(id,o);
	}
	
	
	var ticket = getCookie("UserSID");
	
	
	obj.removeObj = function(id){//移除对象
		try{
			var o = obj._funcs.get(id);
			o  = null;
			obj._funcs.remove(id);
		}catch(e){
		}

	}
	/*
	 *	定义常量
	 */
	obj.DIV_MESSAGE = '<div class="jumbotron"><div class="alert alert-danger" role="alert"><h3>{0}</h3>{1}</div></div>';
	obj.HTML_ERROR = '请检查网络或与管理员联系...<br/><button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#error{0}" aria-expanded="false" aria-controls="error{0}">查看更多消息...</button>\
	<div class="collapse" id="error{0}"><h4>{1}</h4>{2}</div>';

	obj.TAB_PANEL = '<div target-id="{0}" id="tab{1}" func="{1}"><div role="alert" class="alert alert-info" ><img src="/static/images/loading-sm.gif"/>请稍候,正在加载中......</div></div>';

	/*
	 *	按钮事件  找到DIV显示
	 */
	obj.on_view_error = function(div){
		$(div).modal('show');


	}

	/*
	 *	页面初始化
	 */
	obj.init = function (id,usersid,userid,compid,userName){
		obj.UserID  = userid;
		obj.UserSID = usersid;
		obj.CompID = compid;
		obj.UserName = userName;

		$.ajaxSetup({timeout: 1000 * 60});	//全局超时设置

		$('.leftsidebar_box a').click(on_menu_item_click);
		//$('.search').click(on_btn_search);//搜索按钮点击事件
		$('.link-logout').click(on_sign_out);//Sign out

		obj.main_tab = new TabPanel({renderTo:'main-tab-container',autoResizable:true,items : []});
		if (obj.CompID == 0) {
			obj.add_tab('home','_func_c-company_home','首页','/func/c-company/home',false);
		} else {
			obj.add_tab('home','_func_company_home','首页','/func/company/home',false);
		}

	}
	////提交按钮点击事件
	//function on_btn_search() {
	//	var  queryTerm= $('.queryTerm').val();
	//}
	obj.buildGridQuery = function(s,condition){
		var param = s.data;
		var query = new Object();
		if(typeof(param) == 'object'){
			query = param;
		}else{
			query._search = obj.getValueByName(param , '_search');
			query.nd   = obj.getValueByName(param , 'nd');
			query.rows = obj.getValueByName(param , 'rows');
			query.page = obj.getValueByName(param , 'page');
			query.sidx = obj.getValueByName(param , 'sidx');
			query.sord = obj.getValueByName(param , 'sord');
		}
		query.condition = condition;
		replaceEmptyToNULL(query);
		return JSON.stringify(query);
	}
	function replaceEmptyToNULL(obj){
		for(o in obj){
			if(obj[o] === '') obj[o] = null;
			if(typeof obj[o] == 'object'){
				replaceEmptyToNULL(obj[o]);
			}
		}
	}
	obj.TableReload=function(selector){
		$(selector).DataTable().ajax.reload();
	}
	obj.getValueByName = function(str , name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = str.match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	}
	obj.beforeAjaxSend = function(xhr , settings ){
		/*该函数用于前端请求后台数据时自动添加用户信息，用于后台进行用户权限验证*/
		/*使用方法：jqgrid ({url:url,mtype:"GET",loadBeforeSend:ObjMain.beforeAjaxSend});*/
		/*使用方法：$.ajax({url:url,beforeSend:ObjMain.beforeAjaxSend});*/
		/*该函数是共公方法，也可以自己进行相应数据添加而不使用该函数*/
		try{
			var str = "(^|&){0}=([^&]*)(&|$)";
			if(typeof(settings.url) == "string"){
				var s,r;
				r = new RegExp(str.format("UserID"));
				s = settings.url.match(r);
				if(s == null){
					if (settings.url.match("[\?]")) {
						settings.url += "&";
					} else {
						settings.url += "?";
					}
					settings.url += "UserID={0}".format(ObjCompanyMain.UserID)
				}
				r = new RegExp(str.format("UserSID"));
				s = settings.url.match(r);
				if(s == null){
					if (settings.url.match("[\?]")) {
						settings.url += "&";
					} else {
						settings.url += "?";
					}
					settings.url += "UserSID={0}".format(ObjCompanyMain.UserSID)
				}
				r = new RegExp(str.format("CompID"));
				s = settings.url.match(r);
				if(s == null){
					if (settings.url.match("[\?]")) {
						settings.url += "&";
					} else {
						settings.url += "?";
					}
					settings.url += "CompID={0}".format(ObjCompanyMain.CompID)
				}
				r = new RegExp(str.format("Client"));
				s = settings.url.match(r);
				if(s == null){
					if (settings.url.match("[\?]")) {
						settings.url += "&";
					} else {
						settings.url += "?";
					}
					settings.url += "Client={0}".format(ObjCompanyMain.Client)
				}
			}
		}catch(e){
		}
	}
	function on_sign_out(){
		bootbox.confirm("您确定要退出登录?", function(result) {
			if(result){
				window.location = '/user/logout';
			}
		});
	}
	function on_tabs_change(e){
		var id = $(e.target).attr('aria-controls');
		$('#{0} .resizable-grid'.format(id)).each(function(){obj.resizeGrid($(this).attr('id'))});
	}
	obj.on_ajax_success = function (jsonResult, functionCallback) {
		var result = '';
		jsonResult.action = (typeof (jsonResult.action) == "undefind" || jsonResult.action == null) ? '' : jsonResult.action;
		jsonResult.message = (typeof (jsonResult.message) == "undefind" || jsonResult.message == null) ? '' : jsonResult.message;
		jsonResult.detail = (typeof (jsonResult.detail) == "undefind" || jsonResult.detail == null) ? '' : jsonResult.detail;
		if(jsonResult.result == 0) {
			// result = '成功！';
			if (typeof (jsonResult.detail) != 'undefined' && jsonResult.detail != '' && jsonResult.detail != null) {
				layer.msg(jsonResult.detail,{ area: ['300px'], time: 3000, shift: 0});
			} else {
				layer.msg('操作成功！',{ area: ['300px'], time: 3000, shift: 0});
			}
			// debugger;
			if (typeof (functionCallback) == "function") {
				functionCallback();
			}
			// TIPS.show('操作成功！')
			// bootbox.alert({
			// 	buttons: {
			// 		ok: {
			// 			label: '确定',
			// 			className: 'btn-myStyle'
			// 		}
			// 	},
			// 	message: jsonResult.action + '  ' + jsonResult.message + '<br />' + jsonResult.detail,
			// 	callback: function() {
			// 		if (typeof (functionCallback) == "function") {
			// 			functionCallback();
			// 		}
			// 	},
			// 	title: result
			// });
		}
		else {
			result = '抱歉';
			bootbox.alert({
				buttons: {
					ok: {
						label: '确定',
						className: 'btn-myStyle'
					}
				},
				message: "<div class='col-xs-12 text-danger alert alert-danger' style='margin-top:15px'>"+jsonResult.action+ "  " + jsonResult.message + "<br />" + jsonResult.detail+"</div>",
				callback: function() {
				},
				title: result,
			});
		}
	};
	obj.on_ajax_error = function (xhr, error){
		layer.closeAll('loading');
		if (xhr.status == 413 && xhr.statusText == "Request Entity Too Large") {
			bootbox.alert('上传附件失败！附件应小于 1 MB ');
		} else {
			bootbox.alert('请求错误！' + '</br>' + '错误码：' + xhr.status + '</br>' + '错误信息：' + xhr.statusText);
		}
    };

	//$('.wereHome').onclick
	/*
	 *	添加Tab
	 */
	/*obj.add_tab = function(id,func,title,url,closable) {
		var icon_title=$('.icon_title');
		// debugger
			var r = obj.main_tab.addTab({id:id,
				title:title,
				html:"loading...",
				closable: closable,
				disabled:false,
				icon:"/static/images/loading-sm.gif"
			});
			if(r == false){

			}else if(r == 1){
				document.cookie='CurrentFunc={0}; path=/'.format(url);
				document.cookie='CurrentFuncID={0}; path=/'.format(url);
				var html_panel = obj.TAB_PANEL.format(id,func,title);
				obj.main_tab.setContent(id , html_panel);
				$('#main-tab-container #tab{0}'.format(func)).load(url,obj.on_page_load);//动态加载窗口

			}

	}*/

    obj.add_tab = function(id,func,title,url,closable) {
		var icon_title=$('.icon_title');
// debugger
			var r = obj.main_tab.addTab({id:id,
				title:title,
				html:"loading...",
				closable: closable,
				disabled:false,
				icon:"/static/images/loading-sm.gif"
			});
			if(!r){
				// debugger;
				$('#main-tab-container #tab{0}'.format(func)).html('<div role="alert" class="alert alert-info" ><img src="/static/images/loading-sm.gif"/>请稍候,正在加载中......</div>')
				$('#tab{0}'.format(func)).load(url,obj.on_page_load);//动态加载窗口

			}else if(r){
				// debugger;
				document.cookie='CurrentFunc={0}; path=/'.format(url);
				document.cookie='CurrentFuncID={0}; path=/'.format(url);
				var html_panel = obj.TAB_PANEL.format(id,func,title);
				obj.main_tab.setContent(id , html_panel);
				$('#tab{0}'.format(func)).load(url,obj.on_page_load);//动态加载窗口

			}

    }

	obj.add_tab11 = obj.add_tab;

	//尝试刷新 tab ，如果没有该 tab 则添加 tab
	obj.reload_tab = function(id,func,title,url,closable) {
        if (obj.exists_tab(id)) {
            $('#main-tab-container #tab{0}'.format(func)).load(url,obj.on_page_load);//动态加载窗口
        }
        obj.add_tab(id,func,title,url,closable);
    }
	obj.close_all_tab = function(){
		while(1){
			var cur = obj.main_tab.getActiveTab();
			if(cur != null){
				obj.main_tab.kill(cur.id);
			}else{
				break;
			}
		}
	}
	obj.close_current_tab = function(){
		var cur = obj.main_tab.getActiveTab();
		if(cur != null){
			obj.main_tab.kill(cur.id);
		}

	}

	obj.show_tab = function(id){
		obj.main_tab.show( obj.main_tab.getTabPosision(id));
	}

	obj.refresh_tab_by_id = function(id) {
	    var position = obj.main_tab.getTabPosision(id);
        if (typeof (position) == 'number') {
            obj.main_tab.refresh(position);
        } else {
            return false;
        }
    }

	function on_menu_item_click(){
		var id = $(this).attr('data-id');
		if(typeof(id) === 'undefined'){
			id = randomUUID();
            // id = '_func_socialSecurityFile';
			$(this).attr('data-id',id);
		}
		var href = $(this).attr('href');
		if(href != null && typeof(href) === 'string' && href.trim().lastIndexOf('#') == 0/*.startsWith('#')*/){
			href = href.replaceAll('#','');
			var func = href.replaceAll("/","_");
			// obj.close_all_tab();
			obj.add_tab11(id,func,$(this).text(),href,true);
		}
	}
	/*
	 *	Tab加载事件
	 */
	obj.on_page_load = function(response,status,xhr){

		var tab_id = $(this).attr("target-id");
		obj.main_tab.setIcon(tab_id , "");
		if(status == 'error'){
			var html = obj.DIV_MESSAGE.format('对不起 页面加载失败',obj.HTML_ERROR.format($(this).attr("id"),'{0}加载失败'.format($(this).attr('func')),response) );
			$(this).html(html);

		}else if(status == 'success'){

		}
	}

	obj.exists_tab = function(id){
		return typeof(obj.main_tab.getTabPosision(id)) === 'integer';
	}

	$('.searching').click(GetUserMess);//搜索绑定事件
	function GetUserMess(){
		var nameornumber=$('.queryTerm').val();//输入......
		$('.usertoname').text(nameornumber);//输入值
		$.ajax({
			url: "/api/user/getUserByMess?mess="+nameornumber+"&ticket="+ticket,
			type: "post",
			async : false,
			dataType: "json",
			success: function(data){
				if(data.result == -1){
					bootbox.alert("没有该信息的员工，请重新输入!");
				}else{
					obj.$currentDlg = bootbox.dialog({
						title: "搜索",
						message: obj.html_dialog_searching,
						size:"large",
					});
					var ax = data;
					var str = null;
					for (var i = 0;i<ax.length;i++){
						str +="<tr><td style='display:none'>"+ax[i].id+"</td><td>"+ax[i].user_true_name+"</td><td>"+ax[i].idnumber+"</td><td>"+ax[i].sex+"</td><td>"+ax[i].compname+"</td> <td>"+ax[i].num+"</td> <td><a class='lookCompany' >查看</a></td></tr>";
					}
					$('#rows').html(str);

					$('.lookCompany').bind('click',function(){
						bootbox.hideAll();
						var datatime = $('#details').DataTable().row($(this).parents('tr')).data();
						
						var userid = datatime[0];
						var username = datatime[1];
						if(username != null) {
							username = encodeURI(encodeURI(username));
						}
						window.location = '/fileCard?uid='+userid+'&uname='+username+'&username='+username+"&back=-1&insurce=Y";
						//javascript:ObjCompanyMain.add_tab('fileCardCompany','','基本档案','/func/fileCard?uid='+userid+'&uname='+username);
					})
				}
			}
		});
	};

    //搜索条件小插件
	obj.searchShow = function(clickBtn, searchBtn, hideBox,searchCriteria) {
		clickBtn.text('搜索');
		searchCriteria.hide();
		var  interval =searchBtn.attr('interval');
		clickBtn.bind("click", function () {
			if (clickBtn.text() == '收起') {
				clickBtn.text('搜索');
				searchCriteria.remove();
				searchBtn.removeClass('col-lg-offset-'+interval);
			} else {
				clickBtn.text('收起');
				searchCriteria.show();
				hideBox.append(searchCriteria);
				searchBtn.addClass('col-lg-offset-'+interval);
			}
		})
	};
	//显示隐藏columnsBox
	obj.listShow =function (listBtn,columnsBox) {
		columnsBox.hide();
		listBtn.click(function(){
			if(listBtn.text()=='收起列表'){
				listBtn.text('显示列表');
			}else{
				listBtn.text('收起列表');
			}
			columnsBox.toggle()
		});
	};

	obj.getBirthdayFromIdNumber = function (selector4Id, selector4Birth) {
		var $birthBox = $(selector4Birth);
		var $IdBox = $(selector4Id);
		function  showbirth() {
			var birth = $IdBox.val();
			var year = birth.substring(6,10);
			var month = birth.substring(10,12);
			var day = birth.substring(12,14);
			var time = year + "-" + month + "-" + day;
			$birthBox.val(time);
		}
		function  showBirth15() {
			var birth = $IdBox.val();
			var year = '19' + birth.substring(6,8);
			var month = birth.substring(8,10);
			var day = birth.substring(10,12);
			var time = year + "-" + month + "-" + day;
			$birthBox.val(time);
		}

		function IdBoxlistener (event) {
			var $this = $(this);
			var myEvent = event || window.event;
			var keyCode = myEvent.keyCode;
			// console.log(keyCode);
			//输入是字母，或者退格键则需要重新请求
			if ((keyCode >= 48 && keyCode <= 57)/*keyboard 0-9*/ || (keyCode >= 96 && keyCode <= 105)/*numbers 0-9*/ || (keyCode >= 65 && keyCode <= 90) || keyCode == 8/*backspace*/ || keyCode == 46/*delete*/ || keyCode == 32/*space*/) {
				if ($this.val().length == 18) {
					showbirth()
				} else if ($this.val().length == 15) {
					showBirth15()
				} else {
					$birthBox.val('');
				}
			} else {
				return;
			}
		}
		$(selector4Id).on('keyup', IdBoxlistener);
	}


	var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
	obj.checkCard = function(code) {
		//是否为空
		var tip = "";
		var pass= true;
		if(isCardNo(code) == false) {
			tip = "您输入的身份证号码不正确，请重新输入";
			pass = false;
		}else if(checkProvince(code) == false) {
			tip = "您输入的身份证号码省份不正确,请重新输入";
			pass = false;
		}else if(checkBirthday(code) == false) {
			tip = "您输入的身份证号码生日不正确,请重新输入";
			pass = false;
		}else if(checkParity(code) == false) {
			tip = "您的身份证校验位不正确,请重新输入";
			pass = false;
		}
		if(!pass){
			return tip;
		}else{
			return pass;
		}
	};


    //检查号码是否符合规范，包括长度，类型
	isCardNo = function(code) {
		//身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
		var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
		if(reg.test(code) === false) {
			return false;
		}
		return true;
	};

    //取身份证前两位,校验省份
	checkProvince = function(code) {
		var province = code.substr(0,2);
		if(vcity[province] == undefined) {
			return false;
		}
		return true;
	};

    //检查生日是否正确
	checkBirthday = function(code) {
		var len = code.length;
		//身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
		if(len == '15') {
			var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
			var arr_data = code.match(re_fifteen);
			var year = arr_data[2];
			var month = arr_data[3];
			var day = arr_data[4];
			var birthday = new Date('19'+year+'/'+month+'/'+day);
			return verifyBirthday('19'+year,month,day,birthday);
		}
		//身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
		if(len == '18') {
			var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
			var arr_data = code.match(re_eighteen);
			var year = arr_data[2];
			var month = arr_data[3];
			var day = arr_data[4];
			var birthday = new Date(year+'/'+month+'/'+day);
			return verifyBirthday(year,month,day,birthday);
		}
		return false;
	};

   //校验日期
	verifyBirthday = function(year,month,day,birthday) {
		var now = new Date();
		var now_year = now.getFullYear();
		//年月日是否合理
		if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
			//判断年份的范围（3岁到100岁之间)
			var time = now_year - year;
			if(time >= 3 && time <= 100) {
				return true;
			}
			return false;
		}
		return false;
	};

    //校验位的检测
	checkParity = function(code) {
		//15位转18位
		code = changeFivteenToEighteen(code);
		var len = code.length;
		if(len == '18') {
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var cardTemp = 0, i, valnum;
			for(i = 0; i < 17; i ++) {
				cardTemp += code.substr(i, 1) * arrInt[i];
			}
			valnum = arrCh[cardTemp % 11];
			if (valnum == code.substr(17, 1)) {
				return true;
			}
			return false;
		}
		return false;
	};

    //15位转18位身份证号
	changeFivteenToEighteen = function(code) {
		if(code.length == '15') {
			var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
			var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
			var cardTemp = 0, i;
			code = code.substr(0, 6) + '19' + code.substr(6, code.length - 6);
			for(i = 0; i < 17; i ++) {
				cardTemp += code.substr(i, 1) * arrInt[i];
			}
			code += arrCh[cardTemp % 11];
			return code;
		}
		return code;
	};


	/******************************************************************************/
	/* 表单验证集合  */
	obj.validator_time_24 = {
		validators: {
			notEmpty: {
				message: '时间不可为空'
			},
			regexp: {
				regexp: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
				message: '时间格式不正确[00:00:00]'
			}
		}
	};
//验证邮箱
	obj.validator_email = {
		validators: {
			notEmpty: {
				message: '邮件地址不可为空'
			},
			emailAddress: {
				message: '邮件地址格式不正确'
			},
			regexp: {
				regexp: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
				message: '用户帐号格式不正确'
			}
		}
	};
	//验证用户名称
	obj.validator_username = {
		// message: '用户帐户输入不正确',
		validators: {
			notEmpty: {
				message: '名称不可为空'
			},
			stringLength: {
				min: 2,
				max:12,
				message: '名称字符长度2-12'
			},
			//regexp: {
			//	regexp: /{4,12}/,
			//	message: '名称格式不正确'
			//}
		}
	};
	//验证登录账号
	obj.validator_LoginAccount={
		validators: {
			notEmpty: {
				message: '用户账号不可为空'
			},
			stringLength: {
				min: 2,
				max:12,
				message: '用户账号字符长度2-12'
			},
			//regexp: {
			//	regexp: /^[a-zA-Z0-9_\.]+$/,
			//	message: '用户帐号格式不正确'
			//}
		}
	};
	//验证密码
	obj.validator_password = {
		validators: {
			notEmpty: {
				message: '密码不可为空'
			}
		}
	};

	obj.validator_diff = {
		message: '',
		validators: {
			regexp: {
//				regexp: /^[0-9]\d*$/,
				regexp: /^(0|[1-9]\d{0,9})$/,
				message: '配送数量必须是整数'
			}
		}
	};
	//验证手机号码
	obj.validator_cellPhoneNumber={
		validators: {
			notEmpty: {
				message: '手机号码不可为空'
			},
			stringLength: {
				length:11,
				message: '手机号码长度11'
			},
			regexp: {
				regexp: /^[1][3587][0-9]{9}$/,
				message: '手机号码格式不正确'
			}
		}
	};
	//座机 区号
	obj.validator_area={
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			stringLength: {
				min:3,
				man:4,
				message: '长度3-4'
			},
			//regexp: {
			//	regexp: /(0[1-9]{3,4})/,
			//	message: '格式不正确'
			//}
		}
	}
	//座机 号码
	obj.validator_areaNumber={
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			stringLength: {
				min:7,
				man:8,
				message: '长度不能超过8位'
			},
			regexp: {
				regexp: /^\d{7,8}$/,
				message: '格式不正确'
			}
		}
	}
	//固话号码
	obj.validator_Tel={
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			//stringLength: {
			//	min:5,
			//	man:9,
			//	message: '长度5-9'
			//},
			regexp: {
				regexp: /^\d{3,4}-\d{7,8}$/,
				message: '格式不正确'
			}
		}
	}
	//门店面积
	obj.validator_storeArea={
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			stringLength: {
				min:1,
				man:11,
				message: '长度1-11'
			}
		}
	}
	//座机 号码
	obj.validator_number={
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			stringLength: {
				min:5,
				man:9,
				message: '长度5-9'
			},
			//regexp: {
			//	regexp: /0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}/,
			//	message: '格式不正确'
			//}
		}
	}
	//固话号码验证
	obj.validator_phoneNumber={
		validators: {
			notEmpty: {
				message: '固话号码不可为空'
			},
			stringLength: {
				length:11,
				message: '固话号码长度11'
			},
			//regexp: {
			//	regexp: /^(0(10|2[1-3]|[3-9]\d{2}))?[1-9]\d{6,7}$/,
			//	message: '固话号码格式不正确'
			//}
		}
	};
	//用户传真
	obj.validator_UsersFax={
		validators: {
			//regexp: {
			//	regexp:  /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
			//	message: '格式不正确'
			//}
			//notEmpty: {
			//	message: '固话号码不可为空'
			//},
			//stringLength: {
			//	length:11,
			//	message: '固话号码长度11'
			//},
		}
	};
	//身份证号
	obj.validator_card={
		validators: {
			notEmpty: {
				message: '身份证号不可为空'
			},
			stringLength: {
				length:18,
				message: '身份证号长度18'
			},
			regexp: {
				regexp: /^[1-9](\d{16}|\d{13})[0-9xX]$/,
				message: '身份证号格式不正确'
			}
		}
	};
	//银行卡号
	obj.validator_bank={
		validators: {
			//notEmpty: {
			//	message: '银行卡号不可为空'
			//},
			stringLength: {
				min:12,
				man:19,
				message: '银行卡号长度12-19'
			},
			regexp: {
				regexp: /^\d{12,19}$/,
				message: '身份证号格式不正确'
			}
		}
	}
	//用户地址
	obj.validator_location={
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			stringLength: {
				min:5,
				man:50,
				message: '地址长度不可低于5个字符'
			},
			regexp: {
				regexp: /^[a-zA-Z0-9\u4e00-\u9fa5]{5,50}/,
				message: '格式不正确'
			}
		}
	}
	//是否为汉字
	obj.validator_ChineseCharacters = {
		// message: '用户帐户输入不正确',
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			regexp: {
				regexp: /[\u4e00-\u9fa5]{2,12}/,
				message: '格式不正确'
			}
		}
	};
	// 验证文件格式
	obj.file_excel = {
		message: '',
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			regexp: {
				regexp: /\.(?:csv|xls|xlsx)$/i,
				message: '文件格式不支持'
			}
		}
	};
	// 验证正实数
	obj.real_numbers = function(config){
		var message = config.message?config.message:"-";
		var rt = {
			message: '',
			validators: {
				notEmpty: {
					message: message+'不可为空'
				},
				regexp: {
					regexp: '^[0-9]+(.[0-9]{1,3})?$',// 验证有1-3位小数的正实数
					message: message+'必须是1-3位小数的正实数'
				}
			}
		}
		return rt;
	}
	//非空验证
	obj.validator_empty={
		validators: {
			notEmpty: {
				message: '不可为空'
			}
		}
	};
	//非空验证   加长度
	obj.validator_emptyLength={
		validators: {
			notEmpty: {
				message: '不可为空'
			},
			stringLength: {
				min:4,
				man:4,
				message: '必须是4个字符'
			},
			regexp: {
				regexp: /^[0-9]{4}$/,
				message: '格式不正确'
			}
		}
	};
	// 非空验证
	obj.not_empty = function(config){
		var message = config.message?config.message:"-";
		var rt = {
			message: '',
			validators: {
				notEmpty: {
					message: message+'不可为空'
				}
			}
		}
		return rt;
	}
	obj.feedbackIcons = { valid: 'glyphicon glyphicon-ok', invalid: 'glyphicon glyphicon-remove', validating: 'glyphicon glyphicon-refresh'};
	/******************************************************************************/
	obj.gridFormatterDate = function(cellvalue, options, rowObject){//表格日期单元格式化函数
		if(typeof(cellvalue) == 'undefined' || cellvalue == null)	return '';
		try{var date = new Date(cellvalue); return date.pattern("yyyy-MM-dd hh:mm:ss");}catch(e){return cellvalue;}
		/*formatter:'date',formatoptions: {srcformat:'Y-m-d H:i:s',newformat:'Y-m-d H:i:s'}*/
	}

	/*******************************************************************************/
	//避免精度缺失的四则运算 Start
	//加法
	Number.prototype.add = function(arg){
		// debugger;
		var r1,r2,m;
		try{r1=this.toString().split(".")[1].length}catch(e){r1=0}
		try{r2=arg.toString().split(".")[1].length}catch(e){r2=0}
		m=Math.pow(10,Math.max(r1,r2))
		return (this.mul(m)+arg.mul(m))/m
	};
	//减法
	Number.prototype.sub = function (arg){
		return this.add(-arg);
	};

	//乘法
	Number.prototype.mul = function (arg)
	{
		var m=0,s1=this.toString(),s2=arg.toString();
		try{m+=s1.split(".")[1].length}catch(e){}
		try{m+=s2.split(".")[1].length}catch(e){}
		return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
	};

	//除法
	Number.prototype.div = function (arg){
		var t1=0,t2=0,r1,r2;
		try{t1=this.toString().split(".")[1].length}catch(e){}
		try{t2=arg.toString().split(".")[1].length}catch(e){}
		with(Math){
			r1=Number(this.toString().replace(".",""))
			r2=Number(arg.toString().replace(".",""))
			return (r1/r2)*pow(10,t2-t1);
		}
	};
	// $('dd a').bind('click',function(){
	// })
	//避免精度缺失的四则运算 End
	/*********************************************************************************/

	obj.validator=function(){

	};




	return obj;
}();
