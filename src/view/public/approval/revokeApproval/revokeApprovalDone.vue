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
              key="approvalRevoke2"
              localKey="approvalRevoke2"
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
        >
            <template slot-scope="{ row, index }" slot="action">
                <Button @click="getDetail(row.applyId)">详情</Button>
            </template>
        </Table>
        <div class="tableFooter">
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
        <revokeDetailModal
          :info="'done'"
          @close="close"
          @closeAndRefresh="closeAndRefresh"
          :show="showDetail"
          :propsData="propsData"
        ></revokeDetailModal>
    </div>
</template>

<script>
import { baseUrl } from '@/api/base'
import moment from 'moment'
import mixins from '../mixins'
import revokeDetailModal from './revokeDetailModal'
import TableHeaderSetting from '_c/table-header-setting'
export default {
  name: 'revokeApprovalDone',
  mixins: [ mixins ],
  components: { revokeDetailModal, TableHeaderSetting },
  data () {
    return {
      loading: true,
      headerSearch: {
        userid: '', // 当事人id
        initiationType: 0, // 扣分类型
        initiatorId: '', // 发起人
        applyTimeRange: [null, null], // 申请时间范围
        timeRange: [null, null], // 扣分时间范围
        fuzzyCondition: '', // 迷糊搜索条件
        pageSize: 20,
        totalCount: 0,
        currentPage: 1
      },
      defaultList: [
        'index',
        'rewardUserName',
        'applyTime',
        'approveStatusName',
        'reason',
        'initiationDetailed',
        'score',
        'applyReason',
        'action'
      ],
      tableHeader: [],
      columns: [
        {
          title: '序号',
          key: 'index',
          type: 'index',
          width: 60,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '当事人',
          key: 'rewardUserName',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14" class={this.headerSearch.userid ? 'on' : ''} />
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.headerSearch.userid}
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
          title: '申请时间',
          width: 150,
          key: 'applyTime',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14" class={this.headerSearch.applyTimeRange[1] ? 'on' : ''} />
                </span>
                <div slot="content">
                  <DatePicker
                    onOn-ok={() => {
                      this.getTableData()
                    }}
                    onOn-clear={
                      () => {
                        this.getTableData()
                      }
                    }
                    type="daterange"
                    v-model={this.headerSearch.applyTimeRange}
                    confirm
                    placement="bottom-start"
                    placeholder="输入时间"
                  />
                </div>
              </Poptip>
            </span>)
          }
        },
        {
          title: '扣分时间',
          minWidth: 150,
          key: 'rewardTime',
          width: 100,
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
                    onOn-ok={() => {
                      this.getTableData()
                    }}
                    onOn-clear={
                      () => {
                        this.getTableData()
                      }
                    }
                    type="daterange"
                    v-model={this.headerSearch.timeRange}
                    confirm
                    placement="bottom-start"
                    placeholder="输入时间"
                  />
                </div>
              </Poptip>
            </span>)
          }
        },
        {
          title: '扣分事项',
          key: 'reason',
          minWidth: 120,
          align: 'center',
          render: (h, params) => {
            if (params.row.taskId) {
              return (
                <span class="taskTitle pointer">
                  <a onClick={() => this.checkDetail(params.row.taskId)}>{params.row.reason}</a>
                </span>
              )
            } else {
              return <span>{params.row.reason}</span>
            }
          }
        },
        {
          title: '扣分类型',
          key: 'initiationDetailed',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  { params.column.title }
                  <Icon type="md-search" size="14" class={this.headerSearch.initiationType ? 'on' : ''} />
                </span>
                <Select
                  slot="content"
                  filterable
                  placeholder="扣分类型"
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.headerSearch.initiationType}
                >
                  {this.initiationTypeList.map(item => {
                    return <Option value={item.id} label={item.name} />
                  })}
                </Select>
              </Poptip>
            </span>)
          }
        },
        {
          title: '分值',
          key: 'score',
          minWidth: 80,
          align: 'center'
        },
        {
          title: '审批状态',
          minWidth: 80,
          key: 'approveStatusName',
          align: 'center'
        },
        {
          title: '发起人',
          key: 'initiatorName',
          minWidth: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (<span>
              <Poptip transfer={true} placement="bottom">
                <span class="pointer">
                  {params.column.title}
                  <Icon type="md-search" size="14" class={this.headerSearch.initiatorId ? 'on' : ''} />
                </span>
                <Select
                  slot="content"
                  filterable
                  clearable
                  onOn-change={() => {
                    this.getTableData()
                  }}
                  v-model={this.headerSearch.initiatorId}
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
          title: '销分事由',
          key: 'applyReason',
          minWidth: 120,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 100,
          slot: 'action',
          align: 'center',
          fixed: 'right'
        }
      ],
      rowData: [],
      showDetail: false,
      propsData: {}
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
        userid: '', // 当事人id
        initiationType: 0, // 扣分类型
        initiatorId: '', // 发起人
        applyTimeRange: [null, null], // 申请时间范围
        timeRange: [null, null], // 扣分时间范围
        fuzzyCondition: searchContent, // 迷糊搜索条件
        pageSize,
        totalCount,
        currentPage
      }
    },
    // 获取表格数据
    getTableData (currentPage, pageSize) {
      let _search = this.headerSearch
      let sendData = {}
      if (_search.fuzzyCondition) {
        sendData.fuzzyCondition = _search.fuzzyCondition
        this.clearSearchHeader(_search.fuzzyCondition)
      } else {
        sendData = {
          userid: _search.userid,
          initiationType: _search.initiationType,
          initiatorId: _search.initiatorId,
          currPage: currentPage,
          pageSize: pageSize || this.headerSearch.pageSize
        }
        if (_search.applyTimeRange[0]) {
          sendData.applyStartTime = moment(_search.applyTimeRange[0]).format('YYYY-MM-DD')
          sendData.applyEndTime = moment(_search.applyTimeRange[1]).format('YYYY-MM-DD')
        } else if (_search.timeRange[0]) {
          sendData.startTime = moment(_search.timeRange[0]).format('YYYY-MM-DD')
          sendData.endTime = moment(_search.timeRange[1]).format('YYYY-MM-DD')
        }
      }

      this.loading = true
      this.$axios({
        url: `${baseUrl}/approve/getRewardApproval/1`,
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
      }).catch(err => {
        console.log('err', err)
      })
    },
    getDetail (id) {
      let data = id
      this.$axios({
        url: `${baseUrl}/approve/getDetail`,
        method: 'post',
        data: $qs.stringify({ id: data })
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
    }
  }
}
</script>

<style lang="less" scope>
</style>
