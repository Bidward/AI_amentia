<template>
  <div id="semDayList">
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
          <FormItem label="是否上线盈利词">
            <Checkbox v-model="proFitData.doAdjusted" true-value="1" false-value="0" />
          </FormItem>
        </Form>
      </Modal>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="推广组、关键词、责任人"
          search
          clearable
          v-model="detailHeader.text"
          style="width:200px;margin-right:5px;"
        />
        <Button :icon="isFullScreen?'md-contract':'md-expand'" @click="handleFullScreen" />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}" />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          v-model="tableHeader"
          localKey="semDayListV2"
          :defaultList="defaultList"
        />
      </div>
    </div>
    <BzVxeTable
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      key="semDayList"
    />
    <!-- <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      border
      key="semDayList"
    >
    </Table> -->
    <SemContentEdit
      @on-success="detailSearch"
      v-if="showEdit"
      v-model="showEdit"
      :propData="propData"
    />
    <!-- <SemOwnerEdit
      @updateList="detailSearch"
      v-if="showEdit"
      v-model="showEdit"
      :propData="propData"
    />-->
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
      />
    </div>
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import moment from 'moment'
import TableHeaderSetting from '_c/table-header-setting'
// import SemOwnerEdit from './SemOwnerEdit'
import SemContentEdit from './SemContentEdit'
import BzVxeTable from '_c/bz-vxe-table'
import { mixins, renderHeaderMixins } from '../tools.js'
import { Track } from '@/libs/track'
const track = new Track('营销/360成本表/每日新')
export default {
  name: 'semDayList',
  components: {
    TableHeaderSetting,
    // SemOwnerEdit,
    SemContentEdit,
    BzVxeTable
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
  beforeCreate () {
    track.start()
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
          render: (h, { index }) => {
            if (index === 0 || index === this.tableContent.length - 1) {
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
                <Poptip placement="bottom">
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
                      onOn-search={value => {
                        this.detailSearch({ keyword: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span title="红色：不包含产品名称" class="pointer">
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
          },
          render: (h, { row, params, index }) => {
            return (
              <span
                class={this.keyWordIncludeSoftNameColor(
                  row.softName,
                  row.keyword
                )}
              >
                {row.keyword}
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
          title: '产品名',
          key: 'softName',
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
          title: '责任人',
          key: 'owner',
          align: 'center',
          width: 100,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '内容编辑',
          key: 'userEdit',
          // slot: 'userEdit',
          align: 'center',
          width: 100,
          render: (h, { row, params, index }) => {
            if (
              index !== this.tableContent.length - 1 &&
              index !== 0 &&
              this.permission.config
            ) { return <Button onClick={() => { this.editOwner(row) }}>编辑</Button> }
          }
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
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.semMatch}
                      onOn-change={value => {
                        this.detailSearch({ semMatch: value, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="短精">短精</Option>
                      <Option value="短">短</Option>
                      <Option value="精">精</Option>
                    </Select>
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
          title: '模板ID',
          key: 'xzShowid',
          width: 90,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
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
                title="单位收益*利润系数*账户返点*点击安装率\n橙色：0.22<=最大出价<0.3\n红色：0.22以下"
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
              <span title="总费用/安装数/账户返点" class="pointer">
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
                title="(单位收益*安装数)-(总费用/账户返点)\n红色：利润<0"
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
                title="平均每次安装推荐软件个数\n橙色：2<=推荐软件<2.5\n红色：小于2"
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
          title: '上周同期差值',
          key: 'xzDiffLastweek',
          width: 130,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="查询日期安装-上周同期安装\n红色：差值<0"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.xzDiffLastweekColor(row.xzDiffLastweek)}>
                {row.xzDiffLastweek}
              </span>
            )
          }
        },
        {
          title: '昨日差值',
          key: 'xzDiffLastday',
          width: 120,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="查询日期安装-前一天安装\n红色：差值<0"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.xzDiffLastdayColor(row.xzDiffLastday)}>
                {row.xzDiffLastday}
              </span>
            )
          }
        },
        {
          title: '历史最高差值',
          key: 'xzDiffMaxsetup',
          width: 130,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="查询日期安装-历史最高安装\n红色：差值<0"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          },
          render: (h, { row, params, index }) => {
            return (
              <span class={this.xzDiffMaxsetupColor(row.xzDiffMaxsetup)}>
                {row.xzDiffMaxsetup}
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
        softName: '', // 产品名
        groupName: '', // 推广组
        owner: '', // 责任人
        campaignName: '', // 推广计划
        semMatch: '', // 匹配

        xzShowid: '', // 模板ID
        xzSoftid: '', // 软件ID
        xzAppid: ''// 渠道号
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
  mounted () {
    this.setTimeRange()
    this.detailSearch()
    // window.addEventListener('scroll', this.toggleFixedTable, true)
  },
  methods: {
    // 编辑责任人
    editOwner (row) {
      this.showEdit = true
      this.propData = row
    },
    // 导出excel
    exportExcel () {
      let sendData = this.getSendData()
      sendData.type = 'expt'
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/CostT/day?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/CostT/day',
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
        text: '', // 模糊搜索
        keyword: '', // 关键字
        keywordCheck: '', // 关键词是否精确搜索
        timeRange: [], // 时间范围
        accountName: '', // 账户名称
        softName: '', // 产品名
        groupName: '', // 推广组
        owner: '', // 责任人
        campaignName: '', // 推广计划
        semMatch: '', // 匹配

        xzShowid: '', // 模板ID
        xzSoftid: '', // 软件ID
        xzAppid: ''// 渠道号
      }
      this.detailHeader = Object.assign(initData, data)
      this.setTimeRange()
      return this.detailHeader
    },
    // 保存收益调整
    submitProChange () {
      let sendData = {}
      sendData.profitStartDate = moment(this.proFitData.date[0]).format(
        'YYYY-MM-DD'
      )
      sendData.profitEndDate = moment(this.proFitData.date[1]).format(
        'YYYY-MM-DD'
      )
      sendData.doAdjusted = this.proFitData.doAdjusted
      this.$axios({
        url: semUrl + '/CronProfit/getProfitDay4Self',
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
