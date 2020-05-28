<template>
<!--悬赏任务-->
<div class="taskSystem">
    <Tabs value="7" :animated="false" tab="outTable" @on-click="detail">
        <TabPane label="任务详情" name="0" v-if="isDetail"></TabPane>
        <TabPane label="我发起的任务" name="1"></TabPane>
        <TabPane label="我接受的任务" name="2"></TabPane>
        <TabPane label="我执行的任务" name="3"></TabPane>
        <TabPane label="我关注的任务" name="4"></TabPane>
        <TabPane label="全部任务" name="5"></TabPane>
        <TabPane label="待审任务" name="6"></TabPane>
        <TabPane label="悬赏任务" name="7">
            <Button class="launchTask" type="primary" @click="launchTask">发起任务</Button>
            <div class="searchInput" style="top: 8px;">
                <Input  @on-click="getTableData()" v-model="searchHeader.searchContent" icon="ios-search"  style="width:200px" placeholder="任务名称、发起人、接收人"></Input>
                <Button type="default" @click="refresh"><Icon type="md-refresh" /></Button>
            </div>
            <Table  :loading="loading"  border ref="selection" :columns="dataTableHeader" :data="dataContent">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" style="margin-right: 5px;">领取</Button>
                    <Button type="primary" style="margin-right: 5px;">编辑</Button>
                    <Button type="error" style="margin-right: 5px;">删除</Button>
                    <Button @click="look(row, index)" type="primary" class="btns" style="margin-right: 5px;">查看</Button>
                    <Poptip placement="bottom" width="100">
                        <Button type="default" class="moreBtns" style="margin-right: 5px;">更多</Button>
                        <div class="moreAction" slot="content" style="text-aligh:left;">
                            <p style="margin-right: 5px;">领取</p>
                            <p style="margin-right: 5px;">编辑</p>
                            <p style="margin-right: 5px;">删除</p>
                            <p @click="look(row, index)" class="btns" style="margin-right: 5px;">查看</p>
                        </div>
                    </Poptip>
                </template>
            </Table>
            <Page
                :total="searchHeader.totalCount"
                :page-size="searchHeader.pageSize"
                :current="searchHeader.currPage"
                size="small"
                show-total
                show-sizer
                show-elevator
                @on-change="(currPage)=>{searchHeader.currPage=currPage;getTableData()}"
                @on-page-size-change="(pageSize)=>{searchHeader.pageSize=pageSize;getTableData()}"
                style="float:right;"
            />
        </TabPane>
        <TabPane label="部门任务" name="8"></TabPane>
        <TabPane label="月度评审" name="9"></TabPane>
    </Tabs>
    <Modal title="发起任务" :mask-closable="false" :loading="modelLoading" id="taskModal" @on-ok="insertTasksForm()" v-model="launchTaskModal" style="width: 920px;">
        <launchTask ref="formValidate"></launchTask>
    </Modal>
</div>
</template>

