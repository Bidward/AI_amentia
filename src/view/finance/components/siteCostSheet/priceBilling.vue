<template>
  <!--单价计费-->
  <div id="priceBilling">
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <Upload
        ref="upload"
        style="display:inline"
        name="file"
        accept=".xlsx, .xls, .cvs"
        :format="['xlsx', 'xls', 'cvs']"
        :action="baseUrl + '/importcostTrack'"
        :show-upload-list="false"
        :with-credentials="true"
        :on-success="uploadSuccess"
        v-if="permission.cost_import"
      >
        <Button class="btns">导入</Button>
      </Upload>
      <div class="searchbar">
        <Input
          maxlength="50"
          @on-search="
            () => {
              detailHeader.currPage = 1;
              detailSearch();
            }
          "
          v-model="detailHeader.Channel"
          placeholder="输入渠道/站群名称"
          search
          clearable
          @on-clear="
            () => {
              detailSearch();
            }
          "
          style="width:200px;margin-right:5px;"
        />
        <Button
          :icon="isFullScreen ? 'md-contract' : 'md-expand'"
          @click="handleFullScreen"
        />
        <Button
          class="btns"
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
          key="priceBilling"
          localKey="priceBilling"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="dataText"
      border
      show-summary
      :height="tableHeight"
      :summary-method="handleSummary"
      @on-sort-change="sortChange"
    >
      <template slot-scope="{ row, index }" slot="action">
        <Button
          class="btns"
          type="primary"
          size="small"
          @click="editBilling(row)"
          v-if="permission.cost_edit"
          >编辑</Button
        >
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        :total="detailHeader.sum"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20, 50, 100]"
        show-total
        size="small"
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
    <editBilling
      v-if="showEdit"
      :showEdit.sync="showEdit"
      @updataList="detailSearch"
      :id="id"
    />
  </div>
