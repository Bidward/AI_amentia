<template>
    <div>
        <div class="level-three">
            <Button type="primary" v-if="permission.create" @click="showAdd=true">新增</Button>
            <Button v-if="permission.import" @click="showImport=true">导入</Button>
            <div class="searchbar">
            <Input
                @on-search="detailSearch()"
                placeholder="搜索发起人、当事人"
                search
                clearable
                v-model="detailHeader.fuzzyCondition"
                style="width:200px;margin-right:5px;"
            />
            <Button  icon="ios-loading" @click="()=>{reload(); detailSearch()}"></Button>
            <TableHeaderSetting
                :totalTableHeader="detailTableHeader"
                :tableHeader.sync="tableHeader"
                key="rewardTabelHeaders"
                localKey="rewardTabelHeaders"
                :defaultList="defaultList"
            />
            </div>
        </div>
        <Modal
            @on-ok="handleValidate()"
            v-model="showAdd"
            :mask-closable="false"
            title="新增"
            :loading="loading"
            :width="700"
        >
            <addReward v-if="showAdd" ref="addReward" :incumbencyTbUser="employees"></addReward>
        </Modal>
        <Modal
            v-model="showImport"
            :mask-closable="false"
            title="导入"
            :loading="loading"
            footer-hide
        >
            <addImport v-if="showImport" ref="showImport" @on-import-success="() => showImport = false"></addImport>
        </Modal>
        <Table
            ref="selection"
            border
            :loading="tableLoading"
            @on-selection-change="selectChange"
            :columns="tableHeader"
            :data="detailContent"
            @on-sort-change="sortChange"
            key="reward"
        >
            <template slot-scope="{ row, index }" slot="edit">
                <Button
                    :disabled="row.userId!==userId"
                    @click="revoke(row)"
                    type="primary"
                >申请销分</Button>
                <Button
                    v-if="permission.edit"
                    :disabled="row.initiationDetailed!=='日常奖惩'"
                    @click="showEditModal(row.id)"
                    type="primary"
                >编辑</Button>
                <Button
                    v-if="permission.delete"
                    @click="del(row)"
                    type="error"
                >删除</Button>
                <Button
                    @click="showDetailModal(row.id)"
                >详情</Button>
            </template>
            <div slot="footer">
                <span style="margin-left:18px">总分：{{detailHeader.limitScore}}</span>
            </div>
        </Table>
        <Modal
            v-model="showApply"
            :mask-closable="false"
            :loading="loading"
            @on-ok="applyRevoke()"
            title="申请销分"
        >
            <revoke
                :key="revokeId"
                :revokeId="revokeId"
                :incumbencyTbUser="employees"
                ref="revoke"
            />
        </Modal>
        <Modal
            v-model="showEdit"
            :mask-closable="false"
            :loading="loading"
            @on-ok="rewardEdit()"
            title="编辑"
        >
            <edit
                ref="rewardEdit"
                :rewardEditId="rewardEditId"
            />
        </Modal>
        <Modal v-model="showDetail" :mask-closable="false" title="查看详情">
            <detail
                ref="rewardDetail"
                :detail="detail"
            />
        </Modal>
        <div class="clearfix tableFooter">
            <Button type="error" @click="delMore" v-if="permission.delete">批量删除</Button>
            <Page
                :total="detailHeader.totalCount"
                :page-size="detailHeader.pageSize"
                :current="detailHeader.currPage"
                size="small"
                show-total
                show-sizer
                show-elevator
                @on-change="(currPage)=>{detailHeader.currPage=currPage; detailSearch(currPage)}"
                @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize; detailSearch()}"
                style="float:right;"
            />
        </div>
    </div>
