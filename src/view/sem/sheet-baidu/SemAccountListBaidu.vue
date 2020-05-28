<template>
  <div>
    <div class="level-three clearfix">
      <!-- <Button type="primary" class="btns" @click="addAccount()">新增</Button> -->
      <Button type="primary" class="btns" v-if="permission.create" @click="addAccount()">新增</Button>
      <Button class="btns" @click="expt()">导出</Button>
      <Button class="btns" @click="setBalanceDay()">账户设置</Button>
      <Modal
        :mask-closable="false"
        v-model="showModal"
        :loading="loading"
        title="账户设置"
        @on-ok="handleSetBalance"
      >
        <Form
          label-position="right"
          :label-width="120"
          :model="accountSet"
          :rules="accountSetRules"
          ref="accountSet"
        >
          <FormItem label="充值天数计算" prop="balanceDay">
            <Input v-model="accountSet.balanceDay" />
          </FormItem>
        </Form>
      </Modal>
      <Button class="searchbar" icon="ios-loading" @click="reload()" />
      <Input
        @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
        placeholder="账户名称"
        search
        clearable
        v-model="detailHeader.text"
        class="searchbar"
        style="width:200px;margin-right:5px;"
      />
    </div>
    <Table
      border
      @on-sort-change="sortChange"
      :columns="tableHeader"
      :data="tableContent"
      :height="tableHeight"
    >
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update" @click="editAccount(row)">编辑</Button>
        <Button class="btns" type="error" v-if="permission.delete" @click="deleteAccount(row)">刪除</Button>
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        size="small"
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20,50,100]"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
      />
    </div>
    <AccountEditBaidu
      @on-success="detailSearch"
      v-if="showEdit"
      :showEdit.sync="showEdit"
      :accountId="accountId"
    />
  </div>
</template>

