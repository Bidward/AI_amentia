export default [{
  path: '/morningMeeting',
  name: 'morningMeeting',
  meta: {
    title: '晨会纪要',
    icon: 'md-home',
    hideInMenu: true
  },
  component: () => import('@/view/work-report/morning-meeting/morning')
},
{
  path: '/addNewMorning',
  name: 'addNewMorning',
  meta: {
    title: '新增晨会纪要',
    icon: 'md-home',
    actName: 'morningMeeting',
    hideInMenu: true
  },
  component: () => import('@/view/work-report/morning-meeting/add-new-morning')
},
{
  path: '/editMorning',
  name: 'editMorning',
  meta: {
    title: '编辑晨会纪要',
    icon: 'md-home',
    actName: 'morningMeeting',
    notCache: false,
    hideInMenu: true
  },
  component: () => import('@/view/work-report/morning-meeting/edit-morning')
},
{
  path: '/detailMorning',
  name: 'detailMorning',
  meta: {
    title: '晨会纪要详情',
    icon: 'md-home',
    actName: 'morningMeeting',
    hideInMenu: true
  },
  component: () => import('@/view/work-report/morning-meeting/detail-morning')
},
{
  path: '/morningSetting',
  name: 'morningSetting',
  meta: {
    title: '晨会配置',
    icon: 'md-home',
    actName: 'morningMeeting',
    hideInMenu: true
  },
  component: () => import('@/view/work-report/morning-meeting/morning-setting')
}
]
