<template>
  <div id="dailyCostTracking">
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          class="fuzzySearch"
          maxlength="50"
          @on-enter="() => {detailHeader.currPage = 1;detailSearch();}"
          v-model.trim="detailHeader.Channel"
          placeholder="输入站群/渠道名称"
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
          key="dailyCostTracking"
          localKey="dailyCostTracking"
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
          @click="editDailyCost(row)"
          v-if="permission.day_edit"
          >编辑</Button
        >
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        size="small"
        :total="detailHeader.sum"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20, 50, 100]"
        show-elevator
        show-sizer
        show-total
        @on-change="
          currPage => {
            detailSearch({currPage});
          }
        "
        @on-page-size-change="
          pageSize => {
            detailSearch({pageSize});
          }
        "
      />
    </div>
    <editDailyCost
      v-if="showEdit"
      :showEdit.sync="showEdit"
      @updataList="detailSearch"
      :id="id"
    />
  </div>
</template>
<script>
import moment from 'moment'
import editDailyCost from './editDailyCost'
import TableHeaderSetting from '_c/table-header-setting'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import { baseUrl } from '@/api/base.js'
import { Track } from '@/libs/track.js'
import mixin from '../../mixin'
const track = new Track('财务运营中心/业务数据/日成本跟踪表')
export default {
  name: 'dailyCostTracking',
  components: {
    TableHeaderSetting,
    editDailyCost,
    HeaderInput,
    HeaderSelect
  },
  mixins: [mixin],
  data () {
    return {
      showEdit: false,
      tableHeader: [],
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          minwidth: 60,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '渠道/站群',
          key: 'channelName',
          minWidth: 70,
          align: 'center',
          alwaysShow: false,
          sortable: true
        },
        {
          title: '日期',
          key: 'date',
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
                        value={this.detailHeader.timeRange}
                        placement="bottom-start"
                        placeholder="输入时间"
                        onOn-change={value => {
                          this.detailHeader.timeRange = value
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
          title: '付款方式',
          key: 'methodName',
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
                      <Select
                        clearable
                        v-model={this.detailHeader.methodName}
                        onOn-change={value => {
                          this.detailSearch({
                            methodName: value,
                            currPage: 1
                          })
                        }}
                      >
                        <Option value="单价计费">单价计费</Option>
                        <Option value="包月付款">包月付款</Option>
                      </Select>
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.methodName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '当日成本',
          key: 'cost',
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
                        v-model={this.detailHeader.cost}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            cost: value,
                            condition: this.detailHeader.condition,
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
                      class={this.detailHeader.cost ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          },
          render: (h, params) => {
            if (params.row.estimate) {
              return h(
                'span',
                {
                  style: {
                    color: 'blue'
                  }
                },
                params.row.cost
              )
            } else {
              return h('span', {}, params.row.cost)
            }
          }
        },
        {
          title: '安装量',
          key: 'all',
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
                        v-model={this.detailHeader.all}
                        type="number"
                        clearable
                        slot="content"
                        search
                        placeholder="请输入金额"
                        onOn-search={value => {
                          this.detailSearch({
                            all: value,
                            condition: this.detailHeader.condition,
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
                      class={this.detailHeader.all ? 'on' : ''}
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
              <span>
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
                            condition: this.detailHeader.condition,
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
          title: '操作',
          key: 'action',
          slot: 'action',
          minWidth: 120,
          align: 'center',
          alwaysShow: false
        }
      ],
      detailHeader: {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        Channel: '', // 模糊搜索
        orderby: '', // 根据什么字段排序
        desc: '', // 排序的方式
        channelName: '', // 站群/渠道
        timeRange: [], // 付款时间范围
        stations: '', // 所属站群
        methodName: '', // 付款方式
        cost: '', // 当日成本
        all: '', // 安装量
        unitPrice: '', // 单价
        condition: '' // 查询条件
      },
      dataText: [],
      sum: {},
      id: 1,
      isFullScreen: false
    }
  },
  mounted () {
    this.detailSearch()
    this.setTableHeight()
  },
  beforeCreate () {
    track.start()
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
      window.open(baseUrl + '/accountingwarning/exportcosttracking?' + data)
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
        url: baseUrl + '/accounting/costtracking',
        data: $qs.stringify(sendData),
        method: 'post'
      }).then(res => {
        this.dataText = res.data.content.costTrackList
        this.detailHeader.sum = res.data.content.sum
        let estimateSum = res.data.content.estimateSum // 预估成本合计
        let totalSum = res.data.content.totalSum // 成本合计
        let sum = {
          index: '',
          channelName: '',
          date: { key: 'date', value: '预估成本合计' },
          methodName: { key: 'methodName', value: estimateSum },
          cost: { key: 'cont', value: '成本合计' },
          all: { key: 'all', value: totalSum },
          unitPrice: '',
          action: ''
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
        sendData.startTime = moment(sendData.timeRange[0]).format('YYYY-MM-DD')
        sendData.endTime = moment(sendData.timeRange[1]).format('YYYY-MM-DD')
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
    // 清空表头
    reload (data = {}) {
      let initData = {
        sum: 0,
        pageSize: 20,
        currPage: 1,
        Channel: '', // 模糊搜索
        orderby: '', // 根据什么字段排序
        desc: '', // 排序的方式
        channelName: '', // 站群/渠道
        timeRange: [], // 付款时间范围
        stations: '', // 所属站群
        methodName: '', // 付款方式
        cost: '', // 当日成本
        all: '', // 安装量
        unitPrice: '', // 单价
        condition: '' // 查询条件
      }
      this.detailHeader = Object.assign(initData, data)
      return this.detailHeader
    },
    // 编辑
    editDailyCost ({ id }) {
      this.id = id
      this.showEdit = true
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
