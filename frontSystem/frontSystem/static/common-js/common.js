/*window.onerror = function (msg, file, line){
	alert("对不起,发现开发工程师未解决的问题:  " + msg + "\n\n发生在: " + file + " (" + line + ")\n\n请按Ctrl+C组合按键复制错误消息或截取屏幕发送给系统管理员.");
	return true; 
};*/
window.console = window.console || (function(){ 
	var c = {}; 
	c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){}; 
	return c; 
})(); 
Math.uuid=(function(){var $="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");return function(_,G){var C=$,F=[],D=Math.random;G=G||C.length;if(_){for(var B=0;B<_;B++)F[B]=C[0|D()*G]}else{var A=0,E;F[8]=F[13]=F[18]=F[23]="-";F[14]="4";for(B=0;B<36;B++)if(!F[B]){E=0|D()*16;F[B]=C[(B==19)?(E&3)|8:E&15]}}return F.join("")}})();
var randomUUID=Math.uuid;

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
	// null and undefined are "empty"
	if(typeof(obj) == 'undefined') return true;
    if (obj == null) return true;
	if(typeof(obj) == 'number')	return false;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
var obj 			= new Object();
function buildGridQuery(s,condition){
    var param = s.data;
    var query = new Object();
    // debugger;
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
obj.getValueByName = function(str , name){
    //debugger;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = str.match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
function emptyObjectProperty(obj){
	if(typeof(obj) == 'object'){
		for (var key in obj) {
			obj[key] = null;
		}
	}
}

Array.prototype.remove = function(s) {     
    for (var i = 0; i < this.length; i++) {     
        if (s == this[i])     
            this.splice(i, 1);     
    }     
}
Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg= new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}

Date.prototype.pattern=function(fmt) {           
    var o = {           
    "M+" : this.getMonth()+1, //月份           
    "d+" : this.getDate(), //日           
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    "H+" : this.getHours(), //小时           
    "m+" : this.getMinutes(), //分           
    "s+" : this.getSeconds(), //秒           
    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
    "S" : this.getMilliseconds() //毫秒           
    };           
    var week = {           
    "0" : "/u65e5",           
    "1" : "/u4e00",           
    "2" : "/u4e8c",           
    "3" : "/u4e09",           
    "4" : "/u56db",           
    "5" : "/u4e94",           
    "6" : "/u516d"          
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
}         
function padLeft(str,lenght){ 
	if(str.length >= lenght) 
		return str; 
	else 
		return padLeft("0" +str,lenght); 
} 
function padRight(str,lenght){ 
	if(str.length >= lenght) 
		return str; 
	else 
		return padRight(str+"0",lenght); 
}

function getFB(){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var txt = 'http://security.tencent.com/';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "tencent";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    var b64 = canvas.toDataURL().replace("data:image/png;base64,","");
    var bin = atob(b64);
    return md5(bin);
}

function getCookie(c_name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start != -1){
			c_start = c_start + c_name.length+1
			c_end = document.cookie.indexOf(";",c_start)
			if (c_end == -1)
				c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		}
	}
	return ""
}
var TIPS = (function() {
    "use strict";
    var elem,
        hideHandler,
        that = {};

    that.init = function(options) {
        elem = $(options.selector);
    };

    that.show = function(text) {
        clearTimeout(hideHandler);
        elem.find("span").html(text);
        elem.delay(20).fadeIn().delay(4000).fadeOut();
    };

    return that;
}());
function Map() {     
    /** 存放键的数组(遍历用到) */    
    this.keys = new Array();     
    /** 存放数据 */    
    this.data = new Object();     
         
    /**   
     * 放入一个键值对   
     * @param {String} key   
     * @param {Object} value   
     */    
    this.put = function(key, value) {     
        if(this.data[key] == null){     
            this.keys.push(key);     
        }     
        this.data[key] = value;     
    };     
         
    /**   
     * 获取某键对应的值   
     * @param {String} key   
     * @return {Object} value   
     */    
    this.get = function(key) {     
		if(this.keys.contains(key))
			return this.data[key];     
    };     
         
    /**   
     * 删除一个键值对   
     * @param {String} key   
     */    
    this.remove = function(key) {     
        this.keys.remove(key);     
        this.data[key] = null;     
    };     
         
    /**   
     * 遍历Map,执行处理函数   
     *    
     * @param {Function} 回调函数 function(key,value,index){..}   
     */    
    this.each = function(fn){     
        if(typeof fn != 'function'){     
            return;     
        }     
        var len = this.keys.length;     
        for(var i=0;i<len;i++){     
            var k = this.keys[i];     
            fn(k,this.data[k],i);     
        }     
    };     
    /**   
     * 获取键值数组(类似Java的entrySet())   
     * @return 键值对象{key,value}的数组   
     */    
    this.entrys = function() {    
        var len = this.keys.length;     
        var entrys = new Array(len);     
        for (var i = 0; i < len; i++) {     
            entrys[i] = {     
                key : this.keys[i],     
                value : this.data[this.keys[i]]     
            };     
        }     
        return entrys;     
    };     
         
    /**   
     * 判断Map是否为空   
     */    
    this.isEmpty = function() {     
        return this.keys.length == 0;     
    };     
         
    /**   
     * 获取键值对数量   
     */    
    this.size = function(){     
        return this.keys.length;     
    };     
         
    /**   
     * 重写toString    
     */    
    this.toString = function(){     
        var s = "{";     
        for(var i=0;i<this.keys.length;i++,s+=','){     
            var k = this.keys[i];     
            s += k+"="+this.data[k];     
        }     
        s+="}";     
        return s;     
    };     
}     
function rsaString(s){
	setMaxDigits(19);
	// Put this statement in your code to create a new RSA key with these parameters
	/*
	e = 136273485194251236885055758009287886407
	d = 86157976464099593574109527294860798039
	m = 141861180480596906389186162456762240631
	var key = new RSAKeyPair(
	 "6685518e3514af88323353320430c647",
	 "40d16c34e33f3e44ca334c88553b2857",
	 "6ab97833fe8bc30f065e9f9cb307ce77"
	);
	*/
	var key = new RSAKeyPair(
	 "6685518e3514af88323353320430c647",
	 "",
	 "6ab97833fe8bc30f065e9f9cb307ce77"
	);
	
	
	var out = encryptedString(key, s);
	console.log(out);
	
	var key = new RSAKeyPair(
	 "6685518e3514af88323353320430c647",
	 "40d16c34e33f3e44ca334c88553b2857",
	 "6ab97833fe8bc30f065e9f9cb307ce77"
	);
	var decryptedPssword = decryptedString(key, out);
    console.log(decryptedPssword);
}

