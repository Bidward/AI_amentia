<template>
  <div id="mainWrap" class="viewWrapper">
    <div class="headWrap tableHeader-only">
      <Button class="five" v-if="permiss.create" type="primary" @click="addUser">新增</Button>
      <div class="searchbar">
        <Button v-if="permiss.export" @click="outputExcel" slot="extra" style="margin-right:10px;">
          <Icon type="ios-log-out" />导出
        </Button>
        <Button @click="openfilterCard">
          <Icon type="ios-arrow-up " v-if="filterCard" />
          <Icon type="ios-arrow-down" v-else />筛选
        </Button>
      </div>
    </div>
    <Card style="margin-top:10px;padding:20px;" v-if="filterCard">
      <div>
        <span class="searchTitle">入职时间：</span>
        <DatePicker
          v-model="headerData.starttime"
          @on-change="headerData.starttime=$event"
          format="yyyy-MM-dd"
          clearable
          style="width:145px;margin-left:5px;"
        ></DatePicker>-
        <DatePicker
          clearable
          v-model="headerData.endtime"
          @on-change="headerData.endtime=$event"
          format="yyyy-MM-dd"
          style="width:146px;margin-right:5px;"
        ></DatePicker>
        <span class="searchTitle">姓名：</span>
        <Input
          v-model="headerData.nickname"
          @on-enter="search"
          clearable
          style="width:200px;margin:5px"
        ></Input>
        <span class="searchTitle">部门：</span>
        <tree-select
          class="searchBar"
          v-model="headerData.dept"
          :expand-all="true"
          check-strictly
          @on-check-change="search"
          :data="headerSelection.deptTree"
        />
        <br />
        <span class="searchTitle">职位：</span>
        <Select clearable v-model="headerData.positionId" @on-change="search" class="searchBar" style="width:300px;">
          <Option
            v-for="(item,key) in headerSelection.position "
            :value="item.positionId"
            :key="key"
            :label="item.positionName"
          ></Option>
        </Select>
        <span class="searchTitle">职级：</span>
        <Select clearable v-model="headerData.rankId" class="searchBar" @on-change="search">
          <Option
            v-for="(item,key) in headerSelection.rank "
            :value="item.rankId"
            :key="key"
            :label="item.rankName"
          ></Option>
        </Select>
        <span class="searchTitle">状态：</span>
        <Select clearable v-model="headerData.userStatus" @on-change="search" class="searchBar">
          <Option value="0" key="0">在职</Option>
          <Option value="1" key="1">离职</Option>
          <Option value="-1" key="-1">全部</Option>
        </Select>
      </div>
      <div style="float:right;">
        <Button class="five" @click="clearSelection">
          <Icon type="ios-trash-outline" />清空搜索
        </Button>
        <Button class="five" type="primary" @click="search">搜索</Button>
        <Button class="five" type="primary" @click="filterCard = false">
          <Icon type="ios-arrow-up" />收起
        </Button>
      </div>
    </Card>
    <Table
      :loading="loading"
      style="margin-top:10px"
      :columns="tableHeader"
      :data="tableContent"
      border
    >
      <template slot-scope="{ row, index }" slot="option">
        <Button
          size="default"
          type="primary"
          v-if="permiss.retrie"
          @click="show(row.id)"
          style="margin-right: 5px"
        >查看</Button>
        <Button
          size="default"
          type="primary"
          v-if="permiss.update"
          @click="edit(row.id)"
          style="margin-right: 5px;"
        >编辑</Button>
        <Button
          size="default"
          type="primary"
          v-if="permiss.permission"
          @click="rolePermission(row)"
        >角色设置</Button>
      </template>
    </Table>
    <div class="tableFooter">
      <Page
        :total="totalCount"
        :page-size="pageSize"
        :current="currPage"
        size="small"
        show-total
        show-sizer
        show-elevator
        @on-page-size-change="(pageSize)=>currentPageChange(currPage,pageSize)"
        @on-change="(current)=>currentPageChange(current,pageSize)"
        style="float:right;margin-botton:20px;"
      />
    </div>
    <Modal v-model="userModal" title="用户权限配置" @on-ok="updateUserPermission" id="userModalColor">
      <Tree
        :data="userSetData"
        expand
        show-checkbox
        @on-select-change="selectChange"
        @on-check-change="selectChange"
      ></Tree>
    </Modal>
    <Modal v-model="rolePermissionModal" title="角色设置" @on-ok="saveRoleSet">
      <div>
        <Select v-model="roleId">
          <Option
            v-for="(item,key) in rolePermissionList"
            :value="item.roleId"
            :key="key"
            :label="item.roleName"
          ></Option>
        </Select>
      </div>
    </Modal>
  </div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import TreeSelect from '_c/tree-select'
