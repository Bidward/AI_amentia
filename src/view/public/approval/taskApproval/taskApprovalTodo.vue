<template>
    <div>
        <div class="level-three">
          <div class="searchbar">
            <Input
              @on-search="getTableData()"
              placeholder="搜索当事人、发起人"
              search
              clearable
              v-model="headerSearch.fuzzyCondition"
              style="width:200px;margin-right:5px;"
            />
            <Button icon="ios-loading" @click="refresh()"></Button>
            <TableHeaderSetting
              :totalTableHeader="columns"
              :tableHeader.sync="tableHeader"
              key="approvalTask1"
              localKey="approvalTask1"
              :defaultList="defaultList"
            />
          </div>
        </div>
        <Table
          border
          ref="selection"
          :columns="tableHeader"
          :data="rowData"
          :loading="loading"
          @on-selection-change="selectChange"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button class="btn" type="primary" @click="approve(row)">同意</Button>
            <Button class="btn" type="error" @click="reject(row)">拒绝</Button>
            <Button class="btn" @click="getDetail(row)">详情</Button>
          </template>
        </Table>
        <div class="tableFooter">
          <!-- <Button type="primary" @click="agreeMore">批量同意</Button> -->
          <Page
            :total="headerSearch.totalCount"
            :page-size="headerSearch.pageSize"
            :current="headerSearch.currentPage"
            size="small"
            show-total
            show-sizer
            show-elevator
            @on-change="changeCurrentPage"
            @on-page-size-change="changePageSize"
          />
        </div>
        <taskDetailModal
          :info="'todo'"
          @close="close"
          @closeAndRefresh="closeAndRefresh"
          :row="row"
          :show="showDetail"
          :propsData="propsData"
        ></taskDetailModal>
    </div>
</template>

<script>
import { baseUrl } from '@/api/base'
import moment from 'moment'
import mixins from '../mixins'
import taskDetailModal from './taskDetailModal'
import TableHeaderSetting from '_c/table-header-setting'
import { Track } from '@/libs/track'
const track = new Track('综合模块/审批中心/任务审批')

