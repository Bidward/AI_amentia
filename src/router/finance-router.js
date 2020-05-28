export default [
  {
    path: 'siteDate',
    name: 'siteDate',
    component: () =>
      import('@/view/finance/siteDate.vue'),
    meta: {
      hideInMenu: false,
      title: '业务数据',
      notCache: true,
      icon: 'md-home',
      access: ['finance']
    }
  },
  {
    path: 'financeBusinessSet',
    name: 'financeBusinessSet',
    component: () =>
      import('@/view/finance/businessSet.vue'),
    meta: {
      hideInMenu: false,
      title: '财务配置',
      notCache: true,
      icon: 'md-home',
      access: ['financeConfig']
    }
  }
]
