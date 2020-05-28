<template>
  <div id="semDayListBaidu">
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <Button @click="showProfitChange=true">收益调整</Button>
      <!-- 收益调整的弹窗 -->
      <Modal v-model="showProfitChange" title="收益调整" @on-ok="submitProChange">
        <Form :modal="proFitData" :label-width="100" v-if="showProfitChange">
          <FormItem label="日期">
            <DatePicker
              :options="profitOption"
              :clearable="false"
              v-model="proFitData.date"
              type="daterange"
              placeholder="成本表日期"
            />
          </FormItem>
        </Form>
      </Modal>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="推广单元、关键词、责任人"
          search
          clearable
          v-model="detailHeader.text"
          style="width:200px;margin-right:5px;"
        />
        <Button
          :icon="isFullScreen?'md-contract':'md-expand'"
          @click="handleFullScreen"
        />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}" />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="semDayListBaiduV2"
          localKey="semDayListBaiduV2"
          :defaultList="defaultList"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      key="semDayListBaidu"
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
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
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
const track = new Track('营销/百度成本表/每日')
export default {
  name: 'semDayListBaidu',
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
      loading: true,
      tableHeader: [],
      showEdit: false,
      propData: {},
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          align: 'center',
          alwaysShow: true,
          fixed: 'left',
          render: (h, { row, params, index }) => {
            if (index === this.tableContent.length - 1 || index === 0) {
              return (<span>合计</span>)
            } else {
              return (<span>{index}</span>)
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
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        v-on: on-ok={() => {
                          this.detailSearch()
                        }}
                        type="daterange"
                        v-model={this.detailHeader.timeRange}
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
                      class={this.detailHeader.timeRange.length > 0 ? 'on' : ''}
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
                      v-on: on-search={value => {
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
          title: '推广单元',
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
                      v-on: on-search={value => {
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
                      v-on: on-search={value => {
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
          title: '平均排名',
          key: 'semPosition',
          width: 110,
          align: 'center',
          sortable: 'custom'
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
          width: 140,
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
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'xzSetups',
          width: 100,
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
                        v-on: on-search={value => {
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
                        v-on: on-search={value => {
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
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        text: '', // 模糊搜索
        keyword: '', // 关键字
        keywordCheck: '', // 关键词是否精确搜索
        timeRange: [], // 时间范围
        accountName: '', // 账户名称
        groupName: '', // 推广单元
        campaignName: '', // 推广计划
        semMatch: '', // 匹配
        semClickSetup: '' // 点击安装率
      },
      showProfitChange: false, // 展示收益调整的框
      proFitData: {
        date: [moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD'),
        moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD')]
      },
      profitOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000// 减一天
        }
      }
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.setTimeRange()
    this.detailSearch()
    // window.addEventListener('scroll', this.toggleFixedTable, true)
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
      window.open(semUrl + '/CostTBaidu/day?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/CostTBaidu/day',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let list = res.data.list
          list.push(res.data.sum)
          list.unshift(res.data.sum)
          this.tableContent = Object.freeze(list)
          // this.tableContent =  res.data.list
          this.detailHeader.totalCount = Number(res.data.totalCount)
          this.$nextTick(() => {
            track.end()
          })
          // 合计放到最后一行

          // 设置表格的高度，防止出现外部滚动条
          this.setTableHeight()
          this.loading = false
        })
        .catch(err => {
          console.error(err)
          this.$Notice.warning({
            title: '数据异常，请联系技术人员'
          })
          this.loading = false
        })
    },
    // 排序
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
    // 设置日期为前一天
    setTimeRange () {
      this.detailHeader.timeRange = [
        moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD'),
        moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD')
      ]
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
        sendData.date = moment(sendData.timeRange[0]).format('YYYY-MM-DD')
        sendData.enddate = moment(sendData.timeRange[1]).format('YYYY-MM-DD')
      }
      delete sendData.timeRange
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
    // 重新加载
    reload (data = {}) {
      // 页面初始化的时候的数据
      let initData = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        timeRange: [], // 时间范围
        text: '', // 模糊搜索
        accountName: '', // 账户名称
        groupName: '', // 推广单元
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        semMatch: '', // 匹配方式
        appratio: '', // 打开安装率
        keywordCheck: '' // 关键词精确搜索
      }
      this.detailHeader = Object.assign(initData, data)
      this.setTimeRange()
      return this.detailHeader
    },
    // 保存收益调整
    submitProChange () {
      let sendData = {}
      sendData.profitStartDate = moment(this.proFitData.date[0]).format('YYYY-MM-DD')
      sendData.profitEndDate = moment(this.proFitData.date[1]).format('YYYY-MM-DD')
      this.$axios({
        url: semUrl + '/CronProfitBaidu/getProfitDay4Self',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        console.log(res)
      })
      this.$Message.success('后台处理中，约五分钟之后处理成功')
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  }
}
</script>
