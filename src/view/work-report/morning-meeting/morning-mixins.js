import { baseUrl } from '@/api/base.js'
import moment from 'moment'

export default {
  inject: ['app'],
  data () {
    return {
      allTableData: [
        {
          date: '2020-2-2',
          object: '主题',
          status: '未读',
          recordman: '汪黛玉'

        }
      ],
      disabledOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      loading: false,
      timeRange: [null, null],
      totalCount: 0,
      variableObject: {
        currPage: 1,
        pageSize: 20,
        subject: '',
        recorderId: '',
        startTime: '',
        endTime: '',
        searchContent: '',
        isRead: ''
      },
      subjectList: [],
      headerSelection: {
        objectList: []
      }

    }
  },
  methods: {
    // 获取主题
    getSubject () {
      this.$axios({
        url: baseUrl + '/morning/getSubject',
        method: 'post'
      }).then(res => {
        if (res.data.code === 10000) {
          this.subjectList = res.data.content
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 我的晨会列表
    getmyMorningTableData (currPage, pageSize) {
      let _v = this.variableObject
      let sendData = {
        subject: _v.subject,
        recorderId: _v.recorderId,
        currPage: currPage,
        pageSize: pageSize || this.variableObject.pageSize,
        isRead: _v.isRead
      }
      if (this.timeRange[0]) {
        sendData.startTime = moment(this.timeRange[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(this.timeRange[1]).format('YYYY-MM-DD')
      }
      if (_v.searchContent) {
        sendData.searchContent = _v.searchContent.trim()
      }
      this.$axios({
        url: baseUrl + '/morning/getMyMeetingList',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          this.allTableData = res.data.content.pageContent
          this.totalCount = res.data.content.totalCount
          this.canAdd = res.data.content._disabled
          this.variableObject.currPage = res.data.content.currPage
          this.variableObject.pageSize = res.data.content.pageSize
        } else {
        //   this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 重置
    refresh (searchContent) {
      let { pageSize, currentPage } = this.variableObject
      this.variableObject = {
        subject: '',
        recorderId: '',
        startTime: '',
        endTime: '',
        isRead: '',
        searchContent: searchContent,
        pageSize,
        currentPage
      }
      this.timeRange = [null, null]
      this.getmyMorningTableData()
    },
    // 选择某个节点
    handleSelect (nodes) {
      let select = []
      if (nodes.children) {
        this.getLeaf(nodes, select)
      } else {
        select.push(nodes.id)
      }
      this.baseInfo.attendeeList = this.baseInfo.attendeeList.concat(select)
      let $select = this.$refs['attendSelect']
      $select.resetSearchQuery('')

      if (this.baseInfo.unAttendeeList.length > 0) {
        let resultMap = {}
        this.baseInfo.attendeeList.forEach(n => resultMap[n] = true)
        let requestResult = this.baseInfo.unAttendeeList.filter(n => resultMap[n])
        for (var key in requestResult) {
          console.log(requestResult[key])
          let index = this.findIndexById(requestResult[key], this.baseInfo.unAttendeeList)
          if (index >= 0) {
            this.baseInfo.unAttendeeList.splice(index, 1)
          }
        }
      }

      this.$axios({
        url: baseUrl + '/morning/addMettingAttendee',
        method: 'post',
        data: { id: this.baseInfo.id, attendeeList: select }
      }).then(res => {
        if (res.data.code === 10000) {
          this.baseInfo.emphasisList = res.data.content
          this.searcheJobArrange()
        } else {
          this.$Message.error(res.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 取消勾选
    handleDeselect (nodes) {
      // 如果该节点有字节点 删除字节点
      if (nodes.children) {
        if (nodes.id === 'dpt1') {
          this.baseInfo.attendeeList = []
        } else {
          this.removeLeaf(nodes)
        }
      } else {
        // 否则删除该节点
        let index = this.findIndexById(nodes.id, this.baseInfo.attendeeList)
        this.baseInfo.attendeeList.splice(index, 1)
        let indexList = []
        indexList.push(nodes.id)
        let map = {}
        // 删除的参会人在配置的参会人中就进未到人，不需要发请求
        // 删除的参会人不在配置的参会人不进进未到人，需要发请求
        this.baseInfo.settingAttendeeList.forEach(n => map[n] = true)
        let result = indexList.filter(n => map[n])
        if (result.length <= 0) {
          this.$axios({
            url: baseUrl + '/morning/deleteMettingAttendee',
            method: 'post',
            data: { id: this.baseInfo.id, attendeeList: indexList }
          }).then(res => {
            if (res.data.code === 10000) {
              this.baseInfo.emphasisList = res.data.content
              this.searcheJobArrange()
            } else {
              this.$Message.error(res.data.msg)
            }
          }).catch(err => {
            console.log('err', err)
          })
        } else {
          this.baseInfo.unAttendeeList = [...new Set(this.baseInfo.unAttendeeList.concat(indexList))]
        }
      }
    },
    // 点击清除按钮
    handleClearAll () {
      // 清除的人中只有在配置的参会人中的人 到 未到人
      let map = {}
      this.baseInfo.settingAttendeeList.forEach(n => map[n] = true)
      let unResult = this.baseInfo.attendeeList.filter(n => map[n])
      this.baseInfo.unAttendeeList = unResult

      // 清除的人中是新增加的人发请求
      let resultMap = {}
      this.baseInfo.settingAttendeeList.forEach(n => resultMap[n] = true)
      let requestResult = this.baseInfo.attendeeList.filter(n => !resultMap[n])

      this.baseInfo.attendeeList = []

      if (requestResult > 0) {
        this.$axios({
          url: baseUrl + '/morning/deleteMettingAttendee',
          method: 'post',
          data: { id: this.baseInfo.id, attendeeList: requestResult }
        }).then(res => {
          if (res.data.code === 10000) {
            this.baseInfo.emphasisList = res.data.content
            this.searcheJobArrange()
          } else {
            this.$Message.error(res.data.msg)
          }
        }).catch(err => {
          console.log('err', err)
        })
      }
    },
    // 获取纯子节点
    getLeaf (nodes, arr) {
      nodes.children.forEach(node => {
        if (node.children) {
          this.getLeaf(node, arr)
        } else {
          arr.push(node.id)
        }
      })
    },
    // 删除子节点
    removeLeaf (nodes) {
      console.log(nodes)
      nodes.children.forEach(node => {
        if (node.children) {
          this.removeLeaf(node)
        } else {
          let index = this.findIndexById(node.id, this.baseInfo.attendeeList)
          if (index >= 0) {
            this.baseInfo.attendeeList.splice(index, 1)
          }
        }
      })
    },
    // 根据id获取index
    findIndexById (id, arr) {
      return arr.findIndex((value, index) => {
        return value === id
      })
    },
    // 新增
    handleAdd () {
      this.$router.push({
        name: 'addNewMorning',
        query: {
          option: 'add'
        }
      })
    },
    // 编辑
    handleEdit (row) {

    },
    handleView (row) {
      this.$router.push({
        name: 'detailMorning',
        query: {
          id: row.id
        }
      })
    },
    goBack () {
      this.$router.go(-1)
      bus.$emit('on-myclose', this.$route)
    }
  },
  computed: {
    // 在职人员
    employees () {
      return this.app.employees
    },
    // 当前页面的权限
    permiss () {
      /**
        create: false, // 新增
        export: false, // 导出
        retrie: false, // 查看
        update: false, // 编辑
        permission: false, // 权限设置
      */
      return this.$store.state.user.userpermission.userManage
    },
    morningSettingPermiss () {
      return this.$store.state.user.userpermission.morningMeeting
    }
  }
}
