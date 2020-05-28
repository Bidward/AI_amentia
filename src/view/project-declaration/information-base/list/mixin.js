import {
  prUrl
} from '@/api/base.js'
import { debounce } from '@/libs/tools'
import moment from 'moment'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      isFullScreen: this.$store.state.app.isTaskListFullScreen,
      tableHeight: 600
    }
  },
  mounted () {
    this.getData()
    window.addEventListener('resize', debounce(this.setTableHeight))
  },
  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.setTableHeight))
  },
  methods: {
    setTableHeight () {
      let TABLE_MARGIN_HEIGHT = 380
      let pagePaddingHeight = document
        .querySelectorAll('body')[0]
        .getClientRects()[0].height
      this.tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT
    },
    // 切换全屏状态
    handleFullScreen () {
      this.isFullScreen = !this.isFullScreen
      this.setFullScreen(this.isFullScreen)
    },

    ...mapMutations({
      setFullScreen: 'toggleFullScreenState'
    }),
    // 获取数据
    getData (data) {
      let sendData = this.getSendData(data)
      this.$axios({
        url: prUrl + '/info/searchByCondition',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.tableLoading = false
          let tempData = res.data.data
          this.infoBankData = tempData.result
          this.detailHeader.currPage = tempData.currPage
          this.detailHeader.pageSize = tempData.pageSize
          this.detailHeader.totalCount = tempData.totalSize
        }
        this.setTableHeight()
        // this.$Message.success(res.data.msg)
      })
      // .catch(err => {
      //   this.$Notice.warning({
      //     title: '数据异常，请联系技术人员'
      //   })
      // })
    },
    // 获取表头搜索有效参数
    getSendData (data) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let sendData = {}
      // 判断哪个列表传不同的infoStatus
      let list = sessionStorage.messageTabs || ''
      if (list === 'processed') {
        this.detailHeader.infoStatus = 1
      } else {
        this.detailHeader.infoStatus = 0
      }
      // 非空字符串
      let hasValueKeys = keys.filter(e => {
        return me.detailHeader[e] !== ''
      })
      // 拷贝到sendData
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
      }
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      // 如果有模糊搜索，清空表头
      if (this.detailHeader.query) {
        // 清空搜索
        this.reload()
        sendData.query = sendData.query.trim()
        this.detailHeader.query = sendData.query
      }
      // 时间
      if (this.detailHeader.releaseDate) {
        sendData.releaseDate = moment(sendData.releaseDate).format('YYYY-MM-DD')
      }
      delete sendData.totalCount
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.order === 'normal') {
        delete sendData.orderBy
        delete sendData.order
      } else {
        // console.log(2)
        if (sendData.order === 'asc') {
          sendData.order = 1
        } else {
          sendData.order = 0
        }
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 排序
    handleSort (column) {
      // 降序  "desc"
      let orderBy = column.key
      let order = column.order
      this.getData({
        orderBy,
        order
      })
      this.detailHeader.orderBy = column.key
      this.detailHeader.order = column.order
    },
    // 刷新
    reload (infoStatus) {
      this.detailHeader = {
        infoStatus: infoStatus,
        userId: this.$store.state.user.userId,
        query: '', // 模糊搜索
        infoName: '', // 信息名称
        releaseDate: '', // 日期
        website: '', // 网址
        channel: '', // 渠道
        handlePerson: '', // 处理人
        status: '', // 状态
        checkInfo: '', // 信息核对
        orderBy: '', // 根据什么字段排序
        order: 'normal', // 排序的方式
        totalCount: 0,
        pageSize: 20,
        currPage: 1
      }
    },
    // 日志
    getLog () {
      let list = sessionStorage.messageTabs || ''
      let infoStatu = ''
      if (list === 'processed') {
        infoStatu = 1
      } else {
        infoStatu = 0
      }
      let sendData = {
        infoStatus: infoStatu,
        userId: this.$store.state.user.userId
      }
      this.$axios({
        url: prUrl + '/info/showLog',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.Log = res.data.data
        }
        // this.$Message.success(res.data.msg)
      })
      // .catch(err => {
      //   this.$Notice.warning({
      //     title: '数据异常，请联系技术人员'
      //   })
      // })
    },
    // 编辑
    edit (row) {
      this.$router.push({
        name: 'editInfo',
        query: {
          infoId: row.id,
          infoName: row.infoName,
          status: row.status,
          infoStatus: row.infoStatus,
          relatedId: row.relatedId
        }
      })
    },
    // 详情
    detail (row) {
      this.$router.push({
        name: 'deatilInfo',
        query: {
          infoId: row.id,
          status: row.status,
          infoStatus: row.infoStatus
        }
      })
    }
  }
}
