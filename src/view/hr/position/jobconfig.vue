<template>
<div id="mainWrap">
    <div class="headWrap">
        <div style="display: inline-block;width: 80px;height: 32px;">
            <Button class="five" v-if="permissionCreat" type="primary"  @click="addNewJob">新增职位</Button>
        </div>
        <div class="right">
            <Button @click="openfilterCard"><Icon type="ios-arrow-up " v-if="filterCard"/><Icon type="ios-arrow-down" v-else/>筛选</Button>
        </div>
    </div>
    <Card style="margin-top:10px;padding:20px;" v-if="filterCard">
        <div id="searchCard">
            <span class="searchTitle" >所属部门:</span>
            <Select @on-change="getPositionByDeptId()" v-model="searchDept" filterable clearable placeholder="请选择部门" style="width:200px">
                <Option v-for="item in deptNameList" :value="item.id" :label="item.tile" :key="item.id">{{item.title}}</Option>
            </Select>
            <span class="searchTitle">职位名称:</span> <Select v-model="searchPositionName" filterable clearable style="width:200px" ref="resetPositionName">
                <Option v-for="item in positionNameList" :value="item.positionName" :key="item.positionName">{{ item.positionName }}</Option>
            </Select>
        </div>
        <div style="float:right;">
            <Button class="five" @click="clearSearch"><Icon type="ios-trash-outline" />清空搜索</Button>
            <Button class="five" type="primary" @click="searchJob">搜索</Button>
            <Button class="five" type="primary" @click="filterCard = false"><Icon type="ios-arrow-up" />收起</Button>
        </div>
    </Card>
    <Table :loading="loading" id="jobTable" style="margin-top:10px" border :columns="columns" :data="tableData">
        <template slot-scope="{ row, index }" slot="numIndex">
            <span>{{index+1}}</span>
        </template>
        <template slot-scope="{ row, index }" slot="action">
            <Button v-if="permissionUpdate" type="primary" size="default" style="margin-right: 5px" @click="editPosition(row)">编辑</Button>
            <Button v-if="permissionSetting" type="primary" size="default" style="margin-right: 5px" @click="positionPermission(row)">权限设置</Button>
            <Button v-if="permissionDelet" type="error" size="default" @click="deleteRow(row)">删除</Button>
        </template>
    </Table>
    <Modal v-model="positionModal" title="职位权限配置" @on-ok="updatePositionPermission" id="positionModalColor">
        <Tree :data="positionSetData" expand show-checkbox @on-select-change="selectChange" @on-check-change="selectChange"></Tree>
    </Modal>
    <Modal :loading="addJobLoading" class="addJobModal" v-model="newJob" :title="modalTitle" cancelText="关闭" @on-ok="changePosiData">
        <h3><i class="require">*</i>职位名称:</h3>
        <Input v-model="positionName" clearable class="spacings"/>
        <br/>
        <h3><i class="require">*</i>编制人数:</h3>
        <Input v-model="strengthNum" clearable class="spacings" />
        <br/>
        <h3><i class="require">*</i>所属部门: </h3>
        <tree-select v-show="isAdd" :data="deptNameListTree" v-model="treeSelected" check-strictly filterable clearable class="spacings" :expand-all="true" placeholder="请选部门"></tree-select>
        <Input  v-show="!isAdd && this.updateDeptStatus  === 0" disabled v-model="inputTreeSelected" class="spacings"/>
        <tree-select v-show="!isAdd && this.updateDeptStatus  === 1" :data="deptNameListTree" v-model="treeSelected" check-strictly class="spacings" :expand-all="true" placeholder="请选部门"></tree-select>
    </Modal>
    <Page :total="total" :page-size="pageSize" :current="currPage" size="small" show-total show-sizer show-elevator @on-page-size-change="(pageSize)=>currentPageChange(currPage,pageSize)" @on-change="(currPage)=>currentPageChange(currPage,pageSize)" style="float:right;" />
</div>
</template>