<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import launchTask from './components/launchTask'
export default {
  name: 'allTask',
  components: {
    launchTask
  },
  data () {
    return {
      isDetail: false, // 是否是任务详情
      loading: true, // 是否显示表格加载框
      modelLoading: true, // 是否显示弹出框加载匡
      launchTaskModal: false, // 发起任务弹框 默认false
      incumbencyTbUser: [], // 在职人员列表
      // 表头搜索model值
      searchHeader: {
        searchTaskLeavelList: [], // 任务等级列表
        name: '', // 任务名称
        sendName: '', // 发起人姓名
        sendUid: '', // 发起人id
        taskLevel: '', // 任务等级
        searchType: '0', // 默认是 0 代表表头搜索，非 0 值代表文本框模糊搜索
        searchContent: '', // 模糊搜索的内容
        totalCount: 0, // 分页
        pageSize: 20, // 分页
        currPage: 1// 分页
      },
      dataTableHeader: [
        {
          title: ' ',
          type: 'focus',
          width: 50,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: params.row.tasksFocus ? 'ios-star-outline' : 'ios-star'
                },
                style: {
                  color: 'red',
                  cursor: 'pointer',
                  marginRight: '1px',
                  fontSize: '18px'
                },
                on: {
                  click: () => {
                    this.focusTask(params.index, params)
                  }
                }
              }),
              h('span')
            ])
          }
        }, {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '任务名称',
          key: 'name',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Input v-model={this.searchHeader.name} clearable placeholder="任务名称" size="small" style="width:110px"></Input>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }} ><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.name = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '发起时间',
          key: 'sendTime',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <DatePicker
                  v-on:on-ok={() => {
                    this.getTableData()
                  }}
                  v-model={this.searchHeader.sendTime}
                  size="small" style="width:110px"
                  confirm
                  transfer={false}
                  placement="bottom-start"
                  placeholder="输入时间"
                />
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.sendTime = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '发起人',
          key: 'sendName',
          width: 90,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Select
                  placeholder="发起人" size="small" style="width:110px"
                  slot="content"
                  filterable
                  clearable
                  v-on:on-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.searchHeader.sendUid}>
                  {(this.incumbencyTbUser || []).map(person => {
                    return (
                      <Option v-model={person.id}>{person.nickname}</Option>
                    )
                  })}
                </Select>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.sendUid = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '任务等级',
          key: 'taskLevel',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span>
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Select clearable v-model={this.searchHeader.taskLevel} size="small" placeholder="任务等级" style="width:110px">
                  {(this.searchHeader.searchTaskLeavelList || []).map(task => {
                    return (
                      <Option v-model={task.tasksLevelId}>{task.tasksLevelName}</Option>
                    )
                  })}
                </Select>
                <Button class="searchButton" size="small" v-on:click={() => { this.getTableData() }}><i class = "ivu-icon ivu-icon-ios-search" /></Button>
                <Button type="error" size="small" v-on:click={() => { this.searchHeader.taskLevel = '' }}><Icon type="md-close-circle" /></Button>
              </div>
            </Poptip>)
          }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      dataContent: []// 列表页数据
    }
  },
  methods: {
    // 初始化
    initialize () {
      this.getTableData()
    },
    // 统一初始数据
    getData () {
      // 任务等级 任务类型 任务状态
      this.$axios({
        url: 'http://192.168.1.126:8080/BzSystem/tasks/tasksrender',
        data: $qs.stringify(),
        method: 'get'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.searchHeader.searchTaskLeavelList = resp.data.content.tasksLevel// 任务等级
          this.searchHeader.searchTaskStatuList = resp.data.content.tasksStatus// 任务状态
        } else {
          this.$Message.success(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
      // 发起人 执行人 接收人
      this.$axios({
        url: baseUrl + '/user/getIncumbencyTbUser', // 在职人员列表
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.incumbencyTbUser = res.data.content
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 初始数据 表格数据 分页 搜索
    getTableData () {
      this.getData()
      // 表格数据
      let {
        name,
        sendTime,
        sendName,
        taskLevel,
        sendUid,
        searchType,
        currPage,
        pageSize,
        searchContent
      } = this.searchHeader
      let sendData = {}
      // 如果有模糊搜索，清空表头内容
      if (searchContent) {
        sendData.searchType = '1'
        sendData.searchContent = searchContent
      } else {
        // 发送表头搜索内容
        sendData = {
          name,
          sendTime,
          sendName,
          taskLevel,
          sendUid,
          searchType,
          searchContent
        }
        // if (sendTime) {
        //   sendData.taskInfoStartDate = moment(sendTime).format('YYYY-MM-DD')
        // }
        sendData.pageSize = pageSize
        sendData.currPage = currPage
      }
      this.$axios({
        url: 'http://192.168.1.126:8080/BzSystem/tasks/reward',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        // 查无数据
        if (resp.data.code === 10001) {
          this.searchHeader.totalCount = 0
          this.searchHeader.currPage = 1
          this.searchHeader.totalScore = 0
          this.dataContent = []
        } else if (resp.data.code === 10000) {
          // 获取表格详细数据
          this.dataContent = resp.data.content.page.pageContent
          // 分页数据
          let pageData = resp.data.content.page.pageContent
          let { pageSize, totalCount, currPage } = pageData
          this.searchHeader.pageSize = pageSize
          this.searchHeader.totalCount = totalCount
          this.searchHeader.currPage = currPage
          this.loading = false
        } else {
          this.dataContent = []
          this.$Message.success(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 关注任务
    focusTask (index, params) {
      let sendData = {
        taskId: params.row.id,
        isFocus: params.row.tasksFocus
      }
      this.$axios({
        url: 'http://192.168.1.126:8080/BzSystem/tasks/focus',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(resp => {
        if (resp.data.code === 10000) {
          this.$Message.success(resp.data.msg)
        } else {
          this.$Message.success(resp.data.msg)
        }
      }).catch(err => {
        console.log('err', err)
      })
      params.row.tasksFocus = !params.row.tasksFocus
    },
    // 发起任务弹框
    launchTask () {
      this.$refs.formValidate.formValidate = {
        name: '', // 任务名称
        acceptUid: '', // 接受人
        sendUid: '', // 发起人
        taskLevel: '', // 任务等级
        type: '', // 任务等级
        endTime: '', // 截止时间
        counselorUid: '', // 顾问
        introducerUid: '', // 提出人
        description: ''// 任务描述
      }
      this.launchTaskModal = true
    },
    // 发起任务表单验证
    insertTasksForm () {
      let formValidateForm = this.$refs.formValidate.$refs.formValidateForm
      formValidateForm.validate((valid) => {
        if (valid) {
          // 必填项都填了就发起任务
          this.insertTasks()
        } else {
          // 有未填必填项，提示
          this.modelLoading = false
          this.$nextTick(() => {
            this.modelLoading = true
          })
        }
      })
    },
    // 发起任务
    insertTasks () {
      let sendData = this.$refs.formValidate.formValidate
      sendData.endTime = moment(this.$refs.formValidate.formValidate.endTime).format('YYYY-MM-DD')
      this.$axios({
        url: 'http://192.168.1.126:8080/BzSystem/tasks/inserttasks',
        data: sendData,
        method: 'post'
      }).then(resp => {
        this.modelLoading = false // 发起任务确认框先取消loading
        if (resp.data.code === 10000) {
          this.$Message.success(resp.data.msg)
          this.getTableData()
        } else {
          this.$Message.success(resp.data.msg)
        }
        this.$nextTick(() => {
          this.modelLoading = true
        })
      }).catch(err => {
        console.log('err', err)
      })
      this.launchTaskModal = false
    },
    // 按钮操作 - 查看
    look (row, index) {
      this.$router.push({
        name: 'taskDetail',
        query: {
          id: row.id
        }
      })
    },
    // 清空表头搜索
    clearSearchHeader (searchContent) {
      this.searchHeader = {
        name: '',
        sendTime: '',
        sendName: '',
        sendUid: '',
        taskLevel: '',
        searchType: '',
        currPage: 1,
        pageSize: 20,
        searchContent: searchContent
      }
    },
    // 一键清空搜索条件，获取原始数据
    refresh () {
      this.clearSearchHeader()
      this.getTableData()
    },
    // 切换外部tabs
    detail (name) {
      switch (name) {
        case '0':
          this.$router.push({
            name: 'taskDetail'
          })
          break
        case '1':
          this.$router.push({
            name: 'taskPropose'
          })
          break
        case '2':
          this.$router.push({
            name: 'taskAccept'
          })
          break
        case '3':
          this.$router.push({
            name: 'taskExcute'
          })
          break
        case '4':
          this.$router.push({
            name: 'taskFocus'
          })
          break
        case '5':
          this.$router.push({
            name: 'taskAll'
          })
          break
        case '6':
          this.$router.push({
            name: 'taskPending'
          })
          break
        case '7':
          this.$router.push({
            name: 'taskReward'
          })
          break
        case '8':
          this.$router.push({
            name: 'taskDepart'
          })
          break
        case '9':
          this.$router.push({
            name: 'taskMonthly'
          })
          break
      }
    }
  },
  mounted () {
    this.initialize()
  }
}
</script>

<style scope>
.indexBody {
    right: 0;
    bottom: 0;
    top: 104px;
    height: calc(100% - 90px);
    padding: 20px;
    background-color: #f0f2f5;
}

.innerBody {
    width: 100%;
    height: 100%;
    overflow: scroll;
    padding: 0;
    background-color: #fff;
}

#task .ivu-tabs-nav .ivu-tabs-tab-active,
#task .ivu-tabs-nav .ivu-tabs-tab:hover {
    color: #19aa8d;
}

#task .ivu-tabs-ink-bar {
    background-color: #19aa8d;
}
#task .ivu-input:hover,
#task .ivu-input:focus {
    border-color: #19aa8d;
    outline: 0;
    box-shadow:none !important;
}

#task .searchButton.ivu-btn:hover {
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
}

#task .ivu-icon-ios-search:hover{
    color: #19aa8d;
}

#task .ivu-select-selection:hover{
    border-color: #19aa8d !important;
}

#task .ivu-select-selection-focused,
#task .ivu-select-visible .ivu-select-selection{
    border-color: #19aa8d !important;
}
#task .ivu-tabs .ivu-tabs-tabpane{
    padding: 0px 12px 0px 12px;
}
#task .launchTask{
    margin-bottom: 12px;
}
#task .ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
    border-color: #19aa8d!important;
}
#task .searchInput{
    position: relative;
    float: right;
    top: 36px;
    z-index:100;
}
#task .ivu-icon.ivu-icon-ios-search{
    margin-left: 5px;
}
#task .moreAction{
    text-align:left;
    cursor: pointer;
}
#task .moreAction p{
    padding:2px;
}
#task .moreAction p:hover{
    color: #19aa8d;
}
#task .btns:hover,
#task .btns:active{
    color: #fff;
    border-color: #19aa8d;
    box-shadow:none;
}
#task .moreBtns:hover,
#task .moreBtns:active{
    color: #19aa8d;
    border-color: #19aa8d;
    box-shadow:none;
}

.require{
    color: red;
    font-size: 17px;
    position: relative;
    top: 6px;
    right: 5px;
}
#taskModal .ivu-modal{
    width:1000px !important;
}

#taskModal .ivu-input:hover {
    border-color: #19aa8d;
}
#taskModal .ivu-input:focus {
    border-color: #19aa8d;
    outline: 0;
    box-shadow: none;
}
#taskModal .ivu-select-selection-focused,
#taskModal .ivu-select-selection:hover
{
    border-color: #19aa8d;
}
#taskModal .ivu-select-visible .ivu-select-selection {
    border-color: #19aa8d;
    outline: 0;
    box-shadow:none;
}
#taskModal .ivu-modal-footer Button:first-child{
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
}
#taskModal .uploadButton:hover,
#taskModal .uploadButton:active{
    color: #19aa8d !important;
    background-color: #fff;
    border-color: #19aa8d  !important;
    box-shadow:none;
}

.searchInput Button:hover,
.searchInput Button:active{
    color: #19aa8d;
    background-color: #fff;
    border-color: #19aa8d;
    box-shadow:none;
}

</style>
