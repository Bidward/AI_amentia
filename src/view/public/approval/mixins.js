export default {
  inject: ['app'],
  data () {
    return {
      initiationTypeList: [
        { id: 0, name: '全部' },
        { id: 2, name: '日常奖惩' },
        { id: 3, name: '日报扣分' },
        { id: 4, name: '晨会纪要扣分' },
        { id: 5, name: '面谈扣分' },
        { id: 7, name: '任务扣分' }
      ],
      taskStatusList: [
        { id: 1, name: '暂缓' },
        { id: 2, name: '关闭' }
      ],
      headerSearch: {
        // userid: '', // 当事人id
        // initiationType: '', // 扣分类型
        // initiatorId: '', // 发起人
        // applyTimeRange: [null, null], // 申请时间范围
        // timeRange: [null, null], // 扣分时间范围
        // fuzzyCondition: '' // 迷糊搜索条件
        /**
          任务审批：
          * @taskName 任务名称
          * @time 时间范围
          * @sendName 发起人
          * @acceptName 接收人
          * @executors 执行人
          * @status 更改状态
          *
          * 销分申请：
          * @party 当事人
          * @timeApply 申请时间
          * @rewardTime 扣分时间
          * @typeDeduct 扣分类型
          * @itmeDeduct 扣分事项
          * @score 分值
          * @sendName 发起人
          * @applyReason 销分事由
          *
          * @timeSort 排序1近到远，2远到近
          */
        // taskName: '',
        // time: [null, null],
        // sendName: '',
        // acceptName: '',
        // executors: '',
        // status: '',
        // party: '',
        // timeApply: [null, null],
        // rewardTime: [null, null],
        // initiationDetailed: '',
        // itmeDeduct: '',
        // score: '',
        // applyReason: '',
        // timeSort: ''
      }
    }
  },
  computed: {
    employees () {
      return this.app.employees
    }
  },
  methods: {
    // 按时间排序
    // sortChange (column) {
    //   降序  "desc"
    //   let orderby = column.key
    //   let desc = column.order
    //   if (desc === 'desc') {
    //     this.headerSearch.timeSort = '1'
    //   } else if (desc === 'asc') {
    //     this.headerSearch.timeSort = '2'
    //   } else {
    //     this.headerSearch.timeSort = ''
    //   }
    //   this.detailSearch()
    // },
    // 获取详情
    // getDetail (id) {
    //   let data = id

    //   this.$axios({
    //     url: `${baseUrl}/approve/getDetail`,
    //     method: 'post',
    //     data: $qs.stringify({ id: data })
    //   }).then(res => {
    //     if (res.data.code === 10000) {
    //       this.detail = res.data.content
    //     } else {
    //       this.$Message.error(res.data.msg)
    //       this.loading = false
    //     }
    //   }).catch(err => {
    //     console.log('err', err)
    //   })
    //   this.detailModal = true
    // }
  }
}
