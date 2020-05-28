<template>
<!-- 待审核 -->
<div id="task-pending">
  <Tabs type="card"
    :animated="false"
    v-model="currentTab"
    >
    <TabPane
      v-for="(tab, index) in headerCount"
      :label="tab.count"
      :name="index + 2 + ''"
      :key="index"
      >
      <div v-if="currentTab == '2'">
        <bz-table
          :columns="tableHeader"
          :rowData="rowData"
          :loading="loading"
          :page="page"
          @current-page="updateCurrentPage"
          @page-size="updatePageSize"
        >
        </bz-table>
      </div>
    </TabPane>
    <div slot="extra">
      <search-box
        :searchContent="searchContent"
        :totalTableHeader="columns"
        :defaultList="defaultList"
        :searchType="pending"
        @search-content-change="handleSearchContentChange"
        @inaccurate-search="handleInaccurateSearch"
        @refresh="handleRefresh"
        @tableHeaders="handleTableHeaders"
      ></search-box>
    </div>
  </Tabs>
</div>
</template>

<script>
import { baseUrl } from '@/api/base.js'
import BzTable from './components/bz-table'
import SearchBox from './components/search-box'
import { tasksMixin } from '@/assets/js/mixins'
import { Track } from '@/libs/track'
const track = new Track('综合模块/任务系统/待审任务')
export default {
  name: 'taskFocus',
  mixins: [tasksMixin],
  components: {
    BzTable,
    SearchBox
  },
  data () {
    return {
      headerCount: [
        {
          count: (h) => {
            return h('div', [
              h('span', '全部'),
              h('Badge', {
                props: {
                  count: this.headCount.countAll
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
        }
      ],
      headCount: {
        countAll: 0 // 全部显示数值
      },
      // 当前tab的name属性
      currentTab: '',
      loading: false, // 是否显示表格加载框
      searchContent: '', // 模糊搜素关键字
      searchType: '0', // 默认是 0 代表表头搜索
      // 表头搜索字段
      fields: {
        taskLevel: '', // 任务等级
        taskStatus: '', // 任务状态
        name: '', // 任务名称
        approveStatus: '', // 审批状态
        timeRange: [], // 时间范围
        sendUid: '', // 发起人id
        sendName: '', // 发起人姓名
        acceptUid: '', // 接收人id
        acceptName: '', // 接受人姓名
        executeUid: '', // 执行人id
        executeName: '', // 执行人姓名
        startTime: '',
        endTime: '',
        searchType: 0
      },
      page: {
        pageSize: 20,
        totalCount: 0,
        currentPage: 1
      },
      // thead渲染数据
      dataTableHeader: [],
      // tbody渲染数据
      rowData: [],
      tableHeader: [],
      pending: 'pending',
      defaultList: [
        'focus',
        'index',
        'name',
        'tasksTimeStartToEnd',
        'sendName',
        'acceptName',
        'executors',
        'taskStatus',
        'approveStatus',
        'action'
      ],
      // 审批状态数据
      approveStatus: [
        {
          approveStatusId: 0,
          approveStatusName: '未审批'
        },
        {
          approveStatusId: 1,
          approveStatusName: '同意'
        },
        {
          approveStatusId: 2,
          approveStatusName: '拒绝'
        }
      ],
      // 表头数据
      columns: [
        {
          title: '关注',
          key: 'focus',
          type: 'focus',
          width: 50,
          align: 'center',
          alwaysShow: true,
          render: (h, params) => {
            return (
              <Tooltip placement="top" content={params.row.tasksFocus ? '取消关注' : '关注任务'}>
                <Icon
                  type={params.row.tasksFocus ? 'ios-star' : 'ios-star-outline'}
                  style="color: #ed4014; cursor: pointer; margin-right: 1px; font-size: 18px"
                  on-Click={() => this.focusTask(params)}
                >
                </Icon>
              </Tooltip>)
          }
        },
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 70,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '任务名称',
          key: 'name',
          minWidth: 150,
          align: 'center',
          alwaysShow: true,
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span class="cursor">
                { params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <Input
                  placeholder="任务名称"
                  style="width:160px"
                  suffix="ios-search"
                  clearable
                  search
                  onOn-search={
                    value => {
                      this.page.currentPage = 1
                      this.searchContent = ''
                      this.getTableData({ currPage: 1 })
                    }
                  }
                  onOn-clear={
                    () => {
                      this.getTableData({ currPage: 1 })
                    }
                  }
                  v-model={this.fields.name}
                ></Input>
              </div>
            </Poptip>)
          },
          render: (h, params) => {
            return (
              <span class="taskTitle" style="cursor: pointer">
                <a onClick={() => this.checkDetail(params.row)}>{params.row.name}</a>
              </span>
            )
          }
        },
        {
          title: '时间',
          width: 100,
          key: 'tasksTimeStartToEnd',
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span class="cursor">
                { params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content">
                <DatePicker
                  transfer={false}
                  type="daterange"
                  confirm
                  clearable
                  placement="bottom-start"
                  // v-model={this.fields.timeRange}
                  value={this.fields.timeRange}
                  onOn-change={value => { this.fields.timeRange = value }}
                  placeholder="请选择时间"
                  style="width: 200px"
                  onOn-ok={
                    value => {
                      this.page.currentPage = 1
                      this.searchContent = ''
                      this.getTableData({ currPage: 1 })
                    }
                  }
                  onOn-clear={
                    () => {
                      this.getTableData({ currPage: 1 })
                    }
                  }
                ></DatePicker>
              </div>
            </Poptip>)
          },
          render: (h, params) => {
            // console.log(params.row)
            return h(
              'div',
              {
                style: {
                  padding: '5px 0'
                }
              },
              [
                h('p', params.row.sendTime),
                h('span', { style: { textAlign: 'center' } }, '~'),
                h('p', params.row.endTime)
              ]
            )
          }
        },
        {
          title: '发起人',
          key: 'sendName',
          width: 95,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span class="cursor">
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content" style="white-space: normal">
                <Select
                  placeholder="发起人"
                  slot="content"
                  filterable
                  size="small"
                  clearable
                  style="textAlign: left; width: 190px;"
                  v-model={this.fields.sendUid}
                  onOn-change={
                    () => {
                      this.searchContent = ''
                      this.getTableData()
                    }
                  }
                >
                  {(this.employees || []).map(person => {
                    return (
                      <Option
                        value={person.id}
                        key={person.id}
                        label={person.nickname}
                      >
                        <div>
                          <div>{person.nickname}</div>
                          <div style="font-weight: normal;">
                            <span>部门:</span>
                            <span>{person.deptName}</span>
                          </div>
                          <div style="font-weight: normal;">
                            <span>职位:</span>
                            <span>
                              {person.positionName && person.positionName}
                            </span>
                          </div>
                        </div>
                      </Option>
                    )
                  })}
                </Select>
              </div>
            </Poptip>)
          }
        },
        {
          title: '接收人',
          key: 'acceptName',
          width: 95,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span class="cursor">
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content" style="white-space: normal">
                <Select
                  placeholder="接收人"
                  slot="content"
                  filterable
                  size="small"
                  clearable
                  style="textAlign: left; width: 190px;"
                  v-model={this.fields.acceptUid}
                  onOn-change={
                    () => {
                      this.searchContent = ''
                      this.getTableData()
                    }
                  }
                >
                  {(this.employees || []).map(person => {
                    return (
                      <Option
                        value={person.id}
                        key={person.id}
                        label={person.nickname}
                      >
                        <div>
                          <div>{person.nickname}</div>
                          <div style="font-weight: normal;">
                            <span>部门:</span>
                            <span>{person.deptName}</span>
                          </div>
                          <div style="font-weight: normal;">
                            <span>职位:</span>
                            <span>
                              {person.positionName && person.positionName}
                            </span>
                          </div>
                        </div>
                      </Option>
                    )
                  })}
                </Select>
              </div>
            </Poptip>)
          }
        },
        {
          title: '执行人',
          key: 'executors',
          minWidth: 150,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom" width="230">
              <span class="cursor">
                {params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" />
              </span>
              <div slot="content" style="white-space: normal">
                <Select
                  placeholder="执行人"
                  slot="content"
                  filterable
                  size="small"
                  clearable
                  style="textAlign: left; width: 190px;"
                  v-model={this.fields.executeUid}
                  onOn-change={
                    () => {
                      this.searchContent = ''
                      this.getTableData()
                    }
                  }
                >
                  {(this.employees || []).map(person => {
                    return (
                      <Option
                        value={person.id}
                        key={person.id}
                        label={person.nickname}
                      >
                        <div>
                          <div>{person.nickname}</div>
                          <div style="font-weight: normal;">
                            <span>部门:</span>
                            <span>{person.deptName}</span>
                          </div>
                          <div style="font-weight: normal;">
                            <span>职位:</span>
                            <span>
                              {person.positionName && person.positionName}
                            </span>
                          </div>
                        </div>
                      </Option>
                    )
                  })}
                </Select>
              </div>
            </Poptip>)
          }
        },
        {
          title: '更改状态',
          key: 'taskStatus',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span class="cursor">
                { params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" style="marginLeft:5px" />
              </span>
              <div slot="content">
                <Select
                  placeholder="选择任务状态"
                  v-model={this.fields.taskStatus}
                  clearable
                  onOn-query-change={
                    (value, a) => {
                      this.page.currentPage = 1
                      this.searchContent = ''
                      // console.log('changchangchange')
                      this.getTableData({ currPage: 1, targetTaskStatus: this.fields.taskStatus })
                    }
                  }
                >
                  {
                    this.taskStatus.map(status => {
                      if (status.tasksStatusId === '3' || status.tasksStatusId === '7') {
                        return (
                          <Option
                            style="text-align: center"
                            key={status.tasksStatusId}
                            v-model={status.tasksStatusId}>
                            {status.tasksStatusName}
                          </Option>
                        )
                      }
                    })
                  }
                </Select>
              </div>
            </Poptip>)
          },
          render: (h, params) => {
            const tasksApprove = params.row.tasksApprove
            return h(
              'span',
              tasksApprove.targetTaskStatus
            )
          }
        },
        {
          title: '审批状态',
          key: 'approveStatus',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (<Poptip placement="bottom">
              <span class="cursor">
                { params.column.title }
                <i class = "ivu-icon ivu-icon-ios-search" style="marginLeft:5px" />
              </span>
              <div slot="content">
                <Select
                  placeholder="选择审批状态"
                  v-model={this.fields.approveStatus}
                  clearable
                  onOn-query-change={
                    value => {
                      this.page.currentPage = 1
                      this.searchContent = ''
                      // console.log('changchangchange')
                      this.getTableData({ currPage: 1 })
                    }
                  }
                >
                  {
                    this.approveStatus.map(status => {
                      return (
                        <Option
                          style="text-align: center"
                          key={status.approveStatusId}
                          value={status.approveStatusId}>
                          {status.approveStatusName}
                        </Option>
                      )
                    })
                  }
                </Select>
              </div>
            </Poptip>)
          },
          render: (h, params) => {
            const text = params.row.approveStatus
            switch (text) {
              case 0:
                return h(
                  'div',
                  '未审批'
                )
              case 1:
                return h(
                  'div',
                  '同意'
                )
              case 2:
                return h(
                  'div',
                  '拒绝'
                )
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          align: 'center',
          width: 280,
          fixed: 'right',
          alwaysShow: true
        }
      ]
    }
  },
  created () {
    track.start()
  },
  methods: {
    handleTableHeaders (arr) {
      this.tableHeader = arr
    },
    // 获取页面渲染数据
    getTableData (data) {
      let params = this.getValidParams(data)
      this.loading = true
      // num count
      this.$axios({
        url: `${baseUrl}/tasks/approve/0`,
        method: 'post',
        data: $qs.stringify(params)
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.content
          this.headCount.countAll = data.countAll
          this.headCount.countClose = data.countClose
          this.headCount.countDefer = data.countDefer
          this.headCount.countDone = data.countDone
          this.headCount.countOngoing = data.countOngoing
          this.headCount.countTbc = data.countTbc
        }
      }).catch(err => {
        console.log('err', err)
      })

      this.$axios({
        url: `${baseUrl}/tasks/approve/1`,
        method: 'post',
        data: $qs.stringify(params)
      }).then(res => {
        if (res.data.code === 10000) {
          // console.log('data', res.data)
          let data = res.data.content
          // this.headCount.countAll = data.countAll
          // this.headCount.countClose = data.countClose
          // this.headCount.countDefer = data.countDefer
          // this.headCount.countDone = data.countDone
          // this.headCount.countOngoing = data.countOngoing
          // this.headCount.countTbc = data.countTbc

          this.page.currentPage = data.page.currPage
          this.page.pageSize = data.page.pageSize
          this.page.totalCount = data.page.totalCount

          // 列表数据
          this.rowData = data.page.pageContent
          // console.log(rowData, 'rowData')
          this.loading = false
        } else {
          this.loading = false
          this.$Message.success(res.data.msg)
        }
        this.$nextTick(() => {
          track.end()
        })
      }).catch(err => {
        this.loading = false
        console.log('err', err)
      })
    }
  }
}
</script>

<style lang="less">
  #task-pending {
    box-sizing: border-box;
    // padding: 0 10px;
    .ivu-tabs-bar{
      margin: 0;
    }
    .ivu-tabs-tabpane {
      min-height: 0;
    }
    .cursor {
      cursor: pointer;
      i {
        margin-left: 3px;
      }
    }
  }
</style>
