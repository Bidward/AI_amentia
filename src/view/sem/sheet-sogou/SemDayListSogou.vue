<template>
  <div id="semDayListSogou">
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
          @on-search="(text)=>{detailSearch({text,currPage:1})}"
          placeholder="关键词"
          search
          clearable
          v-model="detailHeader.text"
          style="width:200px;margin-right:5px;"
        />
        <Button :icon="isFullScreen?'md-contract':'md-expand'" @click="handleFullScreen" />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}" />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          :defaultList="defaultList"
        />
      </div>
    </div>
      <!-- :summary-method="handleSummary" -->
      <!-- show-summary -->
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      key="semDayListSogou"
    />
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
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import { HeaderInput } from '_c/table-header-search'
import { mixins } from '../tools.js'
import { Track } from '@/libs/track'
const track = new Track('营销/搜狗成本表/每日')
export default {
  name: 'semDayListSogou',
  components: {
    TableHeaderSetting,
    HeaderInput
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
      // sum: {},
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          // type: 'index',
          align: 'center',
          alwaysShow: true,
          fixed: 'left',
          render: (h, { row, params, index }) => {
            if (index === this.tableContent.length - 1 || index === 0) {
              return <span>合计</span>
            } else {
              return <span>{index}</span>
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
                      v-on:on-search={value => {
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
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <DatePicker
                        onOn-ok={() => {
                          this.detailSearch()
                        }}
                        transfer={false}
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
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '推广组',
          key: 'groupName',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '匹配',
          key: 'semMatch',
          align: 'center',
          width: 80,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
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
              <span class={this.semClickSetupColor(row.semClickSetup)}>
                {row.semClickSetup}
              </span>
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
              <span class={this.profitMaxpriceColor(row.profitMaxprice)}>
                {row.profitMaxprice}
              </span>
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
              <span
                class={this.profitInoutColor(row.profitInout, row.profitIn)}
              >
                {row.profitInout}
              </span>
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
              <span class={this.profitPerColor(row.profitPer)}>
                {row.profitPer}
              </span>
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
              <span class={this.profitInColor(row.profitIn)}>
                {row.profitIn}
              </span>
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
              <span class={this.profitInradioColor(row.profitInradio)}>
                {row.profitInradio}
              </span>
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
              <span
                title="平均每次安装推荐软件个数\n橙色：2<=推荐软件<2.5\n红色：推荐软件<2"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.xzSofttjColor(row.xzSofttj)}>
                {row.xzSofttj}
              </span>
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
              <span class={this.xzSetupsColor(row.xzSetups)}>
                {row.xzSetups}
              </span>
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
          renderHeader: (h, params) => this.renderHeaderInput(h, params),
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
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
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
              <span class={this.xzOpenSetupColor(row.xzOpenSetup)}>
                {row.xzOpenSetup}
              </span>
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
        groupName: '', // 推广组
        campaignName: '', // 推广计划
        semMatch: '', // 匹配
        xzSoftid: '', // 软件ID
        xzAppid: '' // 渠道号
      },
      showProfitChange: false, // 展示收益调整的框
      proFitData: {
        date: [
          moment()
            .subtract(2, 'days')
            .format('YYYY-MM-DD'),
          moment()
            .subtract(2, 'days')
            .format('YYYY-MM-DD')
        ]
      },
      profitOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now() - 86400000 // 减一天
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
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/CostTSogou/day?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/CostTSogou/day',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let list = res.data.list
          let sum = res.data.sum
          if (list.length > 0) {
            list.push(sum)
            list.unshift(sum)
          }
          this.tableContent = Object.freeze(list)
          this.detailHeader.totalCount = Number(res.data.totalCount)
          console.time('render')
          this.$nextTick(() => {
            console.timeEnd('render')
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
    // 重新加载
    reload () {
      // 页面初始化的时候的数据
      this.detailHeader = {
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
        groupName: '', // 推广组
        campaignName: '', // 推广计划
        semMatch: '', // 匹配
        xzSoftid: '', // 软件ID
        xzAppid: '' // 渠道号
      }
      this.setTimeRange()
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      // 1.字符串字段去空格
      // 2.有值的拷贝到新对象
      // 3.模糊搜索的时候，清空其他字段，新对象只保留部分值
      // 4.非模糊搜索,才有可能表头搜索,转换逗号
      // 5 删除不必要的字段，将处理完的数据合并回源对象
      const multipleArr = ['xzSoftid', 'xzAppid'] // 需要转换成逗号分隔的字段
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
      } else {
        // 需要多选的
        multipleArr.forEach(key => {
          if (sendData[key]) {
            sendData[key] = sendData[key].split(' ').join(',')
          }
        })
        const [date, enddate] = sendData.timeRange.map(e =>
          moment(e).format('YYYY-MM-DD')
        )
        sendData.date = date
        sendData.enddate = enddate
        delete sendData.timeRange
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

    // 保存收益调整
    submitProChange () {
      let sendData = {}
      let [profitStartDate, profitEndDate] = this.proFitData.date.map(e =>
        moment(e).format('YYYY-MM-DD')
      )
      sendData.profitStartDate = profitStartDate
      sendData.profitEndDate = profitEndDate
      this.$axios({
        url: semUrl + '/CronProfitSogou/getProfitDay4Self',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        console.log(res)
      })
      this.$Message.success('后台处理中，约五分钟之后处理成功')
    },
    // 算合计的方法，已弃用
    handleSummary () {
      let totalSum = {}
      let sum = this.sum
      this.totalTableHeader.forEach((col, index) => {
        const { key } = col
        totalSum[key] = {
          key: key,
          value: sum[key] || ''
        }
      })
      totalSum.index = {
        key: 'index',
        value: '合计'
      }
      return totalSum
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  }
}
</script>
