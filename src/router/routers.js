import Main from '@/components/main'
import semRouters from './sem-routers'// 营销相关页面二级菜单配置
// import parentView from '@/components/parent-view'
import cloudRouters from './cloud-router'
import publicRouters from './public-router'
import hrRouters from './hr-router'
import setRouters from './set-router'
import workRouters from './work-router'
// import financeRouter from './finance-router'
import projectDeclaration from './project-declaration'
import businessRouters from './business-router'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 注意这里的菜单是角色   可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  actName:设置该字段值为某个路由的name，可以指定某个菜单名字高亮,常用于hideInMenu的详情页，需要高亮左侧父菜单
 * }
 */
let route = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true,
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, user-scalable=no'
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: false,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: false,
        title: '个人主页',
        notCache: true,
        icon: 'ios-contact'
      },
      component: () => import('@/view/user/user1')
    }]
  },
  {
    path: '/work',
    name: 'work',
    component: Main,
    meta: {
      title: '工作汇报',
      icon: 'ios-list-box',
      hideInMenu: true,
      showAlways: true
    // access: ['work']
    },
    children: workRouters
  },
  {
    path: '/public',
    name: 'public',
    component: Main,
    meta: {
      title: '综合模块',
      icon: 'ios-list-box',
      hideInMenu: false,
      showAlways: true,
      access: ['public']
    },
    children: publicRouters
  },
  {
    path: '/sem',
    name: 'sem',
    component: Main,
    meta: {
      title: '营销运营中心',
      icon: 'ios-list-box',
      hideInMenu: false,
      showAlways: true,
      access: ['sem']
    },
    children: semRouters
  },
  {
    path: '/hr',
    name: 'hr',
    component: Main,
    meta: {
      title: '人力运营中心',
      icon: 'ios-list-box',
      hideInMenu: false,
      showAlways: true,
      access: ['hr']
    },
    children: hrRouters
  },
  {
    path: '/business',
    name: 'business',
    component: Main,
    meta: {
      title: '商务运营中心',
      icon: 'ios-list-box',
      hideInMenu: false,
      showAlways: true,
      access: ['bi']
    },
    children: businessRouters
  },
  {
    path: '/cloud',
    name: 'cloud',
    component: Main,
    meta: {
      title: '业务运营中心',
      icon: 'ios-list-box',
      hideInMenu: true,
      showAlways: true,
      access: ['cloud']
    },
    children: cloudRouters
  },
  //   {
  //     path: '/finance',
  //     name: 'finance',
  //     component: Main,
  //     meta: {
  //       title: '财务运营中心',
  //       icon: 'ios-list-box',
  //       hideInMenu: false,
  //       access: ['finance']
  //     },
  //     children: financeRouter
  //   },
  {
    path: '/projectDeclaration',
    name: 'projectDeclaration',
    component: Main,
    meta: {
      title: '发展规划中心',
      icon: 'ios-list-box',
      hideInMenu: false,
      showAlways: true,
      access: ['projectReport']
    },
    children: projectDeclaration
  },
  {
    path: '/set',
    name: 'set',
    component: Main,
    meta: {
      title: '系统设置',
      icon: 'md-settings',
      hideInMenu: false,
      showAlways: true,
      access: ['set']
    },
    children: setRouters
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
export default route
