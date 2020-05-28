<template>
  <div>
    <div class="level-three clearfix">
      <Button class="" @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="(text)=>{detailSearch({text,currPage:1})}"
          placeholder="关键词"
          search
          clearable
          v-model="detailHeader.text"
          class=""
          style="width:200px;margin-right:5px;"
        />
        <Button
          class="btns"
          :icon="isFullScreen?'md-contract':'md-expand'"
          @click="handleFullScreen"
        />
        <Button class="btns" icon="ios-loading" @click="()=>{reload();detailSearch()}"></Button>
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          :defaultList="defaultList"
          key="semHourListV2Baidu"
          localKey="semHourListV2Baidu"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      key="semHourListBaidu"
      border
    >
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
        style="float:right;"
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import { mixins } from '../tools.js'
import { Track } from '@/libs/track'
const track = new Track('营销/搜狗成本表/小时')
export default {
  name: 'semHourListBaidu',
  components: {
    TableHeaderSetting
  },
  mixins: [mixins],
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
      tableHeader: [],
      loading: true,
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          align: 'center',
          fixed: 'left',
          alwaysShow: true,
          render: (h, { row, params, index }) => {
            if (index === this.tableContent.length - 1 || index === 0) {
              return (<span>合计</span>)
            } else {
              return (<span>{ index }</span>)
            }
          }
        },
        {
          title: '关键词',
          key: 'keyword',
          align: 'center',
          minWidth: 120,
          fixed: 'left',
          alwaysShow: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Checkbox
                      true-value={'1'}
                      false-value={''}
                      v-model={this.detailHeader.keywordCheck}
                    >
                      精确搜索
                    </Checkbox>
                    <Input
                      v-model={this.detailHeader.keyword}
                      search
                      style="width:200px"
                      v-on: on-search={value => {
                        this.detailSearch({ keyword: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.keyword ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '日期',
          key: 'date',
          align: 'center',
          width: 130,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <DatePicker
                      v-on:on-ok={() => {
                        this.detailSearch({ currPage: 1 })
                      }}
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
          title: '小时',
          key: 'hour',
          align: 'center',
          sortable: 'custom',
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Checkbox
                        true-value={'2'}
                        false-value={'1'}
                        v-model={this.detailHeader.hourMergin}
                      >
                        区间合并
                      </Checkbox>
                      <TimePicker
                        v-on:on-ok={() => {
                          this.detailSearch({ currPage: 1 })
                        }}
                        type="timerange"
                        v-model={this.detailHeader.timeRange}
                        placement="bottom-end"
                        placeholder="Select time"
                        style="width: 168px"
                        confirm
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.timeRange.length > 1 ? 'on' : ''}
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
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.accountName}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ currPage: 1 })
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
          title: '推广组',
          key: 'groupName',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.groupName}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ groupName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.groupName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.campaignName}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ campaignName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.campaignName ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '匹配',
          key: 'semMatch',
          align: 'center',
          width: 80,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.semMatch}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ semMatch: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.semMatch ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '点击安装率',
          key: 'semClickSetup',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="安装数/点击数\n橙色：40%=<点击安装率<50%\n红色：小于40%"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.semClickSetupColor(row.semClickSetup)}>{row.semClickSetup}</span>
            )
          }
        },
        {
          title: '出价',
          key: 'semPrice',
          width: 80,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '平均出价',
          key: 'semAvgprice',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '最大出价',
          key: 'profitMaxprice',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="单位收益*利润系数*返点*点击安装率\n橙色：0.22<=最大出价<0.3\n红色：0.22以下"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.profitMaxpriceColor(row.profitMaxprice)}>{row.profitMaxprice}</span>
            )
          }
        },
        {
          title: '展现点击率',
          key: 'semClickView',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="点击数/展示数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '盈亏',
          key: 'profitInout',
          width: 80,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="单位收益*利润系数-成本\n橙色：收益>=成本>收益*利润系数\n红色：收益<成本"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.profitInoutColor(row.profitInout, row.profitIn)}>{row.profitInout}</span>
            )
          }
        },
        {
          title: '成本',
          key: 'semCost',
          width: 80,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="总费用/安装数/返点" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '单位收益',
          key: 'profitPer',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="推广软件收益+换包收益+导航收益+收藏夹收益+信息流收益+其他收益\n橙色：0.2=<单位收益<0.4\n红色：单位收益<0.2"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.profitPerColor(row.profitPer)}>{row.profitPer}</span>
            )
          }
        },
        {
          title: '换包收益',
          key: 'profitChg',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '利润',
          key: 'profitIn',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="(单位收益*安装数)-(总费用/返点)\n红色：利润<0"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.profitInColor(row.profitIn)}>{row.profitIn}</span>
            )
          }
        },
        {
          title: '利润率',
          key: 'profitInradio',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="利润/(单位收益*安装数)\n红色：利润率<0"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.profitInradioColor(row.profitInradio)}>{row.profitInradio}</span>
            )
          }
        },

        {
          title: '推荐软件',
          key: 'xzSofttj',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="平均每次安装推荐软件个数\n橙色：2<=推荐软件<2.5\n红色：推荐软件<2" class="pointer">
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.xzSofttjColor(row.xzSofttj)}>{row.xzSofttj}</span>
            )
          }
        },
        {
          title: '展示数',
          key: 'semViews',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '点击数',
          key: 'semClicks',
          width: 90,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'xzSetups',
          width: 90,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="红色：安装量<5" class="pointer">
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.xzSetupsColor(row.xzSetups)}>{row.xzSetups}</span>
            )
          }
        },
        {
          title: '总费用',
          key: 'semTotalCost',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '软件ID',
          key: 'xzSoftid',
          width: 120,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.xzSoftid}
                        search
                        clearable
                        v-on:on-search={value => {
                          this.detailSearch({ xzSoftid: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.sixzSoftidd ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          },
          render: (h, { row, column, index }) => {
            return (
              <a href={row.semUrl} target="_blank" title="打开页面">
                <span class="pointer">{row.xzSoftid}</span>
              </a>
            )
          }
        },
        {
          title: '渠道号',
          key: 'xzAppid',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.xzAppid}
                        search
                        clearable
                        v-on:on-search={value => {
                          this.detailSearch({ xzAppid: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.xzAppid ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '打开安装率',
          key: 'xzOpenSetup',
          width: 150,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="下载器安装数/下载器打开数\n橙色：40%=<打开安装率<50%\n红色：40%以下"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, column, index }) => {
            return (
              <span class={this.xzOpenSetupColor(row.xzOpenSetup)}>{row.xzOpenSetup}</span>
            )
          }
        }
      ],
      tableContent: [],
      detailHeader: {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        date: '',
        hour: '',
        text: '', // 模糊搜索内容
        accountName: '', // 账户名称
        groupName: '', // 推广组
        user: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        showid: '', // 模板id
        sid: '', // 软件id
        appId: '',
        timeRange: [], // 小时时间范围
        hourMergin: '1', // 是否区间合并
        keywordCheck: '' // 关键词精确搜索
      }
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.setTimeRange()
    this.detailSearch()
  },
  methods: {
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/CostTBaidu/hour?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/CostTBaidu/hour',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let list = res.data.list
          let sum = res.data.sum
          list.push(sum)
          list.unshift(sum)

          this.detailHeader.totalCount = Number(res.data.totalCount)
          this.tableContent = list
          // 设置表格的高度，防止出现外部滚动条
          this.setTableHeight()
          this.loading = false
          this.$nextTick(() => {
            track.end()
          })
        })
        .catch(err => {
          console.error(err)
          this.$Notice.warning({
            title: '数据异常，请联系技术人员'
          })
          this.loading = false
        })
    },
    sortChange (column) {
      // 降序  "desc"
      let orderby = column.key
      let desc = column.order
      this.detailSearch({ orderby, desc })
      this.detailHeader.orderby = column.key
      this.detailHeader.desc = column.order
    },
    // 设置Table的高度
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 设置日期为当前
    setTimeRange () {
      this.detailHeader.date = moment().format('YYYY-MM-DD')
      // 整点的15分钟以后，当前前一小时和当前小时，如8:16,获取7点和8点的
      // 整点的15分钟之前，当前前两个小时和前一小时，如8:14，获取6点到7点
      if (new Date().getMinutes() > 15) {
        this.detailHeader.timeRange = [
          moment()
            .subtract(1, 'hours')
            .format('HH:00:00'),
          moment().format('HH:00:00')
        ]
      } else {
        this.detailHeader.timeRange = [
          moment()
            .subtract(2, 'hours')
            .format('HH:00:00'),
          moment()
            .subtract(1, 'hours')
            .format('HH:00:00')
        ]
      }
    },
    // 设置全屏
    handleFullScreen () {
      this.$emit('update:isFullScreen', !this.isFullScreen)
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
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
      if (sendData.text) {
        // 清空搜索
        this.reload()
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      } else {
        sendData.date = moment(sendData.date).format('YYYY-MM-DD')
        sendData.startHour = sendData.timeRange[0]
        sendData.endHour = sendData.timeRange[1]
      }
      delete sendData.totalCount
      delete sendData.timeRange
      sendData = Object.assign(sendData, data)
      // 如果排序清空，不需要带排序条件
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      this.detailHeader.currPage = sendData.currPage
      return sendData
    },
    // 重新加载
    reload (data = {}) {
      let initData = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        timeRange: [],
        date: '',
        text: '', // 模糊搜索内容
        accountName: '', // 账户名称
        groupName: '', // 推广组
        user: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        showid: '', // 模板id
        sid: '', // 软件id
        appId: '',
        hourMergin: '1', // 区间合并
        keywordCheck: '' // 关键词精确搜索
      }
      this.detailHeader = Object.assign(initData, data)
      this.setTimeRange()
      return this.detailHeader
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  }
}
</script>
