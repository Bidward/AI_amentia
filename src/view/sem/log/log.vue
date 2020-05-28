<template>
  <div class="viewWrapper">
    <div class="level-three clearfix">
      <Button @click="exportExcel" >导出</Button>
      <div class="searchbar">
        <Input
          @on-search="()=>{detailHeader.currPage=1;detailSearch()}"
          placeholder="推广组、关键词"
          search
          clearable
          v-model.trim="detailHeader.text"
          style="width:200px;margin-right:5px;"
        />
        <Button icon="ios-loading" @click="()=>{reload();detailSearch()}"></Button>
        <TableHeaderSetting
          :totalTableHeader="totalTableHeader"
          :tableHeader.sync="tableHeader"
          key="semLogList"
          localKey="semLogList"
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
import { Track } from '@/libs/track.js'
const track = new Track('营销/日志/日志')
export default {
  name: 'semLog',
  components: {
    TableHeaderSetting
  },
  data () {
    return {
      tableHeader: [],
      loading: true,
      tableHeight: 600,
      totalTableHeader: [
        {
          title: '序号',
          key: 'index',
          width: 60,
          type: 'index',
          align: 'center',
          alwaysShow: true
        },
        {
          title: '时间',
          key: 'date',
          align: 'center',
          width: 150,
          sortable: 'custom',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <DatePicker
                      split-panels
                      v-on: on-ok={() => {
                        this.detailSearch({ currPage: 1 })
                      }}
                      type="datetimerange"
                      v-model={this.detailHeader.timeRange}
                      confirm
                      placement="bottom-start"
                      placeholder="输入时间"
                    />
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
          title: '账户名称',
          key: 'account_name',
          width: 100,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader['account_name']}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader['account_name'] ? 'on' : ''} />
                    {params.column.title}
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
          width: 140,
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
                    <Icon type="md-search" size="14" class={this.detailHeader.campaignName ? 'on' : ''} />
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
          width: 130,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
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
                    <Icon type="md-search" size="14" class={this.detailHeader.groupName ? 'on' : ''} />
                    {params.column.title}
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
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Checkbox true-value={'1'} false-value={''} v-model={this.detailHeader.keywordCheck}>精确搜索</Checkbox>
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
                    <Icon type="md-search" size="14" class={this.detailHeader.keyword ? 'on' : ''} />
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
          align: 'center',
          width: 100,
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
                        this.detailSearch({ currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.appId ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作人',
          key: 'operation_username',
          align: 'center',
          width: 100,
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Input
                      v-model={this.detailHeader.operation_username}
                      search
                      clearable
                      v-on: on-search={value => {
                        this.detailSearch({ operation_username: value, currPage: 1 })
                      }}
                    />
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.operation_username ? 'on' : ''} />
                    {params.column.title}
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
          width: 100,
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
                    <Icon type="md-search" size="14" class={this.detailHeader.owner ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span>
            )
          }
        },
        {
          title: '操作类型',
          key: 'operation',
          width: 120,
          align: 'center',
          renderHeader: (h, params) => {
            return (
              <span>
                <Poptip placement="bottom">
                  <div slot="content">
                    <Select
                      v-model={this.detailHeader.operation}
                      onOn-change={value => { this.detailSearch({ currPage: 1 }) }}>
                      {this.logTypeList.map(type => {
                        return (
                          <Option value={type.fval}>{type.fkey}</Option>
                        )
                      })}
                    </Select>
                  </div>
                  <span class="pointer">
                    <Icon type="md-search" size="14" class={this.detailHeader.operation ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
              </span >
            )
          }
        },
        {
          title: '内容',
          key: 'reason',
          minWidth: 320,
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
                    <Icon type="md-search" size="14" class={this.detailHeader.reason ? 'on' : ''} />
                    {params.column.title}
                  </span>
                </Poptip>
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
        account_name: '', // 账户名称
        campaignName: '', // 推广计划
        groupName: '', // 推广组
        keyword: '', // 关键字
        appId: '', // 渠道号
        operation_username: '', // 操作人
        owner: '', // 责任人
        operation: '', // 匹配方式
        reason: '', // 内容
        keywordCheck: ''// 关键词精确搜索
      },
      logTypeList: []
    }
  },
  beforeCreate () {
    track.start()
  },
  mounted () {
    this.setTimeRange()
    this.detailSearch()
    this.getLogTypeList()
    window.addEventListener('resize', () => {
      this.setTableHeight()
    })
  },
  methods: {
    // 导出
    exportExcel () {
      let sendData = this.getSendData()
      delete sendData.pageSize
      delete sendData.currPage
      delete sendData.text
      let data = $qs.stringify(sendData)
      window.open(semUrl + '/Log/exptCostLog?' + data)
    },
    // 搜索
    detailSearch (getData = {}) {
      let sendData = this.getSendData(getData)
      this.loading = true
      this.$axios({
        url: semUrl + '/Log/index',
        method: 'post',
        data: $qs.stringify(sendData)
      }).then(res => {
        this.tableContent = res.data.content.pageContent
        this.detailHeader.totalCount = Number(res.data.content.totalCount)
        this.setTableHeight()
        this.loading = false
        this.$nextTick(() => {
          track.end()
        })
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
      let pagePaddingHeight = document
        .querySelectorAll('body')[0]
        .getClientRects()[0].height
      this.tableHeight = pagePaddingHeight - 240
    },

    // 设置日期为昨天和今天，后端已经倒排了
    setTimeRange () {
      this.detailHeader.timeRange = [
        moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00'),
        moment().format('YYYY-MM-DD 23:59:59')
      ]
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
        // 清空搜索
        this.reload()
        sendData.text = sendData.text.trim()
        this.detailHeader.text = sendData.text
      } else {
        sendData.date = moment(sendData.timeRange[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        // 这里有个坑，写死了选取日期的截止时间为当天最后一秒
        sendData.enddate = moment(sendData.timeRange[1]).format(
          'YYYY-MM-DD 23:59:59'
        )
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
        account_name: '', // 账户名称
        campaignName: '', // 推广计划
        groupName: '', // 推广组
        keyword: '', // 关键字
        appId: '', // 渠道号
        operation_username: '', // 操作人
        owner: '', // 责任人
        operation: '', // 匹配方式
        reason: '', // 内容
        keywordCheck: ''// 关键词精确搜索
      }
      this.detailHeader = Object.assign(initData, data)
      this.setTimeRange()
      return this.detailHeader
    },
    // 获取日志类型类别
    getLogTypeList () {
      this.$axios({
        url: semUrl + '/Log/logType',
        method: 'post'
      }).then(res => {
        this.logTypeList = res.data
        this.logTypeList.unshift({
          fkey: '全部',
          fval: ''
        })
      })
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => {
      this.setTableHeight()
    })
  }
}
</script>