export default {
  name: 'userManage',
  components: {
    TreeSelect
  },
  data () {
    return {
      roleId: '', // 角色id
      rolePermissionList: [], // 角色列表
      rolePermissionModal: false, // 角色设置modal框开关
      userModal: false, // 用户权限配置modal框开关
      userSetData: [], // 用户权限数据
      userIds: [], // 用户权限配置传回的用户ID数组对象 json形式
      loading: false,
      baseUrl: baseUrl,
      filterCard: false, // 是否显示高级搜索
      tableHeader: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 80
        },
        {
          title: '姓名',
          key: 'nickname',
          align: 'center',
          width: 100
        },
        {
          title: '部门',
          key: 'deptFullName',
          align: 'center',
          minWidth: 200,
          tooltip: true
        },
        {
          title: '职位',
          key: 'positionName',
          align: 'center',
          minWidth: 180,
          tooltip: true
        },
        {
          title: '职级',
          key: 'rankName',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center',
          width: 80
        },
        {
          title: '身份证号码',
          key: 'personId',
          align: 'center',
          width: 160
        },
        {
          title: '入职时间',
          key: 'entryDate',
          align: 'center',
          width: 100
        },
        {
          title: '角色',
          key: 'roleName',
          align: 'center',
          width: 100
        },
        {
          title: '状态',
          key: 'userStatusName',
          align: 'center',
          width: 80
        },
        {
          title: '操作',
          slot: 'option',
          width: 300,
          align: 'center'
        }
      ],
      tableContent: [],
      totalCount: 100,
      pageSize: 20,
      currPage: 1,
      headerData: {
        dept: [],
        // 搜索框的内容
        nickname: '',
        starttime: '',
        endtime: '',
        deptId: [],
        rankId: '',
        positionId: '',
        userStatus: '0'
      },
      headerSelection: {
        deptTree: [], // 部门的树
        position: [], // 职位
        rank: [] // 职级
      }
    }
  },
  mounted () {
    // this.getPermission()
    this.getHeaderData()
    this.search()
    // this.getData();
  },
  methods: {
    // 获取当前页面权限
    // getPermission () {
    // 改在vuex里面用coumpted
    // },
    // 角色管理    给用户设置角色 获取初始角色列表
    rolePermission (row) {
      this.roleId = row.roleId
      this.rolePermissionModal = true
      this.userId = row.id
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
    // 保存给用户设置的角色
    saveRoleSet () {
      let sendData = {
        userId: this.userId,
        roleId: this.roleId
      }
      this.$axios({
        url: baseUrl + '/permission/updateUserRole',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.$Message.info(resp.data.msg)
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 权限设置
    userPermission (row) {
      this.userId = row.id
      this.userModal = true
      // 用户权限配置初始化接口
      let sendData = {
        id: this.userId,
        type: 'user'
      }
      this.$axios({
        url: baseUrl + '/permission/getPermissionList',
        data: $qs.stringify(sendData, {
          indices: false
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.userSetData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 选择权限
    selectChange (index) {
      this.userIds = index.map(e => {
        return {
          permissionId: e.id,
          type: e.type,
          positionPermission: e.disabled // 职位权限与用户权限的区分
        }
      })
    },
    // 保存设置的用户权限
    updateUserPermission () {
      let sendData = {
        id: this.userId,
        permissionIds: this.userIds
      }
      this.$axios({
        url: baseUrl + '/permission/updateUserPermission',
        data: sendData,
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.userSetData = resp.data.content
            this.$Message.info(resp.data.msg)
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    openfilterCard () {
      this.filterCard === true
        ? (this.filterCard = false)
        : (this.filterCard = true)
    },
    currentPageChange (currPage, pageSize) {
      this.pageSize = pageSize
      this.currPage = currPage
      this.loading = true
      this.$axios({
        url: baseUrl + '/user/page',
        data: $qs.stringify(
          {
            username: this.headerData.nickname,
            deptId: this.headerData.dept,
            positionId: this.headerData.positionId,
            rankId: this.headerData.rankId,
            starttime: this.headerData.starttime,
            endtime: this.headerData.endtime,
            userStatus: this.headerData.userStatus,
            currPage: this.currPage,
            pageSize: this.pageSize
          },
          {
            indices: false
          }
        ),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.tableContent = resp.data.content.pageContent
            this.currPage = resp.data.content.currPage
            this.pageSize = resp.data.content.pageSize
            this.totalCount = resp.data.content.totalCount
            this.loading = false
          } else {
            this.tableContent = resp.data.content.pageContent
            this.currPage = resp.data.content.currPage
            this.pageSize = resp.data.content.pageSize
            this.totalCount = resp.data.content.totalCount
            this.loading = true
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    addUser () {
      // 跳转到添加用户页面
      this.$router.push({
        name: 'addUser',
        query: {
          type: 'add'
        }
      })
    },
    outputExcel () {
      // 导出excel
      let data = {
        username: this.headerData.nickname,
        deptId: this.headerData.dept,
        positionId: this.headerData.positionId,
        rankId: this.headerData.rankId,
        starttime: this.headerData.starttime,
        endtime: this.headerData.endtime,
        userStatus: this.headerData.userStatus
      }
      window.open(
        this.baseUrl +
          '/user/exportTbUser?' +
          $qs.stringify(data, {
            indices: false
          })
      )
      // console.log($qs.stringify(data))
    },
    getHeaderData () {
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
    search () {
      this.loading = true
      let sendData = {
        username: this.headerData.nickname,
        deptId: this.headerData.dept,
        positionId: this.headerData.positionId,
        rankId: this.headerData.rankId,
        starttime: this.headerData.starttime,
        endtime: this.headerData.endtime,
        userStatus: this.headerData.userStatus
      }
      this.$axios({
        url: baseUrl + '/user/page',
        data: $qs.stringify(sendData, {
          indices: false
        }),
        method: 'post'
      })
        .then(resp => {
          console.log(resp)
          let content = resp.data.content
          this.tableContent = content.pageContent
          this.currPage = content.currPage
          this.pageSize = content.pageSize
          this.totalCount = content.totalCount
          this.loading = false
          if (resp.data.code !== 10000) {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    clearSelection () {
      this.headerData = {
        nickname: '',
        starttime: '',
        endtime: '',
        dept: [],
        rankId: '',
        positionId: '',
        userStatus: '0'
      }
    },
    show (id) {
      this.$router.push({
        name: 'showUser',
        query: {
          id: id,
          type: 'show'
        }
      })
    },
    edit (id) {
      this.$router.push({
        name: 'addUser',
        params: {
          title: '编辑'
        },
        query: {
          id: id,
          type: 'edit'
        }
      })
    }
  },
  computed: {
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
  watch: {}
}
</script>

<style scoped>
#mainWrap {
  /* top: 100px;
  padding: 30px; */
}

#mainWrap .right {
  /* float: right; */
}

#mainWrap .right::after {
  content: '';
  clear: both;
}

#mainWrap .headWrap {
  /* border-bottom: 2px solid #088f74;
  padding: 3px; */
}

#mainWrap .five {
  margin-right: 5px;
}

#mainWrap .searchBar {
  width: 200px;
  margin: 5px;
}

#mainWrap .searchTitle {
  display: inline-block;
  width: 80px;
  text-align: right;
}

.ivu-btn-primary {
  background-color: #19aa8d;
  border-color: #19aa8d;
  color: #fff;
}
</style>
<style>
#userModalColor .ivu-tree-arrow {
}

#userModalColor .ivu-tree ul {
  font-size: 15px !important;
}
#userModalColor .ivu-btn-primary {
  background-color: #19aa8d !important;
  border-color: #19aa8d !important;
}
</style>
