<template>
<!-- 发起任务 -->
  <div id="task-propose">
    <Tabs type="card"
      :animated="false"
      v-model="currentTab"
      @on-click="setCurrentPage"
      >
      <TabPane
        v-for="(tab, index) in headerCount"
        :label="tab.count"
        :name="index + 1 + ''"
        :key="index"
        >
        <div v-if="currentTab == index + 1 + ''">
          <bz-table
            :columns="tableHeader"
            :rowData="rowData"
            :loading="loading"
            :page="page"
            @current-page="updateCurrentPage"
            @page-size="updatePageSize"
            @click="handleBtnClick"
          >
          </bz-table>
        </div>
      </TabPane>
      <div slot="extra">
        <search-box
          :searchContent="searchContent"
          :totalTableHeader="columns"
          :defaultList="defaultList"
          :searchType ='propose'
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
import BzTable from './components/bz-table'
import SearchBox from './components/search-box'
import { baseUrl } from '@/api/base.js'
import { tasksMixin } from '@/assets/js/mixins'
import { Track } from '@/libs/track'
const track = new Track('综合模块/任务系统/我发起的任务')
export default {
  name: 'allTask',
  mixins: [tasksMixin],
  inject: ['app'],
  components: {
    BzTable,
    SearchBox
  },
  data () {
    return {
      // 当前tab的name属性
      currentTab: '',
      loading: true, // 是否显示表格加载框
      searchContent: '', // 模糊搜素关键字
      searchType: '0', // 默认是 0 代表表头搜索
      propose: 'propose',
      // 表头搜索字段
      fields: {
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
        startTime: '',
        endTime: '',
        searchType: 0
      },
      page: {
        pageSize: 20,
        totalCount: 0,
        currentPage: 1
      },
      // tbody渲染数据
      rowData: [],
      tableHeader: [],
      defaultList: [
        'focus',
        'index',
        'name',
        'tasksTimeStartToEnd',
        'acceptName',
        'executors',
        'taskStatus',
        'taskLevel',
        'type',
        'action'
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
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="cursor">
                    { params.column.title }
                    <Icon type="md-search" size="14" class={this.fields.name ? 'on' : ''} />
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
                </Poptip></span>)
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
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="cursor">
                    { params.column.title }
                    <Icon type="md-search" size="14" class={this.fields.timeRange[1] ? 'on' : ''} />
                  </span>
                  <div slot="content">
                    <DatePicker
                      // type="date"
                      type="daterange"
                      confirm
                      clearable
                      placement="bottom-start"
                      // v-model={this.fields.endTime}
                      value={this.fields.timeRange}
                      onOn-change={value => { this.fields.timeRange = value }}
                      placeholder="请选择时间"
                      style="width: 200px;"
                      onOn-ok={
                        value => {
                          this.page.currentPage = 1
                          this.searchContent = ''
                          this.getTableData({ currPage: 1 })
                        }
                      }
                      onOn-clear={
                        () => {
                          this.getTableData({ currPage: 1, taskInfoStartDate: '', taskInfoEndDate: '' })
                        }
                      }
                    ></DatePicker>
                  </div>
                </Poptip>
              </span>)
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
          title: '接收人',
          key: 'acceptName',
          width: 95,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" class={this.fields.acceptUid ? 'on' : ''} />
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
                            label={person.nickname}
                            key={person.id}
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
                </Poptip>
              </span>)
          }
        },
        {
          title: '执行人',
          key: 'executors',
          minWidth: 150,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom" width="230">
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" class={this.fields.executeUid ? 'on' : ''} />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="执行人"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="text-align: left; width: 190px;"
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
                            label={person.nickname}
                            key={person.id}
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
                </Poptip>
              </span>)
          }
        },
        {
          title: '任务等级',
          width: 110,
          key: 'taskLevel',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" class={this.fields.taskLevel ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    placeholder="选择任务等级"
                    clearable
                    v-model={this.fields.taskLevel}
                    onOn-query-change={
                      value => {
                        this.page.currentPage = 1
                        this.searchContent = ''
                        this.getTableData({ currPage: 1 })
                      }
                    }
                  >
                    {
                      this.taskLevels.map((level) => {
                        return (
                          <Option
                            style="text-align: center"
                            value={level.tasksLevelId}
                            key={level.tasksLevelId}>
                            {level.tasksLevelName}
                          </Option>
                        )
                      })
                    }
                  </Select>
                </Poptip>
              </span>)
          }
        },
        {
          title: '任务状态',
          key: 'taskStatus',
          width: 110,
          align: 'center',
          render: (h, params) => {
            const text = params.row.taskStatus
            // console.log(params, 'header-params')
            // let confirmBtnStatus = params.row.button.confirmTasks
            // let lastConfirm = params.row.lastConfirmTime
            // let timeArr = lastConfirm.split(' ')
            // let lastConfirmDay = timeArr[0]
            // let lastConfirmTime = timeArr[1]rr
            // const text = this.[params.row.taskStatus]
            switch (text) {
              case '待确认':
                return (
                  <div>
                    <span style="display: inline">{text}</span>
                    <Tooltip
                      content='与接收人确认可执行方案，执行人确认后，点击“方案确认”按钮，任务开始进行'
                      max-width="200"
                      style="marginLeft: 5px;"
                    >
                      <Icon
                        type="ios-alert-outline"
                        color="#f90"
                        size="16"
                        style="margin-bottom: 2px; cursor: pointer;">
                      </Icon>
                    </Tooltip>
                  </div>
                )
              case '进行中':
                return (
                  <div>
                    <span style="display: inline">{text}</span>
                    <Tooltip
                      content='任务确认后请点击“任务完成”或“阶段性确认”按钮'
                      max-width="200"
                      style="marginLeft: 5px;">
                      <Icon
                        type="ios-alert-outline"
                        color="#f90"
                        size="16"
                        style="margin-bottom: 2px; cursor: pointer;">
                      </Icon>
                    </Tooltip>
                  </div>
                )
              default:
                return h('span', text)
            }
          }
        },
        {
          title: '任务类型',
          key: 'type',
          align: 'center',
          width: 150
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
  beforeCreate () {
    track.start()
  },
  methods: {
    handleTableHeaders (arr) {
      this.tableHeader = arr
    },
    // 获取页面渲染数据
    getTableData (data) {
      this.loading = true
      let params = this.getValidParams(data)
      // num count
      this.$axios({
        url: `${baseUrl}/tasks/send/0`,
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
        url: `${baseUrl}/tasks/send/${this.currentTab}`,
        method: 'post',
        data: $qs.stringify(params)
      }).then(res => {
        if (res.data.code === 10000) {
          // console.log('data', res.data)
          let data = res.data.content
          this.page.currentPage = data.page.currPage
          this.page.pageSize = data.page.pageSize
          this.page.totalCount = data.page.totalCount
          // 列表数据
          this.rowData = data.page.pageContent
          this.loading = false
        } else {
          this.loading = false
          this.$Message.success(res.data.msg)
        }
        this.$nextTick(() => {
          track.end()
        })
      }).catch(err => {
        console.log('err', err)
      })
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/style/variables.less';
  #task-propose {
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
