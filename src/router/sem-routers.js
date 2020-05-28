export default [{
  path: 'baseInfo',
  name: 'semBaseInfo',
  meta: {
    title: '基础信息',
    icon: 'md-home'
  },
  component: () => import('@/view/sem/baseInfo/baseInfo.vue')
},
{
  path: 'sheet',
  name: 'semSheet',
  meta: {
    title: '360成本表',
    icon: 'md-home',
    notCache: false
  },
  component: () => import('@/view/sem/sheet/sheetList.vue')
},
{
  path: 'sheetSearch',
  name: 'semSheetSearch',
  meta: {

    title: '搜索词成本表',
    icon: 'md-home',
    notCache: true,
    hideInMenu: false
  },
  component: () => import('@/view/sem/sheet-search/SheetListSearch.vue')
},
{
  path: 'statis',
  name: 'semStatisList',
  meta: {
    title: '360数据统计',
    icon: 'md-home',
    notCache: true
  },
  component: () => import('@/view/sem/statis/statisList.vue')
},
{
  path: 'sheetBaidu',
  name: 'sheetListBaidu',
  meta: {
    title: '百度成本表',
    icon: 'md-home',
    notCache: false
  },
  component: () => import('@/view/sem/sheet-baidu/sheetListBaidu.vue')
},
{
  path: 'sheetSogou',
  name: 'sheetListSogou',
  meta: {
    title: '搜狗成本表',
    icon: 'md-home',
    notCache: false,
    hideInMenu: false
  },
  component: () => import('@/view/sem/sheet-sogou/SheetListSogou.vue')
},
/*
{
  path: 'semOldsheet',
  name: 'semOldSheet',
  meta: {
    title: '成本表',
    icon: 'md-home',
    notCache: false,
    hideInMenu: true
  },
  component: () => import('@/view/sem/old-sheet/sheetList.vue')
},
*/
{
  path: 'extension',
  name: 'semExtension',
  component: () => import('@/view/sem/group/group.vue'),
  meta: {
    title: '精确模式',
    icon: 'md-home',
    hideInMenu: false,
    notCache: false
  }
},
{
  path: 'shortGroup',
  name: 'semShortGroup',
  component: () => import('@/view/sem/short-group'),
  meta: {
    title: '短语模式',
    icon: 'md-home',
    hideInMenu: false,
    notCache: false
  }
},
// 短语模式推广组编辑页面
{
  path: 'editShortGroup/:title/:groupId',
  name: 'editShortGroup',
  meta: {
    title: route => `${route.params.title === 'add' ? '新增' : '编辑'}短语推广组`,
    hideInMenu: true,
    actName: 'semShortGroup',
    notCache: false
  },
  component: () => import('@/view/sem/short-group/group/GroupEdit.vue')
},
{
  path: 'showShortGroup/:groupId',
  name: 'showShortGroup',
  meta: {
    title: '查看短语推广组',
    hideInMenu: true,
    actName: 'semShortGroup',
    notCache: false
  },
  component: () => import('@/view/sem/short-group/group/GroupShow.vue')
},
// 短语模式产品否定词编辑页面
{
  path: 'negativeWordsDetail',
  name: 'negativeWordsDetail',
  component: () => import('@/view/sem/short-group/negativeWords/NegativeWordsDetail.vue'),
  meta: {
    title: '短语产品详情',
    icon: 'md-home',
    hideInMenu: true,
    notCache: false,
    actName: 'semShortGroup'
  }
},
{
  path: 'softDetail',
  name: 'softDetail',
  component: () => import('@/view/sem/group/software/softwareDetail.vue'),
  meta: {
    title: '产品详情',
    icon: 'md-home',
    hideInMenu: true,
    notCache: false,
    actName: 'semExtension'
  }
},
{
  path: 'keywordDetail/:id',
  name: 'semKeywordDetail',
  meta: {
    title: '关键词详情',
    icon: 'md-home',
    hideInMenu: true,
    notCache: false,
    actName: 'semExtension'
  },
  component: () => import('@/view/sem/group/keywords/detail.vue')
},
{
  path: 'editExtension/:id',
  name: 'editExtension',
  meta: {
    title: route => `${route.query.title}推广组`,
    hideInMenu: true,
    actName: 'semExtension',
    notCache: false
  },
  component: () => import('@/view/sem/group/extension/editExtension.vue')
},
{
  path: 'editExtension/:id',
  name: 'editSimple',
  meta: {
    title: '编辑推广组',
    hideInMenu: true,
    actName: 'semExtension',
    notCache: false
  },
  component: () => import('@/view/sem/group/extension/editSimple.vue')
},
{
  path: 'showExtension/:type/:id',
  name: 'showExtension',
  meta: {
    title: '查看推广组',
    hideInMenu: true,
    actName: 'semExtension',
    notCache: false
  },
  component: () => import('@/view/sem/group/extension/showExtension.vue')
},
{
  path: 'config',
  name: 'semConfig',
  meta: {
    title: '营销配置',
    icon: 'md-home',
    notCache: true
  },
  component: () => import('@/view/sem/config/')
},
{
  path: 'log',
  name: 'semLog',
  meta: {
    title: '日志',
    icon: 'md-home',
    notCache: false
  },
  component: () => import('@/view/sem/log/log.vue')
}
]
