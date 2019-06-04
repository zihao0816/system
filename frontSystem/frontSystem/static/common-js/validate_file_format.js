/**
 * 用于校验文件格式
  */
/**
 * 定义支持的文件格式
 */
//Excel表格
var suppotExcelFile = new Array();
suppotExcelFile[0] = "xls";
suppotExcelFile[1] = "xlsx";
//图片
var suppotImgFile = new Array();
suppotImgFile[0] = "bmp";
suppotImgFile[1] = "jpeg";
suppotImgFile[2] = "jpg";
suppotImgFile[3] = "gif";
suppotImgFile[4] = "png";
suppotImgFile[5] = "psd";
suppotImgFile[6] = "pcx";
suppotImgFile[7] = "dxf";
suppotImgFile[8] = "cdr";
suppotImgFile[9] = "ico";
//文档
var suppotdocFile = new Array();
suppotdocFile[0] = "txt";
suppotdocFile[1] = "rtf";
suppotdocFile[2] = "doc";
suppotdocFile[3] = "xls";
suppotdocFile[4] = "ppt";
suppotdocFile[5] = "htm";
suppotdocFile[6] = "html";
suppotdocFile[7] = "wpd";
suppotdocFile[8] = "pdf";
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

/**
 * 检验图片格式
 */
var imgflie = function(fileName){
	if (!isNullFile(fileName)) {
		if (fileName.lastIndexOf(".") != -1) {
			var fileType = getFileType(fileName);
			for (var i =0;i<suppotImgFile.length;i++) {
				if (suppotImgFile[i] == fileType) {
					return true;
				}
			}
			bootbox.alert("文件类型不合法,只能是\""+suppotImgFile+"\"类型！");
			return false;
		} else {
			bootbox.alert("上传文件格式不正确！");
			return false;
		}
	}
};

/**
 * 检验文档格式
 */
var docfile = function(fileName){
	if (!isNullFile(fileName)) {
		if (fileName.lastIndexOf(".") != -1) {
			var fileType = getFileType(fileName);
			for (var i =0;i<suppotdocFile.length;i++) {
				if (suppotdocFile[i] == fileType) {
					return true;
				}
			}
			bootbox.alert("文件类型不合法,只能是\""+suppotdocFile+"\"类型！");
			return false;
		} else {
			bootbox.alert("上传文件格式不正确！");
			return false;
		}
	}
};

