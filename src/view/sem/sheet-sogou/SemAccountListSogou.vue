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
      <div class="searchbar">
        <Input
          @on-search="(text)=>{detailSearch({text,currPage:1})}"
          placeholder="账户名称"
          search
          clearable
          v-model="detailHeader.text"
        />
        <Button icon="ios-loading" @click="reload()" />
      </div>
    </div>
    <Table
      border
      @on-sort-change="sortChange"
      :columns="tableHeader"
      :data="tableContent"
      :height="tableHeight"
    >
      <template slot-scope="{ row }" slot="edit">
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
        @on-change="(currPage)=>{detailSearch({currPage})}"
        @on-page-size-change="(pageSize)=>{detailSearch({pageSize})}"
      />
    </div>
    <AccountEditSogou
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
import AccountEditSogou from './SemAccountEditSogou'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
// import moment from 'moment'
import { Track } from '@/libs/track'
const track = new Track('营销/搜狗成本表/账户管理')
export default {
  name: 'SemAccountListBaidu',
  mixins: [semPermissionMixin],
  components: {
    AccountEditSogou,
    HeaderInput,
    HeaderSelect
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
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          key: 'password',
          title: '密码',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          key: 'token',
          title: 'token',
          minWidth: 120,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
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
            const options = [
              { label: '全部', value: '' },
              { label: '启用', value: '1' },
              { label: '暂停', value: '3' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={options}
                key={key}
                title={title}
                onOn-change={data => {
                  this.detailSearch({ currPage: 1 })
                }}
                v-model={this.detailHeader.status}
              />
            )
            // return (
            //   <span>
            //     <Poptip placement="bottom">
            //       <div slot="content">
            //         <Select
            //           v-model={this.detailHeader.status}
            //           v-on:on-change={() => {
            //             this.detailSearch({ currPage: 1 });
            //           }}
            //         >
            //           <Option value="" label="全部" />
            //           <Option value="1" label="启用" />
            //           <Option value="3" label="暂停" />
            //         </Select>
            //       </div>
            //       <span class="pointer">
            //         {params.column.title}
            //         <Icon
            //           type="md-search"
            //           size="14"
            //           class={this.detailHeader.status ? "on" : ""}
            //         />
            //       </span>
            //     </Poptip>
            //   </span>
            // );
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
                      onOn-ok={() => {
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
                  onOn-popper-show={() => {
                    this.getAccountBalance(row, index)
                  }}
                >
                  <span>{row.recharge}</span>
                  <div slot="content">
                    <p>日均消费日期:{row.detail ? row.detail.date : ''}</p>
                    <p>日均消费:{row.detail ? row.detail.consumeDay : ''}</p>
                    <p>
                      {this.accountSet.balanceDay}天消费:
                      {row.detail ? row.detail.consume8day : ''}
                    </p>
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
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
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
        balanceDay: '0' // 配置时间
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
    // 表头搜索输入框函数
    renderHeaderInput (h, params) {
      let { key, title } = params.column
      return (
        <HeaderInput
          v-model={this.detailHeader[key]}
          title={title}
          onOn-search={value => {
            this.detailSearch({ [key]: value, currPage: 1 })
          }}
        />
      )
    },
    addAccount () {
      this.accountId = -1
      this.showEdit = true
    },
    editAccount ({ accountId }) {
      this.accountId = accountId
      this.showEdit = true
    },

    // 导出
    expt () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      let url = semUrl + '/AccountSogou/index?' + $qs.stringify(sendData)
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
    reload () {
      this.detailHeader = {
        text: '',
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '',
        desc: 'normal',

        accountName: '', // 账户名称
        password: '', // 密码
        token: '',
        status: '', // 状态
        date: '', // 日均消费日期，
        sum: '' // 备注

      }
    },
    getSendData (data = {}) {
      // 1.字符串字段去空格
      // 2.有值的拷贝到新对象
      // 3.模糊搜索的时候，清空其他字段，新对象只保留部分值
      // 4.非模糊搜索,才有可能表头搜索,转换逗号
      // 5 删除不必要的字段，将处理完的数据合并回源对象
      this.detailHeader = Object.assign(this.detailHeader, data)
      let sendData = {}
      for (let key in this.detailHeader) {
        let value = this.detailHeader[key]
        value = typeof value === 'string' ? value.trim() : value
        if (value) {
          sendData[key] = value
        }
      }

      // 模糊搜索，清空其他内容
      if (sendData.text) {
        this.reload(sendData.text)
        const { currPage, pageSize, text, desc, orderby } = sendData
        sendData = { currPage, pageSize, text, desc, orderby }
      }
      // 删除排序
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      delete sendData.totalCount
      this.detailHeader = Object.assign(this.detailHeader, sendData)
      return sendData
    },
    // 搜索
    detailSearch (data = {}) {
      let sendData = this.getSendData((data = {}))
      this.$axios({
        url: semUrl + '/AccountSogou/index',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          if (res.data.code === 10000) {
            const { pageContent, totalCount, balanceDay } = res.data.content
            this.tableContent = pageContent
            this.detailHeader.totalCount = totalCount
            this.accountSet.balanceDay = balanceDay
          } else {
            this.$Message.error(res.data.msg)
          }
          this.$nextTick(() => {
            track.end()
          })
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
            url: semUrl + '/AccountSogou/delAccount',
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
        url: semUrl + '/AccountSogou/getAccountBalance',
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
          url: semUrl + '/AccountSogou/saveBalanceDay',
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