export default {
  name: 'taskApprovalTodo',
  components: { taskDetailModal, TableHeaderSetting },
  mixins: [ mixins ],
  beforeCreate () {
    track.start()
  },
  data () {
    return {
      loading: true,
      headerSearch: {
        name: '', // 任务名称
        timeRange: [null, null], // 时间范围
        sendUid: '', // 发起人
        acceptUid: '', // 接收人
        executeUid: '', // 执行人
        targetTaskStatus: '', // 状态
        fuzzyCondition: '', // 迷糊搜索条件
        pageSize: 20,
        totalCount: 0,
        currentPage: 1
      },
      defaultList: [
        'selection',
        'index',
        'name',
        'tasksTimeStartToEnd',
        'sendName',
        'acceptName',
        'targetTaskStatus',
        'approveStatusName',
        'action'
      ],
      tableHeader: [],
      columns: [
        {
          title: '多选框',
          type: 'selection',
          key: 'selection',
          width: 50,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '序号',
          key: 'index',
          type: 'index',
          width: 60,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '任务名称',
          key: 'name',
          minWidth: 150,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip placement="bottom">
                <span class="pointer">
                  { params.column.title }
                  <Icon type="md-search" size="14" class={this.headerSearch.name ? 'on' : ''} />
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
                        this.getTableData()
                      }
                    }
                    v-model={this.headerSearch.name}
                  ></Input>
                </div>
              </Poptip>
            </span>)
          },
          render: (h, params) => {
            return (
              <span class="taskTitle pointer">
                <a onClick={() => this.checkDetail(params.row.tasksApprove.taskId)}>{params.row.name}</a>
              </span>
            )
          }
        },
        {
          title: '任务类型',
          key: 'type',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '任务状态',
          key: 'taskStatus',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '任务等级',
          key: 'taskLevel',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '时间',
          key: 'tasksTimeStartToEnd',
          minWidth: 150,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14" class={this.headerSearch.timeRange[1] ? 'on' : ''} />
                </span>
                <div slot="content">
                  <DatePicker
                    type="daterange"
                    v-model={this.headerSearch.timeRange}
                    confirm
                    placement="bottom-start"
                    placeholder="输入时间"
                    onOn-ok={
                      value => {
                        this.getTableData()
                      }
                    }
                    onOn-clear={
                      () => {
                        this.getTableData()
                      }
                    }
                  />
                </div>
              </Poptip>
            </span>)
          },
          render: (h, params) => {
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
          title: '申请时间',
          key: 'applyTime',
          minWidth: 110,
          align: 'center',
          render: (h, params) => {
            const tasksApprove = params.row.tasksApprove
            return h(
              'span',
              tasksApprove.applyTime
            )
          }
        },
        {
          title: '发起人',
          key: 'sendName',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14" class={this.headerSearch.sendUid ? 'on' : ''} />
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.headerSearch.sendUid}
                >
                  {this.employees.map(person => {
                    return <Option value={person.id} label={person.nickname}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '接收人',
          key: 'acceptName',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14" class={this.headerSearch.acceptUid ? 'on' : ''} />
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.headerSearch.acceptUid}
                >
                  {this.employees.map(person => {
                    return <Option value={person.id} label={person.nickname}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '执行人',
          key: 'executors',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14" class={this.headerSearch.executeUid ? 'on' : ''} />
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.headerSearch.executeUid}
                >
                  {this.employees.map(person => {
                    return <Option value={person.id} label={person.nickname}/>
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '更改状态',
          key: 'targetTaskStatus',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  { params.column.title }
                  <Icon type="md-search" size="14" class={this.headerSearch.targetTaskStatus ? 'on' : ''} />
                </span>
                <Select
                  slot="content"
                  clearable
                  filterable
                  placeholder="任务状态"
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.headerSearch.targetTaskStatus}
                >
                  {this.taskStatusList.map(item => {
                    return <Option value={item.id} label={item.name} />
                  })}
                </Select>
              </Poptip>
            </span>)
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
          key: 'approveStatusName',
          minWidth: 80,
          align: 'center',
          render: (h, params) => {
            const tasksApprove = params.row.tasksApprove
            return h(
              'span',
              tasksApprove.approveStatusName
            )
          }
        },
        {
          title: '操作',
          minWidth: 200,
          key: 'action',
          slot: 'action',
          align: 'center',
          fixed: 'right'
        }
      ],
      rowData: [],
      showDetail: false,
      propsData: {},
      row: {},
      checked: []
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    checkDetail (id) {
      this.$router.push({ name: 'taskDetail', params: { id: id } })
    },
    // 页码改变
    changeCurrentPage (currentPage) {
      this.getTableData(currentPage, sessionStorage.pageSize)
    },

    // 切换每页条数
    changePageSize (pageSize) {
      sessionStorage.pageSize = pageSize
      this.getTableData(this.headerSearch.currPage, pageSize)
    },
    close () {
      this.showDetail = false
    },
    closeAndRefresh () {
      this.showDetail = false
      this.refresh()
    },
    refresh () {
      this.clearSearchHeader()
      this.getTableData()
    },
    // 清空表头搜索
    clearSearchHeader (searchContent) {
      let { totalCount, pageSize, currentPage } = this.headerSearch
      this.headerSearch = {
        name: '', // 任务名称
        timeRange: [null, null], // 时间范围
        sendUid: '', // 发起人
        acceptUid: '', // 接收人
        executeUid: '', // 执行人
        targetTaskStatus: '', // 状态
        fuzzyCondition: searchContent, // 迷糊搜索条件
        pageSize,
        totalCount,
        currentPage
      }
    },
    // 获取页面渲染数据
    getTableData (currentPage, pageSize) {
      let _search = this.headerSearch
      let sendData = {}
      if (_search.fuzzyCondition) {
        sendData.fuzzyCondition = _search.fuzzyCondition
        this.clearSearchHeader(_search.fuzzyCondition)
      } else {
        sendData = {
          name: _search.name,
          sendUid: _search.sendUid,
          acceptUid: _search.acceptUid,
          executeUid: _search.executeUid,
          targetTaskStatus: _search.targetTaskStatus,
          currPage: currentPage,
          pageSize: pageSize || this.headerSearch.pageSize
        }
        if (_search.timeRange[0]) {
          sendData.taskInfoStartDate = moment(_search.timeRange[0]).format('YYYY-MM-DD')
          sendData.taskInfoEndDate = moment(_search.timeRange[1]).format('YYYY-MM-DD')
        }
      }

      this.loading = true
      this.$axios({
        url: `${baseUrl}/tasks/getTaskApproval/0`,
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        if (res.data.code === 10000) {
          let data = res.data.content
          this.headerSearch.currentPage = data.page.currPage
          this.headerSearch.pageSize = data.page.pageSize
          this.headerSearch.totalCount = data.page.totalCount

          this.rowData = data.page.pageContent
          this.loading = false
        } else {
          this.$Message.error(res.data.msg)
          this.loading = false
        }
        this.$nextTick(() => {
          track.end()
        })
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 详情
    getDetail (row) {
      this.row = row
      this.$axios({
        url: `${baseUrl}/tasks/getDetail`,
        method: 'post',
        data: $qs.stringify({ id: row.id })
      }).then(res => {
        if (res.data.code === 10000) {
          this.propsData = res.data.content
          this.showDetail = true
        } else {
          this.$Message.error(res.data.msg)
          this.loading = false
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    // 同意/拒绝
    approve (row) {
      this.$Modal.confirm({
        title: '提醒',
        content: `确定将<span style="color: #ff9900;">"${row.name}"</span>任务状态变更为${row.tasksApprove.targetTaskStatus}？`,
        onOk: () => {
          this.checkApprove(row.id, 1)
        }
      })
    },
    reject (row) {
      this.$Modal.confirm({
        title: '提醒',
        content: `确定拒绝<span style="color: #ff9900;">"${row.name}"</span>任务状态变更申请？`,
        onOk: () => {
          this.checkApprove(row.id, 2)
        }
      })
    },
    checkApprove (id, approveStatus) {
      this.$axios({
        url: baseUrl + `/tasks/checkApprove`,
        data: { id: id, approveStatus: approveStatus },
        method: 'post'
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.app.reload()
          } else {
            this.$Message.success(res.data.msg)
            this.app.reload()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectChange (rows) {
      this.checked = rows.map(e => {
        return e.id
      })
    },
    // 批量同意
    agreeMore () {
      let ids = this.checked
      if (ids.length === 0) {
        this.$Message.error('未选择')
        return
      }
      this.$Modal.confirm({
        title: '确定同意吗?',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/approve/agree',
            method: 'post',
            data: ids
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.getTableData()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
            .catch(err => {
              console.log(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scope>
</style>
