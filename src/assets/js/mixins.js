import { baseUrl } from '@/api/base'
import { mapMutations } from 'vuex'
import moment from 'moment'
import iView from 'view-design'

// 列表页mixin
export const tasksMixin = {
  inject: ['app'],
  data () {
    return {
      headCount: {
        countAll: 0,
        countOngoing: 0,
        countTbc: 0,
        countClose: 0,
        countDefer: 0,
        countDone: 0
      },
      headerCount: [
        {
          count: (h) => {
            return h('div', [
              h('span', '全部'),
              h('Badge', {
                props: {
                  count: this.headCount.countAll
                  // count: 100,
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '1'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '待确认'),
              h('Badge', {
                props: {
                  count: this.headCount.countTbc
                  // count: 10
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '2'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '进行中'),
              h('Badge', {
                props: {
                  count: this.headCount.countOngoing
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '3'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '暂缓'),
              h('Badge', {
                props: {
                  count: this.headCount.countDefer
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '4'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '关闭'),
              h('Badge', {
                props: {
                  count: this.headCount.countClose
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '5'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        },
        {
          count: (h) => {
            return h('div', [
              h('span', '完成'),
              h('Badge', {
                props: {
                  count: this.headCount.countDone
                },
                class: {
                  'task-badge': true,
                  'active-badge': this.currentTab === '6'
                },
                style: {
                  marginLeft: '5px'
                }
              })
            ])
          }
        }
      ]
    }
  },
  created () {
    this.currentTab = sessionStorage.getItem('currentTab') || '2'
    this.page.currentPage = Number(sessionStorage.getItem('currentPage')) || 1
    this.page.pageSize = Number(sessionStorage.getItem('pageSize')) || 20
    // console.log('createdcreated')
  },
  methods: {
    checkDetail (row) {
      // this.$router.push('/task/detail/' + row.id)
      this.$router.push({ name: 'taskDetail', params: { id: row.id } })
    },
    // 获取表头搜索有效参数
    getValidParams (data) {
      let params = {}
      if (this.searchContent) {
        this.clearSearchHeader(this.searchContent)
      } else {
        delete this.fields.searchContent
      }
      let conditions = JSON.parse(JSON.stringify(this.fields))
      if (conditions.name) {
        conditions.name = conditions.name.trim()
      }
      for (let key in conditions) {
        if (conditions.hasOwnProperty(key)) {
          if (conditions[key]) {
            params[key] = conditions[key]
          }
        }
      }
      // 如果有起始时间
      if (params.timeRange && params.timeRange[0]) {
        // params.startTime = moment(params.timeRange[0]).format('YYYY-MM-DD')
        // params.endTime = moment(params.timeRange[1]).format('YYYY-MM-DD')
        params.taskInfoStartDate = moment(params.timeRange[0]).format('YYYY-MM-DD')
        params.taskInfoEndDate = moment(params.timeRange[1]).format('YYYY-MM-DD')
      }
      // 删除timeRange字段
      // delete params.timeRange
      params = { ...params, ...data }
      // console.log('paramsparams', params)
      return params
    },
    // 当前页发生变化
    updateCurrentPage (current) {
      let pageSize = sessionStorage.getItem('page-size') || 20
      this.page.currentPage = current
      // 保存当前页码，以免刷回到初始状态
      // console.log(current)
      sessionStorage.setItem('currentPage', current)
      if (this.searchContent) {
        this.getTableData({ pageSize: pageSize, currPage: current, searchType: 1 })
      } else {
        this.getTableData({ pageSize: pageSize, currPage: current })
      }
    },
    // 每页显示条数发生变化
    updatePageSize (pageSize) {
      this.page.pageSize = pageSize
      this.getTableData({ pageSize: pageSize })
    },
    // 模糊搜索的关键词被清空后的处理逻辑
    handleSearchContentChange (searchContent) {
      this.searchContent = searchContent
      if (!this.searchContent) {
        this.getTableData()
      } else {
        this.getTableData({ searchType: 1 })
      }
    },
    // 总搜索框模糊搜索
    handleInaccurateSearch () {
      this.getTableData({ searchType: 1 })
    },
    // 清空表头搜索
    clearSearchHeader (searchContent) {
      this.fields = {
        taskLevel: '', // 任务等级
        taskStatus: '', // 任务状态
        name: '', // 任务名称
        timeRange: [], // 时间范围
        sendUid: '', // 发起人id
        sendName: '', // 发起人姓名
        acceptUid: '', // 接收人id
        acceptName: '', // 接受人姓名
        executeUid: '', // 执行人id
        executeName: '', // 执行人姓名
        pageSize: 20,
        totalCount: 0,
        currentPage: 1,
        startTime: '',
        endTime: '',
        searchContent: searchContent
      }
    },
    // 一键清空搜索条件，获取原始数据
    refresh () {
      this.clearSearchHeader()
      this.getTableData()
    },
    handleRefresh () {
      this.refresh()
    },
    // 关注任务
    focusTask (params) {
      let sendData = {
        taskId: params.row.id,
        isFocus: !params.row.tasksFocus
      }
      this.$axios({
        url: baseUrl + '/tasks/focus',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            params.row.tasksFocus = !params.row.tasksFocus
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 切换tab标签时将第一页设为当前页
    setCurrentPage () {
      this.page.currentPage = 1
      sessionStorage.setItem('currentPage', 1)
      // 切换tab时将searchCondition置为空
      sessionStorage.setItem('searchCondition', '{}')
    },
    // 点击按钮无刷新
    handleBtnClick () {
      this.page.currentPage = Number(sessionStorage.getItem('currentPage')) || 1
      this.getTableData({ currPage: sessionStorage.getItem('currentPage') || 1 })
    }
  },
  watch: {
    currentTab (newVal) {
      this.loading = true
      let initConditions = {
        taskLevel: '',
        taskStatus: '',
        name: '',
        timeRange: [],
        sendUid: '',
        sendName: '',
        acceptUid: '',
        acceptName: '',
        executeUid: '',
        executeName: '',
        startTime: '',
        endTime: '',
        searchType: 0,
        deptId: ''
      }
      this.fields = { ...initConditions, ...(JSON.parse(sessionStorage.getItem('searchCondition')) || {}) }
      sessionStorage.setItem('currentTab', newVal)
      this.getTableData({ currPage: this.page.currentPage })
    }
  },
  computed: {
    employees () {
      return this.app.employees
    },
    taskLevels () {
      return this.app.taskLevels
    },
    taskStatus () {
      return this.app.taskStatus
    }
  },
  // 路由离开时将currentTab和currentPage设为1
  beforeRouteLeave (to, from, next) {
    let isTask = to.path.startsWith('/task')
    // 如果切换到不以/task开头的路由也保持状态
    if (to.name === 'taskDetail' || to.name === 'taskEdit' || !isTask) {
      sessionStorage.setItem('currentTab', this.currentTab)
      sessionStorage.setItem('currentPage', this.page.currentPage)
      sessionStorage.setItem('searchCondition', JSON.stringify(this.fields))
    } else {
      sessionStorage.setItem('currentTab', '2')
      sessionStorage.setItem('currentPage', 1)
      sessionStorage.setItem('searchCondition', '{}')
    }
    next()
  }
}

// 详情编辑页mixin
export const detailAndEditMixin = {
  inject: ['app'],
  data () {
    return {
      time: 9,
      spinShow: false,
      // 详情编辑页面按钮的loading状态
      loadingStatus: false,
      // 保存按钮loading状态
      saveLoading: false,
      activeAttachmentIndex: -1,
      // 任务截至日期不能早于发起日期
      taskEndOptions: {},
      // 任务发起时间不早于今天,如果有截止日期，不早于截止日期,watch中有相关逻辑
      taskSendOption: {},
      // 方案时间限制
      planStartOptions: {},
      // 详情编辑字段验证
      ruleValidate: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' }
        ],
        acceptUid: [
          { required: true, message: '接受人不能为空', trigger: 'blur' }
        ],
        sendTime: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请选择任务发起时间'))
            } else {
              callback()
            }
          }
        }]
      },
      // 任务的general info
      info: {},
      // 保存成功与否标识
      isSaved: false,
      // 点击返回按钮
      isButtonBack: false,
      // 子元素优先
      valueConsistsOf: 'LEAF_PRIORITY',
      // 部门名称
      deptNames: [],
      // 附件列表
      enclousureList: [],
      // 发起时间时分秒
      timePickerOptions: {
        disabledHours: [],
        disabledMinutes: []
      }
    }
  },
  created () {
    // 当前登录人id
    this.uid = this.$store.state.user.userId
    // 任务id
    this.tid = this.$route.params.id
    this.params = {
      'tasks': {
        'id': -1,
        'name': '',
        'sendUid': null,
        'acceptUid': null,
        'description': ''
      },
      'taskPlanDetail': [
        {
          'taskId': 101,
          'taskPlanId': 11,
          'planStatus': 1,
          'taskPlanContent': '测试3',
          'taskPlanStarttime': '2019-07-07',
          'taskPlanEndtime': '2019-07-08',
          'executors': [
            {
              'id': 124,
              'name': '测试',
              'isRed': 'false'
            },
            {
              'id': 24,
              'name': '测试',
              'isRed': 'false'
            },
            {
              'id': 23,
              'name': '测试',
              'isRed': 'false'
            }
          ]
        }
      ]
    }
    // 获取任务信息
    this.getTaskData()
    // 获取部门信息
    this.getDeptInfo()
    // 是否能修改发起人
    this.canChangeSender()
    // 获取附件列表
    this.getEnclousureList()
  },
  mounted () {
    this.query = ''
    // 当前任务状态
    this.currentTaskStatus = ''
  },
  filters: {
    // 执行人拼接字符串
    executor (data) {
      if (!data) return
      let names = data.map(person => {
        return person.name
      })
      return names.join(' ')
    },
    // 日期格式化
    timeFormat (date) {
      if (!date) return
      return moment(date).format('YYYY-MM-DD')
    },
    // 获取未确认人员名单，上浮提示
    getUnConfirmed (executors) {
      if (!executors.length) return
      let arr = []
      let unConfirmed = executors.filter(executor => {
        return executor.red
      })
      unConfirmed.forEach(item => {
        arr.push(`“${item.name}”`)
      })
      return arr.join(' ')
    }
  },
  methods: {
    // 点击下载附件
    createALink (item) {
      this.dowloadReource('/resources/' + item.enclosureUrl, item.enclosureName)
      // this.dowloadReource('http://origin.static.nnnnzs.cn/upload/bing/20190816.png', '喀喀.png')
    },
    // 获取blob（一个不可变、原始数据的类文件对象）
    dowloadReource (url, filename) {
      this.$axios({
        url: url,
        // 响应数据类型
        responseType: 'blob',
        // 不能发送cookie否则报跨域
        withCredentials: false
      })
        .then(res => res.data)
        .then(file => {
          // console.log(file, 'blob')
          let blobUrl = window.URL.createObjectURL(file)
          this.forceDownload(blobUrl, filename)
        })
        .catch(e => console.error(e))
    },
    forceDownload (blobUrl, filename) {
      let a = document.createElement('a')
      a.download = filename
      a.href = blobUrl
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    // 获取附件列表
    getEnclousureList () {
      this.$axios({
        url: baseUrl + '/tasks/getUploadAttachment',
        method: 'post',
        data: { tasks: { id: this.$route.params.id } }
      })
        .then(res => {
          this.enclousureList = res.data.content
        })
    },
    // 修改发起时间
    handleSendTimeChange (date) {
      if (date) {
        // console.log(date, 'date')
        // 时间改变时先将限制条件清空
        this.timePickerOptions.disabledHours = []
        this.timePickerOptions.disabledMinutes = []

        // 选择的时间字符串拆为日期和时间
        let timeArr = date.split(' ')
        let day = timeArr[0]

        // 当前小时/分钟
        let hours = moment().get('hours')
        let minutes = moment().get('minutes')
        // 选择的小时数
        let selectHours = moment(date).get('hours')

        // 日期是否是今天
        let isToday = null
        if (moment().get('date') === moment(date).get('date')) {
          isToday = true
        }
        // 如果不是今天
        if (!isToday) {
          // 时间限制为9点前不能选
          this.limitHMS('disabledHours', this.time)
          // 如果没有选择时分秒
          if (timeArr[1] === '00:00:00') {
            // 默认9点
            this.taskData.sendTime = day + ' ' + '09:00:00'
          } else {
            // 否则以选择的时间为准
            this.taskData.sendTime = date
          }
        } else { // 是今天
          // 如过当前小时数小于9
          if (hours < this.time) {
            this.limitHMS('disabledHours', this.time)
            // this.formValidate.sendTime = moment().format('YYYY-MM-DD') + ' ' + '09:00:00'
          } else {
            // 否则限制小时数和分钟数为当前时/分前不可选
            this.limitHMS('disabledHours', hours)
            this.limitHMS('disabledMinutes', minutes)
          }
          // 没有选择时/分
          if (timeArr[1] === '00:00:00') {
            // 当前时间作为发起时间
            this.taskData.sendTime = moment().format('YYYY-MM-DD HH:mm:ss')
          } else {
            // 选择的小时数大于当前小时数
            if (selectHours > hours) {
              // 分钟数不做限制
              this.timePickerOptions.disabledMinutes = []
            }
            this.taskData.sendTime = date
          }
        }
        // console.log(this.formValidate.sendTime, 'last')
      } else {
        this.taskData.sendTime = ''
      }
    },
    limitHMS (key, time) {
      for (let i = 0; i < time; i++) {
        this.timePickerOptions[key].push(i)
      }
    },
    // 修改发起时间
    handleSendTimeOpenChange (open) {
      if (open) {
        this.taskSendOption = {
          disabledDate: (date) => {
            let startDate = this.getStartTime()
            if (startDate) {
              return date && (date.valueOf() < Date.now() - 1000 * 3600 * 24 || date.valueOf() > new Date(startDate).getTime())
            } else if (this.taskData.endTime) {
              return date && ((date.valueOf() > new Date(this.taskData.endTime).getTime()) || date.valueOf() < Date.now() - 86400000)
            } else {
              return date.valueOf() < Date.now() - 86400000
            }
          }
        }
      }
    },
    // 修改任务截止时间
    handleEndTimeOpenChange (open) {
      if (!open) return
      console.log('open', open)
      let newVal = this.taskData.sendTime
      this.taskEndOptions = {
        disabledDate: (date) => {
          let today = moment().format('YYYY-MM-DD')
          let sendDay = moment(newVal).format('YYYY-MM-DD')
          let isEarly = moment(today).valueOf() > moment(sendDay).valueOf()
          console.log(isEarly, 'isEarly')
          let hasPlan = this.rowData.length > 0
          let retValue
          if (isEarly) {
            retValue = date && date.valueOf() < Date.now() - 1000 * 3600 * 24
          } else {
            retValue = date && date.valueOf() < moment(sendDay).valueOf()
          }
          // 方案日期一定早于发起时间
          if (hasPlan) {
            let maxData = this.getMaxDate()
            if (maxData) {
              if (moment(today).valueOf() > moment(maxData).valueOf()) {
                retValue = date && date.valueOf() < Date.now() - 1000 * 3600 * 24
              } else {
                retValue = date && date.valueOf() < moment(maxData).valueOf()
              }
            }
          }
          return retValue
        }
      }
    },
    beforeunloadHandler () {
      this.beforeUnloadTime = new Date().getTime()
    },
    // 点击返回按钮
    handleButtonBack () {
      this.isButtonBack = true
    },
    // 执行人点击确认方案
    confirmTaskPlan (item) {
      if (this.isApproving(this.taskData)) return
      this.loadingStatus = true
      this.$axios({
        url: baseUrl + '/taskplan/operate/confirm?taskPlanId=' + item.taskPlanId,
        method: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
            // this.app.reload()
            this.getTaskData()
          } else {
            this.$Message.error(msg)
          }
          this.loadingStatus = false
        })
        .catch(err => {
          console.log(err)
          this.loadingStatus = false
        })
    },
    // 鼠标移入执行人是否显示提示
    handleMouseEnter (executors, e, index) {
      let height = getComputedStyle(e.target).height
      // 通过执行人文本框的高度计算提示框的偏移量
      this.offsetHeight = height
      // 判断是否全部点击完成
      let confirmed = this.hasAllConfirm(executors)
      // 全部确认不显示，index为-1
      if (confirmed) {
        this.activeIndex = -1
      } else {
        this.activeIndex = index
      }
    },
    // 鼠标移除提示隐藏
    handleMouseLeave () {
      this.activeIndex = -1
    },
    // 判断是否所有执行人已经点击确认/或完成
    hasAllConfirm (executors) {
      return executors.every(executor => {
        return !executor.red
      })
    },
    // 获取任务信息/
    getTaskData (delay) {
      this.spinShow = true
      return this.$axios({
        url: baseUrl + '/tasks/plandetail/' + this.$route.params.id,
        method: 'get'
      }).then(res => {
        let data = res.data.content
        this.taskData = data
        let { taskName, taskStarttime, endTime, taskStatus, taskType, confirmTimeMillis, taskLevel, completeTime } = this.taskData
        this.info = { taskName, taskStarttime, endTime, taskStatus, taskType, confirmTimeMillis, taskLevel, completeTime }
        this.rowData = this.taskData.content || []
        if (this.rowData.length) {
          this.rowData.forEach(plan => {
            this.$set(plan, 'errMsg', {
              dateErrMsg: '',
              executorErrMsg: '',
              planErrMsg: ''
            })
          })
        }
        this.initTaskData = JSON.parse(JSON.stringify(this.taskData))
        // rowData有数据则hasPlan为true
        if (this.rowData.length) {
          this.hasPlan = true
        }
        // 隐藏加载
        if (delay) {
          setTimeout(() => {
            this.spinShow = false
          }, delay)
        } else {
          this.spinShow = false
        }
      }).catch(e => {
        console.error(e)
      })
    },
    // 判断是否有修改发起人权限
    canChangeSender () {
      this.$axios({
        url: baseUrl + '/tasks/getInitiator',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          if (res.data.content && res.data.content.length) {
            this.senderList = res.data.content
            this.hasRightChangeSender = true
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 表格收起/展开状态切换
    toggleFoldStatus () {
      this.fold = !this.fold
    },
    // 编辑
    async handleEdit () {
      // 如果任务处于待审状态，不可编辑
      if (this.isApproving(this.taskData)) return
      let taskStatus = this.taskData.taskStatus
      if (taskStatus === '待确认') {
        await this.getTaskData()
      }
      this.editLoading = true
      if (this.taskData.taskStatus === '进行中') {
        this.$Modal.confirm({
          title: '提示',
          content: '任务状态为进行中，此时编辑任务方案接收人将会被扣1分',
          onOk: () => {
            this.isSomeoneEditing(this.tid, this.editingHandler)
          },
          onCancel: () => {
            this.editLoading = false
          }
        })
      } else {
        this.isSomeoneEditing(this.tid, this.editingHandler)
      }
    },
    // 判断任务是否处于待审状态
    isApproving (row) {
      if (row.approveStatus) {
        this.$Message.error('该任务处于待审状态，不可编辑！')
        return true
      }
    },
    // 如果当前没人编辑执行editingHandler
    editingHandler () {
      this.isEditing = true
      this.showCancelBtn = true
      this.rowData = this.taskData.content
      if (this.isSender || (this.isReceiver && this.hasPlan)) {
        this.showSaveBtn = true
      }
    },
    // 编辑页面的取消
    cancelEditInEdit () {
      // 为true时通过路由拦截删除标签，解锁
      this.isButtonBack = true
      // this.$router.go(-1)
      this.$router.push({ name: 'taskDetail', params: { id: this.tid }, query: { from: 'edit' } })
    },
    // 取消编辑
    handleCancelEdit () {
      let hasChange = this.hasContentChanged()
      // 有内容变更则弹框
      if (hasChange) {
        this.$Modal.confirm({
          title: '取消编辑',
          content: '<p>还有未保存的内容，确认取消吗</p>',
          onOk: () => {
            // 如果是编辑页面只回复原来的数据不解锁
            if (this.$route.name === 'taskEdit') {
              // this.cancelEditHandler()
              this.isButtonBack = true
              this.$router.go(-1)
            } else {
              this.$axios({
                url: baseUrl + '/tasks/cancelLockEditPlan',
                params: { taskId: this.tid },
                type: 'get'
              })
                .then(res => {
                  if (res.data.code === 10000) {
                    this.cancelEditHandler()
                  }
                })
            }
          }
        })
      } else {
        // 如果是详情页的编辑取消编辑直接解锁
        if (this.$route.name === 'taskDetail') {
          this.$axios({
            url: baseUrl + '/tasks/cancelLockEditPlan',
            params: { taskId: this.tid },
            type: 'get'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.cancelEditHandler()
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.isButtonBack = true
          this.$router.go(-1)
        }
      }
    },
    // 取消编辑的handler
    cancelEditHandler () {
      this.showCancelBtn = false
      this.isEditing = false
      this.taskData = JSON.parse(JSON.stringify(this.initTaskData))
      this.rowData = this.taskData.content
      this.showSaveBtn = false
    },
    // 点击添加添方案
    addRow () {
      this.rowData.push(JSON.parse(JSON.stringify(this.initTaskPlanData)))
      this.showSaveBtn = true
    },
    // 方案起止时间
    changePlanDate (value, item, index) {
      // console.log(value)
      let chooseStartTime = value[0]
      let chooseEndTime = value[1]
      // 保存一份原始方案的起始时间
      let startTime = JSON.parse(JSON.stringify(item)).taskPlanStarttime || ''
      let endTime = JSON.parse(JSON.stringify(item)).taskPlanEndtime || ''
      // 赋值新日期
      item.taskPlanStarttime = chooseStartTime
      item.taskPlanEndtime = chooseEndTime
      // 如果有任务截止日期
      if (this.taskData.endTime) {
        let taskEndTimeStp = new Date(this.taskData.endTime).getTime()
        let planEndTimeStp = new Date(chooseEndTime).getTime()
        // 如果是接收人
        if (this.isReceiver) {
          // 如果方案时间超过任务截止时间
          if (planEndTimeStp > taskEndTimeStp) {
            this.$Modal.confirm({
              title: '提示',
              content: '方案时间超过截止时间，完成时将会导致执行人扣分',
              onOk: () => {
                this.checkDateValid()
              },
              onCancel: () => {
                this.useOldDate(index, [startTime, endTime])
              }
            })
            return
          } else {
            // 不超过任务截止时间
            // 任务的起始日期
            // 不应该时发起时间，应该是方案的最早时间
            // let start = moment(this.taskData.sendTime).format('YYYY-MM-DD')
            let start = this.getStartTime()
            let now = moment().format('YYYY-MM-DD')
            // 如果修改方案时间在截止时间内，但是超过2/3
            if (this.pass2of3(start, this.taskData.endTime, now)) {
              this.$Modal.confirm({
                title: '提示',
                content: '方案截止日期已超过总时长的2/3，延长最后一步方案时间会导致接收人扣分是否继续',
                onOk: () => {
                  this.checkDateValid()
                },
                onCancel: () => {
                  // this.useOldDate(index, startTime, 'taskPlanStarttime')
                  this.useOldDate(index, [startTime, endTime])
                }
              })
              return
            }
          }
        } else { // 如果是发起人
          // 如果方案时间超过任务截止时间
          if (planEndTimeStp > taskEndTimeStp) {
            this.$Modal.confirm({
              title: '提示',
              content: '方案时间超过截止时间，自动延长截止时间，是否继续？',
              okText: '继续',
              onOk: () => {
                this.prolongEndtime()
                this.checkDateValid()
              },
              onCancel: () => {
                this.useOldDate(index, [startTime, endTime])
                // this.useOldDate(index, startTime, 'taskPlanStarttime')
              }
            })
            return
          }
        }
      }
      // 如果选择了日期
      if (value[0]) {
        item.errMsg.dateErrMsg = ''
      } else {
        item.errMsg.dateErrMsg = '日期不能为空'
      }
    },
    // 方案截止时间-> 原来是两个时间选择框目前通过daterange控制, 该方法废弃
    changeEndDate (value, item, index) {
      let endTime = JSON.parse(JSON.stringify(item)).taskPlanEndtime || ''
      item.taskPlanEndtime = value
      if (this.taskData.endTime) {
        let taskEndTimeStp = new Date(this.taskData.endTime).getTime()
        let planEndTimeStp = new Date(value).getTime()
        // 如果是接收人
        if (this.isReceiver) {
          // 如果方案时间超过任务截止时间
          if (planEndTimeStp > taskEndTimeStp) {
            this.$Modal.confirm({
              title: '提示',
              content: '方案时间超过截止时间，完成时将会导致扣分',
              onOk: () => {
                this.checkDateValid()
              },
              onCancel: () => {
                this.useOldDate(index, endTime, 'taskPlanEndtime')
              }
            })
          } else {
            let start = moment(this.taskData.sendTime).format('YYYY-MM-DD')
            let now = moment().format('YYYY-MM-DD')
            // 如果修改方案时间在截止时间内，但是超过2/3
            if (this.pass2of3(start, this.taskData.endTime, now)) {
              this.$Modal.confirm({
                title: '提示',
                content: '已经超过总时长的2/3，延长最后一步方案时间会导致接收人扣分是否继续',
                onOk: () => {
                  this.checkDateValid()
                },
                onCancel: () => {
                  this.useOldDate(index, endTime, 'taskPlanEndtime')
                }
              })
            }
          }
        } else {
          if (planEndTimeStp > taskEndTimeStp) {
            this.$Modal.confirm({
              title: '提示',
              content: '方案时间超过截止时间，自动延长截止时间，是否继续？',
              okText: '继续',
              onOk: () => {
                this.prolongEndtime()
                this.checkDateValid()
              },
              onCancel: () => {
                this.useOldDate(index, endTime, 'taskPlanEndtime')
              }
            })
            return
          }
        }
      }
      this.checkDateValid()
    },
    // 判断当前时间是否超过总时间2/3
    pass2of3 (start, end, now) {
      let allDays = moment(end).diff(moment(start), 'days')
      let passDays = moment(now).diff(moment(start), 'days')
      // console.log((passDays / allDays))
      return (passDays / allDays) > 2 / 3
    },
    // 发起人/执行人放弃修改日期，恢复之前日期
    useOldDate (index, timeArr) {
      this.rowData = this.taskData.content
      let copyed = JSON.parse(JSON.stringify(this.rowData))
      copyed[index].taskPlanStarttime = timeArr[0]
      copyed[index].taskPlanEndtime = timeArr[1]
      this.rowData = copyed
      this.$set(this.taskData, 'content', this.rowData)
    },
    // 自动延长截止时间
    prolongEndtime () {
      let max = this.getMaxDate()
      this.$set(this.taskData, 'endTime', moment(max).format('YYYY-MM-DD'))
    },
    // 获取所有方案中起止日期的最大值
    getMaxDate () {
      let max = 0
      this.rowData.forEach(row => {
        if (row.taskPlanStarttime) {
          if (moment(row.taskPlanStarttime).valueOf() > max) {
            max = moment(row.taskPlanStarttime).valueOf()
          }
        }
        if (row.taskPlanEndtime) {
          if (moment(row.taskPlanEndtime).valueOf() > max) {
            max = moment(row.taskPlanEndtime).valueOf()
          }
        }
      })
      return max
    },
    // 获取方案的最早时间（理论上是第一条方案）
    getStartTime () {
      if (!this.taskData.content.length) return
      let plans = this.taskData.content
      let startTimeStpArr = plans.map(plan => {
        return Number(new Date(plan.taskPlanStarttime).getTime())
      })
      return moment(startTimeStpArr.sort()[0]).format('YYYY-MM-DD')
    },
    // 方案日期选择框
    handleOpenChange (flag, item) {
      console.log(item, 'item')
      if (flag) {
        this.planStartOptions = {
          disabledDate: (date) => {
            if (item.taskPlanStatus && item.taskPlanStatus === '进行中') {
              if (item.taskPlanStarttime) {
                return date && date.valueOf() < moment(item.taskPlanStarttime).valueOf()
              } else {
                return date && date.valueOf() < moment().valueOf()
              }
            } else {
              let today = moment().format('YYYY-MM-DD')
              let sendDay = moment(this.taskData.sendTime).format('YYYY-MM-DD')
              let isEarly = moment(today).valueOf() > moment(sendDay).valueOf()

              // 发起日期小于今天
              if (isEarly) {
                return date && date.valueOf() < Date.now() - 86400000
              } else {
                return date && date.valueOf() < moment(sendDay).valueOf()
              }
            }
          }
        }
      }
    },
    // 当前下拉框index
    updateIndex (index, item) {
      this.currentSelectIndex = index
      this.$nextTick(() => {
        let select = this.$refs['executorSelect' + index][0]
        select.openMenu()
        select.focusInput()
      })
    },
    // 任务方案值发生改变
    handleTaskPlanChange (e, item) {
      let value = e.target.value
      item.taskPlanContent = value.trim()
      if (value) {
        item.errMsg.planErrMsg = ''
      } else {
        item.errMsg.planErrMsg = '方案内容不能为空'
      }
    },
    /**
     * 执行人选择
     */
    // 获取executor的id,用于绑定
    getIds (array) {
      if (!array) return
      return array.map(item => {
        return item.id
      })
    },
    // 获取executor组成的字符串
    getNames (array) {
      if (!array) return
      let arr = array.map(item => {
        return item.name
      })
      if (arr.length === 1) {
        return arr[0]
      } else {
        return arr.join(', ')
      }
    },
    // 选择某个节点
    handleSelect (nodes, nodeId, item, index) {
      let select = []
      if (nodes.children) {
        this.getLeaf(nodes, select)
      } else {
        select = [{ id: nodes.id, name: nodes.label }]
      }
      item.executors = [...item.executors, ...select]
      let $select = this.$refs['executorSelect' + index][0]
      $select.resetSearchQuery('')
      // 验证非空
      if (item.executors.length) {
        item.errMsg.executorErrMsg = ''
      } else {
        item.errMsg.executorErrMsg = '执行人不能为空'
      }
    },
    // 取消勾选
    handleDeselect (nodes, nodeId, item) {
      // 如果该节点有字节点 删除字节点
      if (nodes.children) {
        if (nodes.id === 'dpt1') {
          item.executors = []
        } else {
          this.removeLeaf(nodes, item)
        }
      } else {
        // 否则删除该节点
        let index = this.findIndexById(nodes.id, item.executors)
        item.executors.splice(index, 1)
      }
      // // 验证是否为空
      // this.checkExecutorValid()
      // 验证非空
      if (item.executors.length) {
        item.errMsg.executorErrMsg = ''
      } else {
        item.errMsg.executorErrMsg = '执行人不能为空'
      }
    },
    // 点击清除按钮
    handleClearAll (item) {
      item.executors = []
      item.errMsg.executorErrMsg = '执行人不能为空'
      return true
    },
    // 获取纯子节点
    getLeaf (nodes, arr) {
      nodes.children.forEach(node => {
        if (node.children) {
          this.getLeaf(node, arr)
        } else {
          arr.push({ id: node.id, name: node.label })
        }
      })
    },
    // 删除子节点
    removeLeaf (nodes, item) {
      nodes.children.forEach(node => {
        if (node.children) {
          this.removeLeaf(node, item)
        } else {
          let index = this.findIndexById(node.id, item.executors)
          if (index >= 0) {
            item.executors.splice(index, 1)
          }
        }
      })
    },
    // 根据id获取index
    findIndexById (id, arr) {
      return arr.findIndex((value, index) => {
        return value.id === id
      })
    },
    // 格式化后台数据为树形数据结构
    getTree (data = [], id, pid = null) {
      const children = []
      for (const i in data) {
        const node = data[i]
        if (((!pid && !node.pid) || node.pid === pid) && node.id !== id) {
          // key, value, label
          children.push({
            id: node.id,
            value: node.id + '',
            label: node.nickname,
            children: this.getTree(data, id, node.id),
            ...node
          })
        }
      }
      return children.length ? children : undefined
    },
    // 获取部门信息
    getDeptInfo () {
      this.$axios({
        url: baseUrl + '/Structure/findStructureByCondition',
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.deptNames = res.data.content
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 展开树形数据结构
    flatTree (tree, flat) {
      tree.forEach(node => {
        flat.push({ id: 'dpt' + node.id, label: node.deptName, pid: 'dpt' + node.parentId })
        if (node.children.length) {
          this.flatTree(node.children, flat)
        }
      })
      // console.log(flat, 'flat')
      return flat
    },
    // 增加行
    addRowInline (index) {
      this.rowData.splice(index + 1, 0, JSON.parse(JSON.stringify(this.initTaskPlanData)))
      let taskPlan = { tid: this.tid, rowData: this.rowData }
      sessionStorage.setItem('taskPlan', JSON.stringify(taskPlan))
      // 增加方案时延长加锁时间
      this.$axios({
        url: baseUrl + '/tasks/resetKeyExpire',
        params: { taskId: this.tid },
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            // nothing todo
          } else {

          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 删除行
    deleteRowInline (index) {
      this.rowData.splice(index, 1)
      let taskPlan = { tid: this.tid, rowData: this.rowData }
      sessionStorage.setItem('taskPlan', JSON.stringify(taskPlan))
    },
    // getTimeStamp
    getTimeStamp (timeStr) {
      return parseInt(new Date(timeStr).getTime())
    },

    // 获取任务状态
    getTaskStatus () {
      return this.$axios({
        url: baseUrl + '/tasks/getTasksInfoById?id=' + this.$route.params.id
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.currentTaskStatus = res.data.content.taskStatus
          } else {
            console.log()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存数据
    handleSave (cb) {
      // 页面内容是否改变
      let hasChange = this.hasContentChanged()
      // 来自编辑页面的点击
      let saveFromEdit = this.$route.name === 'taskEdit'

      // 编辑页面没改继续往下走，详情则给提示+返回
      if (!hasChange) {
        if (saveFromEdit) {
          this.isSaved = true
          this.$router.push({ name: 'taskDetail', params: { id: this.tid }, query: { from: 'edit' } })
          return
        }
        this.$Message.error('没有改变的内容')
        return
      }
      // 标识位用来判断（任务/方案）必填字段是否已填
      let valid = false
      // 标识位判断任务必填字段是否已填
      let taskValid = false
      // 方案必填字段是否已填
      let planValid = this.checkDateValid() && this.checkExecutorValid() && this.checkPlanValid()
      // 验证任务general info有效性
      this.$refs.formValidate && this.$refs.formValidate.validate((valid) => {
        if (valid) {
          taskValid = true
        } else {
          taskValid = false
        }
      })
      // 如果任务不处于编辑状态，taskValid标识位为true，
      // 否则验证会失效，不能发表评论
      // async-validator的验证为异步操作，返回一个promise，所以后续逻辑改为在setTimeout中执行
      // 之前出现过保存按钮无法点击的问题
      // 因为发起人编写任务需要验证taskValid，如果不用setTimeout此时taskValid为false验证不通过
      setTimeout(async () => {
        if (!this.$refs.formValidate) {
          taskValid = true
        }
        // 如果是发起人
        if (this.isSender) {
          // 验证任务信息和方案
          valid = taskValid && planValid
        } else {
          // 否则只验证方案
          valid = planValid
        }
        // 验证不通过return
        if (!valid) return
        // 验证通过后页面处于加载状态
        this.params.tasks.id = this.$route.params.id
        this.params.tasks.name = this.taskData.taskName
        this.params.tasks.sendUid = this.taskData.sendUid
        this.params.tasks.acceptUid = this.taskData.acceptUid
        this.params.tasks.description = this.taskData.description
        this.params.tasks.taskLevel = this.getTaskLevelId(this.taskData.taskLevel)
        this.params.tasks.taskStatus = this.getTaskStatusId(this.taskData.taskStatus)
        let sendTime = this.taskData.sendTime ? moment(this.taskData.sendTime).format('YYYY-MM-DD HH:mm:ss') : ''
        this.params.tasks.sendTime = sendTime
        let endTime = this.taskData.endTime ? moment(this.taskData.endTime).format('YYYY-MM-DD') : ''
        this.params.tasks.endTime = endTime
        this.params.tasks.enclosureUrlList = this.taskData.enclosureUrlList
        // 如果没有方案id将方案id设为0=> 后端
        // 拷贝一份，直接改动响应式数据更新很慢
        let content = JSON.parse(JSON.stringify(this.rowData))
        content.forEach(plan => {
          if (!plan.taskPlanId) {
            plan.taskPlanId = 0
          }
          delete plan.taskPlanStatus
        })
        // 入参的key是taskPlanDetail
        this.params.taskPlanDetail = content
        // this.spinShow = true
        this.saveLoading = true

        // await this.getTaskStatus()
        // if (this.currentTaskStatus === 1 && !this.isSender) {
        //   this.$Modal.confirm({
        //     title: 'warning',
        //     content: '任务状态已是进行中，现在编辑任务会被扣分，确认继续？',
        //     onOk: () => {
        //       this.updateTask()
        //     },
        //     onCancel: () => {
        //       // this.getTaskData()
        //       if (saveFromEdit) {
        //         this.isSaved = true
        //         this.$router.push({ name: 'taskDetail', params: { id: this.tid }, query: { from: 'edit' } })
        //       }
        //     }
        //   })
        // } else {
        this.updateTask()
        // }
      }, 0)
    },
    // 添加/更新任务
    updateTask () {
      this.$axios({
        url: baseUrl + '/tasks/editPlan',
        method: 'post',
        data: this.params
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success({
              content: res.data.msg
            })
            // 是否保存的标志未设为true
            this.isSaved = true
            // 加载状态取消
            this.spinShow = false
            // 保存按钮loding消失
            this.saveLoading = false
            // 如果是在详情页面的编辑状态，取消编辑状态，解锁
            if (this.isEditing) {
              this.cancelEditHandler()
              this.app.reload()
            }
            // 如果是在编辑页面，跳到详情ing
            if (this.$route.query && parseInt(this.$route.query.editing) === 1) {
            // 该函数执行时，路由拦截执行
              // this.$router.push('/task/detail/' + this.tid + '?from=edit')
              this.$router.push({ name: 'taskDetail', params: { id: this.tid }, query: { from: 'edit' } })
              // 使用nextTick后第一次从编辑跳转到详情会出现失败的情况
              // detail页面还没有create的时候，不应该删除edit路由
              // 如果detail页面还没有create，此时删除edit路由，则current route会变成edit的上级路由，
              setTimeout(() => {
                bus.$emit('on-myclose', this.from)
              }, 100)
            }
          } else {
            this.$Message.error({
              content: res.data.msg
            })
            this.spinShow = false
            this.saveLoading = false
          }
        })
        .catch(err => {
          this.spinShow = false
          this.saveLoading = false
          console.log(err)
        })
    },
    // 检测方案日期是否有效
    checkDateValid () {
      let unfinished = this.getUnfinishedPlan()
      return unfinished.every(plan => {
        if (plan.taskPlanEndtime === '' || plan.taskPlanStarttime === '') {
          plan.errMsg.dateErrMsg = '日期不能为空'
        } else if (this.getTimeStamp(plan.taskPlanEndtime) < this.getTimeStamp(plan.taskPlanStarttime)) {
          plan.errMsg.dateErrMsg = '起始日期不能大于截止日期'
        } else {
          plan.errMsg.dateErrMsg = ''
        }
        return (plan.errMsg.dateErrMsg === '')
      })
    },
    // 检测方案执行人是否添加
    checkExecutorValid () {
      let unfinished = this.getUnfinishedPlan()
      return unfinished.every(plan => {
        if (!plan.executors.length) {
          plan.errMsg.executorErrMsg = '执行人不能为空'
        } else {
          plan.errMsg.executorErrMsg = ''
        }
        return (plan.errMsg.executorErrMsg === '')
      })
    },
    // 检测方案内容是否为空
    checkPlanValid () {
      let unfinished = this.getUnfinishedPlan()
      return unfinished.every(plan => {
        if (!plan.taskPlanContent.length) {
          plan.errMsg.planErrMsg = '方案内容不能为空'
        } else {
          plan.errMsg.planErrMsg = ''
        }
        return (plan.errMsg.planErrMsg === '')
      })
    },
    // 获取为完成任务列表
    getUnfinishedPlan () {
      return this.rowData.filter(plan => {
        return plan.taskPlanStatus !== '完成'
      })
    },
    // 编写评论
    handleCommentChange (e, item) {
      // this.$set(this.rowData[index], 'comment', this.rowData[index].comment.trim())
      item.comment = item.comment.trim()
      this.isCommenting = true
    },
    // 删除附件
    deleteAttachment (index) {
      this.$Modal.confirm({
        title: '提醒',
        content: '确定删除该附件吗？',
        width: '340px',
        onOk: () => {
          let deleted = this.enclousureList.splice(index, 1)
          deleted[0].isAdd = 2
          this.$axios({
            url: baseUrl + '/tasks/uploadAttachment',
            method: 'post',
            data: {
              tasks: {
                id: this.$route.params.id,
                // enclosureUrlList: this.enclousureList,
                enclosureUrlList: deleted
              }
            }
          })
            .then(res => {
              console.log(res)
              // this.getTaskData()
            })
        }
      })
    },
    // 显示附件删除按钮
    showCancel (index) {
      this.activeAttachmentIndex = index
    },
    // 隐藏附件删除按钮
    hideCancel () {
      this.activeAttachmentIndex = -1
    },
    // 判断页面数据是否有改动
    hasContentChanged () {
      return JSON.stringify(this.initTaskData) !== JSON.stringify(this.taskData)
    },
    // 截止日期 =>改变时将期设为字符串格式ime
    handleDateChange (date) {
      let bkp = JSON.parse(JSON.stringify(this.taskData)).endTime
      this.taskData.endTime = date
      if (this.taskData.content) {
        let pEndTime = this.getMaxDate()
        let tEndTime = moment(date).valueOf()
        // 如果截止日期早于
        if (pEndTime > tEndTime) {
          this.$Modal.warning({
            title: '提示',
            content: '方案截止时间超过任务截止时间，请先修改方案时间!',
            onOk: () => {
              this.taskData.endTime = bkp
            }
          })
        }
      }
    },
    // 解锁
    cancelLock (id) {
      // console.log('closed')
      this.$axios({
        url: baseUrl + '/tasks/cancelLockEditPlan',
        params: { taskId: id },
        type: 'get'
      })
        .then(res => {
          let msg = res.data.msg
          if (res.data.code === 10000) {
            this.$Message.success(msg)
          } else {
            // this.$Message.error(msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    lock (id, cb) {
      this.$axios({
        url: baseUrl + '/tasks/lockEditPlan',
        params: { taskId: id },
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
          } else if (res.data.code === 10056) {
            cb()
            this.$Message.error(res.data.msg + '正在编辑')
          }
        })
        .catch(err => {
          console.log(err)
          this.editLoading = false
        })
    },
    // 文件上传回调
    handleSuccess (response, file, fileList) {
      let f = {
        contractId: 0,
        enclosureUrl: file.response.url,
        enclosureName: file.response.filename,
        isAdd: 1, // 新增
        status: 0
      }
      this.$axios({
        url: baseUrl + '/tasks/uploadAttachment',
        method: 'post',
        data: {
          tasks: {
            id: this.$route.params.id,
            enclosureUrlList: [f]
          }
        }
      })
        .then(res => {
          console.log(res)
          this.getEnclousureList()
        })
    },
    handleExceeded () {
      this.$Message.error('上传失败，文件超过20M')
    },
    // 是否有人编辑
    isSomeoneEditing (id, callback) {
      this.$axios({
        url: baseUrl + '/tasks/lockEditPlan',
        params: { taskId: id },
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.editLoading = false
            callback(id)
          } else if (res.data.code === 10056) {
            this.editLoading = false
            this.$Message.error(res.data.msg + '正在编辑')
          // return true
          }
        })
        .catch(err => {
          this.editLoading = false
          console.log(err)
        })
    },
    getTaskLevelId (key) {
      let levelMap = { 'A': 1, 'B': 2, 'C': 3 }
      return levelMap[key]
    },
    getTaskStatusId (key) {
      let status = [
        // { 'tasksStatusId': '4', 'tasksStatusName': '待确认' },
        // { 'tasksStatusId': '3', 'tasksStatusName': '暂缓' },
        // { 'tasksStatusId': '7', 'tasksStatusName': '关闭' }
        { 'tasksStatusId': '1', 'tasksStatusName': '进行中' },
        { 'tasksStatusId': '2', 'tasksStatusName': '完成' },
        { 'tasksStatusId': '3', 'tasksStatusName': '暂缓' },
        { 'tasksStatusId': '4', 'tasksStatusName': '待确认' },
        { 'tasksStatusId': '7', 'tasksStatusName': '关闭' }
      ]
      let index = status.findIndex(item => {
        return item.tasksStatusName === key
      })
      return status[index].tasksStatusId
    },
    // 完成方案不收起

    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ])
  },
  watch: {
    index (val) {
      // console.log(val)
    },
    '$route' (to, from) {
      if (to) {
        if (to.name === 'taskDetail' || to.name === 'taskEdit') {
          this.tid = to.params.tid
          // tag-nav切换时候加200毫秒延时，防止闪动
          // this.getTaskData(200)
          this.app.reload()
        }
      }
      // 从详情离开
      if (from.name === 'taskDetail') {
        // 如果处于编辑状态
        if (this.isEditing) {
          // 取消编辑状态
          this.$axios({
            url: baseUrl + '/tasks/cancelLockEditPlan',
            params: { taskId: this.tid },
            type: 'get'
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.cancelEditHandler()
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    }
  },
  // 离开详情编辑页面之前的钩子
  beforeRouteLeave (to, from, next) {
    // 编辑跳转到详情时将编辑的tag-nav删除，参数为from
    this.from = from
    let hasChange
    // 如果未保存，判断内容是否有变
    if (!this.isSaved) {
      hasChange = this.hasContentChanged()
    } else {
      hasChange = false
    }
    // 如果有变化，此时点击离开页面提醒保存
    if (hasChange) {
      this.$Modal.confirm({
        title: '取消编辑',
        content: '<p>还有未保存的内容，确认取消吗</p>',
        onOk: () => {
          this.cancelEditHandler()
          this.cancelLock(this.from.params.id)
          next()
          // 删除当前nav-tag
          // 后面考虑async
          if (this.isButtonBack) {
            setTimeout(() => {
              bus.$emit('on-myclose', this.from)
            })
          }
        },
        onCancel: () => {
          next(false)
          this.isButtonBack = false
        }
      })
    } else {
      next()
      // 从编辑页面离开解锁
      if (this.from.name === 'taskEdit') {
        this.cancelLock(this.from.params.id)
      } else if (this.from.name === 'taskDetail') {
        // 如果是详情页面但是处于编辑状态，也需要解锁
        if (this.isEditing) {
          this.cancelLock(this.from.params.id)
        }
      }
      // 删除当前nav-tag
      if (this.isButtonBack) {
        setTimeout(() => {
          bus.$emit('on-myclose', from)
        }, 100)
      }
    }
  },
  // 路由进入之前
  beforeRouteEnter (to, from, next) {
    // console.log('beforeRouteEnter')
    // detail页面直接进
    if (to.name === 'taskDetail') {
      next()
    } else {
      next(vm => {
        // 编辑页面判断是否有人编辑
        vm.lock(to.params.id, () => {
          vm.$router.go(-1)
          vm.tagNavList.splice(vm.tagNavList.length - 1, 1)
          vm.setTagNavList(vm.tagNavList)
        })
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    let hasChange
    // 如果未保存，判断内容是否有变
    if (!this.isSaved) {
      hasChange = this.hasContentChanged()
    } else {
      hasChange = false
    }
    // 如果有变化，此时点击离开页面提醒保存
    if (hasChange) {
      // 如果是从详情页面离开到另一个详情
      if (from.name === 'taskDetail') {
        this.$Modal.confirm({
          title: '取消编辑',
          content: '<p>还有未保存的内容，确认取消吗</p>',
          onOk: () => {
            this.cancelEditHandler()
            this.cancelLock(from.params.id)
            next()
          },
          onCancel: () => {
            // next(from.path)
            iView.LoadingBar.finish()
            next(false)
          }
        })
      } else {
        // 编辑页面之间切换
        this.$Modal.confirm({
          title: '取消编辑',
          content: '<p>还有未保存的内容，确认取消吗</p>',
          onOk: () => {
            // 先判断要进入的编辑页面是否有人编辑
            this.$axios({
              url: baseUrl + '/tasks/lockEditPlan',
              params: { taskId: to.params.id },
              method: 'get'
            })
              .then(res => {
                if (res.data.code === 10000) {
                // 没人编辑解锁当前编辑
                  this.cancelLock(from.params.id)
                  next()
                } else if (res.data.code === 10056) {
                  // 否则提示有人正在编辑
                  this.$Message.error(res.data.msg + '正在编辑')
                  iView.LoadingBar.finish()
                // next(from.path)
                }
              })
          },
          onCancel: () => {
            iView.LoadingBar.finish()
            next(false)
          }
        })
      }
    } else {
      if (from.name === 'taskDetail') {
        next()
      } else {
        // 先判断要进入的编辑页面是否有人编辑
        this.$axios({
          url: baseUrl + '/tasks/lockEditPlan',
          params: { taskId: to.params.id },
          method: 'get'
        })
          .then(res => {
            if (res.data.code === 10000) {
            // 没人编辑解锁当前编辑
              this.cancelLock(from.params.id)
              next()
            } else if (res.data.code === 10056) {
              // 否则提示有人正在编辑
              this.$Message.error(res.data.msg + '正在编辑')
              iView.LoadingBar.finish()
            // next(from.path)
            }
          })
      }
    }
  },
  computed: {
    // 是否有编辑全权限
    canEditAll () {
      return this.taskData.button && this.taskData.button.editTasks
    },
    // 只能编辑方案
    canEditPlanOnly () {
      return this.taskData.button && this.taskData.button.editTasksPlan
    },
    // 判断是否有已完成的任务
    hasCompletedPlan () {
      return this.rowData.some(plan => {
        return plan.taskPlanStatus === '完成'
      })
    },
    // 是否显示编辑按钮
    showEditBtn () {
      return (this.canEditAll || this.canEditPlanOnly)
      // return this.hasPlan && (this.isSender || this.isReceiver) || (!this.hasPlan && this.isSender)
    },
    // 是否时发起人
    isSender () {
      return this.canEditAll
    },
    isSimpleTaskSender () {
      let sendUid = this.taskData.sendUid
      return sendUid === this.uid
    },
    // 是否接收人
    isReceiver () {
      // let acceptUid = this.taskData.acceptUid
      // return acceptUid == this.uid
      return this.canEditPlanOnly
    },
    styleObj () {
      return {
        bottom: parseFloat(this.offsetHeight) + 10 + 'px'
      }
    },
    showTaskConfirmBtn () {
      return this.taskData.button && this.taskData.button.confirmTasks
    },
    // tag-navs数据
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    // 人员列表
    employees () {
      return this.app.employees
    },
    options () {
      return this.getTree(this.employeesAndDept)
    },
    isLoggedIn () {
      return this.$store.state.user.userId
    },
    // 将部门数据结构改为同一层级
    flatDeptNames () {
      let flat = []
      if (this.deptNames.length > 0) {
        flat = this.flatTree(this.deptNames, flat)
      }
      flat.some(item => {
        if (item.id === 'dpt1') {
          item.pid = null
        }
      })
      return flat
    },
    // 合并部门和人员信息
    employeesAndDept () {
      let labelEmployee = this.employees.map(employee => {
        return { ...employee, label: employee.nickname, pid: 'dpt' + employee.pid }
      })
      return [...this.flatDeptNames, ...labelEmployee]
    },
    isPhone () {
      // comment
      return this.$store.state.app.isPhone
    },
    // 是否有更改任务等级的权限
    canChangeTaskLevel () {
      return this.taskData.button && this.taskData.button.special
    },
    taskLevels () {
      return this.app.taskLevels
    },
    taskStatus () {
      let currentStatus = this.taskData.taskStatus
      if (currentStatus === '待确认' || currentStatus === '暂缓' || currentStatus === '关闭') {
        return [
          { 'tasksStatusId': '4', 'tasksStatusName': '待确认' },
          { 'tasksStatusId': '3', 'tasksStatusName': '暂缓' },
          { 'tasksStatusId': '7', 'tasksStatusName': '关闭' }
        ]
      }
    },
    // 最后一条完成方案的时间
    lastCompletePlanTime () {
      let timeArr = []
      let today = moment(moment().format('YYYY-MM-DD')).valueOf()
      this.rowData.forEach(item => {
        if (item.taskPlanStatus === '完成') {
          if (moment(item.taskPlanStarttime).valueOf() > today) {
            // 是否有提前完成的方案
            this.hasForCompletePlan = true
          }
          timeArr.push(moment(item.taskPlanEndtime).valueOf())
        }
      })
      let filteredArr = timeArr.filter(item => {
        return item <= today
      })
      return moment(filteredArr.sort()[(filteredArr.length - 1)]).format('YYYY-MM-DD')
      // return moment(timeArr.sort()[(timeArr.length - 1)]).format('YYYY-MM-DD')
    }
  }
}

// 按钮操作mixin
export const buttonMixin = {
  // inject: ['tasks'],
  data () {
    return {
      // 当前任务信息
      currentTask: {}
    }
  },
  methods: {
    // 是否有人在编辑
    isSomeoneEditing (id, callback) {
      this.$axios({
        url: baseUrl + '/tasks/lockEditPlan',
        params: { taskId: id },
        method: 'get'
      })
        .then(res => {
          if (res.data.code === 10000) {
            callback(id)
          } else if (res.data.code === 10056) {
            this.$Message.error(res.data.msg + '正在编辑')
            // return true
          }
        })
    }
  }
}
