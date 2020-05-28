export default [{
  path: 'product',
  name: 'product',
  component: () =>
      import('@/view/businessSmart/product.vue'),
  meta: {
    hideInMenu: false,
    title: '产品库',
    notCache: true,
    icon: 'md-home',
    actName: 'product',
    access: ['product']
  }
},
{
  path: 'channel',
  name: 'channel',
  component: () =>
      import('@/view/businessSmart/channel.vue'),
  meta: {
    hideInMenu: false,
    title: '渠道库',
    notCache: true,
    icon: 'md-home',
    actName: 'channel',
    access: ['channel']
  }
},
{
  path: 'addChannel',
  name: 'addChannel',
  component: () =>
      import('@/view/businessSmart/components/channelBank/add/add-channel.vue'),
  meta: {
    hideInMenu: true,
    title: '新增渠道',
    notCache: true,
    icon: 'md-home',
    actName: 'channel'
  }
},
{
  path: 'channelEdit',
  name: 'channelEdit',
  component: () =>
      import('@/view/businessSmart/components/channelBank/edit/edit-channel.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑渠道',
    notCache: true,
    icon: 'md-home',
    actName: 'channel'
  }
},
{
  path: 'channelDetail',
  name: 'channelDetail',
  component: () =>
      import('@/view/businessSmart/components/channelBank/detail/detail-channel.vue'),
  meta: {
    hideInMenu: true,
    title: '渠道详情',
    notCache: true,
    icon: 'md-home',
    actName: 'channel'
  }
},
{
  path: 'businessSet',
  name: 'businessSet',
  component: () =>
      import('@/view/businessSmart/businessConfig.vue'),
  meta: {
    hideInMenu: false,
    title: '业务配置',
    notCache: true,
    icon: 'md-home',
    actName: 'businessSet',
    access: ['busiConfig']
  }
},
{
  path: 'businessAddProduct',
  name: 'businessAddProduct',
  component: () =>
      import('@/view/businessSmart/components/productBank/add/add-product.vue'),
  meta: {
    hideInMenu: true,
    title: '新增产品',
    notCache: false,
    icon: 'md-home',
    actName: 'product'
  }
},
// {
  // 自测自定义弹窗
//   path: 'test',
//   name: 'test',
//   component: () =>
//       import('@/view/businessSmart/components/test.vue'),
//   meta: {
//     hideInMenu: true,
//     title: 'test',
//     notCache: false,
//     icon: 'md-home',
//     actName: 'product'
//   }
// },
{
  path: 'detailProducts',
  name: 'detailProducts',
  component: () =>
      import('@/view/businessSmart/components/productBank/detail/detail-product.vue'),
  meta: {
    hideInMenu: true,
    title: '产品详情',
    notCache: false,
    icon: 'md-home',
    actName: 'product'
  }
},
{
  path: 'editProducts',
  name: 'editProducts',
  component: () =>
      import('@/view/businessSmart/components/productBank/edit/edit-product.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑产品',
    notCache: false,
    icon: 'md-home',
    actName: 'product'
  }
}
]
