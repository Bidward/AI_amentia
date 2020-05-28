<template>
  <div id="receiptBills">
    <div class="level-three clearfix">
      <Button
        type="primary"
        class="btns"
        @click="addReceipt()"
        v-if="permission.receivable_create"
        >新增</Button
      >
      <!-- <Button @click="exportExcel">导出</Button> -->
      <div class="searchbar">
        <DatePicker
          :editable='false'
          type="daterange"
          placeholder="选择日期搜索"
          style="width: 200px;margin-right:5px;"
          @on-change="detailSearch()"
          clearable
          v-model="detailHeader.timeRange"
        />
        <Button
          :icon="isFullScreen ? 'md-contract' : 'md-expand'"
          @click="handleFullScreen"
        />
        <Button
          icon="ios-loading"
          @click="
            () => {
              reload();
              detailSearch();
            }
          "
        />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="receiptBills"
          localKey="receiptBills"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="dataText"
      border
      show-summary
      :max-height="tableHeight"
      :summary-method="handleSummary"
      @on-sort-change="sortChange"
    >
      <template slot-scope="{ row, index }" slot="action">
        <Button
          class="btns"
          type="primary"
          size="small"
          @click="editReceipt(row)"
          v-if="permission.receivable_edit"
          >编辑</Button
        >
        <Button
          class="btns"
          type="error"
          size="small"
          @click="deleteReceipt(row)"
          >刪除</Button
        >
        <Button
          class="btns"
          @click="detailsReceipt(row)"
          size="small"
          v-if="permission.receivable_allocatio"
          >分配</Button
        >
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        :total="detailHeader.sum"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20, 50, 100]"
        size="small"
        show-total
        show-elevator
        show-sizer
        @on-change="
          currPage => {
            detailHeader.currPage = currPage;
            detailSearch();
          }
        "
        @on-page-size-change="
          pageSize => {
            detailHeader.pageSize = pageSize;
            detailSearch();
          }
        "
      />
    </div>
    <editReceipt
      v-if="showEdit"
      :showEdit.sync="showEdit"
      @updataList="detailSearch"
      :id="id"
    />
    <addReceipt
      v-if="showEditAdd"
      :showEditAdd.sync="showEditAdd"
      @updataList="detailSearch"
    />
    <detailsReceipt
      v-if="showDetails"
      :showDetails.sync="showDetails"
      @updataList="detailSearch"
      :id="id"
    />
  </div>
