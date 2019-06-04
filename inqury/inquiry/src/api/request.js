/* eslint-disable */
import axios from 'axios'
import store from '../store'
import router from '../router';
// 创建axios实例
const service = axios.create({
  baseURL: process.env.API_HOST,
  timeout: 5000
})
// request拦截器
service.interceptors.request.use( async (config) => {
  // Do something before request is sent
  let url = config.url;
  if (url.endsWith('/oauth/token')){
    return config;
  }
  let headers = config.headers || {}
  if(sessionStorage.getItem('session') != null){
    headers['sessionId'] = sessionStorage.getItem('session');
  }

  config.headers = headers;
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response;
    const status = res.status;
    if (status == 401){
      //store.dispatch('RemoveToken')
      router.replace({
        path:"/login"
      })
      location.reload();
    }
    return response
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  })
export default service
