<template>
  <div id="semDayList">
    <div class="level-three clearfix">
      <Button class="btns" @click="exportExcel">导出</Button>
      <Button class="" @click="showProfitChange=true">收益调整</Button>
      <!-- 收益调整的弹窗 -->
      <Modal v-model="showProfitChange" title="收益调整" @on-ok="submitProChange">
        <Form :modal="proFitData" :label-width="100">
          <FormItem label="成本表日期">
            <DatePicker
              :options="profitOption"
              :clearable="false"
              v-model="proFitData.costDate"
              type="date"
              placeholder="成本表日期"
            />
          </FormItem>
          <FormItem label="收益日期">
            <DatePicker
              :options="profitOption"
              :clearable="false"
              v-model="proFitData.profitDate"
              type="date"
              placeholder="收益日期"
            />
          </FormItem>
        </Form>
      </Modal>
      <div class="searchbar">
        <Input
          @on-search="detailSearch()"
          placeholder="推广组、关键词、责任人"
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
          key="semDayList"
          :defaultList="defaultList"
          localKey="semDayList"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      key="semDayList"
    >
      <template slot-scope="{ row, index }" slot="index">
        <span v-if="index===tableContent.length-1||index===0">合计</span>
        <span v-else>{{index}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="keyword">
        <span :class="keyWordIncludeSoftNameColor(row.softName,row.keyword)">{{row.keyword}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="setupRadio">
        <span :class="setupRadioColor(row.setupRadio)">{{row.setupRadio}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="maxprice">
        <span :class="maxpriceColor(row.maxprice)">{{row.maxprice}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="percost">
        <span :class="percostColor(row.percost, row.grossProfit)">{{row.percost}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="profit">
        <span :class="profitColor(row.profit)">{{row.profit}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="grossProfit">
        <span :class="grossProfitColor(row.grossProfit)">{{row.grossProfit}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="profitRatio">
        <span :class="profitRatioColor(row.profitRatio)">{{row.profitRatio}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="ratio">
        <span :class="ratioColor(row.ratio)">{{row.ratio}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="setups">
        <span :class="setupsColor(row.setups)">{{row.setups}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="lastWeekSetups">
        <span :class="lastWeekSetupsColor(row.lastWeekSetups)">{{row.lastWeekSetups}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="lastDaySetups">
        <span :class="lastDaySetupsColor(row.lastDaySetups)">{{row.lastDaySetups}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="maxSetups">
        <span :class="maxSetupsColor(row.maxSetups)">{{row.maxSetups}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="appratio">
        <span :class="appratioColor(row.appratio)">{{row.appratio}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="userEdit">
        <Button v-if="index!==tableContent.length-1&&index!==0" @click="editOwner(row)">编辑</Button>
      </template>
      <template slot-scope="{ row, index }" slot="sid">
        <a :href="row.destinationUrl" target="_blank" title="打开页面">
          <span class="pointer">{{row.sid}}</span>
        </a>
      </template>
    </Table>
    <SemOwnerEdit
      @updateList="detailSearch"
      v-if="showEdit"
      v-model="showEdit"
      :propData="propData"
    />
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
import SemOwnerEdit from './SemOwnerEdit'
import mixins from './mixins'
export default {
  name: 'semDayList',
  components: {
    TableHeaderSetting,
    SemOwnerEdit
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
      // tableHeight: 600,
      showEdit: false,
      propData: {},
      defaultList: [
        'index',
        'date',
        'groupName',
        'user',
        'keyword',
        'matchType',
        'setupRadio',
        'profitRatio',
        'avgPosition',
        'price',
        'views',
        'maxprice',
        'percost',
        'profit',
        'setups'
      ],
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          slot: 'index',
          align: 'center',
          alwaysShow: true,
          fixed: 'left'
        },
        {
          title: '关键词',
          key: 'keyword',
          slot: 'keyword',
          align: 'center',
          minWidth: 120,
          fixed: 'left',
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
                  <span title="红色：不包含产品名称" class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.keyword ? 'on' : ''}
                    />
                    {params.column.title}
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
                        v-on:on-ok={() => {
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
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.timeRange.length > 0 ? 'on' : ''}
                    />
                    {params.column.title}
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
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.accountName ? 'on' : ''}
                    />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '产品名',
          key: 'softName',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softName}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ softName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.softName ? 'on' : ''}
                    />
                    {params.column.title}
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
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.groupName ? 'on' : ''}
                    />
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
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.user}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ user: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.user ? 'on' : ''}
                    />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '责任人编辑',
          key: 'userEdit',
          slot: 'userEdit',
          align: 'center',
          width: 100
        },
        {
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 120,
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
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.campaignName ? 'on' : ''}
                    />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '匹配',
          key: 'matchType',
          align: 'center',
          width: 80,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.matchType}
                      v-on:on-change={value => {
                        this.detailSearch({ matchType: value, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="短精">短精</Option>
                      <Option value="短">短</Option>
                      <Option value="精">精</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.matchType ? 'on' : ''}
                    />
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
          slot: 'setupRadio',
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
          title: '模板ID',
          key: 'showid',
          width: 90,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.showid}
                      search
                      clearable
                      v-on:on-search={value => {
                        this.detailSearch({ showid: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.showid ? 'on' : ''}
                    />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '平均排名',
          key: 'avgPosition',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '出价',
          key: 'price',
          width: 80,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '平均出价',
          key: 'avgPrice',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '最大出价',
          key: 'maxprice',
          slot: 'maxprice',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="单位收益*利润系数*1.65*点击安装率\n橙色：0.22<=最大出价<0.3\n红色：0.22以下"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '展现点击率',
          key: 'clickSetup',
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
          key: 'percost',
          slot: 'percost',
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
          key: 'profit',
          slot: 'profit',
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
          }
        },
        {
          title: '利润',
          key: 'grossProfit',
          slot: 'grossProfit',
          width: 110,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span
                title="(单位收益*安装数)-(总费用/1.65)\n红色：利润<0"
                class="pointer"
              >
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '利润率',
          key: 'profitRatio',
          slot: 'profitRatio',
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
          }
        },
        {
          title: '换包收益',
          key: 'chgprofit',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '推荐软件',
          key: 'ratio',
          slot: 'ratio',
          width: 110,
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
          width: 90,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'setups',
          slot: 'setups',
          width: 90,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="红色：安装量<5" class="pointer">
                {params.column.title}
              </span>
            )
          }
        },
        {
          title: '上周同期差值',
          key: 'lastWeekSetups',
          slot: 'lastWeekSetups',
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
          }
        },
        {
          title: '昨日差值',
          key: 'lastDaySetups',
          slot: 'lastDaySetups',
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
          }
        },
        {
          title: '历史最高差值',
          key: 'maxSetups',
          slot: 'maxSetups',
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
          }
        },
        {
          title: '总费用',
          key: 'totalCost',
          width: 110,
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
          title: '软件ID',
          key: 'sid',
          slot: 'sid',
          width: 120,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.sid}
                        search
                        clearable
                        v-on:on-search={value => {
                          this.detailSearch({ sid: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.sid ? 'on' : ''}
                    />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '渠道号',
          key: 'appId',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip transfer={true} placement="bottom">
                  <div slot="content">
                    <div>
                      <Input
                        v-model={this.detailHeader.appId}
                        search
                        clearable
                        v-on:on-search={value => {
                          this.detailSearch({ appId: value, currPage: 1 })
                        }}
                      />
                    </div>
                  </div>
                  <span class="pointer">
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.appId ? 'on' : ''}
                    />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '打开安装率',
          key: 'appratio',
          slot: 'appratio',
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
        timeRange: [], // 时间范围
        text: '', // 模糊搜索
        accountName: '', // 账户名称
        softName: '', // 产品名
        groupName: '', // 推广组
        user: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        appratio: '', // 打开安装率
        keywordCheck: '' // 关键词精确搜索
      },
      showProfitChange: false, // 展示收益调整的框
      proFitData: {
        // 收益调整数据
        costDate: moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD'), // 成本表日期
        profitDate: moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD') // 收益日期
      },
      profitOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
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
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/Sheet/exptCost?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/Sheet/index',
        method: 'post',
        data: $qs.stringify(sendData)
      })
        .then(res => {
          this.tableContent = res.data.list
          this.detailHeader.totalCount = Number(res.data.totalCount)
          // 合计放到最后一行
          this.tableContent.push(res.data.sumObj)
          this.tableContent.unshift(res.data.sumObj)
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
        softName: '', // 产品名
        groupName: '', // 推广组
        user: '', // 责任人
        keyword: '', // 关键字
        campaignName: '', // 推广计划
        matchType: '', // 匹配方式
        appratio: '', // 打开安装率
        keywordCheck: '' // 关键词精确搜索
      }
      this.detailHeader = Object.assign(initData, data)
      this.setTimeRange()
      return this.detailHeader
    },
    // 保存收益调整
    submitProChange () {
      let sendData = JSON.parse(JSON.stringify(this.proFitData))
      sendData.costDate = moment(sendData.costDate).format('YYYY-MM-DD')
      sendData.profitDate = moment(sendData.profitDate).format('YYYY-MM-DD')
      this.$axios({
        url: semUrl + '/Sheet/costProfitChg',
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
