//请求头格式化
export function getQueryString(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = url.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
//日期格式化
export function timestampToTime (timestamp, timetype) {
        if (timestamp == null || timestamp == '') { 
            return ""; 
        } 
        var date = new Date(timestamp * 1);
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        var day = date.getDay();
        var returndate = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
        switch (timetype) {
            case 1:
                returndate = Y + "-" + M + "-" + D + " " + h + ":" + m;
                break;
            case 2:
                returndate = Y + "-" + M + "-" + D;
                break;
            case 3:
                returndate = h + ":" + m + ":" + s;
                break;
            case 4:
                returndate = Y + ":" + M;
                break;
            case 5:
                returndate = h + ":" + m;
                break;
            case 6:
                returndate = M + "-" + D;
                break;
            case 7:
                returndate = m + ":" + s;
                break;
            case 8:
                returndate = day;
                break;
        }
        if (timetype == 8) {
            switch (returndate) {
                case 0:
                    returndate = '星期日';
                    break;
                case 1:
                    returndate = '星期一';
                    break;
                case 2:
                    returndate = '星期二';
                    break;
                case 3:
                    returndate = '星期三';
                    break;
                case 4:
                    returndate = '星期四';
                    break;
                case 5:
                    returndate = '星期五';
                    break;
                case 6:
                    returndate = '星期六';
                    break;
            }
        }
        return returndate.trim();
    }
    export function filteresx(v){
        return v==1?"男":"女";
    }