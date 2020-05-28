<template>
  <div>
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="(text)=>{detailSearch({text,currPage:1})}"
          placeholder="账户名称"
          search
          clearable
          v-model="detailHeader.text"
        />
        <Button :icon="isFullScreen?'md-contract':'md-expand'" @click="handleFullScreen" />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}" />
        <TableHeaderSetting v-model="tableHeader" :totalTableHeader="totalTableHeader" />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      key="semAccountList"
    ></Table>
    <div class="clearfix tableFooter">
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
        @on-page-size-change="(pageSize)=>{detailSearch({pageSize,currPage:1})}"
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import { mixins, renderHeaderMixins } from '../tools.js'
import { HeaderSelect } from '_c/table-header-search'
import { Track } from '@/libs/track'
const track = new Track('营销/360成本表/账户数据')
export default {
  name: 'semSheetAccountList',
  components: {
    TableHeaderSetting,
    HeaderSelect
  },
  mixins: [mixins, renderHeaderMixins],
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
              return <span>合计</span>
            } else {
              return <span>{index}</span>
            }
          }
        },
        {
          title: '账户名称',
          key: 'accountName',
          align: 'center',
          fixed: 'left',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '日期',
          key: 'date',
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <div>
                      <Checkbox
                        true-value={'1'}
                        false-value={''}
                        transfer={false}
                        v-model={this.detailHeader.dateMergin}
                        onOn-change={(v) => { this.detailSearch({ currPage: 1 }) }}
                      >
                        区间合并
                      </Checkbox>
                      <DatePicker
                        onOn-ok={() => {
                          this.detailSearch({ currPage: 1 })
                        }}
                        transfer={false}
                        clearable={false}
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
          title: '使用类型',
          key: 'useType',
          align: 'center',
          renderHeader: (h, params) => {
            let arr = [
              { label: '全部', value: '' },
              { label: '自用', value: '1' },
              { label: '外放', value: '2' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={arr}
                key={key}
                title={title}
                onOn-change={data => {
                  this.detailSearch()
                }}
                v-model={this.detailHeader.useType}
              />
            )
          }
        },
        {
          title: '总收益',
          key: 'profitAll',
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '总成本',
          key: 'costAll',
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '利润',
          key: 'profitIn',
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '利润率',
          key: 'profitInradio',
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '总费用',
          key: 'totalCost',
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '消耗',
          key: 'consume',
          align: 'center',
          sortable: 'custom'
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

        timeRange: [], // 时间范围
        dateMergin: '', // 是否日期区间合并
        accountName: '', // 账户名称
        useType: '' // 使用类型
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
        ],
        doAdjusted: '0'
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
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/AccountConsume/index?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/AccountConsume/index',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let list = res.data.list
          let sum = res.data.sum
          if (list.length !== 0) {
            // 合计放到最后一行
            list.push(sum)
            list.unshift(sum)
          }
          this.tableContent = Object.freeze(list)
          // this.tableContent =  res.data.list
          this.detailHeader.totalCount = Number(res.data.totalCount)

          // 设置表格的高度，防止出现外部滚动条
          this.setTableHeight()
          this.loading = false
          this.$nextTick(() => { track.end() })
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
      // const multipleArr = ['appId', 'softId'] // 需要转换成逗号分隔的字段
      this.detailHeader = Object.assign(this.detailHeader, data)
      let sendData = {}
      for (let key in this.detailHeader) {
        let value = this.detailHeader[key]
        value = typeof value === 'string' ? value.trim() : value
        if (value) {
          sendData[key] = value
        }
      }

      // 模糊搜索，清空其他内容，重新拿
      if (sendData.text) {
        this.reload()
        const { currPage, pageSize, text, desc, orderby } = sendData
        sendData = { currPage, pageSize, text, desc, orderby }
      } else {
        const [date, enddate] = sendData.timeRange.map(e =>
          moment(e).format('YYYY-MM-DD')
        )
        sendData.date = date
        sendData.enddate = enddate
      }
      delete sendData.timeRange
      // 删除排序
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      delete sendData.totalCount
      this.detailHeader = Object.assign(this.detailHeader, sendData)
      return sendData
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

        timeRange: [], // 时间范围
        dateMergin: '', // 是否日期区间合并
        accountName: '', // 账户名称
        useType: '' // 使用类型
      }
      this.setTimeRange()
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  }
}
</script>
