import { baseUrl } from '@/api/base.js'
import moment from 'moment'
export default {
  inject: ['app'],
  data () {
    return {
      allTableData: [],
      loading: false,
      timeRange: [],
      leaveTimeRange: [],
      totalCount: 0,
      variableObject: {
        pageSize: 20,
        currPage: 1,
        fuzzyCondition: '',
        uid: '',
        deptId: '',
        positionId: '',
        rankId: '',
        roleId: '',
        userStatus: '-1',
        starttime: '',
        endtime: '',
        leaveStartTime: '',
        leaveEndTime: ''
      },
      headerSelection: {
        deptTree: [], // 部门的树
        position: [], // 职位
        rank: [], // 职级
        role: [], // 角色
        educate: [], // 学历
        clubs: []// 俱乐部
      },
      deptList: [],
      rolePermissionList: []
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
		 *
		  create: false, // 新增
		  export: false, // 导出
		  retrie: false, // 查看
      update: false, // 编辑

		  permission: false, // 权限设置
		*/
      return this.$store.state.user.userpermission.userManage
    }

  },
  methods: {
    // 获取全部(-1) 在职(0) 离职(1)数据
    getTableData (data = {}) {
      let _self = this
      let sendData = _self.getSendData(data)
      _self.loading = true
      this.$axios({
        url: `${baseUrl}/user/page`,
        data: $qs.stringify(sendData, { indices: false }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            _self.allTableData = resp.data.content.pageContent
            _self.totalCount = resp.data.content.totalCount
            _self.loading = false
          } else {
            _self.allTableData = resp.data.content.pageContent
            _self.loading = false
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 获取部门树状结构
    getDeptList () {
      this.$axios({
        url: baseUrl + '/structure/getDeptList',
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.deptList = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getDeptList', err)
        })
    },
    // 搜索条件
    getSendData (data) {
      let keys = Object.keys(this.variableObject)
      let _self = this
      let sendData = {}
      // 非空字符串
      let hasValueKeys = keys.filter(e => {
        return _self.variableObject[e] !== ''
      })
      // 拷贝到sendData
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = _self.variableObject[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
      }
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      if (_self.timeRange[0]) {
        sendData.starttime = moment(_self.timeRange[0]).format('YYYY-MM-DD')
        sendData.endtime = moment(_self.timeRange[1]).format('YYYY-MM-DD')
      }
      if (_self.leaveTimeRange[0]) {
        sendData.leaveStartTime = moment(_self.leaveTimeRange[0]).format('YYYY-MM-DD')
        sendData.leaveEndTime = moment(_self.leaveTimeRange[1]).format('YYYY-MM-DD')
      }
      return sendData
    },
    // 获取表头部门 职位 职级 角色
    getHeaderListData () {
      this.$axios({
        url: baseUrl + '/user/pageInitCondition',
        data: $qs.stringify(),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.headerSelection = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 清空表头搜索条件
    refresh (searchContent) {
      let { pageSize, currentPage } = this.variableObject
      this.variableObject = {
        uid: '',
        deptId: '',
        positionId: '',
        rankId: '',
        roleId: '',
        starttime: '',
        endtime: '',
        leaveStartTime: '',
        leaveEndTime: '',
        fuzzyCondition: searchContent,
        pageSize,
        currentPage
      }

      this.timeRange = [null, null]
      this.leaveTimeRange = [null, null]
      this.getTableData()
    },
    // 导出
    exportExcel () {
      let _self = this.variableObject
      let data = {
        uid: _self.uid,
        deptId: _self.deptId,
        positionId: _self.positionId,
        rankId: _self.rankId,
        roleId: _self.roleId,
        userStatus: _self.userStatus,
        starttime: _self.starttime,
        endtime: _self.endtime,
        leaveStartTime: _self.leaveStartTime,
        leaveEndTime: _self.leaveEndTime,
        fuzzyCondition: _self.fuzzyCondition
      }
      if (this.timeRange[0]) {
        data.starttime = moment(this.timeRange[0]).format('YYYY-MM-DD')
        data.endtime = moment(this.timeRange[1]).format('YYYY-MM-DD')
      }
      if (this.leaveTimeRange[0]) {
        data.leaveStartTime = moment(this.leaveTimeRange[0]).format('YYYY-MM-DD')
        data.leaveEndTime = moment(this.leaveTimeRange[1]).format('YYYY-MM-DD')
      }
      window.open(baseUrl +
        '/user/exportTbUser?' +
        $qs.stringify(data, {
          indices: false
        })
      )
    },
    // 新增
    handleAddUser () {
      this.$router.push({
        name: 'addNewUser'
      })
    },
    // 离职
    handleDimission (row) {
      this.$router.push({
        name: 'leaveOffice',
        query: { id: row.id }
      })
    },
    // 返回用户管理
    handleCloseTag () {
      if (this.hasChange) {
        this.$Modal.confirm({
          title: '取消编辑',
          content: '<p>还有未保存的内容，确认取消吗</p>',
          onOk: () => {
            bus.$emit('on-myclose', this.$route)
            this.$router.push({
              name: 'userManagement'
            })
          }
        })
      } else {
        bus.$emit('on-myclose', this.$route)
        this.$router.push({
          name: 'userManagement'
        })
      }
    },
    closeCurrentTag () {
      bus.$emit('on-myclose', this.$route)
    },
    // 获取角色权限
    getRolePermission () {
      this.$axios({
        url: baseUrl + '/permission/lookRole',
        data: $qs.stringify(),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.rolePermissionList = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 查看
    handleView (row) {
      if (row.userStatusName === '离职') {
        this.$router.push({
          name: 'lookUserinfo',
          query: {
            id: row.id,
            status: 'leave'
          }
        })
      } else if (row.userStatusName === '在职') {
        this.$router.push({
          name: 'lookUserinfo',
          query: {
            id: row.id
          }
        })
      }
    }
  }
}
