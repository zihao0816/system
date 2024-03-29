import axios from 'axios';
import common from './common';
import { Toast } from 'we-vue';
import Qs from 'qs';


axios.defaults.timeout = 500000;

//http request 拦截器
// axios.interceptors.request.use(
//     config => {
//         config.data = JSON.stringify(config.data);
//         return config;
//     },
//     error => {
//         return Promise.reject(err);
//     }
// );
//http response 拦截器
axios.interceptors.response.use(
    response => {
        if (response.data.errCode == 2) {
            router.push({
                path: "/login",
                querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
            })
        }
        return response;
    },
    error => {
        return Promise.reject(error)
    }
)

/**
 * 封装请求
 * @param url 请求路径
 * @param data
 * @param success 成功的回调方法
 * @param error 失败的回调方法，默认会弹框
 * @param thenfunction ajax请求回调方法 可以不传
 * @param ContentType  默认 'application/json'， 传true 代表让请求自动适配
 * @param getpost 请求类型 默认根据data是否有值确定
 * @param catchs 请求类型 默认根据data是否有值确定
 * @param config 额外的请求配置
 * 当url为json时 可通过url配置参数
 * @returns {Promise}
*/
export function doRequest(url, data, success, error, thenfunction, ContentType, getpost,catchs, config) {
    if(typeof(url)=='object'){
        data=data==null?url.data:data;
        success=success==null?url.success:success;
        error=error==null?url.error:error;
        thenfunction=thenfunction==null?url.thenfunction:thenfunction;
        ContentType=ContentType==null?url.ContentType:ContentType;
        getpost=getpost==null?url.getpost:getpost;
        catchs=catchs==null?url.catchs:catchs;
        config=config==null?url.config:config;
        url=url.url;
    }
    if (getpost == null) {
        getpost = data == null ? "get" : "post";
    }
    config = config == null ? {} : config;
    config.method = getpost;
    config.url = url;
    if (data != null) {
        config.data = ContentType == null ? JSON.stringify(data) : data;
    }

    config.headers = config.headers == null ? {} : config.headers;
    if (ContentType != true) {
        config.headers["Content-Type"] = ContentType == null ? 'application/json' : ContentType;
    }
    try {
        config.headers.sessionId = this.$store.state.userInfo.sessionId
    } catch (e) {
    }
    if (process.env.API_HOST) {
        config.baseURL = process.env.API_HOST;
    }
    return axios(config)
        .then(res => {
            if (res.status != 200) {
                Toast({
                    duration: 2000,
                    message: "请求失败，请稍后再试",
                    type: 'text'
                })
            } else {
                if (typeof (thenfunction) == 'function') {
                    return thenfunction(res.data);
                } else {
                    if (res.data.result == -1) {
                        if (typeof (error) == 'function') {
                            return error(res.data);
                        } else {
                            var message = res.data.message;
                            Toast({
                                duration: 2000,
                                message: message,
                                type: 'text'
                            })
                        }
                    } else {
                        if (typeof (success) == 'function') {
                            return success(res.data);
                        } else {
                            return res.data;
                        }
                    }
                }
            }
        })
        .catch(err => {
            if (typeof (catchs) == 'function') {
                return catchs(err);
            }
        })
}

/**
 * 封装登录
 * @param {url} url
 * @param {dosome} 当前页面默认渲染数据方法
 * @param {second}  默认不传
 */
export function isLogin(url, dosome, second) {
    var _this = this;
    if (this.$store.state.userInfo.sessionId != null && this.$store.state.userInfo.sessionId != '') {
        dosome();
    } else {
        var code = common.getQueryString(url, 'code');
        var ptid = '';
        try {
            ptid = common.getQueryString(url, 'ptid');
        } catch (error) {
            
        }
        var data = {
            code: code,
            patientid: ptid
        };
        var _this = this;
        if (code != '') {
            doRequest('/api/Personal/VueLogin', data, res => {
                doRequest("/api/Configuration/getConfiguration", null, response => {
                    _this.$store.state.common = response;
                    _this.$store.state.userInfo = res;

                    _this.$login(_this,res);
                    dosome();
                });
            })
        } else {
            if (second == null) {
                setTimeout(() => {
                    isLogin(url, dosome, false)
                }, 1000);
            } else {
                Toast({
                    duration: 2000,
                    message: "请从公众号进入",
                    type: 'text'
                })
            }
        }
    }
}

/**
 * 弹窗
 * @param {msg} 文本内容
 * @param {time} 显示时间
 */
export function toastMsg(msg, time) {
    Toast({
        durcation: time == null || time == '' ? 2000 : time,
        message: msg,
        type: 'text'
    })
}