</template>
<script>
import moment from 'moment'
import editBilling from './editBilling'
import { baseUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
export default {
  name: 'priceBilling',
  components: {
    TableHeaderSetting,
    editBilling
  },
  props: {
    isFullScreen: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      baseUrl: baseUrl,
      showEdit: false,
      tableHeader: [],
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 60,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '站群/渠道',
          key: 'channelName',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: true
        },
        {
          title: '付款时间',
          key: 'paymentTime',
          minWidth: 120,
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
                        onOn-ok={() => {
                          this.detailSearch()
                        }}
                        onOn-clear={() => {
                          this.detailHeader.timeRange = [null, null]
                          this.detailSearch({ currPage: 1 })
                        }}
                        type="daterange"
                        v-model={this.detailHeader.timeRange}
                        confirm
                        clearable
                        placement="bottom-start"
                        placeholder="输入时间"
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
          title: '付款金额',
          key: 'paymentAmount',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: true,
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
                        v-model={this.detailHeader.paymentAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            paymentAmount: value,
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
                      class={this.detailHeader.paymentAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '结算周期',
          key: 'timeSpan',
          minWidth: 150,
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
                        onOn-ok={() => {
                          this.detailSearch()
                        }}
                        onOn-clear={() => {
                          this.detailHeader.timeRange1 = [null, null]
                          this.detailSearch({ currPage: 1 })
                        }}
                        clearable
                        type="daterange"
                        v-model={this.detailHeader.timeRange1}
                        confirm
                        placement="bottom-start"
                        placeholder="输入时间"
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
          },
          render: (h, params) => {
            let { startTime, endTime } = params.row
            let str = `${startTime}~${endTime}`
            return <span>{str}</span>
          }
        },
        {
          title: '结算金额',
          key: 'settlementAmount',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: true,
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
                        v-model={this.detailHeader.settlementAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            settlementAmount: value,
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
                      class={this.detailHeader.settlementAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '单价',
          key: 'unitPrice',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: true,
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
                        v-model={this.detailHeader.unitPrice}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            unitPrice: value,
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
                      class={this.detailHeader.unitPrice ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '修正金额',
          key: 'revisedAmount',
          minWidth: 120,
          align: 'center',
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
                        v-model={this.detailHeader.revisedAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            revisedAmount: value,
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
                      class={this.detailHeader.revisedAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '修正原因',
          key: 'cause',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.cause}
                        clearable
                        slot="content"
                        search
                        onOn-search={value => {
                          this.detailSearch({
                            cause: value,
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
                      class={this.detailHeader.cause ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '编辑',
          key: 'action',
          slot: 'action',
          minWidth: 120,
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
        Channel: '', // 模糊搜索
        channelName: '', // 站群/渠道
        timeRange: [], // 付款时间范围
        timeRange1: [] // 结算周期
      },
      id: 1
    }
  },
  mounted () {
    this.detailSearch()
  },
  methods: {
    // 设置全屏
    handleFullScreen () {
      this.$emit('update:isFullScreen', !this.isFullScreen)
    },
    // 设置Table的高度
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 导入
    uploadSuccess (res) {
      if (res.code === 10000) {
        this.$Message.success(res.msg)
        this.detailSearch()
      } else {
        this.$Message.error(res.msg)
      }
    },
    // 导出
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.Channel
      let data = $qs.stringify(sendData)
      window.open(baseUrl + '/accountingwarning/exportunitprice?' + data)
    },
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
        url: baseUrl + '/accounting/unitprice',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        this.dataText = res.data.content.unitPriceList
        this.detailHeader.sum = res.data.content.sum
        let totalSumSame = res.data.content.totalPayment // 付款总计
        let totalSettlement = res.data.content.totalSettlement // 结算总计
        let surplusAmount = res.data.content.surplusAmount // 剩余金额
        let totalCorrection = res.data.content.totalCorrection // 修正合计
        let sum = {
          index: '',
          channelName: { key: 'channelName', value: '付款总计' },
          paymentTime: { key: 'paymentTime', value: totalSumSame },
          paymentAmount: { key: 'paymentAmount', value: '结算总计' },
          timeSpan: { key: 'timeSpan', value: totalSettlement },
          settlementAmount: { key: 'settlementAmount', value: '剩余金额' },
          unitPrice: { key: 'unitPrice', value: surplusAmount },
          revisedAmount: { key: 'revisedAmount', value: '修正合计' },
          cause: { key: 'cause', value: totalCorrection },
          action: ''
        }
        this.sum = sum
      })
      this.setTableHeight()
    },
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
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      // 如果是模糊搜索
      if (sendData.Channel) {
        // 清空搜索
        this.reload()
        sendData.Channel = sendData.Channel.trim()
        this.detailHeader.Channel = sendData.Channel
      } else if (sendData.timeRange[1]) {
        sendData.paymentStartTime = moment(sendData.timeRange[0]).format(
          'YYYY-MM-DD'
        )
        sendData.paymentEndTime = moment(sendData.timeRange[1]).format(
          'YYYY-MM-DD'
        )
      } else if (sendData.timeRange1[1]) {
        sendData.paymentStartTime1 = moment(sendData.timeRange1[0]).format(
          'YYYY-MM-DD'
        )
        sendData.paymentEndTime1 = moment(sendData.timeRange1[1]).format(
          'YYYY-MM-DD'
        )
      }
      delete sendData.timeRange
      delete sendData.timeRange1
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
    // 清空搜索条件
    reload (data = {}) {
      // 页面初始化的时候的数据
      let initData = {
        totalCount: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        Channel: '', // 模糊搜索
        channelName: '', // 站群/渠道
        timeRange: [], // 付款时间范围
        timeRange1: [] // 付款时间范围
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 编辑
    editBilling ({ id }) {
      this.id = id
      this.showEdit = true
    }
  },
  computed: {
    permission () {
      return this.$store.state.user.userpermission.finance
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  }
}
</script>
