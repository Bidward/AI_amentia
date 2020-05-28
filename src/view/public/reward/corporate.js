export default {
  data () {
    return {
      // 核心列表
      isCoreList: [
        {
          id: -1,
          value: '全部'
        },
        {
          id: 0,
          value: '非核心'
        },
        {
          id: 1,
          value: '核心'
        }
      ],
      // 价值观对应id列表
      corporateValueList: [
        {
          id: 0,
          value: '全部'
        },
        {
          id: 1,
          value: '客户第一'
        },
        {
          id: 2,
          value: '团队合作'
        },
        {
          id: 3,
          value: '拥抱变化'
        },
        {
          id: 4,
          value: '诚信'
        },
        {
          id: 5,
          value: '激情'
        },
        {
          id: 6,
          value: '敬业'
        },
        {
          id: 7,
          value: '其他'
        }
      ],
      // 奖惩类型的列表
      initiationTypeList: [
        { id: 0, name: '全部' },
        { id: 2, name: '日常奖惩' },
        { id: 3, name: '日报扣分' },
        { id: 4, name: '晨会纪要扣分' },
        { id: 5, name: '面谈扣分' },
        { id: 7, name: '任务扣分' },
        { id: 11, name: '定岗定编' }
      ],
      rewardSourceList: [
        { id: 0, name: '全部' },
        { id: 1, name: '内部奖惩' },
        { id: 2, name: '外部奖惩' }
      ]
    }
  }
}
