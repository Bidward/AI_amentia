let base = 'http://zone.bz.cn/BzSystem'
let phpBase = 'http://support.bz.cn'
// let base = 'http://47.101.211.217:8080/BzSystem'
// let phpBase = 'http://support.z.cn'b
// 如果是正式服地址
if (window.location.host === 'mg.bz.cn' || window.location.host === 'zone.bz.cn') {
  base = '/BzSystem'
  phpBase = '/support'
} else {
  // 非正式服环境
  //   base = 'http://zone.bz.cn/BzSystem'// 因为测试服没有权限所以先用正式服的接口
  base = '/BzSystem' // 测试服'
  // base = 'http://192.168.3.112:8080/BzSystem' // 庞颖
  // base = 'http://192.168.2.138:8080/BzSystem' // 张弛
  // base = 'http://192.168.2.32:8080/BzSystem' // 张志远
  // base = 'http://192.168.1.133:8080/BzSystem'
  //   base = '/BzSystem'
  phpBase = '/support'
}
// 默认图片上传等静态资源的域名路径
export const phpURL = phpBase
// export const staticUrl = 'http://static.bz.cn/'
export const staticUrl = '/resources/'
// 营销那边服务器，没有测试服只有正式服
export const semUrl = '/sem'
export const baseUrl = base
// 业务
export const biUrl = '/bi'
export const proBaseUrl = '/bi'
export const goTrack = '/goTrack'
export const semGaohanUrl = 'http://47.100.215.113:8080/bzSEM'
export const prUrl = '/pr'// 项目申报
