<template>
  <div>
    <!-- 责任人成本表 -->
    <div class="level-three clearfix">
      <Button class="" @click="exportExcel" >导出</Button>
      <div class="searchbar">
        <Input
          @on-search="detailSearch()"
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
          :defaultList="defaultList"
          key="semOwnerList"
          localKey="semOwnerList"
        />
      </div>
    </div>
    <Table
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
    <div class="clearfix">
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
      defaultList: ['index', 'user', 'date', 'setupRadio', 'price', 'avgPosition', 'avgPrice', 'maxPrice', 'perCost', 'cost', 'profitUnit', 'views', 'clicks', 'setups', 'totalCost'],
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
                    <Icon type="md-search" size="14" class={this.detailHeader.timeRange.length > 1 ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '责任人',
          key: 'user',
          align: 'center',
          fixed: 'left',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.user}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ user: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.user ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '点击安装率',
          key: 'setupRadio',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="安装数/点击数" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '出价',
          key: 'price',
          width: 80,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '平均排名',
          key: 'avgPosition',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '平均出价',
          key: 'avgPrice',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '最大出价',
          key: 'maxPrice',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="单位收益*利润系数*1.65*点击安装率" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '展现点击率',
          key: 'clickRatio',
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
          key: 'perCost',
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
          key: 'cost',
          width: 80,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="总费用/安装数/1.65" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '单位收益',
          key: 'profitUnit',
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
          key: 'grossProfit',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="单位收益*利润系数*1.65*点击安装率" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '利润率',
          key: 'profitRatio',
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
          key: 'allRatio',
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
          title: '展示数',
          key: 'views',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '点击数',
          key: 'clicks',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'setups',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '关键词数',
          key: 'keywordIdCount',
          width: 120,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '产品数',
          key: 'softCount',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '总费用',
          key: 'totalCost',
          width: 100,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '消耗',
          key: 'consumeCost',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="总费用/1.35" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '打开安装率',
          key: 'appRatio',
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
  mounted () {
    this.setTimeRange()
    this.detailSearch()
  },
  methods: {
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/Sheet/exptCostPerson?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/Sheet/personView',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.tableContent = res.data.list
        // 后端懒得传，责任人表就是list的数组长度
        this.detailHeader.totalCount = res.data.list.length
        // 合计放到最后一行
        this.tableContent.push(res.data.sumObj)
        // this.setTableHeight()
        this.loading = false
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
      // let pagePaddingHeight = document
      //   .querySelectorAll('body')[0]
      //   .getClientRects()[0].height
      // if (this.isFullScreen) {
      //   this.tableHeight = pagePaddingHeight - 150
      // } else {
      //   this.tableHeight = pagePaddingHeight - 280
      // }
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
