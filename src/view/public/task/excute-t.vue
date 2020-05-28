<template>
  <!-- 执行的任务 -->
  <div id="task-executor">
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
        <div v-if="currentTab === index + 1 + ''">
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
          :searchType ="excute"
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
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import BzTable from './components/bz-table'
import SearchBox from './components/search-box'
import { tasksMixin } from '@/assets/js/mixins'
import { Track } from '@/libs/track'
const track = new Track('综合模块/任务系统/我执行的任务')
export default {
  name: 'allExcute',
  mixins: [tasksMixin],
  components: {
    BzTable,
    SearchBox
  },
  created () {
    track.start()
  },
  data () {
    return {
      // 当前tab的name属性
      currentTab: '',
      loading: false, // 是否显示表格加载框
      searchContent: '', // 模糊搜素关键字
      searchType: '0', // 默认是 0 代表表头搜索
      // 表头搜索字段
      fields: {
        taskLevel: '', // 任务等级
        taskStatus: '', // 任务
        name: '', // 任务名称状态
        taskContent: '', //  任务内容
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
        totalCount: null,
        currentPage: 1
      },
      // tbody渲染数据
      rowData: [],
      excute: 'excute',
      tableHeader: [],
      defaultList: [
        'focus',
        'index',
        'name',
        'content',
        'tasksTimeStartToEnd',
        'sendName',
        'acceptName',
        'taskLevel',
        'planStatus',
        'taskType',
        'action'

      ],
      // 表头数据
      columns: [
        {
          title: '关注 ',
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
          key: 'index',
          type: 'index',
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
          title: '方案内容',
          key: 'content',
          minWidth: 150,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="cursor">
                    { params.column.title }
                    <Icon type="md-search" size="14" class={this.fields.taskContent ? 'on' : ''} />
                  </span>
                  <div slot="content">
                    <Input
                      placeholder="方案内容"
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
                      v-model={this.fields.taskContent}
                    ></Input>
                  </div>
                </Poptip></span>)
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
                h('p', params.row.planStarttime),
                h('span', { style: { textAlign: 'center' } }, '~'),
                h('p', params.row.planEndtime)
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
            return (
              <span>
                <Poptip placement="bottom">
                  <span class="cursor">
                    {params.column.title }
                    <Icon type="md-search" size="14" class={this.fields.sendUid ? 'on' : ''} />
                  </span>
                  <div slot="content" style="white-space: normal">
                    <Select
                      placeholder="发起人"
                      slot="content"
                      filterable
                      size="small"
                      clearable
                      style="text-align: left; width: 190px;"
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
                            key={person.id}
                            value={person.id}
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
                </Poptip>
              </span>)
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
          title: '方案状态',
          key: 'planStatus',
          width: 110,
          align: 'center',
          render: (h, params) => {
            const text = params.row.planStatus
            const planStatus = params.row.planStatus
            const planEndTime = params.row.planEndtime
            // const planStartTime = params.row.planStarttime
            let todayTimeString = new Date(planEndTime + ' 09:00:00').getTime()
            let tomorrowTimeString = 24 * 3600 * 1000 + todayTimeString
            let formatTime = moment(tomorrowTimeString).format('YYYY-MM-DD hh:mm:ss')
            switch (planStatus) {
              case '待确认':
                this.content = `请在${params.row.lastConfirmTime}前与接收人确认可执行方案，执行人确认后，点击“任务确认”按钮，任务开始进行`
                return (
                  <div>
                    <span style="display: inline">{planStatus}</span>
                    <Tooltip
                      content={this.content}
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
              case '进行中':
                this.content = `请在${formatTime}前完成任务，并点击完成按钮`
                return (
                  <div>
                    <span style="display: inline">{planStatus}</span>
                    <Tooltip
                      content={this.content}
                      max-width="200"
                      style="marginLeft: 5px">
                      <Icon
                        type="ios-alert-outline"
                        color="#f90"
                        size="16"
                        style="marginBottom: 2px; cursor: pointer;">
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
          key: 'taskType',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          align: 'center',
          width: 280,
          alwaysShow: true,
          fixed: 'right'
        }
      ]
    }
  },
  methods: {
    handleTableHeaders (arr) {
      this.tableHeader = arr
    },
    // 获取页面渲染数据
    getTableData (data) {
      this.loading = true
      let params = this.getValidParams(data)
      // 获取tab标签页显示的数字
      this.$axios({
        url: `${baseUrl}/taskplan/execute/0`,
        method: 'post',
        data: $qs.stringify(params)
        // data: params
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
        url: `${baseUrl}/taskplan/execute/${this.currentTab}`,
        method: 'post',
        data: $qs.stringify(params)
        // data: params
      }).then(res => {
        if (res.data.code === 10000) {
          // console.log('data', res.data)
          let data = res.data.content
          this.page.currentPage = data.page.currPage
          this.page.pageSize = data.page.pageSize
          this.page.totalCount = data.page.totalCount

          // 列表数据
          this.rowData = data.page.pageContent || []
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
#task-executor {
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
