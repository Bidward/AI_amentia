<template>
  <div>
    <div class="level-three clearfix">
      <Button class="btns" @click="exportExcel">导出</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="推广组、关键词、责任人"
          search
          clearable
          v-model="detailHeader.text"
          class
          style="width:200px;margin-right:5px;"
        />
        <Button class="btns" icon="ios-loading" @click="reload()"></Button>
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="keywordsToEdit"
          localKey="keywordsToEdit"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      border
      :data="tableContent"
      @on-sort-change="sortChange"
      :height="tableHeight"
      :loading="loading"
    >
      <template slot-scope="{ row, index }" slot="softId">
        <a :href="row.destinationUrl" target="_blank">{{row.softId}}</a>
      </template>
      <template slot-scope="{ row, index }" slot="offTime">
        <span :class="beyondDay(row.offTime)?'red':''">{{row.offTime}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update" @click="edit(row,index)">编辑</Button>
        <Button class="btns" @click="toDetail(row)">详情</Button>
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
      />
    </div>
    <editKeyword
      @updateList="detailSearch"
      v-if="showEdit"
      :show.sync="showEdit"
      :propData="propData"
    />
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import editKeyword from '../keywords/editKeyword'
import TableHeaderSetting from '_c/table-header-setting'
import moment from 'moment'
import { semPermissionMixin } from '../../tools'
import { Track } from '@/libs/track.js'
const track = new Track('营销/精确模式/优化关键词')
export default {
  name: 'keywordStoEdit', // 优化关键词
  components: {
    editKeyword,
    TableHeaderSetting
  },
  mixins: [semPermissionMixin],
  props: {
    tableHeight: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      showEdit: false,
      propData: {},
      tableHeader: [],
      loading: true,
      tableConfigList: [
        'index',
        'addTime',
        'accountName',
        'groupName',
        'plainGroupName',
        'owner',
        'keyword',
        'price',
        'matchType',
        'showId',
        'status',
        'sum',
        'edit'
      ],
      totalTableHeader: [
        {
          title: '序号',
          type: 'index',
          key: 'index',
          width: 80,
          align: 'center',
          alwaysShow: true
        },
        {
          title: '账户名称',
          key: 'accountName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
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
          title: '推广计划',
          key: 'campaignName',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
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
          title: '责任人',
          key: 'owner',
          align: 'center',
          minWidth: 100,
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
          title: '产品名',
          key: 'softName',
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softName}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ softName: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.softName ? 'on' : ''}
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
          minWidth: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Checkbox
                      true-value={'1'}
                      false-value={''}
                      v-model={this.detailHeader.groupCheck}
                    >
                      精确搜索
                    </Checkbox>
                    <Input
                      v-model={this.detailHeader.groupName}
                      search
                      style="width:200px"
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
          title: '关键词',
          key: 'keyword',
          align: 'center',
          minWidth: 100,
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
          title: '点击安装率',
          key: 'setupClick',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '打开安装率',
          key: 'setupOpen',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '历史最大出价',
          key: 'maxPrice',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '历史最大点击',
          key: 'maxClick',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '昨日点击',
          key: 'lastClick',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '点击差值',
          key: 'diffLastClick',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '历史最高安装',
          key: 'maxSetups',
          width: 130,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '下线差值',
          key: 'promote',
          width: 110,
          align: 'center',
          sortable: 'custom'
        },
        {
          title: '软件id',
          key: 'softId',
          slot: 'softId',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.softId}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ softId: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.softId ? 'on' : ''}
                    />
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
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.appId}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ appId: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.appId ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '模板',
          key: 'showId',
          width: 80,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.showId}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ showId: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.showId ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '状态',
          key: 'optStatus',
          width: 80,
          align: 'center',
          renderHeader: (h, params) => {
            // <Option value="edited">待编辑</Option>
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.optStatus}
                      v-on: on-change={value => {
                        this.detailSearch({ optStatus: value, currPage: 1 })
                      }}
                    >
                      <Option value="">全部</Option>
                      <Option value="enabled">启用</Option>
                      <Option value="paused">暂停</Option>
                      <Option value="stop">停用</Option>
                    </Select>
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.optStatus ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '下线时间',
          key: 'offTime',
          slot: 'offTime',
          minWidth: 180,
          align: 'center',
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span title="超过24小时标红">{params.column.title}</span>
            )
          }
        },
        {
          title: '下线原因',
          key: 'reason',
          minWidth: 180,
          align: 'center',
          tooltip: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.reason}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ reason: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.reason ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '优化方式',
          key: 'optimizeType',
          width: 200,
          align: 'center',
          tooltip: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.optimizeType}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ optimizeType: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.optimizeType ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '备注',
          key: 'sum',
          minWidth: 80,
          align: 'center',
          tooltip: true,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.sum}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ sum: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    {params.column.title}
                    <Icon
                      type="md-search"
                      size="14"
                      class={this.detailHeader.sum ? 'on' : ''}
                    />
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作',
          key: 'edit',
          slot: 'edit',
          minWidth: 160,
          align: 'center',
          alwaysShow: true
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
        accountName: '', // 账户名称
        campaignName: '', // 推广计划
        owner: '', // 责任人
        softName: '', // 产品名
        groupName: '', // 推广组
        keyword: '', // 关键字
        setupClick: '', // 点击安装率
        setupOpen: '', // 打开安装率
        maxPrice: '', // 历史最大出价
        maxClick: '', // 历史最大点击
        maxSetups: '', // 历史最高安装
        promote: '', // 下线差值
        softId: '', // 软件id
        appId: '', // 渠道号
        showId: '', // 模板
        optStatus: '', // 状态
        offTime: '', // 下线时间
        reason: '', // 下线原因
        optimizeType: '', // 优化方式
        sum: '', // 备注
        keywordCheck: '', // 关键词精确搜索
        groupCheck: '' // 推广组精确搜索
      }
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
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
      window.open(semUrl + '/KeywordOptimize/index?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/KeywordOptimize/index',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.tableContent = res.data.content.pageContent
        this.detailHeader.totalCount = Number(res.data.content.totalCount)
        // 合计放到最后一行
        this.loading = false
        this.setTableHeight()
        this.$nextTick(() => {
          track.end()
        })
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
    // 编辑
    edit (row, index) {
      this.$axios({
        url: semUrl + `/keyword/show?keywordId=${row.keywordId}`
      }).then(res => {
        this.showEdit = true
        let data = res.data.data.keyword
        data.keywordId = row.keywordId
        this.propData = data
      })
    },
    toDetail (row) {
      this.$router.push({
        name: 'semKeywordDetail',
        // query: { id: row.keywordId }
        params: { id: row.keywordId }

      })
    },
    reload () {
      this.detailHeader = {
        currPage: 1,
        pageSize: 20,
        totalCount: 0,
        orderby: '', // 根据什么字段排序
        desc: 'normal', // 排序的方式
        text: '', // 模糊搜索
        accountName: '', // 账户名称
        campaignName: '', // 推广计划
        owner: '', // 责任人
        softName: '', // 产品名
        groupName: '', // 推广组
        keyword: '', // 关键字
        setupClick: '', // 点击安装率
        setupOpen: '', // 打开安装率
        maxPrice: '', // 历史最大出价
        maxClick: '', // 历史最大点击
        maxSetups: '', // 历史最高安装
        promote: '', // 下线差值
        softId: '', // 软件id
        appId: '', // 渠道号
        showId: '', // 模板
        optStatus: '', // 状态
        offTime: '', // 下线时间
        reason: '', // 下线原因
        optimizeType: '', // 优化方式
        sum: '', // 备注
        keywordCheck: '', // 关键词精确搜索
        groupCheck: '' // 推广组精确搜索
      }
      this.detailSearch()
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      let keys = Object.keys(this.detailHeader)
      let me = this
      let hasValueKeys = keys.filter(e => {
        // 非空字符串，非空数组,timeRage第二项有值才算
        return me.detailHeader[e] !== ''
      })
      let sendData = {}
      for (let i = 0; i < hasValueKeys.length; i++) {
        let key = hasValueKeys[i]
        let value = me.detailHeader[key]
        sendData[key] = typeof value === 'string' ? value.trim() : value
        if (key === 'appId') {
          sendData.appId = sendData.appId.split(' ').join(',')
        }
      }
      // 传进来的data去除首位空格
      for (let key in data) {
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim()
        }
      }
      // 如果是模糊搜索
      if (sendData.text) {
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      }
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
    // 是否超过一天
    beyondDay (time) {
      // 一天之后是不是在现在之后
      return moment(time).add(1, 'day').isBefore(moment())
    }
  }
}
</script>