</template>
<script>
import { debounce } from '@/libs/tools'
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import corporate from './corporate.js'
import TableHeaderSetting from '_c/table-header-setting'
import addReward from './components/addReward'
import addImport from './components/addImport'
import revoke from './components/revoke'
import edit from './components/edit'
import detail from './components/detail'
export default {
  name: 'reward',
  inject: ['app'],
  components: {
    TableHeaderSetting,
    addReward,
    addImport,
    revoke,
    edit,
    detail
  },
  mixins: [corporate],
  data () {
    return {
      tableHeader: [], // 双向绑定iview-tabel的字段
      tableHeight: 600,
      baseUrl,
      tableLoading: false, // 表格loading状态
      loading: true, // Modal开启loading状态
      showSelect: false, // 奖惩详情的搜索
      showAdd: false, // 新增奖惩的展示框
      showImport: false, // 导入的展示框
      showApply: false, // 消分申请的展示框
      showEdit: false, // 编辑展示框
      showDetail: false, // 奖惩详情的展示框
      tabsType: 'detail',
      checked: [],
      revokeId: 0,
      rewardDetail: {},
      detail: {}, // 详情
      rewardEditId: '',
      // 详情页的搜索表头
      detailHeader: {
        entryUserId: 1, // 录入人
        timeSort: '', // 排序1近到远，2远到近
        totalCount: 1,
        pageSize: 20,
        currPage: 1,
        initiationType: 0, // 发起类型
        rewardSource: 0, // 奖惩来源
        initiatorId: '', // 发起人id
        isCore: -1, // 是否核心KPI，1是0非
        corporateValue: 0, // 企业价值观
        fuzzyCondition: '', // 模糊搜索条件
        timeRange: [null, null], // 时间范围
        limitScore: '',
        userId: 1, // 当事人id
        reason: '' // 理由
      },
      defaultList: [
        'selection',
        'index',
        'rewardTime',
        'nickName',
        'initiationDetailed',
        'rewardSource',
        'reason',
        'score',
        'relateName',
        'isCoreName',
        'value',
        'initiatorName',
        'action'
      ],
      // 详情页的表格表头
      detailTableHeader: [
        { title: '勾选框', key: 'selection', type: 'selection', width: 60, align: 'center', alwaysShow: true },
        { title: '序号', key: 'index', type: 'index', width: 60, align: 'center', alwaysShow: true },
        {
          title: '时间',
          key: 'rewardTime',
          width: 100,
          sortable: 'custom',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.timeRange[1] ? 'on' : ''} />
                  </span>
                  <div slot="content">
                    <div>
                      <DatePicker
                        onOn-change={() => {
                          this.detailSearch()
                        }}
                        type="daterange"
                        clearable={false}
                        v-model={this.detailHeader.timeRange}
                        placement="bottom-start"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '当事人',
          key: 'nickName',
          width: 100,
          align: 'center',
          alwaysShow: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.userId ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    filterable
                    clearable
                    onOn-change={
                      value => {
                        this.detailSearch()
                      }
                    }
                    v-model={this.detailHeader.userId}
                  >
                    {this.employees.map(person => {
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
                </Poptip >
              </span>
            )
          }
        },
        {
          title: '类型',
          key: 'initiationDetailed',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.initiationType ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    onOn-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.detailHeader.initiationType}
                  >
                    {this.initiationTypeList.map(item => {
                      return <Option value={item.id} label={item.name} />
                    })}
                  </Select>
                </Poptip >
              </span>
            )
          }
        },
        {
          title: '奖惩来源',
          key: 'rewardSource',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.rewardSource ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    onOn-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.detailHeader.rewardSource}
                  >
                    {this.rewardSourceList.map(item => {
                      return <Option value={item.id} label={item.name} />
                    })}
                  </Select>
                </Poptip >
              </span>
            )
          },
          render: (h, params) => {
            const rewardSource = params.row.rewardSource
            switch (rewardSource) {
              case 1:
                return (
                  <span>内部奖惩</span>
                )
              case 2:
                return (
                  <span>外部奖惩</span>
                )
              default:
                break
            }
          }
        },
        {
          title: '事项',
          minWidth: 400,
          key: 'reason',
          tooltip: true,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.reason ? 'on' : ''} />
                  </span>
                  <Input
                    clearable
                    slot="content"
                    search
                    onOn-search={() => {
                      this.detailSearch()
                    }}
                    onOn-clear={() => {
                      this.detailHeader.reason = ''
                      this.detailSearch()
                    }}
                    v-model={this.detailHeader.reason}
                  />
                </Poptip>
              </span>
            )
          },
          render: (h, params) => {
            return (
            // <span class="taskTitle pointer" >
              <span class={params.row.taskId ? 'taskTitle pointer' : ''} >
                <a style={params.row.taskId ? '' : 'color: #515a6e'}
                  onClick={() => this.toTaskDetail(params.row)}>{params.row.reason}</a>
              </span>
            )
          }
        },
        {
          title: '分数',
          key: 'score',
          width: 100,
          align: 'center'
        },
        {
          title: '连带人',
          key: 'relateName',
          width: 100,
          align: 'center'
        },
        {
          title: '事项性质',
          key: 'isCoreName',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.isCore > -1 ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    filterable
                    onOn-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.detailHeader.isCore}
                  >
                    {this.isCoreList.map(item => {
                      return (
                        <Option value={item.id} label={item.value} />
                      )
                    })}
                  </Select>
                </Poptip >
              </span>
            )
          }

        },
        {
          title: '企业价值观',
          // key: 'corporateValueName',
          key: 'value',
          width: 120,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.corporateValue ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    filterable
                    onOn-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.detailHeader.corporateValue}
                  >
                    {this.corporateValueList.map(item => {
                      return (
                        <Option value={item.id} label={item.value} />
                      )
                    })}
                  </Select>
                </Poptip >
              </span>
            )
          }
        },
        {
          title: '发起人',
          key: 'initiatorName',
          width: 120,
          searchKey: 'initiatorId',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.initiatorId ? 'on' : ''} />
                  </span>
                  <Select
                    slot="content"
                    filterable
                    clearable
                    onOn-change={() => {
                      this.detailSearch()
                    }}
                    v-model={this.detailHeader.initiatorId}
                  >
                    {this.employees.map(person => {
                      return (
                        <Option value={person.id} label={person.nickname}/>
                      )
                    })}
                  </Select>
                </Poptip >
              </span>
            )
          }
        },
        { title: '操作', key: 'action', slot: 'edit', width: 320, align: 'center', fixed: 'right', alwaysShow: true }
      ],
      // 详情页的表格内容体格式
      detailContent: []
    }
  },
  mounted () {
    this.setTimeRange() // 设置默认时间
    this.reload() // 设置默认搜索条件
    this.detailSearch()
    this.setTableHeight()
    window.addEventListener('resize', debounce(this.setTableHeight))
  },
  beforeDestroy () {
    window.removeEventListener('resize', debounce(this.setTableHeight))
  },
  methods: {
    setTableHeight () {
      let TABLE_MARGIN_HEIGHT = 330
      let pagePaddingHeight = document
        .querySelectorAll('body')[0]
        .getClientRects()[0].height
      this.tableHeight = pagePaddingHeight - TABLE_MARGIN_HEIGHT
    },
    // 任务扣分--跳转任务详情页面
    toTaskDetail (row) {
      if (row.taskId) {
        this.$router.push({
          name: 'taskDetail',
          params: {
            id: row.taskId
          }
        })
      }
    },
    selectChange (rows) {
      this.checked = rows.map(e => {
        return e.id
      })
    },
    // 展示编辑
    showEditModal (id) {
      this.showEdit = true
      this.rewardEditId = id
    },
    // 编辑奖惩
    rewardEdit () {
      let data = this.$refs.rewardEdit.detail
      let editForm = this.$refs.rewardEdit.$refs.editForm
      editForm.validate(valid => {
        if (valid) {
          this.$axios({
            url: baseUrl + '/reward/editReward',
            method: 'post',
            data: data
          })
            .then(res => {
              this.$Message.success(res.data.msg)
              this.showEdit = false
              this.detailSearch()
            })
            .catch(err => {
              console.log('rewardEdit', err)
            })
        } else {
          this.$Message.error('有必填项未填')
        }
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    // 展示详情
    showDetailModal (id) {
      this.showDetail = true
      this.$axios({
        url: baseUrl + '/reward/getDetail',
        method: 'post',
        data: $qs.stringify({ id: id })
      })
        .then(res => {
          if (res.data.code === 10000) {
            this.detail = res.data.content
          }
        })
        .catch(err => {
          console.log('getDetail', err)
        })
    },
    // HR销分
    eliminate (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否对“${row.reason}”进行销分`,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/reward/eliminate',
            method: 'post',
            data: $qs.stringify({
              id: row.id
            })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.detailSearch()
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }

      })
    },
    // 当事人申请销分
    revoke (row) {
      this.revokeId = row.id
      this.canRevoke(this.revokeId)
    },
    // 是否存在正在销分，不能销分
    canRevoke (rid) {
      this.$axios({
        url: baseUrl + '/reward/getEliminateStatus',
        method: 'post',
        data: $qs.stringify({ rid: rid })
      }).then(res => {
        if (res.data.code === 10001) {
          this.showApply = true
        } else {
          this.$Message.warning(res.data.msg)
        }
      }).catch(err => {
        console.log(err.data)
      })
    },
    // 申请销分
    applyRevoke () {
      let data = this.$refs.revoke.revokeData
      let revokeForm = this.$refs.revoke.$refs.revokeForm
      revokeForm.validate(valid => {
        if (valid) {
          this.$axios({
            url: baseUrl + '/approve/rewardEliminate',
            method: 'post',
            data: { rewardApply: data }
          })
            .then(res => {
              this.$Message.success(res.data.msg)
              this.showApply = false
            })
            .catch(err => {
              console.log('applyRevoke', err)
            })
        } else {
          this.$Message.error('有必填项未填')
        }
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      })
    },
    reload (text) {
      let { totalCount, pageSize, currPage, limitScore, timeSort } = this.detailHeader
      this.detailHeader = {
        entryUserId: this.userId, // 录入人
        timeSort, // 排序1近到远，2远到近
        totalCount,
        pageSize,
        currPage,
        limitScore,
        initiationType: '', // 发起类型
        rewardSource: '', // 奖惩来源
        initiatorId: '', // 发起人id
        fuzzyCondition: text || '', // 模糊搜索条件
        timeRange: [null, null], // 时间范围
        userId: this.userId, // 当事人id
        reason: '' // 理由
      }
    },
    getSendData (currPage) {
      let sendData = {}
      let keys = Object.keys(this.detailHeader)
      keys.filter(item => {
        if (this.detailHeader[item] !== '') {
          let value = this.detailHeader[item]
          if (item === 'fuzzyCondition' && value) {
            this.reload(value)
          } else if (item === 'timeRange' && value[0]) {
            let timeRange = this.detailHeader[item]
            sendData.startTime = moment(timeRange[0]).format('YYYY-MM-DD')
            sendData.endTime = moment(timeRange[1]).format('YYYY-MM-DD')
          }
          if (currPage) {
            sendData.currPage = currPage
          } else {
            sendData.currPage = 1
          }
          sendData[item] = typeof value === 'string' ? value.trim() : value
        }
      })
      return sendData
    },
    // 搜索
    detailSearch (currPage) {
      this.tableLoading = true
      let sendData = this.getSendData(currPage)
      this.$axios({
        url: baseUrl + '/reward/getRewardsByDTO',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          // 查无数据
          if (res.data.code === 10001) {
            this.detailHeader.totalCount = 0
            this.detailHeader.currPage = 1
            this.detailHeader.limitScore = 0
            this.detailContent = []
            this.tableLoading = false
            return
          }
          let data = res.data.content
          let { totalCount, pageSize, currPage, limitScore } = data
          this.detailHeader.totalCount = totalCount
          this.detailHeader.pageSize = pageSize
          this.detailHeader.currPage = currPage
          this.detailHeader.limitScore = limitScore
          this.detailContent = data.pageContent
          this.tableLoading = false
          // 计算表格高度
          this.setTableHeight()
        })
        .catch(err => {
          this.tableLoading = false
          console.log(err)
        })
    },
    sortChange (column) {
      // 降序  "desc"
      // let orderby = column.key
      let desc = column.order
      if (desc === 'desc') {
        this.detailHeader.timeSort = '1'
      } else if (desc === 'asc') {
        this.detailHeader.timeSort = '2'
      } else {
        this.detailHeader.timeSort = ''
      }
      this.detailSearch()
    },
    // 删除
    del (row) {
      let id = [row.id]
      this.$Modal.confirm({
        title: '提示',
        content: `是否对“${row.reason}”进行删除？`,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/reward/deleteReward',
            method: 'post',
            data: id
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.detailSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 批量删除
    delMore () {
      let ids = this.checked
      if (ids.length === 0) {
        this.$Message.error('未选择')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '是否对所选条目进行删除？',
        onOk: () => {
          this.$axios({
            url: baseUrl + '/reward/deleteReward',
            method: 'post',
            data: ids
          })
            .then(res => {
              if (res.data.code === 10000) {
                this.$Message.success(res.data.msg)
                this.detailSearch()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    // 新增奖惩验证表单
    handleValidate () {
      let addRewardForm = this.$refs.addReward.$refs.addRewardForm
      let data = this.$refs.addReward.addReward
      data.rewardDate = moment(data.rewardDate).format('YYYY-MM-DD')
      let me = this
      addRewardForm.validate(valid => {
        if (valid) {
          me.handleAddReward()
        } else {
          this.$Message.error('有必填项未填')
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }
      })
    },
    // 新增奖惩
    handleAddReward () {
      let data = this.$refs.addReward.addReward
      // data.rewardDate = moment(data.rewardDate).format('YYYY-MM-DD')
      // 价值观其他，不添加星级
      if (data.corporateValue === 7) {
        delete data.corporateValueLevel
      }
      this.$axios({
        url: baseUrl + '/reward/rewardInsert',
        method: 'post',
        data: data
      })
        .then(res => {
          this.loading = false // 确认框先取消loading
          if (res.data.code === 10000) {
            this.$Message.success(res.data.msg)
            this.detailSearch()
          } else {
            this.$Message.error(res.data.msg)
          }
          this.$nextTick(() => {
            this.loading = true
          })
        })
        .catch(err => {
          console.error(err)
        })
      this.showAdd = false
    },
    uploadSuccess (res) {
      if (res.code === 10000) {
        this.$Message.success(res.msg)
        this.detailSearch()
      } else {
        this.$Message.error('模板格式有误，请下载模板后导入')
      }
    },
    handleFormatError (file) {
      this.$Message.error('文件格式有误，请选择.xlsx, .xls, .cvs后缀的文件')
    },
    setTimeRange () {
      let firstDayOfMonth = moment().format('YYYY-MM') + '-01'
      let lastDayOfMonth = moment(firstDayOfMonth).add(1, 'month').add(-1, 'days').format('YYYY-MM-DD')
      this.detailHeader.timeRange = [ firstDayOfMonth, lastDayOfMonth ]
    }
  },
  computed: {
    employees () {
      return this.app.employees
    },
    userId () {
      return this.$store.state.user.userId
    },
    permission () {
      return this.$store.state.user.userpermission.reward
    }
  }
}
</script>
