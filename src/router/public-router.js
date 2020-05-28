export default [
// {
//   path: '/reward',
//   name: 'reward',
//   component: () => import('@/view/public/reward/reward'),
//   meta: {
//     hideInMenu: false,
//     title: '日常奖惩',
//     notCache: false,
//     icon: 'md-home',
//     access: ['reward']
//   }
// },
  {
    path: '/task',
    name: 'tasks',
    component: () => import('@/view/public/task/components/task-types.vue'),
    meta: {
      hideInMenu: false,
      title: '任务系统',
      notCache: false,
      icon: 'md-home'
    // access: ['taskTrack']
    },
    redirect: '/task/propose',
    children: [
      {
        path: 'propose',
        name: 'taskPropose',
        component: () => import('@/view/public/task/propose-t'),
        meta: {
          hideInMenu: true,
          title: '我发起的任务',
          icon: 'md-home',
          actName: 'tasks'
        }
      },
      {
        path: 'accept',
        name: 'taskAccept',
        component: () => import('@/view/public/task/accept-t'),
        meta: {
          hideInMenu: true,
          title: '我接收的任务',
          icon: 'md-home',
          actName: 'tasks'
        }
      },
      {
        path: 'excute',
        name: 'taskExcute',
        component: () => import('@/view/public/task/excute-t'),
        meta: {
          hideInMenu: true,
          title: '我执行的任务',
          icon: 'md-home',
          actName: 'tasks'
        }
      },
      {
        path: 'focus',
        name: 'taskFocus',
        component: () => import('@/view/public/task/focus-t'),
        meta: {
          hideInMenu: true,
          title: '我关注的任务',
          icon: 'md-home',
          actName: 'tasks'
        }
      },
      {
        path: 'all',
        name: 'taskAll',
        component: () => import('@/view/public/task/all-t'),
        meta: {
          hideInMenu: true,
          title: '全部任务',
          icon: 'md-home',
          actName: 'tasks'
        }
      },
      {
        path: 'department',
        name: 'taskDepart',
        component: () => import('@/view/public/task/depart-t'),
        meta: {
          hideInMenu: true,
          title: '部门任务',
          icon: 'md-home',
          actName: 'tasks'
        }
      },
      {
        path: 'pending',
        name: 'taskPending',
        component: () => import('@/view/public/task/pending-t'),
        meta: {
          hideInMenu: true,
          title: '待审任务',
          icon: 'md-home',
          actName: 'tasks'
        }
      },
      {
        path: 'monthly',
        name: 'taskMonthly',
        component: () => import('@/view/public/task/monthly-t'),
        meta: {
          hideInMenu: true,
          title: '月度评审',
          icon: 'md-home',
          actName: 'tasks'
        }
      }

    ]
  },
  {
    path: '/task/detail/:id',
    name: 'taskDetail',
    component: () => import('@/view/public/task/detail.vue'),
    meta: {
      hideInMenu: true,
      title: '任务详情',
      notCache: true,
      icon: 'md-home',
      showDetail: true,
      actName: 'tasks',
      // 是否处于编辑状态
      isEditing: false
    }
  },
  {
    path: '/task/edit/:id',
    name: 'taskEdit',
    component: () => import('@/view/public/task/edit.vue'),
    meta: {
      hideInMenu: true,
      title: '任务编辑',
      notCache: true,
      icon: 'md-home',
      showEdit: true,
      actName: 'tasks',
      isEditing: false
    }
  },
  {
    path: '/companyinfo',
    name: 'companyinfo',
    component: () => import('@/view/public/companyinfo/companyinfo'),
    meta: {
      hideInMenu: false,
      title: '公司信息',
      notCache: false,
      icon: 'md-home'
    //   access: ['companyinfo']
    }
  },
  {
    path: '/companyinfo/addCompany',
    name: 'addCompany',
    meta: {
      actName: 'companyinfo',
      hideInMenu: true,
      title: '新增公司信息',
      notCache: false,
      icon: 'md-home'
    },
    component: () => import('@/view/public/companyinfo/addCompany')
  },
  {
    path: '/companyinfo/editCompany',
    name: 'editCompany',
    meta: {
      hideInMenu: true,
      title: '编辑公司信息',
      notCache: false,
      icon: 'md-home'
    },
    component: () => import('@/view/public/companyinfo/editCompany')
  },
  {
    path: '/companyinfo/showCompany',
    name: 'showCompany',
    meta: {
      hideInMenu: true,
      title: '查看公司详情',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/public/companyinfo/showCompany')
  },
  {
    path: '/talk',
    name: 'talk',
    meta: {
      hideInMenu: true,
      title: '成员面谈',
      notCache: true,
      icon: 'md-home',
      access: ['talk']
    },
    component: () => import('@/view/public/talk/talk.vue')
  },
  {
    path: '/station',
    name: 'station',
    meta: {
      hideInMenu: false,
      title: '站内信',
      notCache: true,
      icon: 'md-home',
      access: ['station']
    },
    component: () => import('@/view/public/station/station.vue')
  },
  {
    path: '/station/unreadList',
    name: 'unreadList',
    meta: {
      hideInMenu: true,
      title: '未读列表',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/public/station/unreadList.vue')
  }, {
    path: '/approval',
    name: 'approval',
    meta: {
      hideInMenu: false,
      title: '审批中心',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/public/approval/approvalCenter.vue')
  }, {
    path: '/approval/settingApproval',
    name: 'settingApproval',
    meta: {
      hideInMenu: true,
      title: '审批流程设置',
      notCache: true,
      icon: 'md-home',
      actName: 'approval'
    },
    component: () => import('@/view/public/approval/settingApproval/settingApproval.vue')
  }, {
    path: '/approval/taskApproval',
    name: 'taskApproval',
    meta: {
      hideInMenu: true,
      title: '任务审批',
      notCache: true,
      icon: 'md-home',
      actName: 'approval'
    },
    component: () => import('@/view/public/approval/taskApproval/taskApproval.vue')
  }, {
    path: '/approval/revokeApproval',
    name: 'revokeApproval',
    meta: {
      hideInMenu: true,
      title: '销分审批',
      notCache: true,
      icon: 'md-home',
      actName: 'approval'
    },
    component: () => import('@/view/public/approval/revokeApproval/revokeApproval.vue')
  }
// {
//   path: '/duty',
//   name: 'duty',
//   meta: {
//     hideInMenu: false,
//     title: '定岗定编',
//     notCache: true,
//     icon: 'md-home'
//   },
//   component: () => import('@/view/public/duty/bz-duty.vue')
// },
// {
//   path: '/duty/memberDetail',
//   name: 'generalMemberDetail',
//   meta: {
//     hideInMenu: true,
//     title: '定岗定编详情',
//     notCache: true,
//     actName: 'duty'
//   },
//   component: () => import('@/view/public/duty/general/generalMember/generalMemberDetail.vue')
// },
// {
//   path: '/duty/resultFb',
//   name: 'planDayDetail',
//   meta: {
//     hideInMenu: true,
//     title: '工作计划详情',
//     notCache: true,
//     actName: 'duty'
//   },
//   component: () => import('@/view/public/duty/general/generalPlan/planDayDetail.vue')
// },
// {
//   path: '/duty/public-duty',
//   name: 'publicDuty',
//   meta: {
//     hideInMenu: true,
//     title: '公共模板',
//     notCache: true,
//     icon: 'md-home',
//     actName: 'duty'
//   },
//   component: () => import('@/view/public/duty/public/public-duty.vue')
// },
// {
//   path: '/duty/private-duty',
//   name: 'privateDuty',
//   meta: {
//     hideInMenu: true,
//     title: '定岗定编',
//     notCache: true,
//     icon: 'md-home',
//     actName: 'duty'
//   },
//   component: () => import('@/view/public/duty/jobs/private-duty.vue')
// }
// {
//   path: '/duty/ant-design',
//   name: 'antDesign',
//   meta: {
//     hideInMenu: false,
//     title: 'ant-design',
//     notCache: true,
//     icon: 'md-home',
//     actName: 'duty'
//   },
//   component: () => import('@/view/public/duty/components/public-template.vue')
// }
]
