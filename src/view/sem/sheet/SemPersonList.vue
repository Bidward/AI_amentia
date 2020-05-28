<template>
  <div>
    <!-- 责任人成本表 -->
    <div class="level-three clearfix">
      <Button class="searchbarLeft" @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="责任人"
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
        <Button class="btns" icon="ios-loading" @click="()=>{reload();detailSearch()}" />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="semOwnerListV2"
          localKey="semOwnerListV2"
        />
      </div>
    </div>
    <Table
      border
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      key="semPersonList"
    >
      <template slot-scope="{ row, index }" slot="index">
        <span v-if="index===tableContent.length-1">合计</span>
        <span v-else>{{index+1}}</span>
      </template>
    </Table>
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
        @on-change="(currPage)=>{detailHeader.currPage=currPage;detailSearch()}"
        @on-page-size-change="(pageSize)=>{detailHeader.pageSize=pageSize;detailSearch()}"
        style="float:right;"
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import { Track } from '@/libs/track'
const track = new Track('营销/360成本表/责任人')
export default {
  name: 'semPersonList',
  components: {
    TableHeaderSetting
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
      tableHeader: [],
      loading: true,
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          slot: 'index',
          align: 'center',
          fixed: 'left',
          alwaysShow: true
        },
        {
          title: '责任人',
          key: 'owner',
          align: 'center',
          width: 100,
          fixed: 'left',
          alwaysShow: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.owner}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ owner: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.owner ? 'on' : ''}
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
                      <Checkbox true-value={'2'} false-value={'1'} v-model={this.detailHeader.merge}>区间合并</Checkbox>
                      <DatePicker
                        v-on: on-ok={() => {
                          this.detailSearch({ currPage: 1 })
                        }}
                        type="daterange"
                        v-model={this.detailHeader.timeRange}
                        confirm
                        placement="bottom-start"
                        style="width: 168px"
                        placeholder="输入时间"
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon type="md-search" size="14" class={this.detailHeader.timeRange.length > 1 ? 'on' : ''} />
                  </span>
                </Poptip>
              </span>
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
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '最大出价',
          key: 'profitMaxprice',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="单位收益*利润系数*账户返点*点击安装率" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '平均排名',
          key: 'semPosition',
          width: 120,
          align: 'center',
          sortable: 'custom'
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
              <span title="单位收益*利润系数-成本" class="pointer">
                {params.column.title}
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
              <span title="总费用/安装数/账户返点" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '单位收益',
          key: 'profitPer',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="推广软件收益+换包收益+导航收益+收藏夹收益+信息流收益+其他收益" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '利润',
          key: 'profitIn',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="单位收益*利润系数*账户返点*点击安装率" class="pointer">
                {params.column.title}
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
              <span title="利润/(单位收益*安装数)" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '推荐软件',
          key: 'xzSofttj',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="平均每次安装推荐软件个数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '广告展示数',
          key: 'semViews',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '广告点击数',
          key: 'semClicks',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '页面展示数',
          key: 'xzShow',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '页面点击数',
          key: 'xzClick',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '页面展示点击率',
          key: 'xzShowClick',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'xzSetups',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '关键词数',
          key: 'numKeywords',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '产品数',
          key: 'numSofts',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '总费用',
          key: 'semTotalCost',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '消耗',
          key: 'semConsume',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="总费用/1.48" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '打开安装率',
          key: 'xzOpenSetup',
          width: 130,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="下载器安装数/下载器打开数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        }
      ],
      tableContent: [],
      detailHeader: {
        totalCount: 0,
        currPage: 1,
        pageSize: 20,
        timeRange: [],
        text: '', // 模糊搜索
        user: '', // 责任人
        keywordIdCount: '', // 关键词数
        softCount: '', // 产品数
        merge: '1'// 区间合并
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
      window.open(semUrl + '/CostT/person?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/CostT/person',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        let list = res.data.list
        this.detailHeader.totalCount = Number(list.length)
        list.push(res.data.sum)
        this.tableContent = Object.freeze(list)
        // 设置表格的高度，防止出现外部滚动条
        this.setTableHeight()
        this.loading = false
        this.$nextTick(() => { track.end() })
      }).catch(err => {
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
        moment().subtract(1, 'days').format('YYYY-MM-DD'),
        moment().subtract(1, 'days').format('YYYY-MM-DD')
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
      return sendData
    },
    // 重新加载
    reload (data = {}) {
      let initData = {
        totalCount: 0,
        currPage: 1,
        pageSize: 20,
        timeRange: [],
        text: '', // 模糊搜索
        user: '', // 责任人
        keywordIdCount: '', // 关键词数
        softCount: '', // 产品数
        merge: '1'
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
