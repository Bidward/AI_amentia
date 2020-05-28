import store from '@/store'
import { goTrack } from '@/api/base.js'
const ua = navigator.userAgent

const Log = {
  // Nzs 用来上报接口异常的服务
  sendErrorLog: (errorInfo) => {
    const apiUrl = '//egg.nnnnzs.cn/api/cnzz1'
    // const apiUrl = '//localhost:7001/api/cnzzv2';
    const { request: { responseURL }, message } = errorInfo
    const query = errorInfo.config.data
    const userName = store.state.user.nickname || '未登录'
    const data = { userName, message, responseURL, query }
    Log.sendLogImg(apiUrl, data)
  },
  // 上报接口响应时间
  sendTrackLog: (trackInfo) => {
    const endTime = new Date().getTime()
    // const apiUrl = '//localhost:7001/api/track'
    const apiUrl = '//egg.nnnnzs.cn/api/track'
    const { url, data, metadata: { startTime } } = trackInfo
    let log = { startTime, endTime, url, data, ua, user: store.state.user.nickname || '未登录' }
    Log.sendLogImg(apiUrl, log)
  },
  // 用img标签发送统计埋点，绕过axios拦截器
  sendLogImg: (baseUrl, data = {}) => {
    let log = new Image()
    log.src = `${baseUrl}?${$qs.stringify(data)}`
  }
}
export default Log

/**
 * 在具体页面内new一个实例，传入页面对应路径
 * const track = new Track('综合模块/任务系统/全部任务')
 * 在生命周期 beforCreate的时候  track.start();
 * 在页面主要内容的接口后面   this.$nextTick(()=>{track.end()})
 */
export class Track {
  constructor (path) {
    const [path1 = '', path2 = '', path3 = ''] = path.split('/')
    this.data = {
      ua,
      path1,
      path2,
      path3,
      user: store.state.user.nickname || '未登录',
      startTime: null
    }
  }
  start () {
    // 防止重复记录开始时间
    if (this.data.startTime) return
    this.data.startTime = new Date().getTime()
  }
  end () {
    // 防止没有记录开始时间就上报，无意义
    if (this.data.startTime) {
      this.data.endTime = new Date().getTime()
      const data = this.data
      data.loadTime = this.data.endTime - this.data.startTime// 加载时间
      this.sendTrackImg(data)
      // 清空当前时间
      this.data.startTime = null
      this.data.endTime = null
    }
  }
  sendTrackImg (data = {}) {
    let log = new Image()
    let baseUrl = goTrack + '/recording/time'
    log.src = `${baseUrl}?${$qs.stringify(data)}`
  }
}
