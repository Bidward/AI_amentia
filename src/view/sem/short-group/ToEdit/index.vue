<template>
  <div>
    <div class="level-three clearfix">
      <!-- <Button class="searchbarLeft" @click="exportExcel">导出</Button> -->
      <div class="searchbar">
        <Input
          @on-search="(text)=>{detailSearch({text:text.trim(),currPage:1})}"
          placeholder="推广计划、责任人、推广组"
          search
          clearable
          v-model.trim="detailHeader.text"
        />
        <Button class="btns" icon="ios-loading" @click="()=>{reload();detailSearch({currPage:1})}" />
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :default="tableConfigList"
          v-model="tableHeader"
        />
      </div>
    </div>
    <Table
      :columns="tableHeader"
      :data="tableContent"
      border
      @on-sort-change="sortChange"
      :height="tableHeight"
      :loading="loading"
    >
      <template slot-scope="{ row, index }" slot="edit">
        <Button class="btns" type="primary" v-if="permission.update" @click="edit(row,index)">编辑</Button>
        <Button class="btns" @click="toDetail(row)">详情</Button>
      </template>
    </Table>
    <div class="tableFooter clearfix">
      <Page
        size="small"
        :total="detailHeader.totalCount"
        :page-size="detailHeader.pageSize"
        :current="detailHeader.currPage"
        :page-size-opts="[20,50,100,300]"
        show-total
        show-sizer
        show-elevator
        @on-change="(currPage)=>{detailSearch({currPage})}"
        @on-page-size-change="(pageSize)=>{detailSearch({pageSize})}"
      />
    </div>
    <KeywordEdit
      @updateList="detailSearch"
      v-if="showEdit"
      :show.sync="showEdit"
      :propData="propData"
    />
  </div>
