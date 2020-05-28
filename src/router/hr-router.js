export default [{
  path: '/userManagement',
  name: 'userManagement',
  component: () => import('@/view/hr/users/user-management.vue'),
  meta: {
    hideInMenu: false,
    title: '用户管理',
    notCache: true,
    icon: 'md-home'
    // access: ['userManage']
  }
},
{
  path: '/addNewUser',
  name: 'addNewUser',
  component: () => import('@/view/hr/users/component/add-newuser.vue'),
  meta: {
    hideInMenu: true,
    title: route => `${route.params.title || '新增'}用户`,
    notCache: true,
    actName: 'userManagement',
    icon: 'md-home'
  }
},
{
  path: '/editBaseInfo',
  name: 'editBaseInfo',
  component: () => import('@/view/hr/users/component/edit-base-info.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑用户基础信息',
    notCache: true,
    actName: 'userManagement',
    icon: 'md-home'
  }
},
{
  path: '/leaveOffice',
  name: 'leaveOffice',
  component: () => import('@/view/hr/users/component/leave-office.vue'),
  meta: {
    hideInMenu: true,
    title: '人员离职',
    notCache: true,
    actName: 'userManagement',
    icon: 'md-home'
  }
},
{
  path: '/completeInfo',
  name: 'completeInfo',
  component: () => import('@/view/hr/users/component/complete-info.vue'),
  meta: {
    hideInMenu: true,
    title: route => `${route.params.title || '新增'}用户信息`,
    notCache: true,
    actName: 'userManagement',
    icon: 'md-home'
  }
}, {
  path: '/lookUserinfo',
  name: 'lookUserinfo',
  component: () => import('@/view/hr/users/component/look-userinfo.vue'),
  meta: {
    hideInMenu: true,
    title: '查看用户信息',
    notCache: true,
    actName: 'userManagement',
    icon: 'md-home'
  }
},
{
  path: '/userManage',
  name: 'userManage',
  component: () => import('@/view/public/organization/userManage.vue'),
  meta: {
    hideInMenu: true,
    title: '用户管理old',
    notCache: false,
    icon: 'md-home'
  }
},
{
  path: '/organization/addUser',
  name: 'addUser',
  meta: {
    actName: 'userManage',
    hideInMenu: true,
    title: route => `${route.params.title || '新增'}用户信息`,
    notCache: true,
    icon: 'md-home'
  },
  component: () => import('@/view/public/organization/addUser')
}, {
  path: '/organization/showUser',
  name: 'showUser',
  meta: {
    actName: 'userManage',
    hideInMenu: true,
    title: '查看用户信息',
    notCache: false,
    icon: 'md-home'
  },
  component: () => import('@/view/public/organization/showUser')
},
{
  path: '/hr/position',
  name: 'position',
  component: () => import('@/view/hr/position/position.vue'),
  meta: {
    hideInMenu: false,
    title: '职位管理',
    notCache: false,
    icon: 'md-home',
    access: ['position']
  }
}, {
  path: '/hr/organization',
  name: 'organization',
  component: () => import('@/view/hr/organization/organization.vue'),
  meta: {
    hideInMenu: false,
    title: '组织规划',
    notCache: false,
    icon: 'md-home',
    access: ['organization']
  }
},
{
  path: '/reward',
  name: 'reward',
  component: () => import('@/view/public/reward/reward'),
  meta: {
    hideInMenu: false,
    title: '日常奖惩',
    notCache: false,
    icon: 'md-home',
    access: ['reward']
  }
},
{
  path: '/duty',
  name: 'duty',
  meta: {
    hideInMenu: false,
    title: '定岗定编',
    notCache: true,
    icon: 'md-home'
  },
  component: () => import('@/view/public/duty/bz-duty.vue')
},
{
  path: '/duty/memberDetail',
  name: 'generalMemberDetail',
  meta: {
    hideInMenu: true,
    title: '定岗定编详情',
    notCache: false,
    actName: 'duty'
  },
  component: () => import('@/view/public/duty/general/generalMember/generalMemberDetail.vue')
},
{
  path: '/duty/resultFb',
  name: 'planDayDetail',
  meta: {
    hideInMenu: true,
    title: '工作计划详情',
    notCache: true,
    actName: 'duty'
  },
  component: () => import('@/view/public/duty/general/generalPlan/planDayDetail.vue')
},
{
  path: '/duty/public-duty',
  name: 'publicDuty',
  meta: {
    hideInMenu: true,
    title: '公共模板',
    notCache: true,
    icon: 'md-home',
    actName: 'duty'
  },
  component: () => import('@/view/public/duty/public/public-duty.vue')
},
{
  path: '/duty/private-duty',
  name: 'privateDuty',
  meta: {
    hideInMenu: true,
    title: '定岗定编',
    notCache: true,
    icon: 'md-home',
    actName: 'duty'
  },
  component: () => import('@/view/public/duty/jobs/private-duty.vue')
}
]
