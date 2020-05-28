import axios from 'axios'
import store from '@/store'
import vue from 'vue'
import { semUrl } from './base.js'
import { setToken } from '@/libs/util'
import Log from '@/libs/track'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 是sem的域名，把当前登录的用户名带到headers的token里面
  if (config.url.indexOf(semUrl) > -1) {
    if (store.state.user.nickname) {
      config.headers.token = encodeURI(store.state.user.nickname)
    }
  }
  config.metadata = { startTime: new Date().getTime() }
  return config
}, function (error) {
  // 对请求错误做些什么
  console.warn(error)
  return Promise.reject(error)
})

// axios响应拦截器,用于对session过期跳转到登录页面
axios.interceptors.response.use(function (response) {
  // 拦截未登录，跳转到登录页面
  // 除非登录状态手动清除cookie，不然不会有登陆过期
  if (response.data.message === '未登录') {
    // 清除本地token
    setToken('')
    vue.$router.push({
      name: 'login'
    })
    return response
  };
  // Log.sendTrackLog(response.config);
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error) {
    console.warn(error)
  }
  Log.sendErrorLog(error)
  return Promise.reject(error)
})