function GridState(){
	//作为表格状态记录缓存使用
	//使用注意事项：
	//1、生成本地变量,如：obj.state = GridState();
	//2、修改表格的colModel对应的col的formatter,如：{ label: '状态', name: 'state', width: 50 ,formatter:obj.state.formatter}
	//	 该字段判断标准默认为1，修改请调用setCheckValue
	//3、注册表格中的checkbox对象的change事件，如：$("#jqGrid{0}".format(obj.ID)).on("change", "input[type='checkbox'].gridCheck", obj.state.gridCheck);
	//4、获取变动列表，var data = obj.state.getData();
	//5、如果需要多次使用需要调用 clear 方法
	var obj 			= new Object(); 
	obj.CheckedFlag		= 1;
	obj.UncheckedFlag	= 0;
	obj.state 			= new Map();
	obj.origin			= new Map();
	obj.put				= function(key , val){
		//debugger;
		var origin = obj.origin.get(key);
		if(typeof(origin) != 'undefined' && origin == val){
			obj.state.remove(key);
			obj.origin.remove(key);
			//console.log("REMOVE: " + key );
			return;
		}
		
		if(typeof(origin) == 'undefined'){
			var v = val == obj.CheckedFlag ? obj.UncheckedFlag : obj.CheckedFlag;
			obj.origin.put(key , v);
			//console.log("PUT ORIGIN: " + key + " : " +v);
		}		
		obj.state.put(key , val);		
		//console.log("PUT: " + key + " : " +val);
	}
	obj.get				= function(key){
		//console.log("GET: " + key + " : " + obj.state.get(key));
		return obj.state.get(key);
	}
	obj.clear			= function(){
		obj.state 		= new Map();
		obj.origin		= new Map();
	}
	obj.getData			= function(){
		
		return obj.state.entrys();
	}
	obj.setCheckValue	= function(checkedFlag,uncheckedFlag){
		obj.CheckedFlag 	= checkedFlag;
		obj.UncheckedFlag = uncheckedFlag;
	}	
	obj.formatter		= function(cellvalue, options, rowObject){
		var id = rowObject.id;
		var v = obj.get(id);		
		if(typeof(v) != 'undefined'){
			return '<input type="checkbox" class="gridCheck" data-id="{0}" {1} />'.format(rowObject.id , (v == obj.CheckedFlag ? 'checked' : '') );
		}else{
			return '<input type="checkbox" class="gridCheck" data-id="{0}" {1} />'.format(rowObject.id , (cellvalue == obj.CheckedFlag ? 'checked' : '') );
		}
	}
	obj.gridCheck		= function (e){
		var id = $(e.target).attr('data-id');
		if(typeof(id) != 'undefined'){
			var checked = $(e.target).is(':checked');			
			obj.put(id , (checked ? obj.CheckedFlag : obj.UncheckedFlag) );
			if(checked){
				$(e.target).attr("checked",'true').prop('checked', true);
			}else{
				$(e.target).removeAttr("checked").prop('checked', false);
			}
		}
	}
	return obj;
}

