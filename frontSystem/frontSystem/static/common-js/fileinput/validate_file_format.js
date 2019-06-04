/**
 * 用于校验文件格式
  */
/**
 * 定义支持的文件格式
 */
var suppotExcelFile = new Array();
suppotExcelFile[0] = "xls";
suppotExcelFile[1] = "xlsx";
/**
 * 定义支持的文件格式（结束）
 */

/**
 * 检验文件是否为空
 */	    
var isNullFile = function(fileName){
	if(null == fileName || "" == fileName){
		bootbox.alert("请选择上传的文件！");
		return true;
	}
	return false;
};
/**
 * 取出文件格式
 */
var getFileType = function(fileName){
	return (fileName.substring(fileName.lastIndexOf(".")+1,fileName.length)).toLowerCase();
};


/**
 * 检验Excel格式
 */
var isExcel = function(fileName){
	if (!isNullFile(fileName)) {
		if (fileName.lastIndexOf(".") != -1) {
			var fileType = getFileType(fileName);
			for (var i =0;i<suppotExcelFile.length;i++) {
				if (suppotExcelFile[i] == fileType) {
					return true;
				}
			}
			bootbox.alert("文件类型不合法,只能是\""+suppotExcelFile+"\"类型！");
			return false;
		} else {
			bootbox.alert("上传文件格式不正确！");
			return false;
		}
	}
};