<script>
import {
  baseUrl
} from '@/api/base.js'
import TreeSelect from '_c/tree-select'
export default {
  name: 'jobconfig',
  components: {
    TreeSelect
  },
  data () {
    return {
      permissionCreat: false, // 新增
      permissionSetting: false, // 权限设置
      permissionUpdate: false, // 编辑
      permissionDelet: false, // 删除
      loading: false, // 表格获取数据时为加载状态 开关
      positionSetData: [], // 职位权限配置选项
      positionModal: false, // 职位权限配置modal框开关
      positionTitle: [], // 职位权限配置传回的职位ID数组对象 json形式
      positionType: [], // 职位权限配置传回职位type数组对象 json形式
      searchDeptId: '', // 筛选时所属部门职位ID
      positionId: '',
      searchDept: '',
      modalTitle: '', // 新增编辑的modal头名称
      isAdd: true, // 新增编辑判断
      newJob: false, // 新增职位对话框是否显示 true为显示
      editJob: false, // 编辑职位对话框是否显示 true为显示
      filterCard: false, // 高级搜索框是否显示 true为显示
      addJobLoading: true, // modal框确定按钮 lodaing状态中断关闭 进行提示
      searchPositionName: '',
      updateDeptStatus: '', // 部门下是否有人的标志，0有人 1 没人
      strengthNum: '', // 编制人数
      strengthNumList: [], // 编制人数列表
      positionName: '', // 职位名称
      positionNameList: [], // 职位名称列表
      treeSelectedId: [], // 选中部门对应id
      treeSelected: [], // 选择的所属部门列表
      deptNameList: [], // 所属部门列表
      deptNameListTree: [],
      addDeptNameList: [], // 新增所属部门
      addDeptName: [], // 选择新增的所属部门列表
      editPositionName: '', // 编辑职位名称
      editStrengthNum: '', // 编辑编制人数,
      editId: '', // 当前编辑的部门id
      inputTreeSelected: '', // 编辑时所属部门下有人不可以编辑显示不可选择的input框
      total: 0,
      pageSize: 20,
      currPage: 1,
      columns: [{
        title: '序号',
        slot: 'numIndex',
        align: 'center',
        width: 80
      },
      {
        title: '职位名称',
        key: 'positionName',
        align: 'center'
      },
      {
        title: '所属部门',
        key: 'deptName',
        align: 'center'
      }, {
        title: '编制人数',
        key: 'strengthNum',
        align: 'center',
        width: 100
      }, {
        title: '操作',
        slot: 'action',
        align: 'center'
      }
      ],
      tableData: []
    }
  },
  mounted () {
    this.init()
  },

  computed: {
    positionStatus () {
      return this.positionStatus === '0'
    }
  },
  methods: {
    // 获取当前页面权限
    getPermission () {
      this.permissionCreat = this.$store.state.user.userpermission.position.create
      this.permissionUpdate = this.$store.state.user.userpermission.position.update
      this.permissionSetting = this.$store.state.user.userpermission.position.permission
      this.permissionDelet = this.$store.state.user.userpermission.position.delete
    },
    positionPermission (row) {
      this.positionId = row.positionId
      this.positionModal = true
      // 职位权限配置初始化接口
      let sendData = {
        id: this.positionId,
        type: 'position'
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
            this.positionSetData = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    selectChange (index) {
      this.positionTitle = index.map(e => {
        return {
          permissionId: e.id,
          type: e.type
        }
      })
    },
    updatePositionPermission () {
      let sendData = {
        id: this.positionId,
        permissionIds: this.positionTitle
      }
      this.$axios({
        url: baseUrl + '/permission/updatePositionPermission',
        data: sendData,
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.positionSetData = resp.data.content
            this.$Message.info(resp.data.msg)
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },

    // 初始化数据
    init () {
      this.getPermission()
      this.getData()
      this.getSelectData()
    },
    // 打开高级搜索
    openfilterCard () {
      (this.filterCard === true) ? this.filterCard = false : this.filterCard = true
    },
    // 部门职位联动
    getPositionByDeptId (searchDept) {
      console.log(this.searchDept)
      this.$axios({
        url: baseUrl + '/structure/findByPosition',
        data: $qs.stringify({
          deptId: this.searchDept
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.positionNameList = resp.data.content // 职位
          } else {
            // this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('getPositionByDeptId', err)
        })
    },
    // 获取初始化表格数据
    getData () {
      this.loading = true
      this.$axios({
        url: baseUrl + '/structure/findPositionByCondition',
        data: $qs.stringify(),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.tableData = resp.data.content.pageContent
            this.total = resp.data.content.totalCount
            this.currPage = resp.data.content.currPage
            this.pageSize = resp.data.content.pageSize
            this.loading = false
          } else {
            this.$Message.error(resp.data.msg)
            this.loading = true
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 获取高级搜索下拉提示数据
    getSelectData () {
      let sendData = {}
      this.$axios({
        url: baseUrl + '/structure/findDeptList',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.deptNameList = resp.data.content
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })

      this.$axios({
        url: baseUrl + '/structure/findOption',
        data: $qs.stringify(sendData),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.strengthNumList = resp.data.content.strengthNum
            this.positionNameList = resp.data.content.positionList
            this.deptNameListTree = resp.data.content.deptTreeList
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },

    // 高级搜索
    searchJob () {
      let sendData = {
        positionName: this.searchPositionName,
        deptId: this.searchDept,
        // deptName:this.searchDept,
        strengthNum: this.strengthNum
      }
      this.$axios({
        url: baseUrl + '/structure/findPositionByCondition',
        data: $qs.stringify(sendData, {
          indices: false
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.tableData = resp.data.content.pageContent
            this.total = resp.data.content.totalCount
          } else {
            this.$Message.error(resp.data.msg)
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    addNewJob () {
      this.newJob = true
      this.modalTitle = '新增职位'
      this.isAdd = true
      // 清空输入的数据
      this.positionName = ''
      this.strengthNum = ''
      this.treeSelected = []
      this.searchDept = []
      this.searchDeptId = ''
    },
    editPosition (row) {
      this.modalTitle = '编辑职位'
      this.newJob = true
      this.isAdd = false
      this.updateDeptStatus = row.updateDeptStatus
      this.positionName = row.positionName
      this.strengthNum = row.strengthNum
      this.inputTreeSelected = row.deptName
      setTimeout(() => {
        this.treeSelected = []
        this.treeSelected.push(row.id)
      }, 100)
      this.editId = row.positionId
    },
    // 新增职位
    changePosiData () {
      if (this.isAdd) {
        if (this.positionName === '' || this.strengthNum === '' || this.treeSelected.length === 0) {
          this.$Message.error('有必填项未填写')
          this.addJobLoading = false // 确认框先取消loading
          this.$nextTick(() => {
            this.addJobLoading = true
          }) // 再允许loading，
        } else {
          let sendData = {
            positionName: this.positionName,
            deptId: this.treeSelected,
            strengthNum: this.strengthNum
          }
          this.$axios({
            url: baseUrl + '/structure/insertPosition',
            data: $qs.stringify(sendData, {
              indices: false
            }),
            method: 'post'
          })
            .then(resp => {
              if (resp.data.code === 10000) {
                this.newJob = false // 手动关闭modal框
                this.$Message.info(resp.data.msg)
                this.getData()
              } else {
                this.newJob = false // 手动关闭modal框
                this.$Message.error(resp.data.msg)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      } else {
        if (this.positionName === '' || this.strengthNum === '') {
          this.$Message.error('有必填项未填写')
          this.newJob = false // 确认框先取消loading
          this.$nextTick(() => {
            this.newJob = true
          }) // 再允许loading，
        } else {
          let sendData = {
            positionName: this.positionName,
            deptId: this.treeSelected,
            strengthNum: this.strengthNum,
            id: this.editId,
            currPage: this.currPage,
            pageSize: this.pageSize
          }
          this.$axios({
            url: baseUrl + '/structure/updatePositioninformation',
            data: $qs.stringify(sendData, {
              indices: false
            }),
            method: 'post'
          })
            .then(resp => {
              if (resp.data.code === 10000) {
                this.newJob = false // 手动关闭modal框
                this.$Message.info(resp.data.msg)
                this.getData()
              } else {
                this.newJob = false // 确认框先取消loading
                this.$nextTick(() => {
                  this.newJob = true
                }) // 再允许loading，
                this.$Message.error(resp.data.msg)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      }
    },
    // 删除
    deleteRow (row) {
      let _this = this
      this.$Modal.confirm({
        title: '通知',
        content: '删除' + row.positionName + '?',
        onOk () {
          let sendData = {
            id: row.positionId,
            currPage: this.currPage,
            pageSize: this.pageSize
          }
          this.$axios({
            url: baseUrl + '/structure/updatePositioninStatus',
            data: $qs.stringify(sendData, {
              indices: false
            }),
            method: 'post'
          })
            .then(resp => {
              if (resp.data.code === 10000) {
                this.$Message.info(resp.data.msg)
                _this.getData()
              } else if (resp.data.code === 10001) {
                this.$Message.warning({
                  title: '通知',
                  content: '删除失败，当前职位下有人！'
                })
              } else {
                this.$Message.error(resp.data.msg)
              }
            })
            .catch(err => {
              console.log('err', err)
            })
        }
      })
    },
    // 清空搜索
    clearSearch () {
      this.$refs.resetPositionName.clearSingleSelect()
      this.treeSelected = []
      this.searchDept = ''
    },
    // 分页
    currentPageChange (currPage, pageSize) {
      this.currPage = currPage
      this.pageSize = pageSize
      this.loading = true
      let sendData = {
        currPage: currPage,
        pageSize: this.pageSize
      }
      this.$axios({
        url: baseUrl + '/structure/findPositionByCondition',
        data: $qs.stringify(sendData, {
          indices: false
        }),
        method: 'post'
      })
        .then(resp => {
          if (resp.data.code === 10000) {
            this.tableData = resp.data.content.pageContent
            this.total = resp.data.content.totalCount
            this.loading = false
          } else {
            this.$Message.error(resp.data.msg)
            this.loading = true
          }
        })
        .catch(err => {
          console.log('err', err)
        })
    }
  }
}
</script>

<style scoped>
#searchCard .searchTitle {
    display: inline-block;
    width: 80px;
    text-align: right;
}

.addJobModal .ivu-btn-primary {
    background-color: #19AA8D !important;
    border-color: #19AA8D !important;
    color: #fff;
}

.addJobModal .ivu-btn-primary:hover {
    background-color: #088f74 !important;
    border-color: #088f74 !important;
    color: #fff;
}

.addJobModal i.require {
    color: red;
}

.addJobModal h3 {
    display: inline-block;
    text-align: right;
    width: 140px;
    margin-right: 10px
}

#editJobModal i.require {
    color: red;
}

#editJobModal .ivu-btn-primary {
    background-color: #19AA8D !important;
    border-color: #19AA8D !important;
    color: #fff;
}

#editJobModal .ivu-btn-primary:hover {
    background-color: #088f74 !important;
    border-color: #088f74 !important;
    color: #fff;
}

#editJobModal h3 {
    display: inline-block;
    text-align: right;
    width: 140px;
    margin-right: 10px
}

#mainWrap {
    top: 100px;
    padding: 30px;
}

.headWrap {
    border-bottom: 2px solid #088f74;
    padding: 3px;
}

#jobTable .ivu-table-cell {
    color: #088f74 !important;
}

.spacings {
    width: 200px;
    margin-bottom: 10px;
}

#mainWrap .ivu-input:hover,
#mainWrap .ivu-input:focus {
    border-color: #088f74 !important;
}

.ivu-btn-primary {
    background-color: #19aa8d;
    border-color: #19aa8d;
    color: #fff;
}

.ivu-btn-primary:hover {
    background-color: #088f74;
    border-color: #088f74;
    color: #fff;
}

.five {
    margin-right: 5px;
}

.left {
    display: inline-block;
    float: left;
}

.right {
    float: right;
    margin-bottom: 10px;
}
</style>
<style>
#positionModalColor .ivu-tree-arrow {}

#positionModalColor .ivu-tree ul {
    font-size: 15px !important;
}

#positionModalColor .ivu-btn-primary,
#positionModalColor .ivu-checkbox-indeterminate .ivu-checkbox-inner,
#positionModalColor .ivu-checkbox-checked .ivu-checkbox-inner {
    background-color: #19aa8d !important;
    border-color: #19aa8d !important;
}
</style>
