<template>
  <div id="monthlyPayment">
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
          class="fuzzySearch"
          maxlength="50"
          @on-enter="() => {detailHeader.currPage = 1;detailSearch();}"
          v-model="detailHeader.Channel"
          placeholder="输入渠道/站群名称"
          style="width:200px;margin-right:5px;"
        >
          <Icon
             class="pointer"
             @click="()=>{detailHeader.currPage=1;detailSearch()}"
             type="ios-search"
             slot="suffix"
          />
          <Icon
             class="pointer"
             type="ios-close-circle-outline"
             slot="suffix"
             v-show="detailHeader.Channel"
             @click="()=>{reload(0);detailSearch()}"
           />
        </Input>
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
          key="monthlyPayment"
          localKey="monthlyPayment"
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
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import { Track } from '@/libs/track.js'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import mixin from '../../mixin'
const track = new Track('财务运营中心/业务数据/站点成本表')
export default {
  name: 'monthlyPayment',
  components: {
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect
  },
  mixins: [mixin],
  beforeCreate () {
    track.start()
  },
  data () {
    return {
      baseUrl: baseUrl,
      month: '',
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
          title: '到款时间',
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
                        editable={false}
                        type="daterange"
                        clearable
                        onOn-change={value => {
                          this.detailHeader.timeRangeTime = value
                          this.detailSearch()
                        }}
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
          title: '站群/渠道',
          key: 'channelName',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: true
        },
        {
          title: '账期',
          key: 'timeSpan',
          minWidth: 150,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          render: (h, params) => {
            let { startTime, endTime } = params.row
            let str = `${startTime}~${endTime}`
            return <span>{str}</span>
          },
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        editable={false}
                        onOn-change={value => {
                          this.detailHeader.timeRange = value
                          this.detailSearch({ currPage: 1 })
                        }}
                        clearable
                        type="daterange"
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
          title: '天数',
          key: 'duration',
          minWidth: 70,
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
                        v-model={this.detailHeader.duration}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            duration: value,
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
                      class={this.detailHeader.duration ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '金额',
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
          title: '月前成本',
          key: 'paymentAgo',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          renderHeader: (h, params) => {
            let month = this.month
            let str = month + `月前成本`
            return h('span', str)
          }
        },
        {
          title: '月后本',
          key: 'paymentSame',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          renderHeader: (h, params) => {
            let month = this.month
            let str = month + `月成本`
            return h('span', str)
          }
        },
        {
          title: '月后成本',
          key: 'paymentAfter',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          renderHeader: (h, params) => {
            let month = this.month
            let str = month + `月后成本`
            return h('span', str)
          }
        },
        {
          title: '商务',
          key: 'business',
          minWidth: 120,
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
        }
      ],
      dataText: [],
      sum: {},
      detailHeader: {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        month: '', // 表头月份
        orderby: '', // 根据什么字段排序
        desc: '', // 排序的方式
        timeRange: [], // 付款时间范围
        Channel: '', // 模糊搜索
        channelName: '', // 站群/渠道
        business: '', // 商务
        timeSpan: '', // 账期
        timeRangeTime: [] // 到款时间
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
      delete sendData.productCode
      let data = $qs.stringify(sendData)
      window.open(baseUrl + '/accountingwarning/exportsubscription?' + data)
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
        url: baseUrl + '/accounting/subscription',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        this.dataText = res.data.content.subscriptionList
        this.detailHeader.sum = res.data.content.sum
        this.month = res.data.content.month
        let totalSum = res.data.content.totalSum // 合计金额
        let totalSumAgo = res.data.content.totalSumAgo // 月前成本
        let totalSumSame = res.data.content.totalSumSame // 月成本
        let totalSumAfter = res.data.content.totalSumAfter // 月后成本
        let sum = {
          index: '',
          paymentTime: '',
          channelName: '',
          timeSpan: '',
          duration: { key: 'duration', value: '合计金额' },
          paymentAmount: { key: 'paymentAmount', value: totalSum },
          paymentAgo: { key: 'paymentAgo', value: totalSumAgo },
          paymentSame: { key: 'paymentSame', value: totalSumSame },
          paymentAfter: { key: 'paymentAfter', value: totalSumAfter },
          business: ''
        }
        this.$nextTick(() => {
          track.end()
        })
        this.sum = sum
      })
      this.setTableHeight()
    },
    // 合计
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
      if (sendData.Channel) {
        // 清空搜索
        this.reload()
        sendData.Channel = sendData.Channel.trim()
        this.detailHeader.Channel = sendData.Channel
      } else if (sendData.timeRange[1]) {
        sendData.startTime = moment(sendData.timeRange[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(sendData.timeRange[1]).format('YYYY-MM-DD')
      } else if (sendData.timeRangeTime[1]) {
        sendData.paymentStartTime = moment(sendData.timeRangeTime[0]).format(
          'YYYY-MM-DD'
        )
        sendData.paymentEndTime = moment(sendData.timeRangeTime[1]).format(
          'YYYY-MM-DD'
        )
      }

      delete sendData.timeRange
      delete sendData.timeRangeTime
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
      let initData = {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        month: '', // 表头月份
        orderby: '', // 根据什么字段排序
        desc: '', // 排序的方式
        timeRange: [], // 付款时间范围
        Channel: '', // 模糊搜索
        channelName: '', // 站群/渠道
        business: '', // 商务
        timeSpan: '', // 账期
        timeRangeTime: [] // 到款时间
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    }
  },
  computed: {
    permission () {
      return this.$store.state.user.userpermission.finance
    }
  }
}
</script>
<style lang="css" scoped>
.fuzzySearch >>> span {
  margin: 0 4px;
}
</style>
