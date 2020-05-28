export default [{
  path: '/productCompany',
  name: 'productCompany',
  component: () =>
            import('@/view/cloud/parter/productCompany.vue'),
  meta: {
    hideInMenu: false,
    title: '合作关系', // 合作关系
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
},
{
  path: '/dataScreening',
  name: 'dataScreening',
  component: () =>
            import('@/view/cloud/dataStatistics/dataScreening.vue'),
  meta: {
    hideInMenu: false,
    title: '数据统计',
    notCache: true,
    icon: 'md-home',
    actName: 'dataScreening'
  }
}, {
  path: '/productCompany/waitConProduct',
  name: 'waitConProduct',
  component: () =>
            import('@/view/cloud/parter/product/waitConProduct.vue'),
  meta: {
    hideInMenu: true,
    title: '待确认产品公司',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/channelCompany/waitConChannel',
  name: 'waitConChannel',
  component: () =>
            import('@/view/cloud/parter/channel/waitConChannel.vue'),
  meta: {
    hideInMenu: true,
    title: '待确认渠道公司',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/productBank/waitSureProductBanckCon',
  name: 'waitSureProductBanckCon',
  component: () =>
            import('@/view/cloud/parter/produckBank/waitSureProductBanckCon.vue'),
  meta: {
    hideInMenu: true,
    title: '待确认产品',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/productLink/waitSureProductLink',
  name: 'waitSureProductLink',
  component: () =>
            import('@/view/cloud/parter/productLink/waitSureProductLink.vue'),
  meta: {
    hideInMenu: true,
    title: '待确认信息',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/toAuditInform/toAuditOnline',
  name: 'toAuditOnline',
  component: () =>
            import('@/view/cloud/parter/toAudit/toAuditOnline.vue'),
  meta: {
    hideInMenu: true,
    title: '待审核上线',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/contractBank/waitSureContract',
  name: 'waitSureContract',
  component: () =>
            import('@/view/cloud/parter/contract/waitSureContract.vue'),
  meta: {
    hideInMenu: true,
    title: '待确认合同',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/contractBank/waitSign',
  name: 'waitSign',
  component: () =>
            import('@/view/cloud/parter/contract/waiSign.vue'),
  meta: {
    hideInMenu: true,
    title: '待签订',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/channelCompany',
  name: 'channelCompany',
  component: () =>
            import('@/view/cloud/parter/channelCompany.vue'),
  meta: {
    hideInMenu: true,
    title: '渠道公司',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/contractBank',
  name: 'contractBank',
  component: () =>
            import('@/view/cloud/parter/contractBank.vue'),
  meta: {
    hideInMenu: true,
    title: '合同库',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['partnership']
  }
}, {
  path: '/productBank',
  name: 'productBank',
  component: () =>
            import('@/view/cloud/parter/productBank.vue'),
  meta: {
    hideInMenu: true,
    title: '产品库',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['partnership']
  }
}, {
  path: '/productLink',
  name: 'productLink',
  component: () =>
            import('@/view/cloud/parter/productLink.vue'),
  meta: {
    hideInMenu: true,
    title: '产品链接库',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['partnership']
  }
}, {
  path: '/toAuditInform',
  name: 'toAuditInform',
  component: () =>
            import('@/view/cloud/parter/toAuditInform.vue'),
  meta: {
    hideInMenu: true,
    title: '待审核上线',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['partnership']
  }
}, {
  path: '/addProduct',
  name: 'addProduct',
  component: () =>
            import('@/view/cloud/add/addProduct.vue'),
  meta: {
    hideInMenu: true,
    title: '新增产品公司',
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/editProduct',
  name: 'editProduct',
  component: () =>
            import('@/view/cloud/edit/editProduct.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑产品公司',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'

  }
}, {
  path: '/twoEditProduct',
  name: 'twoEditProduct',
  component: () =>
            import('@/view/cloud/parter/product/twoEditProduct.vue'),
  meta: {
    hideInMenu: true,
    title: '二次编辑产品公司',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'

  }
}, {
  path: '/detailProduct',
  name: 'detailProduct',
  component: () =>
            import('@/view/cloud/detail/detailProduct.vue'),
  meta: {
    hideInMenu: true,
    title: '产品公司详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/twoDetailContract',
  name: 'twoDetailContract',
  component: () =>
            import('@/view/cloud/parter/contract/twoDetailContract.vue'),
  meta: {
    hideInMenu: true,
    title: '二次合同删除', // 我方收款
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/addChannle',
  name: 'addChannle',
  component: () =>
            import('@/view/cloud/add/addChannle.vue'),
  meta: {
    hideInMenu: true,
    title: '新增渠道公司',
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/editChannel',
  name: 'editChannel',
  component: () =>
            import('@/view/cloud/edit/editChannel.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑渠道公司',
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/twoEditChannel',
  name: 'twoEditChannel',
  component: () =>
            import('@/view/cloud/parter/channel/twoEditChannel.vue'),
  meta: {
    hideInMenu: true,
    title: '二次编辑渠道公司',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'

  }
}, {
  path: '/detailChannel',
  name: 'detailChannel',
  component: () =>
            import('@/view/cloud/detail/detailChannel.vue'),
  meta: {
    hideInMenu: true,
    title: '渠道公司详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
},
{
  path: '/payDetailChannel',
  name: 'payDetailChannel',
  component: () =>
            import('@/view/cloud/detail/payDetailChannel.vue'),
  meta: {
    hideInMenu: true,
    title: '渠道公司详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
},
{
  path: '/addIncome',
  name: 'addIncome',
  component: () =>
            import('@/view/cloud/add/addIncome.vue'),
  meta: {
    hideInMenu: true,
    title: '我方拟定新增收款合同', // 我方拟定
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/addPayment',
  name: 'addPayment',
  component: () =>
            import('@/view/cloud/add/addPayment.vue'),
  meta: {
    hideInMenu: true,
    title: '我方拟定新增付款合同', // 我方拟定
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }

}, {
  path: '/twoEditIncome',
  name: 'twoEditIncome',
  component: () =>
            import('@/view/cloud/parter/contract/twoEditIncome.vue'),
  meta: {
    hideInMenu: true,
    title: '二次我方拟定新增收款合同', // 我方拟定
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }

}, {
  path: '/otherAddIncome',
  name: 'otherAddIncome',
  component: () =>
            import('@/view/cloud/add/otherAddIncome.vue'),
  meta: {
    hideInMenu: true,
    title: '对方拟定新增收款合同', // 对方拟定
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
}, {
  path: '/supplement',
  name: 'supplement',
  component: () =>
            import('@/view/cloud/detail/supplement.vue'),
  meta: {
    hideInMenu: true,
    title: '补充协议',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }

},
{
  path: '/paySupplement',
  name: 'paySupplement',
  component: () =>
            import('@/view/cloud/detail/paySupplement.vue'),
  meta: {
    hideInMenu: true,
    title: '补充协议',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }

},
{
  path: '/rebuild',
  name: 'rebuild',
  component: () =>
            import('@/view/cloud/detail/rebuild.vue'),
  meta: {
    hideInMenu: true,
    title: '重新生成',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
},
{
  path: '/payRebuild',
  name: 'payRebuild',
  component: () =>
            import('@/view/cloud/detail/payRebuild.vue'),
  meta: {
    hideInMenu: true,
    title: '重新生成',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }

},
{
  path: '/editUnsign',
  name: 'editUnsign',
  component: () =>
            import('@/view/cloud/edit/editUnsign.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑待签订合同',
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }

},
{
  path: '/payEditUnsign',
  name: 'payEditUnsign',
  component: () =>
            import('@/view/cloud/edit/payEditUnsign.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑待签订合同',
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }

},
{
  path: '/detailContract',
  name: 'detailContract',
  component: () =>
            import('@/view/cloud/detail/detailContract.vue'),
  meta: {
    hideInMenu: true,
    title: '合同详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
},
{
  path: '/payDetailContract',
  name: 'payDetailContract',
  component: () =>
            import('@/view/cloud/detail/payDetailContract.vue'),
  meta: {
    hideInMenu: true,
    title: '合同详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }
},
{
  path: '/otherAddPayment',
  name: 'otherAddPayment',
  component: () =>
            import('@/view/cloud/add/otherAddPayment.vue'),
  meta: {
    hideInMenu: true,
    title: '对方拟定新增付款合同', // 对方拟定
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
  }

}, {
  path: '/dataSheet',
  name: 'dataSheet',
  component: () =>
            import('@/view/cloud/dataSheet.vue'),
  meta: {
    hideInMenu: false,
    title: '数据表',
    notCache: true,
    icon: 'md-home',
    actName: 'dataSheet'
    // access: ['dataSheet']
  }
}, {
  path: '/set/cloudConfig',
  name: 'cloudConfig',
  meta: {
    hideInMenu: false,
    title: '业务配置',
    notCache: true,
    icon: 'md-home',
    access: ['cloudConfig']

  },
  component: () =>
            import('@/view/public/systemset/cloudConfig/businessConfigCon.vue')
}, {
  path: '/set/editLabelManage/:id',
  name: 'editLabelManage',
  meta: {
    hideInMenu: true,
    title: '编辑标签管理',
    notCache: false,
    icon: 'md-home',
    // access: ['cloudConfig'],
    actName: 'cloudConfig'
  },
  component: () => import('@/view/public/systemset/cloudConfig/edit/editLabelManage.vue')
},
{
  path: '/set/twoEditLabelManage/:id',
  name: 'twoEditLabelManage',
  meta: {
    hideInMenu: true,
    title: '编辑标签管理',
    notCache: false,
    icon: 'md-home',
    // access: ['cloudConfig'],
    actName: 'cloudConfig'
  },
  component: () => import('@/view/public/systemset/cloudConfig/edit/twoEditLabelManage.vue')
},
{
  path: '/set/labelManage',
  name: 'labelManage',
  meta: {
    hideInMenu: true,
    title: '标签关联管理',
    notCache: false,
    icon: 'md-home',
    // access: ['cloudConfig'],
    actName: 'cloudConfig'
  },
  component: () => import('@/view/public/systemset/cloudConfig/labelManageCon.vue')
},
{
  path: '/set/waitConfirmCon',
  name: 'waitConfirmCon',
  meta: {
    hideInMenu: true,
    title: '待确认事项',
    notCache: false,
    icon: 'md-home',
    // access: ['cloudConfig'],
    actName: 'cloudConfig'
  },
  component: () => import('@/view/public/systemset/cloudConfig/awaitConfirmCon.vue')
},

  // 安装
{
  path: '/dataSheet/detailSet',
  name: 'detailSet',
  component: () =>
            import('@/view/cloud/detailSheet/detailSet.vue'),
  meta: {
    hideInMenu: true,
    title: '数据表详情',
    notCache: true,
    icon: 'md-home',
    actName: 'dataSheet'
    // access: ['dataSheet']
  }
},
  // 分成
{
  path: '/dataSheet/detailDevide',
  name: 'detailDevide',
  component: () =>
            import('@/view/cloud/detailSheet/detailDevide.vue'),
  meta: {
    hideInMenu: true,
    title: '数据表详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
},
  // 留存
{
  path: '/dataSheet/detailKeep',
  name: 'detailKeep',
  component: () =>
            import('@/view/cloud/detailSheet/detailKeep.vue'),
  meta: {
    hideInMenu: true,
    title: '数据表详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
},
  // 充值
{
  path: '/dataSheet/detailPay',
  name: 'detailPay',
  component: () =>
            import('@/view/cloud/detailSheet/detailPay.vue'),
  meta: {
    hideInMenu: true,
    title: '数据表详情',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
},
  //  {
  //   path: '/dataSheet/detailDataSheet',
  //   name: 'detailDataSheet',
  //   component: () => import('@/view/cloud/detailDataSheet.vue'),
  //   meta: {
  //     hideInMenu: true,
  //     title: '数据表详情',
  //     notCache: false,
  //     icon: 'md-home',
  //     actName: 'productCompany'
  //     // access: ['dataSheet']
  //   }
  // },
  // 合同预览
{
  path: '/contractView',
  name: 'contractView',
  component: () =>
            import('@/view/cloud/contractView.vue'),
  meta: {
    hideInMenu: true,
    title: '收款合同预览',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
}, {
  path: '/payContractView',
  name: 'payContractView',
  component: () =>
            import('@/view/cloud/payContractView.vue'),
  meta: {
    hideInMenu: true,
    title: '付款合同预览',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }

},
{
  path: '/contractApprove',
  name: 'contractApprove',
  component: () =>
            import('@/view/cloud/contractApprove.vue'),
  meta: {
    hideInMenu: true,
    title: '合同审批',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
},
{
  path: '/payContractApprove',
  name: 'payContractApprove',
  component: () =>
            import('@/view/cloud/payContractApprove.vue'),
  meta: {
    hideInMenu: true,
    title: '合同审批',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
},
{
  path: '/toAuditDetail',
  name: 'toAuditDetail',
  component: () =>
            import('@/view/cloud/toAuditDetail.vue'),
  meta: {
    hideInMenu: true,
    title: '待审核合同',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
},
{
  path: '/payToAuditDetail',
  name: 'payToAuditDetail',
  component: () =>
            import('@/view/cloud/payToAuditDetail.vue'),
  meta: {
    hideInMenu: true,
    title: '待审核合同',
    notCache: true,
    icon: 'md-home',
    actName: 'productCompany'
    // access: ['dataSheet']
  }
},
{
  path: '/addProductBank',
  name: 'addProductBank',
  component: () =>
            import('@/view/cloud/add/addProductBank.vue'),
  meta: {
    hideInMenu: true,
    title: '新增产品',
    icon: 'md-home',
    notCache: false,
    actName: 'productCompany'
  }
}, {
  path: '/editProduckBank',
  name: 'editProduckBank',
  component: () =>
            import('@/view/cloud/edit/editProduckBank.vue'),
  meta: {
    hideInMenu: true,
    title: '编辑产品',
    notCache: false,
    icon: 'md-home',
    actName: 'productCompany'
  }
}
]