<script>
import { semPermissionMixin } from '../tools'
import { semUrl } from '@/api/base.js'
import AccountEditBaidu from './SemAccountEditBaidu'
import moment from 'moment'
import { Track } from '@/libs/track'
const track = new Track('营销/百度成本表/账户管理')
export default {
  name: 'SemAccountListBaidu',
  mixins: [semPermissionMixin],
  components: {
    AccountEditBaidu
  },
  props: {
    tableHeight: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      tableHeader: [
        {
          type: 'index',
          title: '序号',
          align: 'center',
          width: 100
        },
        {
          key: 'accountName',
          title: '账户名称',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.accountName}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ accountName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.accountName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          key: 'password',
          title: '密码',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.password}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ password: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.password ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          key: 'token',
          title: 'token',
          minWidth: 120,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.token}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ token: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.token ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          key: 'accountRatio',
          title: '账户返点',
          minWidth: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          key: 'status',
          title: '状态',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.status}
                      v-on:on-change={() => {
                        this.detailSearch({ currPage: 1 })
                      }}
                    >
                      <Option value="" label="全部" />
                      <Option value="1" label="启用" />
                      <Option value="3" label="暂停" />
                    </Select>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.status ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          key: 'date',
          title: '日均消费日期',
          minWidth: 120,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <DatePicker
                      v-on:on-ok={() => {
                        this.detailSearch({ currPage: 1 })
                      }}
                      transfer={false}
                      type="date"
                      v-model={this.detailHeader.date}
                      confirm
                      clearable={false}
                      placement="bottom-start"
                      placeholder="输入时间"
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.date ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          key: 'recharge',
          title: '最终充值',
          minWidth: 120,
          align: 'center',
          sortable: 'custom',
          render: (h, { row, index }) => {
            // 暂停状态只返回数据，不请求消费详情
            if (row.status === '3') {
              return <span>{row.recharge}</span>
            }
            return (
              <span>
                <Tooltip
                  v-on:on-popper-show={() => {
                    this.getAccountBalance(row, index)
                  }}
                >
                  <span>{row.recharge}</span>
                  <div slot="content">
                    <p>日均消费日期:{row.detail ? row.detail.date : ''}</p>
                    <p>日均消费:{row.detail ? row.detail.consumeDay : ''}</p>
                    <p>{this.accountSet.balanceDay}天消费:{row.detail ? row.detail.consume8day : ''}</p>
                    <p>账户余额:{row.detail ? row.detail.balance : ''}</p>
                    <p>最终充值:{row.detail ? row.detail.recharge : ''}</p>
                  </div>
                </Tooltip>
              </span>
            )
          }
        },
        {
          key: 'sum',
          title: '备注',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.sum}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ sum: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.sum ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          key: 'edit',
          slot: 'edit',
          title: '操作',
          minWidth: 100,
          align: 'center'
        }
      ],
      showModal: false,
      loading: true,
      accountSet: {
        balanceDay: '0'// 配置时间
      },
      accountSetRules: {
        balanceDay: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      showEdit: false,
      tableContent: [],
      detailHeader: {
        accountName: '', // 账户名称
        password: '', // 密码
        token: '',
        status: '', // 状态
        date: '', // 日均消费日期，
        sum: '', // 备注
        text: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '',
        desc: 'normal'
      },
      accountId: -1
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    addAccount () {
      this.accountId = -1
      this.showEdit = true
    },
    editAccount ({ accountId }) {
      this.accountId = accountId
      this.showEdit = true
    },
    reload () {
      this.detailHeader = {
        accountName: '', // 账户名称
        password: '', // 密码
        token: '',
        status: '', // 状态
        date: '', // 日均消费日期，
        sum: '', // 备注
        text: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '',
        desc: 'normal'
      }
      this.detailSearch()
    },
    // 导出
    expt () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      let url = semUrl + '/AccountBaidu/index?' + $qs.stringify(sendData)
      window.open(url)
    },
    // 排序
    sortChange (column) {
      // 降序  "desc"
      let orderby = column.key
      let desc = column.order
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
      this.detailSearch({ orderby, desc })
    },
    getSendData (data = {}) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let hasValueKeys = keys.filter(e => {
        // 非空字符串，非空数组,timeRage第二项有值才算
        return me.detailHeader[e] !== ''
      })
      let sendData = {}
      // 只拿非空的数字
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
      }
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      // 如果是模糊搜索
      if (sendData.text) {
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      } else {
        if (sendData.date) {
          sendData.date = moment(sendData.date).format('YYYY-MM-DD')
        }
      }
      delete sendData.totalCount
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 搜索
    detailSearch (data = {}) {
      let sendData = this.getSendData((data = {}))
      this.$axios({
        url: semUrl + '/AccountBaidu/index',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            const { pageContent, totalCount, balanceDay } = res.data.content
            this.tableContent = pageContent
            this.detailHeader.totalCount = totalCount
            this.accountSet.balanceDay = balanceDay
            this.$nextTick(() => {
              track.end()
            })
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    // 删除
    deleteAccount ({ accountId, accountName }) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除账号:${accountName}?`,
        onOk: () => {
          this.$axios({
            url: semUrl + '/AccountBaidu/delAccount',
            method: 'post',
            data: $qs.stringify({ accountId })
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success('删除成功')
              this.detailSearch()
            }
          })
        }
      })
    },
    // 获取账号余额
    getAccountBalance (row, index) {
      let { accountId } = row
      if (row.detail) {
        // 提前中断
        return false
      }
      this.$axios({
        url: semUrl + '/AccountBaidu/getAccountBalance',
        method: 'post',
        data: $qs.stringify({ accountId })
      })
        .then(res => {
          let { code, data } = res.data
          if (code === 10000) {
            this.$set(this.tableContent[index], 'detail', data)
          }
        })
        .catch(err => {
          this.$Message.error(err)
        })
    },
    // 设置账期日期
    setBalanceDay () {
      this.showModal = true
    },
    // 设置账户设置
    handleSetBalance () {
      this.$refs.accountSet.validate(v => {
        if (!v) {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
          return false
        }
        this.$axios({
          url: semUrl + '/AccountBaidu/saveBalanceDay',
          method: 'post',
          data: $qs.stringify(this.accountSet)
        }).then(res => {
          if (res.data.code === 10000) {
            this.loading = false
            this.$nextTick(() => {
              this.loading = true
            })
            this.showModal = false
            this.detailSearch()
          }
        })
      })
    }
  }
}
</script>