</template>
<script>
import { baseUrl } from '@/api/base.js'
import editReceipt from './editReceipt'
import addReceipt from './addReceipt'
import detailsReceipt from './detailsReceipt'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import mixin from '../../mixin'
export default {
  name: 'receiptBills',
  components: {
    TableHeaderSetting,
    editReceipt,
    addReceipt,
    detailsReceipt,
    HeaderInput,
    HeaderSelect
  },
  mixins: [mixin],
  data () {
    return {
      showEdit: false,
      showEditAdd: false,
      showDetails: false,
      tableHeader: [],
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          minWidth: 50,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '收款时间',
          key: 'paydate',
          minWidth: 80,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        editable={false}
                        type="daterange"
                        clearable
                        value={this.detailHeader.timeRange2}
                        placement="bottom-start"
                        placeholder="输入时间"
                        onOn-change={value => {
                          this.detailHeader.timeRange2 = value
                          this.detailSearch({ currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.timeRange.length > 0 ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '开票时间',
          key: 'publishtime',
          minWidth: 130,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        editable={false}
                        type="daterange"
                        clearable
                        value={this.detailHeader.timeRange1}
                        placement="bottom-start"
                        placeholder="输入时间"
                        onOn-change={value => {
                          this.detailHeader.timeRange1 = value
                          this.detailSearch({ currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={
                        this.detailHeader.timeRange1.length > 0 ? 'on' : ''
                      }
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '厂商名称',
          key: 'businessName',
          minWidth: 130,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.detailSearch()
                }}
              ></HeaderInput>
            )
          }
        },
        {
          title: '收款金额',
          key: 'moneyCopy',
          minWidth: 80,
          align: 'center',
          sortable: true,
          alwaysShow: false,
          renderHeader: (h, params) => {
            return (
              <span style="width:200px">
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Select
                        v-model={this.detailHeader.condition}
                        style="width:30%;margin-top:0px"
                        placeholder="请输入条件"
                      >
                        <Option value="1">&gt;</Option>
                        <Option value="2">&lt;</Option>
                        <Option value="3">=</Option>
                        <Option value="4">&le;</Option>
                        <Option value="5">&ge;</Option>
                        <Option value="6">!=</Option>
                      </Select>
                      <Input
                        style="width:70%"
                        v-model={this.detailHeader.moneyCopy}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            moneyCopy: value,
                            currPage: 1
                          })
                        }}
                        onOn-clear={() => {
                          this.detailSearch({ currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.moneyCopy ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '账户名称',
          key: 'accountName',
          minWidth: 140,
          align: 'center',
          sortable: true,
          alwaysShow: false,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.detailSearch()
                }}
              ></HeaderInput>
            )
          }
        },
        {
          title: '收款账号',
          key: 'account',
          minWidth: 100,
          align: 'center',
          sortable: true,
          alwaysShow: false,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.detailSearch()
                }}
              ></HeaderInput>
            )
          }
        },
        {
          title: '商务',
          key: 'business',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.detailSearch()
                }}
              ></HeaderInput>
            )
          }
        },
        {
          title: '备注',
          key: 'remarks',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                clearable={false}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
                onOn-clear={() => {
                  this.detailHeader[key] = ''
                  this.detailSearch()
                }}
              ></HeaderInput>
            )
          }
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          minWidth: 140,
          align: 'center',
          alwaysShow: false
        }
      ],
      dataText: [],
      sum: {},
      detailHeader: {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: '', // 排序的方式
        businessName: '', // 厂商名称
        timeRange: [], // 付款时间范围
        timeRange1: [], // 开票时间范围
        timeRange2: [], // 收款时间范围
        moneyCopy: '', // 收款金额
        accountName: '', // 账户名称
        account: '', // 收款账号
        business: '', // 商务
        remarks: ''// 备注
      },
      id: 1,
      isFullScreen: false
    }
  },
  mounted () {
    this.detailSearch()
    this.setTableHeight()
  },
  methods: {
    // 导出
    exportExcel () {},
    // 排序
    sortChange (column) {
      let orderby = column.key
      let desc = column.order
      this.detailSearch({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 搜索
    detailSearch (data = {}) {
      let sendData = this.getSendData(data)
      this.$axios({
        url: baseUrl + '/accounting/receipt',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        this.dataText = res.data.content.listFinancaials
        this.detailHeader.sum = res.data.content.sum
        let startdate = res.data.content.startdate
        let enddate = res.data.content.enddate
        let timeRange = [startdate, enddate]
        this.detailHeader.timeRange = timeRange
        let totalSum = res.data.content.totalSum // 金额合计
        let sum = {
          index: '',
          paydate: '',
          publishtime: '',
          businessName: { key: 'businessName', value: '合计：' },
          moneyCopy: { key: 'moneyCopy', value: totalSum },
          accountName: '',
          account: '',
          business: '',
          remarks: '',
          action: ''
        }
        this.sum = sum
      })
      this.setTableHeight()
    },
    // 总计
    handleSummary () {
      return this.sum
    },
    // 获取需要发送的数据的数值
    getSendData (data) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let sendData = {}
      // 非空字符串
      let hasValueKeys = keys.filter(e => {
        return me.detailHeader[e] !== ''
      })
      // 拷贝到sendData
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
      }
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      if (sendData.productCode) {
        // 清空搜索
        this.reload()
        sendData.productCode = sendData.productCode.trim()
        this.detailHeader.productCode = sendData.productCode
      }
      if (sendData.timeRange[1]) {
        sendData.startdate = moment(sendData.timeRange[0]).format('YYYY-MM-DD')
        sendData.enddate = moment(sendData.timeRange[1]).format('YYYY-MM-DD')
      }
      if (sendData.timeRange1[1]) {
        sendData.paymentStartTime = moment(sendData.timeRange1[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        sendData.paymentEndTime = moment(sendData.timeRange1[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      if (sendData.timeRange2[1]) {
        sendData.startdate1 = moment(sendData.timeRange2[0]).format(
          'YYYY-MM-DD'
        )
        sendData.enddate1 = moment(sendData.timeRange2[1]).format('YYYY-MM-DD')
      }
      delete sendData.timeRange
      delete sendData.timeRange1
      delete sendData.timeRange2
      delete sendData.sum
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    reload (data = {}) {
      let initData = {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: '', // 排序的方式
        businessName: '', // 厂商名称
        timeRange: [], // 付款时间范围
        timeRange1: [], // 开票时间范围
        timeRange2: [], // 收款时间范围
        moneyCopy: '', // 收款金额
        accountName: '', // 账户名称
        account: '', // 收款账号
        business: '', // 商务
        remarks: ''// 备注
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 编辑
    editReceipt ({ id }) {
      this.id = id
      this.showEdit = true
    },
    // 新增
    addReceipt () {
      this.showEditAdd = true
    },
    // 详情
    detailsReceipt ({ id }) {
      this.id = id
      this.showDetails = true
    },
    // 删除
    deleteReceipt (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否删除${row.businessName}`,
        onOk: () => {
          this.$axios({
            url: baseUrl + '/accounting/detreceipt',
            data: $qs.stringify({ id: row.id }),
            method: 'post'
          }).then(res => {
            if (res.data.code === 10000) {
              this.$Message.success(res.data.msg)
              this.detailSearch()
            }
          })
        }
      })
    }
  },
  computed: {
    permission () {
      return this.$store.state.user.userpermission.finance
    }
  }
}
</script>