</template>
<script>
import { semUrl } from '@/api/base.js'
import TableHeaderSetting from '_c/table-header-setting'
import KeywordEdit from '../keywords/KeywordEdit'
import KeywordDetail from '../keywords/KeywordDetail'
import { semPermissionMixin } from '../../tools'
import { HeaderInput, HeaderSelect } from '_c/table-header-search'
import { Track } from '@/libs/track'
import moment from 'moment'
const track = new Track('营销/短语模式/待优化关键词')
export default {
  name: 'shortToEdit',
  components: {
    TableHeaderSetting,
    HeaderInput,
    HeaderSelect,
    KeywordEdit,
    KeywordDetail
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
      ids: [], // 选中的勾选框
      owner: '', // 更换责任人绑定的新责任人
      status: '', // 更改上下线的状态
      showId: '', // 新的模板号

      showEdit: false,
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
        'showId',
        'status',
        'sum',
        'edit'
      ],
      totalTableHeader: [
        // {
        //   title: '批量',
        //   type: 'selection',
        //   key: 'selection',
        //   width: 50,
        //   align: 'center'
        // },
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
          title: '责任人',
          key: 'owner',
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '产品名',
          key: 'softName',
          minWidth: 100,
          align: 'center',
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
                  falseValue={''}
                  onOn-change={() => { this.detailSearch() }}
                  v-model={this.detailHeader.softNameCheck}
                >
                  精确搜索
                </Checkbox>
              </HeaderInput>
            )
          }
        },
        {
          title: '推广组',
          key: 'groupName',
          minWidth: 100,
          align: 'center',
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
                  falseValue={''}
                  onOn-change={() => { this.detailSearch() }}
                  v-model={this.detailHeader.groupCheck}
                >
                  精确搜索
                </Checkbox>
              </HeaderInput>
            )
          }
        },
        {
          title: '关键词',
          key: 'keyword',
          align: 'center',
          minWidth: 100,
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
                  falseValue={''}
                  onOn-change={() => { this.detailSearch() }}
                  v-model={this.detailHeader.keywordCheck}
                >
                  精确搜索
                </Checkbox>
              </HeaderInput>
            )
          }
        },
        {
          title: '点击安装率',
          key: 'clicksetup',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '打开安装率',
          key: 'opensetup',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '单位利润安装量',
          key: 'setupprofit',
          align: 'center',
          minWidth: 150,
          sortable: 'custom'
        },
        {
          title: '点击数',
          key: 'clicks',
          align: 'center',
          minWidth: 150,
          sortable: 'custom'
        },
        {
          title: '安装数',
          key: 'setups',
          align: 'center',
          minWidth: 150,
          sortable: 'custom'
        },
        {
          title: '单位收益',
          key: 'profit_per',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '历史最大出价',
          key: 'maxPrice',
          align: 'center',
          minWidth: 150,
          sortable: 'custom'
        },
        // {
        //   title: '昨日点击',
        //   key: 'lastClick',
        //   align: 'center',
        //   minWidth: 100,
        //   sortable: 'custom'
        // },
        {
          title: '点击差值',
          key: 'diffClick',
          align: 'center',
          minWidth: 100,
          sortable: 'custom'
        },
        {
          title: '历史最高安装',
          key: 'maxSetup',
          align: 'center',
          minWidth: 130,
          sortable: 'custom'
        },
        {
          title: '软件ID',
          key: 'softId',
          width: 110,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params),
          render: (h, { row, column, index }) => {
            return (
              <a href={row.semUrl} target="_blank" title="打开页面">
                <span class="pointer">{row.softId}</span>
              </a>
            )
          }
        },
        {
          title: '渠道号',
          key: 'appid',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },

        {
          title: '状态',
          key: 'status',
          width: 80,
          align: 'center',
          renderHeader: (h, params) => {
            const arr = [
              { label: '全部', value: '' },
              // { label: '启用', value: 'enabled' },
              { label: '暂停', value: 'paused' }
              // { label: '停用', value: 'stop' }
            ]
            const { key, title } = params.column
            return (
              <HeaderSelect
                options={arr}
                key={key}
                title={title}
                onOn-change={data => {
                  this.detailSearch()
                }}
                v-model={this.detailHeader.status}
              />
            )
          }
        },
        {
          title: '下线时间',
          key: 'offDatetime',
          minWidth: 180,
          align: 'center',
          sortable: 'custom',
          render: (h, { row }) => {
            return <span class={this.beyondDay(row.offDatetime) ? 'red' : ''}>{row.offDatetime}</span>
          }
        },
        {
          title: '下线原因',
          key: 'offReason',
          minWidth: 120,
          align: 'center',
          tooltip: true
        },
        {
          title: '优化方式',
          key: 'optimizeType',
          width: 120,
          align: 'center'
          // tooltip: true
        },
        {
          title: '备注',
          key: 'sum',
          minWidth: 80,
          align: 'center',
          tooltip: true,
          renderHeader: (h, params) => this.renderHeaderInput(h, params)
        },
        {
          title: '操作',
          key: 'edit',
          slot: 'edit',
          width: 150,
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
        softNameCheck: '', // 产品名精确搜索
        groupName: '', // 推广组
        groupCheck: '', // 推广组精确搜索
        keyword: '', // 关键字
        keywordCheck: '', // 关键词精确搜索
        softId: '', // 软件Id
        appid: '', // 渠道号
        status: '', // 状态
        reason: '', // 下线原因
        sum: '' // 备注
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
      window.open(semUrl + '/KeywordOptimize/phraseKeyword?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/KeywordOptimize/phraseKeyword',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        const { pageContent, totalCount } = res.data.content
        this.tableContent = Object.freeze(pageContent)
        this.detailHeader.totalCount = Number(totalCount)
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
      const orderby = column.key
      const desc = column.order
      this.detailSearch({ orderby, desc })
    },
    // 设置Table的高度
    setTableHeight () {
      this.$emit('on-set-table-height')
    },
    // 编辑
    edit (row, index) {
      this.$axios({
        url: semUrl + `/PhraseKeyword/show?keywordId=${row.keywordId}`
      }).then(res => {
        let data = res.data.data.keyword
        data.keywordId = row.keywordId
        this.propData = data
        this.propData.title = '编辑'
        this.showEdit = true
        // this.propData = JSON.parse(JSON.stringify(row))
      })
    },
    // 到关键词详情页
    async toDetail (row) {
      const { data } = await this.$axios({
        url: semUrl + `/PhraseKeyword/show?keywordId=${row.keywordId}`
      })
      let keywordDetail = data.data.keyword
      this.$Modal.info({
        title: '详情',
        render: (h, params) => {
          return <KeywordDetail data={keywordDetail} />
        }
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
        softNameCheck: '', // 产品名精确搜索
        groupName: '', // 推广组
        groupCheck: '', // 推广组精确搜索
        keyword: '', // 关键字
        keywordCheck: '', // 关键词精确搜索
        appid: '', // 渠道号
        softId: '', // 软件Id
        status: '', // 状态
        reason: '', // 下线原因
        sum: '' // 备注
      }
    },
    // 获取需要发送的数据的数值
    getSendData (data = {}) {
      // 1.字符串字段去空格
      // 2.有值的拷贝到新对象
      // 3.模糊搜索的时候，清空其他字段，新对象只保留部分值
      // 4.非模糊搜索,才有可能表头搜索,转换逗号
      // 5 删除不必要的字段，将处理完的数据合并回源对象

      const multipleArr = ['appid', 'softId'] // 需要转换成逗号分隔的字段
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
        // 需要多选的
        multipleArr.forEach(key => {
          if (sendData[key]) {
            sendData[key] = sendData[key].split(' ').join(',')
          }
        })
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
    beyondDay (time) {
      // 一天之后是不是在现在之后
      return moment(time).add(1, 'day').isBefore(moment())
    }
  },
  computed: {
    employees () {
      return this.$store.state.user.employees
    }
  }
}
</script>
