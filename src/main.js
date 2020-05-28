// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'view-design'

// 2020年3月18日nzs注释用于提升加载速度，组件懒加载
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import '@/style/index.less'
import './index.less'
import '@/assets/icons/iconfont.css'
import qs from 'qs'
import axios from 'axios'

// 组织架构图组件
// 2019年12月30日 Nzs注释，放到具体页面里面引用
// import OrgTree from 'v-org-tree'
// import 'v-org-tree/dist/v-org-tree.css'

import Print from 'vue-print-nb'

import 'moment/locale/zh-cn'

// 2020年3月18日nzs注释用于提升加载速度，组件懒加载
// tree-table vxe
// import 'xe-utils'
// import VXETable from 'vxe-table'
// import 'vxe-table/lib/index.css'

// 图片预览
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// font-awesome
import 'font-awesome/css/font-awesome.css'

// Vue.use(VXETable)

// 打印插件
Vue.use(Print) // 注册
Vue.prototype.$axios = axios

// qs
window.$qs = qs

// 2020年3月18日nzs注释用于提升加载速度，组件懒加载
// Vue.use(ElementUI, {
//   i18n: (key, value) => i18n.t(key, value)
// })

Vue.use(Viewer)
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

//这是正常的全局注册
Vue.use(iView, {
    transfer: true,
    i18n: (key, value) => i18n.t(key, value)
});

/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
    /**
     * @description 生产环境关掉提示
     */
Vue.config.productionTip = false
    /**
     * @description 全局注册应用配置
     */
Vue.prototype.$config = config
    /**
     * 注册指令
     */
importDirective(Vue)

/* eslint-disable no-new */
const vm = new Vue({
    el: '#app',
    router,
    i18n,
    store,
    render: h => h(App)
})
window.bus = new Vue()

//公用函数
/* 2020年3月18日Nzs注释，改用mixin到各组件
Vue.tabChangeClick = function(name) {
    switch (name) {
        case '1':
            vm.$router.push({
                name: 'productCompany'
            })
            break
        case '2':
            vm.$router.push({
                name: 'channelCompany'
            })
            break
        case '3':
            vm.$router.push({
                name: 'contractBank'
            })
            break
        case '4':
            vm.$router.push({
                name: 'productBank'
            })
            break
        case '5':
            vm.$router.push({
                name: 'productLink'
            })
            break
        case '6':
            vm.$router.push({
                name: 'toAuditInform'
            })
            break
    }
}
*/

//axios拦截器等功能配置
import '@/api/config.js'

// log
