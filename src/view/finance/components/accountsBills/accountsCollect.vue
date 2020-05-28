<template>
  <div id="accountsCollect">
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <DatePicker
        :editable='false'
        type="daterange"
        placeholder="选择月份查看"
        style="width: 200px"
        @on-change="detailSearch()"
        clearable
        v-model="detailHeader.timeRange"
      ></DatePicker>
      <div class="searchbar">
        <Input
          class="fuzzySearch"
          maxlength="50"
          @on-enter="() => {detailHeader.currPage = 1;detailSearch();}"
          v-model.trim="detailHeader.productCode"
          placeholder="输入产品编码"
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
               v-show="detailHeader.productCode"
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
          key="accountsCollect"
          localKey="accountsCollect"
        />
      </div>
    </div>
    <div>
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
    </div>
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
    <detailsCollect
      v-if="showDetails"
      :showDetails.sync="showDetails"
      @updataList="detailSearch"
      :id="id"
      :productCode="productCode"
      :startdate="startdate"
      :enddate="enddate"
    />
  </div>
</template>
<script>
import moment from 'moment'
import { baseUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import detailsCollect from './detailsCollect'
import { Track } from '@/libs/track.js'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import mixin from '../../mixin'
const track = new Track('财务运营中心/业务数据/应收账单')
export default {
  name: 'accountsCollect',
  components: {
    TableHeaderSetting,
    detailsCollect,
    HeaderInput,
    HeaderSelect
  },
  mixins: [mixin],
  beforeCreate () {
    track.start()
  },
  data () {
    return {
      modal: false,
      showDetails: false,
      tableHeader: [],
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 50,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '厂商名称',
          key: 'businessName',
          minWidth: 120,
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
          title: '业务类型',
          key: 'businesstype',
          minWidth: 120,
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
          title: '产品编码',
          key: 'productCode',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.detailsCollect(params.row)
                    }
                  }
                },
                params.row.productCode
              )
            ])
          }
        },
        {
          title: '期初金额',
          key: 'initialAmountCopy',
          minWidth: 110,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
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
                        v-model={this.detailHeader.initialAmountCopy}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            initialAmountCopy: value,
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
                      class={this.detailHeader.initialAmountCopy ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '本期应收',
          key: 'currentAccounts',
          minWidth: 120,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
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
                        v-model={this.detailHeader.currentAccounts}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            currentAccounts: value,
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
                      class={this.detailHeader.currentAccounts ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '本期核增',
          key: 'thisIncreased',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
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
                        v-model={this.detailHeader.thisIncreased}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            thisIncreased: value,
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
                      class={this.detailHeader.thisIncreased ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '本期核减',
          key: 'thissubtract',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
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
                        v-model={this.detailHeader.thissubtract}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            thissubtract: value,
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
                      class={this.detailHeader.thissubtract ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '本期回款',
          key: 'thiscollection',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
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
                        v-model={this.detailHeader.thiscollection}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            thiscollection: value,
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
                      class={this.detailHeader.thiscollection ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '期末金额',
          key: 'finalAmount',
          minWidth: 100,
          align: 'center',
          alwaysShow: false,
          sortable: 'custom',
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
                        v-model={this.detailHeader.finalAmount}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            finalAmount: value,
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
                      class={this.detailHeader.finalAmount ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
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
        }
      ],
      dataText: [],
      sum: {
        index: { key: 'index', value: '' },
        businessName: { key: 'businessName', value: '' },
        businesstype: { key: 'businesstype', value: '' },
        productCode: { key: 'productCode', value: '' },
        initialAmountCopy: { key: 'initialAmountCopy', value: '' },
        currentAccounts: { key: 'currentAccounts', value: '' },
        thisIncreased: { key: 'thisIncreased', value: '' },
        thissubtract: { key: 'thissubtract', value: '' },
        thiscollection: { key: 'thiscollection', value: '' },
        finalAmount: { key: 'finalAmount', value: '' },
        business: { key: 'business', value: '' },
        action: { key: 'action', value: '' }
      },
      detailHeader: {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        businessName: '', // 厂商名称
        businesstype: '', // 业务类型
        productCode: '', // 产品编码
        initialAmountCopy: '', // 起初金额
        currentAccounts: '', // 本期应收
        thisIncreased: '', // 本期核增
        thissubtract: '', // 本期核减
        thiscollection: '', // 本期贿款
        finalAmount: '', // 期末金额
        business: '', // 商务
        timeRange: [], // 付款时间范围
        condition: '' // 条件
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
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.productCode
      let data = $qs.stringify(sendData)
      window.open(baseUrl + '/accountingwarning/exportreceivable?' + data)
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
        url: baseUrl + '/accounting/sumreceivable',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        let totalInitialAmount = res.data.content.totalInitialAmount // 期初金额
        let totalCurrentAccounts = res.data.content.totalCurrentAccounts // 本期应收
        let totalIncreased = res.data.content.totalIncreased // 本期核增
        let totalsubtract = res.data.content.totalsubtract // 本期核减
        let totalCollection = res.data.content.totalCollection // 本期回款
        let totalFinalAmount = res.data.content.totalFinalAmount // 期末金额
        let sum = {
          index: { key: 'index', value: '' },
          businessName: { key: 'businessName', value: '' },
          businesstype: { key: 'businesstype', value: '' },
          productCode: { key: 'productCode', value: '合计' },
          initialAmountCopy: {
            key: 'initialAmountCopy',
            value: totalInitialAmount
          },
          currentAccounts: {
            key: 'currentAccounts',
            value: totalCurrentAccounts
          },
          thisIncreased: { key: 'thisIncreased', value: totalIncreased },
          thissubtract: { key: 'thissubtract', value: totalsubtract },
          thiscollection: { key: 'thiscollection', value: totalCollection },
          finalAmount: { key: 'finalAmount', value: totalFinalAmount },
          business: { key: 'business', value: '' },
          action: { key: 'action', value: '' }
        }
        this.$nextTick(() => {
          track.end()
        })
        this.sum = sum
      })
      this.$axios({
        url: baseUrl + '/accounting/receivable',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.dataText = res.data.content.listFinancaials
        this.detailHeader.sum = res.data.content.sum
        let startdate = res.data.content.startdate
        let enddate = res.data.content.enddate
        let timeRange = [startdate, enddate]
        this.detailHeader.timeRange = timeRange
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
      delete sendData.timeRange
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
        desc: 'normal', // 排序的方式
        businessName: '', // 厂商名称
        businesstype: '', // 业务类型
        productCode: '', // 产品编码
        initialAmountCopy: '', // 起初金额
        currentAccounts: '', // 本期应收
        thisIncreased: '', // 本期核增
        thissubtract: '', // 本期核减
        thiscollection: '', // 本期贿款
        finalAmount: '', // 期末金额
        business: '', // 商务
        timeRange: [], // 付款时间范围
        condition: '' // 条件
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 详情
    detailsCollect (v) {
      this.id = v.id
      this.productCode = v.productCode
      this.startdate = v.startdate
      this.enddate = v.enddate
      this.showDetails = true
    }
  }
}
</script>
<style lang="css" scoped>
.fuzzySearch >>> span {
  margin: 0 4px;
}
</style>
