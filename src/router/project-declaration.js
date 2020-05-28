export default[
  {
    path: 'relationship',
    name: 'relationship',
    component: () => import('@/view/project-declaration/relationship/index.vue'),
    meta: {
      hideInMenu: true,
      title: '外联清单',
      notCache: false,
      icon: 'md-home'
    }
  },
  {
    path: 'informationPending',
    name: 'informationPending',
    component: () => import('@/view/project-declaration/information-base/information-pending.vue'),
    meta: {
      hideInMenu: false,
      title: '信息库',
      notCache: true,
      icon: 'md-home',
      access: ['projectReportInfo']
    }
  },
  {
    path: 'editInfo',
    name: 'editInfo',
    component: () => import('@/view/project-declaration/information-base/edit/edit.vue'),
    meta: {
      hideInMenu: true,
      title: '编辑政策',
      notCache: true,
      icon: 'md-home',
      actName: 'informationPending'
    }
  },
  {
    path: 'deatilInfo',
    name: 'deatilInfo',
    component: () => import('@/view/project-declaration/information-base/detail/detail.vue'),
    meta: {
      hideInMenu: true,
      title: '政策详情',
      notCache: true,
      icon: 'md-home',
      actName: 'informationPending'
    }
  },
  {
    path: 'projectBank',
    name: 'projectBank',
    component: () => import('@/view/project-declaration/project-bank/index.vue'),
    meta: {
      hideInMenu: false,
      title: '项目库',
      notCache: true,
      icon: 'md-home',
      access: ['projectReportProject']
    }
  },
  {
    path: 'editProject',
    name: 'editProject',
    component: () => import('@/view/project-declaration/project-bank/edit-project.vue'),
    meta: {
      hideInMenu: true,
      title: '编辑项目',
      notCache: true,
      icon: 'md-home',
      actName: 'projectBank'
    }
  },
  {
    path: 'detailProject',
    name: 'detailProject',
    component: () => import('@/view/project-declaration/project-bank/detail-project.vue'),
    meta: {
      hideInMenu: true,
      title: '项目详情',
      notCache: true,
      icon: 'md-home',
      actName: 'projectBank'
    }
  },
  {
    path: 'projectConfig',
    name: 'projectConfig',
    component: () => import('@/view/project-declaration/project-config/index.vue'),
    meta: {
      hideInMenu: false,
      title: '项目配置',
      notCache: true,
      icon: 'md-home',
      access: ['projectReportConfig']
    }
  }
]
