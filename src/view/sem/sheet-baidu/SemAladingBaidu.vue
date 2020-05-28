<template>
  <div id="semAladingBaidu">
    <div class="level-three clearfix">
      <Button @click="exportExcel">导出</Button>
      <Button @click="handleShowProfitChange">阿拉丁设置</Button>
      <!-- 收益调整的弹窗 -->
      <Modal v-model="showProfitChange" title="阿拉丁设置" @on-ok="setReturnMargin">
        <Form :modal="proFitData" :label-width="100" v-if="showProfitChange">
          <FormItem label="返点系数">
            <InputNumber :max="100" :min="0" :step="0.1" v-model="proFitData.returnMargin"></InputNumber>
          </FormItem>
        </Form>
      </Modal>
      <div class="searchbar">
        <Input
          @on-search="(productCode)=>{detailSearch({currPage:1,productCode,searchType:'2'})}"
          placeholder="产品编码"
          search
          clearable
          v-model="detailHeader.productCode"
        />
        <Button :icon="isFullScreen?'md-contract':'md-expand'" @click="handleFullScreen" />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}" />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          :defaultList="[]"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      key="semAladingBaidu"
    ></Table>
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
        @on-page-size-change="(pageSize)=>{detailSearch({pageSize,currPage:1})}"
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
import { semPermissionMixin } from '../tools.js'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import { Track } from '@/libs/track'
const track = new Track('营销/百度成本表/阿拉丁成本表')
export default {
  name: 'semAladingBaidu',
  components: {
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect
  },
  mixins: [semPermissionMixin],
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
          title: '产品编码',
          key: 'productCode',
          align: 'center',
          minWidth: 130,
          fixed: 'left',
          alwaysShow: true,
          renderHeader: (h, params) => {
            let { key, title } = params.column
            return (
              <HeaderInput
                v-model={this.detailHeader[key]}
                title={title}
                onOn-search={value => {
                  this.detailSearch({ [key]: value, currPage: 1 })
                }}
              >
                <Checkbox
                  slot="pre"
                  trueValue={'1'}
                  falseValue={'2'}
                  v-model={this.detailHeader.searchType}
                >
                    精确搜索
                </Checkbox>
              </HeaderInput>
            )
          }
        },
        {
          title: '日期',
          key: 'pdate',
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
                        transfer={false}
                        onOn-ok={() => {
                          this.detailSearch()
                        }}
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
          title: '返数',
          key: 'type',
          align: 'center',
          minWidth: 130,
          renderHeader: (h, params) => {
            let arr = [
              { label: '全部', value: '' },
              { label: '未返数', value: '0' },
              { label: '已返数', value: '1' }
            ]
            let { key, title } = params.column
            return (
              <HeaderSelect
                options={arr}
                key={key}
                title={title}
                onOn-change={type => {
                  this.detailSearch()
                }}
                v-model={this.detailHeader.type}
              />
            )
          },
          render: (h, { row }) => {
            if (row.type === 1) {
              return <span>已返数</span>
            } else if (row.type === 0) {
              return <span>未返数</span>
            }
          }
        },
        {
          title: '点击数',
          key: 'clicks',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '点击单价',
          key: 'clickUnitPrice',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'installNum',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '安装单价',
          key: 'installUnitPrice',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '总成本',
          key: 'totalCost',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '总营收',
          key: 'totalRevenue',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '利润',
          key: 'profit',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '利润率',
          key: 'profitMargin',
          align: 'center',
          minWidth: 130,
          sortable: 'custom',
          render (h, params) {
            return <span> {params.row.profitMargin}%</span>
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
        type: '', // 是否返数，0未返，1已返
        productCode: '', // 产品编码
        searchType: '2', // 关键词是否精确搜索
        timeRange: [] // 时间范围
      },
      showProfitChange: false, // 展示收益调整的框
      proFitData: {
        returnMargin: 1.5
      }
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.setTimeRange()
    this.detailSearch()
    this.getAladingMargin()
  },
  methods: {
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      // sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage

      let data = $qs.stringify(sendData)
      window.open(semUrl + '/SemAlading/exportAladingCost?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/SemAlading/getAladingCost',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          let list = res.data.list
          const sum = res.data.sum
          if (list.length > 0) {
            list.push(sum)
            list.unshift(sum)
          } else {
            list = []
          }
          this.tableContent = Object.freeze(list)
          this.detailHeader.totalCount = Number(res.data.totalCount)
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
          .subtract(2, 'days')
          .format('YYYY-MM-DD'),
        moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD')
      ]
    },
    // 设置全屏
    handleFullScreen () {
      this.$emit('update:isFullScreen', !this.isFullScreen)
    },
    handleShowProfitChange () {
      this.getAladingMargin()
      this.showProfitChange = true
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
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
      // 这个页面模糊搜索只是多了个searchType=2,右上角框和表头搜索一样
      // if (sendData.searchType==='2') {
      //   this.reload(sendData.text)
      //   const { currPage, pageSize, text, desc, orderby } = sendData
      //   sendData = { currPage, pageSize, text, desc, orderby }
      // }
      // 删除排序
      if (sendData.desc === 'normal') {
        delete sendData.orderby
        delete sendData.desc
      }
      const [date, enddate] = sendData.timeRange.map(e =>
        moment(e).format('YYYY-MM-DD')
      )
      sendData.date = date
      sendData.enddate = enddate
      delete sendData.timeRange
      delete sendData.totalCount
      this.detailHeader = Object.assign(this.detailHeader, sendData)
      return sendData
    },
    // 重新加载
    reload (data = {}) {
      this.detailHeader = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式

        type: '', // 是否返数，0未返，1已返
        productCode: '', // 产品编码
        searchType: '2', // 关键词是否精确搜索
        timeRange: [] // 时间范围
      }
      this.setTimeRange()
    },
    // 获取当前阿拉丁返数
    getAladingMargin () {
      this.$axios({
        url: semUrl + '/SemAlading/setReturnMargin',
        method: 'get'
      }).then(res => {
        const { data } = res
        if (data.code === 10000) {
          this.proFitData.returnMargin = Number(data.returnMargin)
        } else {
          this.$Message.error(data.msg)
        }
      })
    },
    // 设置阿拉丁返数
    setReturnMargin () {
      let sendData = {
        returnMargin: this.proFitData.returnMargin
      }
      this.$axios({
        url: semUrl + '/SemAlading/setReturnMargin',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        const { data } = res
        if (data.code === 10000) {
          this.$Message.success(res.data.msg)
          this.showProfitChange = false
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  watch: {
    isFullScreen (newVal) {
      this.setTableHeight()
    }
  }
}
</script>
