export default [{
  path: 'optionSet',
  name: 'optionSet',
  meta: {
    hideInMenu: false,
    title: '选项设置',
    notCache: false,
    icon: 'md-home',
    access: ['optionSet']

  },
  component: () => import('@/view/public/systemset/optionSet')
},
{
  path: '/set/holiday',
  name: 'holiday',
  meta: {
    hideInMenu: false,
    title: '节假日设置',
    notCache: false,
    icon: 'md-home',
    access: ['holiday']

  },
  component: () => import('@/view/systemset/holidaySet.vue')
},
{
  path: '/set/permissonSetting',
  name: 'permissonSetting',
  meta: {
    hideInMenu: false,
    title: '权限设置',
    notCache: false,
    icon: 'md-home',
    access: ['permissonSetting']// 单词拼错了。。。permission
  },
  component: () => import('@/view/systemset/permissionSetting.vue')
},
  //   {
  //     path: '/set/talkRelationship',
  //     name: 'talkRelationship',
  //     meta: {
  //       hideInMenu: true,
  //       title: '面谈设置',
  //       notCache: true,
  //       icon: 'md-home',
  //       access: ['talkRelationship']

  //     },
  //     component: () => import('@/view/public/systemset/talkRelationship.vue')

  //   },
{
  path: '/set/oplog',
  name: 'oplog',
  meta: {
    hideInMenu: false,
    title: '操作日志',
    notCache: true,
    icon: 'md-home',
    access: ['oplog']

  },
  component: () => import('@/view/public/systemset/oplog')
},
{
  path: '/set/doublepermissionSet',
  name: 'doublepermissionSet',
  meta: {
    hideInMenu: true,
    title: '两人两遍权限设置',
    notCache: true,
    icon: 'md-home',
    access: ['doublepermissionSet']

  },
  component: () => import('@/view/public/systemset/doublepermissionSet.vue')
},
{
  path: '/set/talkRelationship',
  name: 'talkRelationship',
  meta: {
    hideInMenu: true,
    title: '面谈设置',
    notCache: true,
    icon: 'md-home',
    access: ['talkRelationship']

  },
  component: () => import('@/view/public/systemset/talkRelationship.vue')
}
]
